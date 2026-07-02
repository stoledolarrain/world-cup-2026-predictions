export interface CreatePredictionDto {
  matchId: string;
  predictedHomeScore: number;
  predictedAwayScore: number;
}

export interface UpdatePredictionDto {
  predictedHomeScore?: number;
  predictedAwayScore?: number;
}