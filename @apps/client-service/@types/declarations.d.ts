import { Request } from "express";

declare module "express-sanitizer";



interface CustomRequest {
    payload?: string|jwt.JwtPayload|undefined;
    user?: any;
    bizId?: string;
    
}

declare module 'express' {
    interface Request extends CustomRequest {}
}






