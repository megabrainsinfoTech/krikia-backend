import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('transaction')
export class TransactionController {

    @Post('request-refund')
    async requestRefund(@Body() refundBody) {
        
    }

    @Post('refund')
    async refund(@Body() refundBody) {
        
    }
    
    @Get(':refId')
    async getTransactionStatus(@Param('refId') refId: string) {
        
    }
}
