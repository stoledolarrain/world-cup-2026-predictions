import axios from "axios";
import { AppDataSource } from "../config/database";
import { Match, MatchStatus } from "../entities/Match";
import { Prediction } from "../entities/Prediction";
import { GroupMember } from "../entities/GroupMembers";

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

    // Mantenemos 2026 como solicitaste
    const url = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/eventsseason.php?id=${leagueId}&s=2026`;

    try {
      const response = await axios.get(url);
      const events = response.data.events;

      if (!events) {
        throw new Error(
          "No se encontraron eventos en la API para esta temporada",
        );
      }

      for (const event of events) {
        let match = await matchRepo.findOne({
          where: { externalApiId: event.idEvent },
        });

        let apiStatus = MatchStatus.SCHEDULED;
        let apiHomeScore = 0;
        let apiAwayScore = 0;
        const matchDate = new Date(
          event.dateEvent + "T" + (event.strTime || "00:00:00"),
        );

        // 1. Verificamos si la API ya trae goles (para el futuro cuando sea real)
        if (event.intHomeScore !== null && event.intHomeScore !== "") {
          apiHomeScore = parseInt(event.intHomeScore) || 0;
          apiAwayScore = parseInt(event.intAwayScore) || 0;
          apiStatus = MatchStatus.FINISHED;
        } else {
          // =========================================================
          // 🚀 MODO SIMULADOR: RESULTADOS FICTICIOS PARA PRUEBAS 2026
          // =========================================================
          // Si el partido no trae goles pero su fecha ya es menor a "hoy",
          // le inventamos un resultado aleatorio para que puedas probar.
          if (matchDate.getTime() < new Date().getTime()) {
            apiHomeScore = Math.floor(Math.random() * 4); // Goles de 0 a 3
            apiAwayScore = Math.floor(Math.random() * 4); // Goles de 0 a 3
            apiStatus = MatchStatus.FINISHED;
          }
        }

        // Validación extra de estado
        const statusStr = event.strStatus ? String(event.strStatus).trim() : "";
        if (
          statusStr === "Match Finished" ||
          statusStr === "Finished" ||
          statusStr === "FT"
        ) {
          apiStatus = MatchStatus.FINISHED;
        } else if (
          statusStr === "In Play" ||
          statusStr === "HT" ||
          statusStr === "Live"
        ) {
          apiStatus = MatchStatus.IN_PLAY;
        }

        if (!match) {
          match = matchRepo.create({
            homeTeam: event.strHomeTeam,
            awayTeam: event.strAwayTeam,
            homeTeamBadge: event.strHomeTeamBadge || "",
            awayTeamBadge: event.strAwayTeamBadge || "",
            matchDate: matchDate,
            stage: event.strEvent || "Fase de Grupos",
            stadiumCity: `${event.strVenue || "Estadio"}, ${event.strCity || "Ciudad"}`,
            status: apiStatus,
            externalApiId: event.idEvent,
            homeScore: apiHomeScore,
            awayScore: apiAwayScore,
          });
        } else {
          // Actualizamos
          match.homeTeamBadge = event.strHomeTeamBadge || "";
          match.awayTeamBadge = event.strAwayTeamBadge || "";
          match.matchDate = matchDate;
          match.stage = event.strEvent || match.stage;
          match.stadiumCity = `${event.strVenue || "Estadio"}, ${event.strCity || "Ciudad"}`;
          match.status = apiStatus;
          match.homeScore = apiHomeScore;
          match.awayScore = apiAwayScore;
        }

        await matchRepo.save(match);
      }
      return {
        message:
          "Todos los partidos 2026 y resultados simulados cargados exitosamente",
      };
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
