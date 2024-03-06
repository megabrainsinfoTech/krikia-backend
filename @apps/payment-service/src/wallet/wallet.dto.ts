import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";

export class CreateWalletDTO {

    @IsNotEmpty()
    @IsEmail()
    holderEmail: string;

    @IsNotEmpty()
    @IsEnum({User: "User", Agent: "Agent", Business: "Business"})
    type: WalletType;
}

export class FundWalletDTO {
    rxId: string;
    email: string;
    amount: number;
}

export class TransferFundFromWalletDTO {
    rxId: string;
    amount: number;
    isCooperate: boolean;
}


export class WithdrawFundFromWalletDTO {
    rxId: string;
    amount: number;
    isCooperate: boolean;
}