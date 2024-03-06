import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import * as cookieParser from "cookie-parser"

void async function () {
  dotenv.config(); // Load environment variables from .env file
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3040', 'http://localhost:3050'], // Allow requests from this origin
    methods: 'GET,POST,PUT,PATCH,OPTION,DELETE', // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific request headers
    credentials: true, // Allow cookies to be sent with requests
    maxAge: 3600, // Set the CORS preflight cache duration
  });
  app.use(cookieParser(process.env.COOKIE_SECRET));
  await app.listen(8001);
  
}();

