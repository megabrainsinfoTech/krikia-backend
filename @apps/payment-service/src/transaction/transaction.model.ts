import { Table, Column, Model } from 'sequelize-typescript';

@Table
export default class Transaction extends Model {

  @Column({primaryKey: true})
  id: string;

  @Column({defaultValue: "Pending"})
  status: TransactionStatus;

  @Column
  amount: number;

  @Column
  fee: number;

  @Column
  grossAmount: number;

  @Column
  description: string;

  @Column
  paymentMethod: PaymentMethod

  @Column
  hash: string;
  
  @Column
  type: TransactionType;

  @Column
  action: TransactionAction;

  @Column
  senderRef: string;

  @Column
  receiverRef: string;

  @Column
  referenceId: string;

  // @HasOne(()=> Wallet)
  // wallet: Wallet;

}