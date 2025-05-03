import { TransactionCategory } from "./transaction-category.enum";

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  accountId: string;
  date: string;
  description: string;
  category: TransactionCategory;
}