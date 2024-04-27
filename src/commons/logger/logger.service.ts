import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

import { ConfigurationService } from '../config/configuration.service';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor(configurationService: ConfigurationService) {
    this.logger = winston.createLogger({
      level: configurationService.loggerLevel,
      format: winston.format.combine(
        winston.format.label({ label: configurationService.loggerLabel }),
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          if (info.message['json']) {
            return JSON.stringify(info.message['json']);
          }

          return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
        }),
      ),
      transports: [new winston.transports.Console()],
    });
  }

  error(message: string, metadata: any = {}): void {
    this.logger.error(message, metadata);
  }

  warn(message: string, metadata: any = {}): void {
    this.logger.warn(message, metadata);
  }

  debug(message: string, metadata: any = {}): void {
    this.logger.debug(message, metadata);
  }

  info(message: string, metadata: any = {}): void {
    this.logger.info(message, metadata);
  }

  verbose(message: string, metadata: any = {}): void {
    this.logger.verbose(message, metadata);
  }

  json(json: object): void {
    this.logger.info({ json });
  }
}
