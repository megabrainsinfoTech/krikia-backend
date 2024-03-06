import { Request } from "express";

export function CurrentUser(req: Request): ClassDecorator {
    return (target: any) => {
      const originalConstructor = target.constructor;
      target.constructor = function (...args: any[]) {
        const instance = originalConstructor.apply(this, args);
        console.log("Request object")
        console.log(req)
        instance.userId = req.user.id; // Assign user ID to private field
        return instance;
      };
    };
  }
  