import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AuthDeserialize } from './auth/auth-deserialize.middleware';

void (async function () {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      process.env.CUSTOMER_FRONTEND_URL as string,
      process.env.BUSINESS_FRONTEND_URL as string,
    ], // Allow requests from this origin
    methods: 'GET,POST,PUT,PATCH,OPTION,DELETE', // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific request headers
    credentials: true, // Allow cookies to be sent with requests
    maxAge: 3600, // Set the CORS preflight cache duration
  });
  app.use(cookieParser(process.env.COOKIE_SECRET));
  await app.listen(process.env.PORT as string);
})();
