export class PaymentDTO {
    readonly senderRef: string;
    readonly receiverRef: string;
    readonly amount: number;
    readonly description: string;
}