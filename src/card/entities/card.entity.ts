import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AccountEntity } from '../../account/entities/account.entity';
import { InvoiceEntity } from '../../invoice/entities/invoice.entity';

@Entity('cards')
export class CardEntity {
  constructor(partial: Partial<CardEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AccountEntity, (account) => account.cards)
  account: AccountEntity;

  @Column({ unique: true })
  number: string;

  @Column()
  expirationDate: Date;

  @Column()
  cvv: string;

  @Column('decimal', { precision: 10, scale: 2 })
  limit: number;

  @Column()
  active: boolean;

  @OneToMany(() => InvoiceEntity, (invoice) => invoice.card)
  invoices: InvoiceEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
