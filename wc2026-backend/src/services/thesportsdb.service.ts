import axios from "axios";
import { AppDataSource } from "../config/database";
import { Match, MatchStatus } from "../entities/Match";
import { Prediction } from "../entities/Prediction";
import { GroupMember } from "../entities/GroupMembers";

// Obtenemos la API Key desde las variables de entorno
const API_KEY = process.env.THESPORTSDB_API_KEY;

if (!API_KEY) {
  throw new Error(
    "La variable de entorno THESPORTSDB_API_KEY no está configurada.",
  );
}

export const TheSportsDBService = {
  // --- CARGA MASIVA DE PARTIDOS ---
  async fetchAndSaveAllMatches(leagueId: string) {
    const matchRepo = AppDataSource.getRepository(Match);
    const url = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/eventsnextleague.php?id=${leagueId}`;

    try {
      const response = await axios.get(url);
      const events = response.data.events;

      if (!events) throw new Error("No se encontraron eventos en la API");

      for (const event of events) {
        // Verificamos si ya existe para evitar duplicados
        const exists = await matchRepo.findOne({
          where: { externalApiId: event.idEvent },
        });

        if (!exists) {
          const newMatch = matchRepo.create({
            homeTeam: event.strHomeTeam,
            awayTeam: event.strAwayTeam,
            matchDate: new Date(event.dateEvent),
            stage: event.strEvent || "Fase de Grupos",
            stadiumCity: `${event.strVenue || "Estadio"}, ${event.strCity || "Ciudad"}`,
            status: MatchStatus.SCHEDULED,
            externalApiId: event.idEvent,
            homeScore: 0,
            awayScore: 0,
          });
          await matchRepo.save(newMatch);
        }
      }
      return { message: "Partidos cargados exitosamente" };
    } catch (error) {
      console.error("Error en fetchAndSaveAllMatches:", error);
      throw error;
    }
  },

  // --- SINCRONIZACIÓN DE RESULTADOS ---
  async syncMatchScores() {
    const matchRepo = AppDataSource.getRepository(Match);
    const predictionRepo = AppDataSource.getRepository(Prediction);
    const groupMemberRepo = AppDataSource.getRepository(GroupMember);

    const activeMatches = await matchRepo.find({
      where: [
        { status: MatchStatus.SCHEDULED },
        { status: MatchStatus.IN_PLAY },
      ],
    });

    for (const match of activeMatches) {
      if (!match.externalApiId) continue;
      try {
        const response = await axios.get(
          `https://www.thesportsdb.com/api/v1/json/${API_KEY}/lookupevent.php?id=${match.externalApiId}`,
        );
        const eventData = response.data.events?.[0];

        if (
          eventData &&
          eventData.intHomeScore !== null &&
          eventData.intAwayScore !== null
        ) {
          match.homeScore = parseInt(eventData.intHomeScore);
          match.awayScore = parseInt(eventData.intAwayScore);

          if (eventData.strStatus === "Match Finished") {
            match.status = MatchStatus.FINISHED;

            // Lógica de cálculo de puntos existente
            const predictions = await predictionRepo.find({
              where: { match: { id: match.id } },
              relations: { user: true },
            });
            for (const pred of predictions) {
              const points = this.calculatePoints(
                pred.predictedHomeScore,
                pred.predictedAwayScore,
                match.homeScore,
                match.awayScore,
              );
              if (points > 0) {
                pred.pointsEarned = points;
                await predictionRepo.save(pred);
                const memberships = await groupMemberRepo.find({
                  where: { user: { id: pred.user.id } },
                });
                for (const member of memberships) {
                  member.totalPoints += points;
                  await groupMemberRepo.save(member);
                }
              }
            }
          } else {
            match.status = MatchStatus.IN_PLAY;
          }
          await matchRepo.save(match);
        }
      } catch (error) {
        console.error(`Error sincronizando partido ${match.id}:`, error);
      }
    }
  },

  calculatePoints(
    predHome: number,
    predAway: number,
    actualHome: number,
    actualAway: number,
  ): number {
    if (predHome === actualHome && predAway === actualAway) return 3;
    const predResult =
      predHome > predAway ? "HOME" : predHome < predAway ? "AWAY" : "DRAW";
    const actualResult =
      actualHome > actualAway
        ? "HOME"
        : actualHome < actualAway
          ? "AWAY"
          : "DRAW";
    return predResult === actualResult ? 1 : 0;
  },
};
