import { TransactionType } from '../types/transactionType';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    category: string;
    date: Date;
    description: string | null;
    userId: string;
}
