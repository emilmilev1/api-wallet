import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ResultError } from '../utils/customErrors/resultError';

const validateTransactionChains = [
    check('type').isIn(['INCOME', 'EXPENSE']).withMessage('Invalid type'),
    check('amount').isNumeric().withMessage('Amount must be a number'),
    check('category').isString().withMessage('Category must be a string'),
    check('date').isISO8601().withMessage('Invalid date'),
    check('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
];

const handleValidationErrors: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors
            .array()
            .reduce((acc: { [key: string]: string }, error) => {
                const { msg } = error;
                return msg;
            }, {});

        return next(
            new ResultError(`Validation errors: ${formattedErrors}`, 400)
        );
    }

    next();
};

export const validateTransaction: RequestHandler[] = [
    ...validateTransactionChains,
    handleValidationErrors,
];
