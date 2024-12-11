import {
    CreateTransactionDTO,
    UpdateTransactionDTO,
} from '../models/transaction.dto';
import { Transaction } from './transaction';

export interface ITransactionRepository {
    getTransactions(
        whereClause: object,
        sortBy: string,
        sortOrder: 'asc' | 'desc'
    ): Promise<Transaction[]>;

    createTransaction(data: CreateTransactionDTO): Promise<Transaction>;

    findTransactionById(id: string): Promise<Transaction | null>;

    updateTransaction(
        id: string,
        data: UpdateTransactionDTO
    ): Promise<Transaction>;

    deleteTransaction(id: string): Promise<void>;
}
