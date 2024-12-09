import { Request, Response, NextFunction } from 'express';
import dbClient from '../database/dbClient';
import { ResultError } from '../utils/customErrors/resultError';
import { Transaction } from '../interfaces/transaction';

/**
 * @description Create a new transaction
 * @route POST /api/v1/transactions
 */
export const createTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { type, amount, category, date, description, userId } = req.body;

    if (!type || !amount || !category || !date || !userId) {
        return next(
            new ResultError('All fields except description are required', 400),
        );
    }

    try {
        if (userId !== req.user.id) {
            return next(new ResultError('Unauthorized user', 401));
        }

        const newTransaction: Transaction = await dbClient.transaction.create({
            data: {
                type,
                amount,
                category,
                date: new Date(date),
                description,
                userId,
            },
        });

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
export const updateTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { id } = req.params;
    const { type, amount, category, date, description } = req.body;

    try {
        const existingTransaction = await dbClient.transaction.findUnique({
            where: { id },
        });
        if (!existingTransaction) {
            return next(new ResultError('Transaction not found', 404));
        }

        if (existingTransaction.userId !== req.user.id) {
            return next(new ResultError('Unauthorized user', 403));
        }

        const updatedTransaction = await dbClient.transaction.update({
            where: { id },
            data: {
                type,
                amount,
                category,
                date: date ? new Date(date) : undefined,
                description,
            },
        });

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
export const deleteTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { id } = req.params;

    try {
        const existingTransaction = await dbClient.transaction.findUnique({
            where: { id },
        });
        if (!existingTransaction) {
            return next(new ResultError('Transaction not found', 404));
        }

        if (existingTransaction.userId !== req.user.id) {
            return next(new ResultError('Unauthorized user', 403));
        }

        await dbClient.transaction.delete({
            where: { id },
        });

        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        next(error);
    }
};
