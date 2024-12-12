import { TransactionService } from '../../src/services/transactionService';
import { TransactionRepository } from '../../src/repositories/transactionRepository';
import { ResultError } from '../../src/utils/customErrors/resultError';
import { Transaction } from '../../src/interfaces/transaction';
import { TransactionQueryDTO } from '../../src/models/transactionQuery.dto';
import {
    CreateTransactionDTO,
    UpdateTransactionDTO,
} from '../../src/models/transaction.dto';

jest.mock('../../src/repositories/transactionRepository');

describe('TransactionService', () => {
    let transactionService: TransactionService;
    let transactionRepository: jest.Mocked<TransactionRepository>;

    beforeEach(() => {
        transactionRepository =
            new TransactionRepository() as jest.Mocked<TransactionRepository>;
        transactionService = new TransactionService(transactionRepository);
    });

    describe('listTransactionsService', () => {
        it('should return transactions with valid query', async () => {
            const queryDto: TransactionQueryDTO = {
                userId: 'user123',
                type: 'INCOME',
                category: 'Salary',
                startDate: '2023-01-01',
                endDate: '2023-12-31',
                sortBy: 'date',
                sortOrder: 'asc',
            };

            const transactions: Transaction[] = [
                {
                    id: '1',
                    userId: 'user123',
                    type: 'INCOME',
                    amount: 500,
                    category: 'Salary',
                    date: new Date('2023-01-01'),
                    description: 'Monthly salary',
                },
            ];

            transactionRepository.getTransactions.mockResolvedValue(
                transactions
            );

            const result =
                await transactionService.listTransactionsService(queryDto);
            expect(result).toEqual(transactions);
            expect(transactionRepository.getTransactions).toHaveBeenCalledWith(
                {
                    userId: 'user123',
                    type: 'INCOME',
                    category: 'Salary',
                    date: {
                        gte: new Date('2023-01-01'),
                        lte: new Date('2023-12-31'),
                    },
                },
                'date',
                'asc'
            );
        });

        it('should throw an error for invalid type', async () => {
            const queryDto: TransactionQueryDTO = {
                userId: 'user123',
                type: 'INVALID',
                category: 'Salary',
                startDate: '2023-01-01',
                endDate: '2023-12-31',
                sortBy: 'date',
                sortOrder: 'asc',
            };

            const transactions: Transaction[] = [
                {
                    id: '1',
                    userId: 'user123',
                    type: 'INVALID',
                    amount: 500,
                    category: 'Salary',
                    date: new Date('2023-01-01'),
                    description: 'Monthly salary',
                },
            ];

            transactionRepository.getTransactions.mockResolvedValue(
                transactions
            );

            const result = transactionService.listTransactionsService(queryDto);

            expect(result).rejects.toThrow('Invalid transaction type');
        });
    });

    describe('createTransactionService', () => {
        it('should create a transaction with valid data', async () => {
            const userId = 'user123';

            const data: CreateTransactionDTO = {
                type: 'EXPENSE',
                amount: 100,
                category: 'Groceries',
                date: new Date('2023-02-01'),
                description: 'Weekly groceries',
                userId: userId,
            };

            const createdTransaction: Transaction = {
                id: '1',
                userId,
                type: 'EXPENSE',
                amount: 100,
                category: 'Groceries',
                date: new Date('2023-02-01'),
                description: 'Weekly groceries',
            };

            transactionRepository.createTransaction.mockResolvedValue(
                createdTransaction
            );

            const result = await transactionService.createTransactionService(
                userId,
                data
            );
            expect(result).toEqual(createdTransaction);
            expect(
                transactionRepository.createTransaction
            ).toHaveBeenCalledWith({
                ...data,
                userId,
                date: new Date('2023-02-01'),
            });
        });

        it('should throw an error if required fields are missing', async () => {
            const userId = 'user123';
            const data: Partial<CreateTransactionDTO> = {
                type: 'EXPENSE',
                amount: 100,
            };

            await expect(
                transactionService.createTransactionService(
                    userId,
                    data as CreateTransactionDTO
                )
            ).rejects.toThrow(
                new ResultError(
                    'All fields except description are required',
                    400
                )
            );
        });
    });

    describe('updateTransactionService', () => {
        it('should update an existing transaction', async () => {
            const id = '1';
            const userId = 'user123';
            const data: UpdateTransactionDTO = {
                amount: 150,
            };

            const existingTransaction: Transaction = {
                id,
                userId,
                type: 'EXPENSE',
                amount: 100,
                category: 'Groceries',
                date: new Date('2023-02-01'),
                description: 'Weekly groceries',
            };

            const updatedTransaction: Transaction = {
                ...existingTransaction,
                amount: 150,
            };

            transactionRepository.findTransactionById.mockResolvedValue(
                existingTransaction
            );
            transactionRepository.updateTransaction.mockResolvedValue(
                updatedTransaction
            );

            const result = await transactionService.updateTransactionService(
                id,
                data,
                userId
            );
            expect(result).toEqual(updatedTransaction);
            expect(
                transactionRepository.updateTransaction
            ).toHaveBeenCalledWith(id, {
                amount: 150,
            });
        });

        it('should throw an error if the transaction is not found', async () => {
            const id = '1';
            const userId = 'user123';
            const data: UpdateTransactionDTO = { amount: 150 };

            transactionRepository.findTransactionById.mockResolvedValue(null);

            await expect(
                transactionService.updateTransactionService(id, data, userId)
            ).rejects.toThrow(new ResultError('Transaction not found', 404));
        });
    });

    describe('deleteTransactionService', () => {
        it('should delete a transaction', async () => {
            const id = '1';
            const userId = 'user123';
            const existingTransaction: Transaction = {
                id,
                userId,
                type: 'EXPENSE',
                amount: 100,
                category: 'Groceries',
                date: new Date('2023-02-01'),
                description: 'Weekly groceries',
            };

            transactionRepository.findTransactionById.mockResolvedValue(
                existingTransaction
            );
            transactionRepository.deleteTransaction.mockResolvedValue();

            await transactionService.deleteTransactionService(id, userId);

            expect(
                transactionRepository.deleteTransaction
            ).toHaveBeenCalledWith(id);
        });

        it('should throw an error if the transaction does not belong to the user', async () => {
            const id = '1';
            const userId = 'user123';
            const existingTransaction: Transaction = {
                id,
                userId: 'anotherUser',
                type: 'EXPENSE',
                amount: 100,
                category: 'Groceries',
                date: new Date('2023-02-01'),
                description: 'Weekly groceries',
            };

            transactionRepository.findTransactionById.mockResolvedValue(
                existingTransaction
            );

            await expect(
                transactionService.deleteTransactionService(id, userId)
            ).rejects.toThrow(new ResultError('Unauthorized user', 403));
        });
    });
});
