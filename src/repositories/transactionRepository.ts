import dbClient from '../database/dbClient';
import { Transaction } from '../interfaces/transaction';
import { ITransactionRepository } from '../interfaces/transactionRepository.interface';
import {
    CreateTransactionDTO,
    UpdateTransactionDTO,
} from '../models/transaction.dto';

export class TransactionRepository implements ITransactionRepository {
    /**
     * @description Find transactions with filtering and sorting
     * @param whereClause
     * @param sortBy
     * @param sortOrder
     * @returns
     */
    async findTransactions(
        whereClause: object,
        sortBy: string,
        sortOrder: 'asc' | 'desc'
    ): Promise<Transaction[]> {
        return await dbClient.transaction.findMany({
            where: whereClause,
            orderBy: sortBy ? { [sortBy]: sortOrder } : { date: 'asc' },
        });
    }

    /**
     * @description Create a new transaction
     * @param data
     * @returns
     */
    async createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
        return await dbClient.transaction.create({ data });
    }

    /**
     * @description Find a transaction by ID
     * @param id
     * @returns
     */
    async findTransactionById(id: string): Promise<Transaction | null> {
        return await dbClient.transaction.findUnique({ where: { id } });
    }

    /**
     * @description Update a transaction by ID
     * @param id
     * @param data
     * @returns
     */
    async updateTransaction(
        id: string,
        data: UpdateTransactionDTO
    ): Promise<Transaction> {
        return await dbClient.transaction.update({ where: { id }, data });
    }

    /**
     * @description Delete a transaction by ID
     * @param id
     */
    async deleteTransaction(id: string): Promise<void> {
        await dbClient.transaction.delete({ where: { id } });
    }
}
