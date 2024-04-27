import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerModule } from '../commons/logger/logger.module';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { CardEntity } from './entities/card.entity';

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([CardEntity])],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
