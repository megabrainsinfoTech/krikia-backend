import { NextFunction, Request, Response } from "express";

type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => any;

export default (middleware: MiddlewareFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // If async then
      middleware(req, res, next).catch((error: any) => {
        next(error)
      })
    } catch(err){
      // Else is sync
      try {
        console.log("Synchronous call")
        middleware(req, res, next);
      } catch (error) {
        next(error);
      }
    }
  };
};
