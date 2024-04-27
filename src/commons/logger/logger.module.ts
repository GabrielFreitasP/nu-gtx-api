import { Module } from '@nestjs/common';

import { ConfigurationModule } from '../config/configuration.module';
import { LoggerService } from './logger.service';

@Module({
  imports: [ConfigurationModule],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
