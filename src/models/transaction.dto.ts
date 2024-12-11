import { TransactionType } from '../types/transactionType';

export class CreateTransactionDTO {
    type: TransactionType;
    amount: number;
    category: string;
    date: Date;
    userId: string;
    description?: string;

    constructor(
        type: TransactionType,
        amount: number,
        category: string,
        date: Date,
        userId: string,
        description?: string
    ) {
        this.type = type;
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.userId = userId;
        this.description = description;
    }
}

export class UpdateTransactionDTO {
    type?: TransactionType;
    category?: string;
    amount?: number;
    date?: Date;
    description?: string;
}
