import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { verify } from 'jsonwebtoken';
import { Sequelize } from 'sequelize-typescript';
@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private readonly sequelize: Sequelize){}
  async use(req: any, res: Response, next: () => void) {
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split('AppAccess')[1] : null;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {



      req.user = token;
      next();

      // const [APPLICATION_SECRET, CLIENT_SIGNATURE] = (token as string).split(":");

      // verify(CLIENT_SIGNATURE, APPLICATION_SECRET, (err, payload)=> {

      //   if(err) return res.status(401).json({ error: 'Unauthorized' });

      //   req.account = payload; // Attach user information to the request
      //   next();
        
      // });

    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

}
