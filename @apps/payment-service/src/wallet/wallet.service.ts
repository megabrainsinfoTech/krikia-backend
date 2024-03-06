import { Injectable, Req } from '@nestjs/common';
import { CreateWalletDTO, FundWalletDTO, TransferFundFromWalletDTO, WithdrawFundFromWalletDTO } from './wallet.dto';
import { InjectModel } from '@nestjs/sequelize';
import Wallet from "./wallet.model";

@Injectable()
export class WalletService {
    constructor(@InjectModel(Wallet) private readonly wallet: typeof Wallet){}

    async create(createBody: any){
        // Check if wallet exist
        let wallet = await this.wallet.findOne({ where: { holderEmail: createBody.holderEmail, type: createBody.type } });
        if(wallet){
            return { message: `${createBody.type} wallet already exist for ${createBody.holderEmail}` }
        }

        // Create wallet
        wallet = await this.wallet.create({ ...(createBody as any) });
        return { wallet, message: `${wallet.type} wallet for ${wallet.holderEmail} has been created successfully` };
    }

    async getWallets(user: string): Promise<Wallet[]>{
        const wallets = await this.wallet.findAll({ where: { holderEmail: user } });
        return wallets;
    }

    async accountNumber(holderEmail: string){
        const wallet = await this.wallet.findOne({where: { holderEmail }});
        return wallet?.accountNumber;
    }

    async findWalletByUser(holderEmail: string, accountNumber: string): Promise<Wallet> {
        const wallet = await this.wallet.findOne({ where: { holderEmail, accountNumber } });
        return wallet;
    }

    transferFund(rxObj: TransferFundFromWalletDTO): TransferFundFromWalletDTO {
        return rxObj;
    }

    transferFundCorporate(rxObj: TransferFundFromWalletDTO): TransferFundFromWalletDTO {
        return rxObj;
    }

    withdrawFrom(withdrawObj: WithdrawFundFromWalletDTO): WithdrawFundFromWalletDTO {
        return withdrawObj;
    }

    withdrawFromCorporate(withdrawObj: WithdrawFundFromWalletDTO): WithdrawFundFromWalletDTO {
        return withdrawObj;
    }

    getHistory(){
        return [];
    }

    fund(fundObj: FundWalletDTO){
        return "Successfully funded your user wallet"
    }

}
