import express from 'express';
import {
    createTransactionHandler,
    readTransactionHandler,
    updateTransactionHandler,
    deleteTransactionHandler,
} from '../controllers/transactionController';
import { verifyToken } from '../middleware/authMiddleware';

const transactionRouter = express.Router();

/**
 * @route GET /api/v1/transactions
 * @description Get filtered and sorted transactions
 */
transactionRouter.get('/', verifyToken, readTransactionHandler);

/**
 * @route POST /api/v1/transactions
 * @description Create a new transaction
 */
transactionRouter.post('/', verifyToken, createTransactionHandler);

/**
 * @route PUT /api/v1/transactions/:id
 * @description Update an existing transaction
 */
transactionRouter.put('/:id', verifyToken, updateTransactionHandler);

/**
 * @route DELETE /api/v1/transactions/:id
 * @description Delete a transaction
 */
transactionRouter.delete('/:id', verifyToken, deleteTransactionHandler);

export default transactionRouter;
