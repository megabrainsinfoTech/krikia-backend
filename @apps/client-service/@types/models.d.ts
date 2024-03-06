import { Model } from "sequelize-typescript";

interface IUserM {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    avatarUrl?: string | null;
    password: string;
    confirmPassword?: string;
    changePasswordDate?: string;
    status?: 'Active' | 'Suspended' | 'Deleted' | 'Incomplete' | 'Banned';
    async cmpPassword(inPassword: string, password: string): Promise<boolean>;
}

interface IUserMCreationAttributes
    extends Omit<IUserM, 'id' | 'fullName' | 'cmpPassword'> {}
  
interface IUserMInstance
    extends Model<Omit<IUserM, "cmpPassword">, IUserMCreationAttributes> {
        status: string;
        password: string;
        async cmpPassword(inPassword: string, password: string): Promise<boolean>;
    // your virtual fields or methods go here
  }