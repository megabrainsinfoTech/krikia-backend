import {
  BeforeCreate,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Business } from '../business/business.model';
import { User } from '../user/user.model';
import { v4 } from 'uuid';
import { genUUID } from 'src/+utils/common';

@Table
export class UserBusiness extends Model {
  @Column({ defaultValue: v4(), primaryKey: true })
  id: string;

  @ForeignKey(() => User)
  userId: string;

  @ForeignKey(() => Business)
  businessId: string;

  @Column
  role: string;

  @BeforeCreate
  static beforeInstanceCreate(model: any) {
    model.id = genUUID();
  }

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Business)
  business: Business;
}
