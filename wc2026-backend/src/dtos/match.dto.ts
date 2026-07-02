import { MatchStatus } from "../entities/Match";

export interface CreateMatchDto {
  homeTeam: string;
  awayTeam: string;
  matchDate: Date | string;
  stage: string;
  stadiumCity: string;
  externalApiId?: string;
}

export interface UpdateMatchDto {
  homeTeam?: string;
  awayTeam?: string;
  matchDate?: Date | string;
  stage?: string;
  stadiumCity?: string;
  status?: MatchStatus;
}