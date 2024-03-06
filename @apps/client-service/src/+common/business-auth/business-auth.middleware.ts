import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { UserBusinessService } from '../../user-business/user-business.service';

@Injectable()
export class BusinessAuthMiddleware implements NestMiddleware {

  constructor(private readonly userBusinessService: UserBusinessService){}

  async use(req: any, res: any, next: () => void) {
    const userId = req.user.id;
    if (!userId) {
      throw new HttpException("Access denied", HttpStatus.UNAUTHORIZED);
    }
  
    const businessId = req.params.businessId || ""; // Extract businessId from the route params. It's actually business alias
   
    // Check if the user is associated with the requested business
    const belongsToBusiness = await this.userBusinessService.findBusinessByUserId(userId, businessId);

    if (!belongsToBusiness) {
        throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
    }

    // User is associated with the business, proceed to the next middleware or route handler
    req.bizId = belongsToBusiness.business.id;
    return next();
  }
}
