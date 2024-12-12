import { TransactionType } from '../types/transactionType';

export class TransactionQueryDTO {
    userId: string;
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';

    constructor({
        userId,
        type,
        category,
        startDate,
        endDate,
        sortBy,
        sortOrder,
    }: {
        userId: string;
        type?: string;
        category?: string;
        startDate?: string;
        endDate?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) {
        this.userId = userId;
        this.type = type;
        this.category = category;
        this.startDate = startDate;
        this.endDate = endDate;
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
    }
}
