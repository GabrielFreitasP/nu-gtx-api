import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AccountEntity } from '../../account/entities/account.entity';
import { AddressEntity } from '../../address/entities/address.entity';
import { LoanEntity } from '../../loan/entities/loan.entity';

@Entity('users')
export class UserEntity {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  active: boolean;

  @Column()
  roles: string;

  @OneToOne(() => AddressEntity, (address) => address.user)
  @JoinColumn()
  address: AddressEntity;

  @OneToMany(() => AccountEntity, (account) => account.user)
  accounts: AccountEntity[];

  @OneToMany(() => LoanEntity, (loan) => loan.user)
  loans: LoanEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @BeforeUpdate()
  @BeforeInsert()
  async setPassword(password: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }
}
