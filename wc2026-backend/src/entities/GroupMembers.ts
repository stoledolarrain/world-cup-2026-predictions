import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Column } from 'typeorm';
import { User } from './User';
import { Group } from './Group';

@Entity('group_members')
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, user => user.groupMemberships)
  user!: User;

  @ManyToOne(() => Group, group => group.members)
  group!: Group;

  @Column({ type: 'int', default: 0 })
  totalPoints!: number;

  @CreateDateColumn()
  joinedAt!: Date;
}