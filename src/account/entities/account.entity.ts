import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

import { CardEntity } from '../../card/entities/card.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('accounts')
export class AccountEntity {
  constructor(partial: Partial<AccountEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agency: string;

  @Column({ unique: true })
  number: string;

  @Column()
  digit: string;

  @Column('decimal', { precision: 10, scale: 2 })
  balance: number;

  @Column('decimal', { precision: 10, scale: 2 })
  savedAmount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  accountYield: number;

  @RelationId((account: AccountEntity) => account.user)
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.accounts)
  user: UserEntity;

  @OneToMany(() => CardEntity, (card) => card.account)
  cards: CardEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
