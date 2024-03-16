import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { BusinessModule } from '../business/business.module';
import { UserBusinessModule } from '../user-business/user-business.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { RefreshToken } from './auth.model';

@Module({
  imports: [
    SequelizeModule.forFeature([RefreshToken]),
    UserModule,
    BusinessModule,
    UserBusinessModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
