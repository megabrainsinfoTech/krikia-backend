import { Body, Controller, Get, Param, Patch, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDTO, FundWalletDTO, TransferFundFromWalletDTO, WithdrawFundFromWalletDTO } from './wallet.dto';

@Controller('wallet')
// @UsePipes(
//     new ValidationPipe({
//         whitelist: true,
//         transform: true
//     })
// )
export class WalletController {

    constructor(private readonly walletService: WalletService){}

    @Post("create")
    async createWallet(@Body() createBody: any){
        return await this.walletService.create(createBody);
    }

    @Get()
    getWallets(@Req() req: any){
        return this.walletService.getWallets(req.user);
    }

    @Get("history")
    getWalletHistory(){
        return this.walletService.getHistory();
    }

    @Get("account-number/:email")
    getAccountNumber(@Param("email") email: string){
        return this.walletService.accountNumber(email);
    }

    @Patch("fund")
    fundWallet(@Body() body: FundWalletDTO){
        return this.walletService.fund(body);
    }

    @Post("transfer-fund")
    transferFund(@Body() body: TransferFundFromWalletDTO){
        if(body.isCooperate){
            return this.walletService.transferFundCorporate(body);
        }

        return this.walletService.transferFund(body);
    }

    @Patch("withdraw")
    withdrawFund(@Body() body: WithdrawFundFromWalletDTO){
        if(body.isCooperate){
            return this.walletService.withdrawFromCorporate(body);
        }

        return this.walletService.withdrawFrom(body);
    }




}
