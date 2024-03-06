import { Table, Column, Model, DataType, PrimaryKey, HasMany, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import { UserAccountStatus } from './user.interface';
import * as bcrypt from "bcryptjs"
import { v4 } from 'uuid';
import { Customer } from '../customer/customer.model';
import { UserBusiness } from '../user-business/user-business.model';
import { Purchase } from 'src/purchase/purchase.model';
import { genUUID } from 'src/+utils/common';

@Table
export class User extends Model {
  @Column({defaultValue: 0, primaryKey: true})
  id: string;

  @Column
  email: string;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  password: string;

  @Column
  dateOBirth: Date;

  @Column
  gender: "Male" | "Female";

  @Column
  phone: string;

  @Column
  stateOfResidence: string;

  @Column
  address: string;

  @Column
  avatarUrl: string;

  @Column
  fnxAccountAddress: string;

  @Column
  status: UserAccountStatus;

  @HasMany(()=> Customer)
  customers: Customer[];

  @HasMany(()=> UserBusiness)
  businesses: UserBusiness[];

  @HasMany(()=> Purchase)
  purchases: Purchase[];

  // @HasOne(()=> NextOfKin)
  // kin: NextOfKin;

  @Column(DataType.VIRTUAL)
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  async cmpPassword(inPassword: string): Promise<boolean> {
    return await bcrypt.compare(inPassword, this.password);
  }

//   Lifecycle methods
  @BeforeCreate
  static async beforeUserCreate(user: any) {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;
    user.id = genUUID();
  }

  @BeforeUpdate
  static beforeUserUpdate(user: any) {
    user.id = Object.freeze(user.id);
  }


}
