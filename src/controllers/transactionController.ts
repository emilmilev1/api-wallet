import { Request, Response, NextFunction } from 'express';
import { ResultError } from '../utils/customErrors/resultError';
import { TransactionType } from '../types/transactionType';
import {
    CreateTransactionDTO,
    UpdateTransactionDTO,
} from '../models/transaction.dto';
import { TransactionQueryDTO } from '../models/transactionQuery.dto';
import { getService } from '../di/container';
import { ITransactionService } from '../interfaces/service/transactionService.interface';

const transactionService =
    getService<ITransactionService>('TransactionService');

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

    if (!req.user) {
        return next(new ResultError('User not authenticated', 401));
    }

    const userId = req.user.id;

    const queryDto = new TransactionQueryDTO({
        userId,
        type: type as TransactionType,
        category: category as string,
        startDate: startDate as string,
        endDate: endDate as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
    });

    try {
        const transactions =
            await transactionService.listTransactionsService(queryDto);

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

    if (!req.user) {
        return next(new ResultError('User not authenticated', 401));
    }

    const userId = req.user.id;
    if (!userId) {
        return next(new ResultError('Unauthorized user', 403));
    }

    try {
        const newTransaction =
            await transactionService.createTransactionService(
                userId,
                createTransactionDto
            );

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
    if (!req.user) {
        return next(new ResultError('User not authenticated', 401));
    }
    const userId = req.user.id;

    const { id } = req.params;
    const updateTransactionDto: UpdateTransactionDTO = req.body;

    try {
        const updatedTransaction =
            await transactionService.updateTransactionService(
                id,
                updateTransactionDto,
                userId
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
    if (!req.user) {
        return next(new ResultError('User not authenticated', 401));
    }

    const userId = req.user.id;
    const { id } = req.params;

    try {
        await transactionService.deleteTransactionService(id, userId);

        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        next(error);
    }
};
