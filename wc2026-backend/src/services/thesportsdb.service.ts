import axios from 'axios';
import { AppDataSource } from '../config/database';
import { Match, MatchStatus } from '../entities/Match';
import { Prediction } from '../entities/Prediction';
import { GroupMember } from '../entities/GroupMembers';

export const TheSportsDBService = {
  async syncMatchScores() {
    const matchRepo = AppDataSource.getRepository(Match);
    const predictionRepo = AppDataSource.getRepository(Prediction);
    const groupMemberRepo = AppDataSource.getRepository(GroupMember);

    // Obtener los partidos que están pendientes o en juego para actualizar
    const activeMatches = await matchRepo.find({
      where: [
        { status: MatchStatus.SCHEDULED },
        { status: MatchStatus.IN_PLAY }
      ]
    });

    for (const match of activeMatches) {
      if (!match.externalApiId) continue;

      try {
        // Req 32: API gratuita de thesportsdb.com
        // Nota: URL de ejemplo, se debe usar el endpoint real según la documentación de la API
        const response = await axios.get(`https://www.thesportsdb.com/api/v1/json/3/lookupevent.php?id=${match.externalApiId}`);
        const eventData = response.data.events?.[0];

        if (eventData && eventData.intHomeScore !== null && eventData.intAwayScore !== null) {
          
          match.homeScore = parseInt(eventData.intHomeScore);
          match.awayScore = parseInt(eventData.intAwayScore);
          
          // Si el estado en la API indica que finalizó, actualizamos el status
          if (eventData.strStatus === 'Match Finished') {
            match.status = MatchStatus.FINISHED;
            
            // Req 11: Calcular puntos de las predicciones para este partido
            const predictions = await predictionRepo.find({
              where: { match: { id: match.id } },
              relations: { user: true }
            });

            for (const pred of predictions) {
              const points = this.calculatePoints(
                pred.predictedHomeScore, pred.predictedAwayScore,
                match.homeScore, match.awayScore
              );

              if (points > 0) {
                pred.pointsEarned = points;
                await predictionRepo.save(pred);

                // Sumar puntos al perfil del usuario en todos sus grupos
                const memberships = await groupMemberRepo.find({
                  where: { user: { id: pred.user.id } }
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

  // Algoritmo de puntuación definido por los desarrolladores (Req 11)
  calculatePoints(predHome: number, predAway: number, actualHome: number, actualAway: number): number {
    // Acierto exacto del marcador (3 puntos)
    if (predHome === actualHome && predAway === actualAway) {
      return 3;
    }

    // Acierto solo de ganador o empate (1 punto)
    const predResult = predHome > predAway ? 'HOME' : predHome < predAway ? 'AWAY' : 'DRAW';
    const actualResult = actualHome > actualAway ? 'HOME' : actualHome < actualAway ? 'AWAY' : 'DRAW';

    if (predResult === actualResult) {
      return 1;
    }

    // Sin puntos
    return 0;
  }
};