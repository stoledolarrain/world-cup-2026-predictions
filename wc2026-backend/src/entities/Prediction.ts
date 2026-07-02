import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Match } from './Match';

@Entity('predictions')
export class Prediction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int' })
  predictedHomeScore!: number;

  @Column({ type: 'int' })
  predictedAwayScore!: number;

  @Column({ type: 'int', default: 0 })
  pointsEarned!: number; // 3 puntos exacto, 1 punto ganador, etc.

  @ManyToOne(() => User, user => user.predictions)
  user!: User;

  @ManyToOne(() => Match, match => match.predictions)
  match!: Match;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}