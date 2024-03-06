import { SequelizeModuleOptions } from "@nestjs/sequelize";
import Wallet from "./wallet/wallet.model";
import Transaction from "./transaction/transaction.model";

export const databaseConfig: SequelizeModuleOptions = {
  dialect: 'mysql', // Adjust as needed
  host: 'localhost',
  username: 'krikia',
  password: 'krikia',
  database: 'KrikiaWallet',
  autoLoadModels: true,
  models: [Wallet, Transaction],
  synchronize: true,
  logging: false
};
