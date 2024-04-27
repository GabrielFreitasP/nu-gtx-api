import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CardEntity } from '../../card/entities/card.entity';

@Entity('invoices')
export class InvoiceEntity {
  constructor(partial: Partial<InvoiceEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CardEntity, (card) => card.invoices)
  card: CardEntity;

  @Column()
  closingDate: Date;

  @Column()
  dueDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column()
  paid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
