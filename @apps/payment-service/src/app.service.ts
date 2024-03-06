import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaymentDTO } from './app.dto';
import { WalletService } from './wallet/wallet.service';
import { TransactionService } from './transaction/transaction.service';

@Injectable()
export class AppService {
  
  constructor(
    private readonly walletService: WalletService,
    private readonly transactionService: TransactionService
  ){}

  async paymentGeneric(holderEmail: string, paymentData: PaymentDTO, fn: ()=> void){
    
    // Debit sender wallet
    const trxWallet = await this.walletService.findWalletByUser(holderEmail, paymentData.senderRef);

    // If wallet is low on fund
    if(trxWallet.balance < paymentData.amount){
        return new HttpException("Your wallet is low on fund", HttpStatus.NOT_ACCEPTABLE);
    }

    trxWallet.set({ balance: trxWallet.balance - paymentData.amount });
    trxWallet.save();

    // Call fn, also responsible for crediting the receiver
    fn();

    // Double entry book-keeping method
    await this.transactionService.create({ ...paymentData, type: TransactionType.Credit  });
    await this.transactionService.create({ ...paymentData, type: TransactionType.Debit  });
}

async paymentWithEscrow(holderEmail: string, paymentData: PaymentDTO){
    const walletService = this.walletService;
    await this.paymentGeneric(holderEmail, paymentData, async function(){
         // Update receiver wallet frozenBalance
        const rcxWallet = await walletService.findWalletByUser(paymentData.receiverRef, paymentData.receiverRef);
        rcxWallet.set({ frozenBalance: rcxWallet.frozenBalance + paymentData.amount });
        rcxWallet.save();
    })
}

async payment(holderEmail: string, paymentData: PaymentDTO){
  const walletService = this.walletService;
    await this.paymentGeneric(holderEmail, paymentData, async function(){
        // Update receiver wallet balance
        const rcxWallet = await walletService.findWalletByUser(paymentData.receiverRef, paymentData.receiverRef);
        rcxWallet.set({ balance: rcxWallet.balance + paymentData.amount });
        rcxWallet.save();
    })
}

}
