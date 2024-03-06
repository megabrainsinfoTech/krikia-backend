import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './database.config';
import { TransactionModule } from './transaction/transaction.module';
import { AuthMiddleware } from './+common/auth.middleware';

@Module({
  imports: [SequelizeModule.forRoot(databaseConfig), WalletModule, TransactionModule],
  exports: [SequelizeModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
    .exclude("wallet/create")
    .forRoutes("wallet", "transaction")
  }
}
