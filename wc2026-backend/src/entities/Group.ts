import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { GroupMember } from './GroupMember';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  inviteCode!: string;

  // El usuario que creó el grupo
  @ManyToOne(() => User, user => user.ownedGroups)
  owner!: User;

  @OneToMany(() => GroupMember, groupMember => groupMember.group)
  members!: GroupMember[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}