import express from 'express';
import {
    createTransaction,
    updateTransaction,
    deleteTransaction,
} from '../controllers/transactionController';

const transactionRouter = express.Router();

/**
 * @route POST /api/v1/transactions
 * @description Create a new transaction
 */
transactionRouter.post('/', createTransaction);

/**
 * @route PUT /api/v1/transactions/:id
 * @description Update an existing transaction
 */
transactionRouter.put('/:id', updateTransaction);

/**
 * @route DELETE /api/v1/transactions/:id
 * @description Delete a transaction
 */
transactionRouter.delete('/:id', deleteTransaction);

export default transactionRouter;
