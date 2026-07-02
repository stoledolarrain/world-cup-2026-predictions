import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { GroupMember } from './GroupMembers';
import { Prediction } from './Prediction';
import { Group } from './Group';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @OneToMany(() => Group, group => group.owner)
  ownedGroups!: Group[];

  @OneToMany(() => GroupMember, groupMember => groupMember.user)
  groupMemberships!: GroupMember[];

  @OneToMany(() => Prediction, prediction => prediction.user)
  predictions!: Prediction[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}