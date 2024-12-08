import { User } from '@prisma/client/wasm';
import dbClient from '../src/database/dbClient';

const seedTransactions = async (): Promise<void> => {
    try {
        const users: User[] = await dbClient.user.findMany({
            select: {
                id: true,
            },
        });

        const userIds: string[] = users.map((user) => user.id);

        const transactions = [
            {
                type: 'INCOME',
                amount: 500,
                category: 'Salary',
                date: new Date('2024-12-01'),
                description: 'Monthly salary',
                userId: userIds[0],
            },
            {
                type: 'EXPENSE',
                amount: 100,
                category: 'Food',
                date: new Date('2024-12-02'),
                description: 'Groceries',
                userId: userIds[0],
            },
            {
                type: 'INCOME',
                amount: 1200,
                category: 'Salary',
                date: new Date('2024-12-03'),
                description: 'Monthly salary',
                userId: userIds[1],
            },
            {
                type: 'EXPENSE',
                amount: 200,
                category: 'Transport',
                date: new Date('2024-12-04'),
                description: 'Monthly bus pass',
                userId: userIds[1],
            },
            {
                type: 'INCOME',
                amount: 800,
                category: 'Freelance',
                date: new Date('2024-12-05'),
                description: 'Freelance project payment',
                userId: userIds[2],
            },
            {
                type: 'EXPENSE',
                amount: 50,
                category: 'Entertainment',
                date: new Date('2024-12-06'),
                description: 'Movie night',
                userId: userIds[2],
            },
            {
                type: 'INCOME',
                amount: 900,
                category: 'Salary',
                date: new Date('2024-12-07'),
                description: 'Monthly salary',
                userId: userIds[3],
            },
            {
                type: 'EXPENSE',
                amount: 150,
                category: 'Health',
                date: new Date('2024-12-08'),
                description: 'Doctor visit',
                userId: userIds[3],
            },
            {
                type: 'INCOME',
                amount: 1000,
                category: 'Investment',
                date: new Date('2024-12-09'),
                description: 'Investment dividend',
                userId: userIds[4],
            },
            {
                type: 'EXPENSE',
                amount: 300,
                category: 'Shopping',
                date: new Date('2024-12-10'),
                description: 'New phone',
                userId: userIds[4],
            },
        ];

        await dbClient.transaction.createMany({
            data: transactions,
        });

        console.log('Seeded some transactions successfully!');
    } catch (error) {
        console.error('Error seeding transactions:', error);
    }
};

seedTransactions();
