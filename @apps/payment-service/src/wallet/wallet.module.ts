import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { SequelizeModule } from '@nestjs/sequelize';
import Wallet from './wallet.model';

@Module({
  imports: [SequelizeModule.forFeature([Wallet])],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService]
})

export class WalletModule {}
