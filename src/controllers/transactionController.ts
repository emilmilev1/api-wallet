import { Request, Response, NextFunction } from 'express';
import { ResultError } from '../utils/customErrors/resultError';
import { TransactionType } from '../types/transactionType';
import {
    CreateTransactionDTO,
    UpdateTransactionDTO,
} from '../models/transaction.dto';
import { ITransactionRepository } from '../interfaces/transactionRepository.interface';
import { TransactionRepository } from '../repositories/transactionRepository';

// DI
const transactionRepository: ITransactionRepository =
    new TransactionRepository();

/**
 * @description Get filtered and sorted transactions
 * @route GET /api/v1/transactions
 */
export const readTransactionHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { type, category, startDate, endDate, sortBy, sortOrder } = req.query;
    const userId = req.user.id;

    try {
        const whereClause: {
            userId: string;
            type?: TransactionType;
            category?: string;
            date?: {
                gte?: Date;
                lte?: Date;
            };
        } = { userId };

        if (type) {
            if (!['INCOME', 'EXPENSE'].includes(type as TransactionType)) {
                return next(new ResultError('Invalid transaction type', 400));
            }
            whereClause.type = type as TransactionType;
        }

        if (category) {
            whereClause.category = category as string;
        }

        if (startDate || endDate) {
            whereClause.date = {
                ...(startDate && { gte: new Date(startDate as string) }),
                ...(endDate && { lte: new Date(endDate as string) }),
            };
        }

        const transactions = await transactionRepository.findTransactions(
            whereClause,
            sortBy as string,
            (sortOrder === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc'
        );

        res.status(200).json({ transactions });
    } catch (error) {
        next(error);
    }
};

/**
 * @description Create a new transaction
 * @route POST /api/v1/transactions
 */
export const createTransactionHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const createTransactionDto: CreateTransactionDTO = req.body;

    if (
        !createTransactionDto.type ||
        !createTransactionDto.amount ||
        !createTransactionDto.category ||
        !createTransactionDto.date
    ) {
        return next(
            new ResultError('All fields except description are required', 400)
        );
    }

    try {
        const userId = req.user.id;
        if (!userId) {
            return next(new ResultError('Unauthorized user', 403));
        }

        createTransactionDto.date = new Date(createTransactionDto.date);

        const newTransaction =
            await transactionRepository.createTransaction(createTransactionDto);

        res.status(201).json({
            message: 'Transaction created successfully',
            transaction: newTransaction,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @description Update a transaction
 * @route PUT /api/v1/transactions/:id
 */
export const updateTransactionHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const updateTransactionDto: UpdateTransactionDTO = req.body;

    try {
        const existingTransaction =
            await transactionRepository.findTransactionById(id);
        if (!existingTransaction) {
            return next(new ResultError('Transaction not found', 404));
        }

        if (existingTransaction.userId !== req.user.id) {
            return next(new ResultError('Unauthorized user', 403));
        }

        if (updateTransactionDto.date) {
            updateTransactionDto.date = new Date(updateTransactionDto.date);
        }

        const updatedTransaction =
            await transactionRepository.updateTransaction(
                id,
                updateTransactionDto
            );

        res.status(200).json({
            message: 'Transaction updated successfully',
            transaction: updatedTransaction,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @description Delete a transaction
 * @route DELETE /api/v1/transactions/:id
 */
export const deleteTransactionHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const existingTransaction =
            await transactionRepository.findTransactionById(id);
        if (!existingTransaction) {
            return next(new ResultError('Transaction not found', 404));
        }

        if (existingTransaction.userId !== req.user.id) {
            return next(new ResultError('Unauthorized user', 403));
        }

        await transactionRepository.deleteTransaction(id);

        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        next(error);
    }
};
