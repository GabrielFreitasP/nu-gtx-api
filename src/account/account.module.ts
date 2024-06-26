import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerModule } from '../commons/logger/logger.module';
import { UserEntity } from '../user/entities/user.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountEntity } from './entities/account.entity';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forFeature([AccountEntity]),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
