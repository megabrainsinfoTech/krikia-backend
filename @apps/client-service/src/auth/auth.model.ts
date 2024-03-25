import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  DeletedAt,
  ForeignKey,
  Table,
  Model,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from 'src/user/user.model';
import { v4 } from 'uuid';

@Table({ paranoid: true, timestamps: true })
export class RefreshToken extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: v4(),
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  token: string;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: new Date() })
  expiresIn: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  userAgent: string;

  @ForeignKey(() => User)
  @Column
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
