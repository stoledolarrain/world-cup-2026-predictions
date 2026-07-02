import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Prediction } from "./Prediction";

export enum MatchStatus {
  SCHEDULED = "SCHEDULED", // Programado / Pendiente
  IN_PLAY = "IN_PLAY", // En juego
  FINISHED = "FINISHED", // Finalizado
}

@Entity("matches")
export class Match {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", nullable: true })
  externalApiId!: string;

  @Column({ type: "varchar", length: 100 })
  homeTeam!: string;

  @Column({ type: "varchar", length: 100 })
  awayTeam!: string;

  @Column({ type: "int", nullable: true })
  homeScore!: number;

  @Column({ type: "int", nullable: true })
  awayScore!: number;

  @Column({ type: "timestamp" })
  matchDate!: Date;

  @Column({ type: "varchar", length: 50 })
  stage!: string;

  @Column({ type: "varchar", length: 100 })
  stadiumCity!: string;

  @Column({ type: "enum", enum: MatchStatus, default: MatchStatus.SCHEDULED })
  status!: MatchStatus;

  @OneToMany(() => Prediction, (prediction) => prediction.match)
  predictions!: Prediction[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
