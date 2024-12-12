import { Transaction } from '../interfaces/transaction';
import { ResultError } from '../utils/customErrors/resultError';
import { TransactionType } from '../types/transactionType';
import { ITransactionService } from '../interfaces/service/transactionService.interface';
import { TransactionQueryDTO } from '../models/transactionQuery.dto';
import { TransactionRepository } from '../repositories/transactionRepository';
import {
    CreateTransactionDTO,
    UpdateTransactionDTO,
} from '../models/transaction.dto';

export class TransactionService implements ITransactionService {
    // DI
    private transactionRepository: TransactionRepository;

    constructor(transactionRepository: TransactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    async listTransactionsService(
        queryDto: TransactionQueryDTO
    ): Promise<Transaction[]> {
        const whereClause = {
            userId: queryDto.userId,
            type: queryDto.type,
            category: queryDto.category,
            date: {
                ...(queryDto.startDate && {
                    gte: new Date(queryDto.startDate),
                }),
                ...(queryDto.endDate && { lte: new Date(queryDto.endDate) }),
            },
        };

        if (queryDto.type) {
            if (
                !['INCOME', 'EXPENSE'].includes(
                    queryDto.type as TransactionType
                )
            ) {
                throw new ResultError('Invalid transaction type', 400);
            }
            whereClause.type = queryDto.type as TransactionType;
        }

        return this.transactionRepository.getTransactions(
            whereClause,
            queryDto.sortBy || 'date',
            queryDto.sortOrder || 'asc'
        );
    }

    async createTransactionService(
        userId: string,
        data: CreateTransactionDTO
    ): Promise<Transaction> {
        if (!data.type || !data.amount || !data.category || !data.date) {
            throw new ResultError(
                'All fields except description are required',
                400
            );
        }

        data.userId = userId;
        data.date = new Date(data.date);

        return this.transactionRepository.createTransaction(data);
    }

    async updateTransactionService(
        id: string,
        data: UpdateTransactionDTO,
        userId: string
    ): Promise<Transaction> {
        const existingTransaction =
            await this.transactionRepository.findTransactionById(id);
        if (!existingTransaction) {
            throw new ResultError('Transaction not found', 404);
        }

        if (existingTransaction.userId !== userId) {
            throw new ResultError('Unauthorized user', 403);
        }

        if (data.date) {
            data.date = new Date(data.date);
        }

        return this.transactionRepository.updateTransaction(id, data);
    }

    async findTransactionByIdService(id: string): Promise<Transaction | null> {
        return this.transactionRepository.findTransactionById(id);
    }

    async deleteTransactionService(id: string, userId: string): Promise<void> {
        const existingTransaction =
            await this.transactionRepository.findTransactionById(id);
        if (!existingTransaction) {
            throw new ResultError('Transaction not found', 404);
        }

        if (existingTransaction.userId !== userId) {
            throw new ResultError('Unauthorized user', 403);
        }

        return this.transactionRepository.deleteTransaction(id);
    }
}
