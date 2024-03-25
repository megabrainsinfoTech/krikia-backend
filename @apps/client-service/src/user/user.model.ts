import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  HasMany,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { UserAccountStatus } from './user.interface';
import * as bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import { Customer } from '../customer/customer.model';
import { UserBusiness } from '../user-business/user-business.model';
import { Purchase } from 'src/purchase/purchase.model';
import { RefreshToken } from 'src/auth/auth.model';
import { Exclude } from 'class-transformer';
import { CompleteUserProfileDTO } from './user.dto';

@Table
export class User extends Model {
  @Column({ defaultValue: v4(), primaryKey: true, type: DataType.UUID })
  id: string;

  @Column
  email: string;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Exclude({ toPlainOnly: true })
  @Column
  password: string;

  @Column
  dateOfBirth: Date;

  @Column
  gender: 'Male' | 'Female';

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
  public status: UserAccountStatus;

  @HasMany(() => Customer)
  customers: Customer[];

  @HasMany(() => UserBusiness)
  businesses: UserBusiness[];

  @HasMany(() => Purchase)
  purchases: Purchase[];

  // User has Many refresh token
  @HasMany(() => RefreshToken, { onDelete: 'CASCADE' })
  refreshTokens: RefreshToken[];

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
  }

  @BeforeUpdate
  static beforeUserUpdate(user: any) {
    user.id = Object.freeze(user.id);
  }

  @BeforeUpdate
  static async verifyUserStatus(user: CompleteUserProfileDTO & User) {
    const fields =
      user.email &&
      user.firstName &&
      user.gender &&
      user.phone &&
      user.lastName &&
      user.dateOfBirth;
    if (!fields) {
      user.status = 'Incomplete';
    }
  }
}
