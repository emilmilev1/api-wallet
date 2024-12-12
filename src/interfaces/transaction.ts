import { TransactionType } from '../types/transactionType';

export interface Transaction {
    id: string;
    type: string;
    amount: number;
    category: string;
    date: Date;
    description: string | null;
    userId: string;
}
