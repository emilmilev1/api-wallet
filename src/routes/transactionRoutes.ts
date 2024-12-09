import express from 'express';
import {
    createTransaction,
    updateTransaction,
    deleteTransaction,
} from '../controllers/transactionController';
import { verifyToken } from '../middleware/authMiddleware';

const transactionRouter = express.Router();

/**
 * @route POST /api/v1/transactions
 * @description Create a new transaction
 */
transactionRouter.post('/', verifyToken, createTransaction);

/**
 * @route PUT /api/v1/transactions/:id
 * @description Update an existing transaction
 */
transactionRouter.put('/:id', verifyToken, updateTransaction);

/**
 * @route DELETE /api/v1/transactions/:id
 * @description Delete a transaction
 */
transactionRouter.delete('/:id', verifyToken, deleteTransaction);

export default transactionRouter;
