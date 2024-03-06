import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { PaymentDTO } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("pay") // account/pay?isOutright=true
    pay(@Req() req: any, @Query("isOutright") isOutright: boolean, @Body() paymentData: PaymentDTO){

      if(isOutright){
          return this.appService.payment(req.user, paymentData);
      }

      return this.appService.paymentWithEscrow(req.user, paymentData);
  }

  @Get("telnet")
  connectToTelnet(){
    return { message: "Wow, i am on telnet" }
  }
}
