import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresDataSourceOptions } from 'ormconfig';

import { AccountModule } from './account/account.module';
import { AddressModule } from './address/address.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CardModule } from './card/card.module';
import configuration from './commons/config/configuration';
import { ConfigurationModule } from './commons/config/configuration.module';
import { ConfigurationService } from './commons/config/configuration.service';
import { LoggerModule } from './commons/logger/logger.module';
import { InvoiceModule } from './invoice/invoice.module';
import { LoanModule } from './loan/loan.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: async (configurationService: ConfigurationService) =>
        PostgresDataSourceOptions({
          host: configurationService.databaseHost,
          port: configurationService.databasePort,
          username: configurationService.databaseUsername,
          password: configurationService.databasePassword,
          name: configurationService.databaseName,
          synchronize: configurationService.databaseSynchronize,
          migrationsRun: configurationService.databaseMigrationsRun,
          logging: configurationService.databaseLogging,
        }),
      inject: [ConfigurationService],
    }),
    ConfigurationModule,
    LoggerModule,
    AuthModule,
    AddressModule,
    AccountModule,
    UserModule,
    CardModule,
    InvoiceModule,
    LoanModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
