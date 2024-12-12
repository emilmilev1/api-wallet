import request from 'supertest';
import { TransactionRepository } from '../../src/repositories/transactionRepository';
import { CreateTransactionDTO } from '../../src/models/transaction.dto';
import dotenv from 'dotenv';
import { ResultError } from '../../src/utils/customErrors/resultError';

dotenv.config();

const baseUrl = process.env.BASE_URL || 'http://localhost:9000/api/v1';

// Mock dependencies
jest.mock('../../src/repositories/transactionRepository');
jest.mock('../../src/middleware/authMiddleware', () => ({
    verifyToken: jest.fn((req, res, next) => {
        req.user = { id: 'user123' }; // Mock user ID for all tests
        next();
    }),
}));

const transactionRepositoryMock = TransactionRepository as jest.MockedClass<
    typeof TransactionRepository
>;

describe('TransactionController E2E Tests', () => {
    let mockToken: string;

    beforeAll(async () => {
        // Sign in an existing user and get authentication token
        const loginResponse = await request(baseUrl)
            .post('/users/login')
            .send({ email: 'testuser@example.com', password: 'testpassword' })
            .expect(200);

        mockToken = loginResponse.body.token;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /transactions', () => {
        it('should create a new transaction', async () => {
            const transactionData: CreateTransactionDTO = {
                type: 'INCOME',
                amount: 1000,
                category: 'Salary',
                date: new Date('2024-12-12'),
                userId: '6d389103-3ea4-438c-b822-7d645ae2cfe9',
                description: 'Test transaction',
            };

            transactionRepositoryMock.prototype.createTransaction.mockResolvedValue(
                {
                    id: 'dad99e10-3eb6-43dd-bde4-9e8fefc1b72b',
                    description: 'Test transaction',
                    ...transactionData,
                }
            );

            const response = await request(baseUrl)
                .post('/transactions')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(transactionData)
                .expect(201);

            expect(response.body).toEqual(
                expect.objectContaining({
                    message: 'Transaction created successfully',
                    transaction: expect.objectContaining({
                        id: expect.any(String),
                        type: transactionData.type,
                        amount: transactionData.amount,
                        category: transactionData.category,
                        date: expect.any(String),
                        description: transactionData.description,
                        userId: transactionData.userId,
                    }),
                })
            );
        });

        it('should return validation errors for invalid input', async () => {
            const transactionData = {
                type: 'INVALID_TYPE',
                amount: 'not-a-number',
                category: 123,
                date: 'invalid-date',
                userId: 'user123',
            };

            const response = await request(baseUrl)
                .post('/transactions')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(transactionData)
                .expect(400);

            expect(response.body).toEqual({
                error: 'Validation errors',
                details: [
                    { field: 'type', message: 'Invalid type' },
                    { field: 'amount', message: 'Amount must be a number' },
                    { field: 'category', message: 'Category must be a string' },
                    { field: 'date', message: 'Invalid date' },
                ],
            });
        });
    });

    describe('GET /transactions', () => {
        it('should return a list of transactions', async () => {
            const mockTransactions = [
                {
                    id: '1',
                    userId: 'user123',
                    type: 'INCOME',
                    amount: 1000,
                    category: 'Salary',
                    date: new Date(),
                    description: 'Test transaction 1',
                },
                {
                    id: '2',
                    userId: 'user123',
                    type: 'EXPENSE',
                    amount: 500,
                    category: 'Food',
                    date: new Date(),
                    description: 'Test transaction 2',
                },
            ];

            transactionRepositoryMock.prototype.getTransactions.mockResolvedValue(
                mockTransactions
            );

            const response = await request(baseUrl)
                .get('/transactions')
                .set('Authorization', `Bearer ${mockToken}`)
                .query({ userId: 'user123' })
                .expect(200);

            expect(response.body).toEqual(mockTransactions);
            expect(
                transactionRepositoryMock.prototype.getTransactions
            ).toHaveBeenCalledWith(
                expect.objectContaining({ userId: 'user123' }),
                'date',
                'asc'
            );
        });

        it('should return filtered transactions', async () => {
            const mockTransactions = [
                {
                    id: '1',
                    userId: 'user123',
                    type: 'INCOME',
                    amount: 1000,
                    category: 'Salary',
                    date: new Date(),
                    description: 'Test transaction',
                },
            ];

            transactionRepositoryMock.prototype.getTransactions.mockResolvedValue(
                mockTransactions
            );

            const response = await request(baseUrl)
                .get('/transactions')
                .set('Authorization', `Bearer ${mockToken}`)
                .query({ userId: 'user123', type: 'INCOME' })
                .expect(200);

            expect(response.body).toEqual(mockTransactions);
            expect(
                transactionRepositoryMock.prototype.getTransactions
            ).toHaveBeenCalledWith(
                expect.objectContaining({ userId: 'user123', type: 'INCOME' }),
                'date',
                'asc'
            );
        });
    });

    describe('PUT /transactions/:id', () => {
        it('should update a transaction', async () => {
            const updatedTransaction = {
                id: '1',
                userId: 'user123',
                type: 'INCOME',
                amount: 2000,
                category: 'Bonus',
                date: new Date(),
                description: 'Updated transaction',
            };

            transactionRepositoryMock.prototype.updateTransaction.mockResolvedValue(
                updatedTransaction
            );

            const response = await request(baseUrl)
                .put('/transactions/1')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(updatedTransaction)
                .expect(200);

            expect(response.body).toEqual(updatedTransaction);
            expect(
                transactionRepositoryMock.prototype.updateTransaction
            ).toHaveBeenCalledWith(
                '1',
                expect.objectContaining({ amount: 2000 })
            );
        });

        it('should return 404 if transaction not found', async () => {
            transactionRepositoryMock.prototype.updateTransaction.mockRejectedValue(
                new ResultError('Transaction not found', 404)
            );

            const response = await request(baseUrl)
                .put('/transactions/999')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({
                    amount: 2000,
                })
                .expect(404);

            expect(response.body).toEqual({
                error: 'Transaction not found',
            });
        });
    });

    describe('DELETE /transactions/:id', () => {
        it('should delete a transaction', async () => {
            transactionRepositoryMock.prototype.deleteTransaction.mockResolvedValue();

            await request(baseUrl)
                .delete('/transactions/1')
                .set('Authorization', `Bearer ${mockToken}`)
                .expect(204);

            expect(
                transactionRepositoryMock.prototype.deleteTransaction
            ).toHaveBeenCalledWith('1');
        });

        it('should return 404 if transaction not found', async () => {
            transactionRepositoryMock.prototype.deleteTransaction.mockImplementation(
                () => {
                    throw new ResultError('Transaction not found', 404);
                }
            );

            const response = await request(baseUrl)
                .delete('/transactions/999')
                .set('Authorization', `Bearer ${mockToken}`)
                .expect(404);

            expect(response.body).toEqual({
                error: 'Transaction not found',
            });
        });
    });
});
