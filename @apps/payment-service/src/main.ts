import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import cors from "cors";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Register global middlewares here
  // app.use(cors());
  // app.use(helmet());
  
  await app.listen(8002);
}
bootstrap();
