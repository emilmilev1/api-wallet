import {
    CreateTransactionDTO,
    UpdateTransactionDTO,
} from '../models/transaction.dto';
import { TransactionQueryDTO } from '../models/transactionQuery.dto';
import { Transaction } from './transaction';

export interface ITransactionService {
    listTransactionsService(
        queryDto: TransactionQueryDTO
    ): Promise<Transaction[]>;

    createTransactionService(
        userId: string,
        data: CreateTransactionDTO
    ): Promise<Transaction>;

    findTransactionByIdService(id: string): Promise<Transaction | null>;

    updateTransactionService(
        id: string,
        data: UpdateTransactionDTO,
        userId: string
    ): Promise<Transaction>;

    deleteTransactionService(id: string, userId: string): Promise<void>;
}
