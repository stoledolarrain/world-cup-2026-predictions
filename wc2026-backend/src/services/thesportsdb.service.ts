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

    const activeMatches = await matchRepo.find({
      where: [
        { status: MatchStatus.SCHEDULED },
        { status: MatchStatus.IN_PLAY }
      ]
    });

    for (const match of activeMatches) {
      if (!match.externalApiId) continue;

      try {
        const response = await axios.get(`https://www.thesportsdb.com/api/v1/json/123/lookupevent.php?id=${match.externalApiId}`);
        const eventData = response.data.events?.[0];

        if (eventData && eventData.intHomeScore !== null && eventData.intAwayScore !== null) {
          
          match.homeScore = parseInt(eventData.intHomeScore);
          match.awayScore = parseInt(eventData.intAwayScore);
          
          if (eventData.strStatus === 'Match Finished') {
            match.status = MatchStatus.FINISHED;
            
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

  calculatePoints(predHome: number, predAway: number, actualHome: number, actualAway: number): number {
    if (predHome === actualHome && predAway === actualAway) {
      return 3;
    }

    const predResult = predHome > predAway ? 'HOME' : predHome < predAway ? 'AWAY' : 'DRAW';
    const actualResult = actualHome > actualAway ? 'HOME' : actualHome < actualAway ? 'AWAY' : 'DRAW';

    if (predResult === actualResult) {
      return 1;
    }

    return 0;
  }
};