import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { v4 } from 'uuid';
import { generate } from 'generate-password'

@Table
export default class Wallet extends Model {

  @Column({primaryKey: true, defaultValue: v4()})
  id: string;

  @Column
  holderEmail: string;

  @Column({allowNull: true, defaultValue: null})
  accountNumber: string;

  @Column({defaultValue: 0})
  balance: number;

  @Column({defaultValue: 0})
  amountRecord: number;

  @Column({defaultValue: 0})
  frozenBalance: number;

  @Column({defaultValue: generate({length: 10, numbers: true})})
  passKey: string;
  
  @Column({defaultValue: "User", type: DataType.ENUM("User","Agent","Business")})
  type: WalletType;
  
}

