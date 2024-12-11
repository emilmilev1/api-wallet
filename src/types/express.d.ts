import { User } from '@prisma/client';
import { Request } from 'express';
import { UserDb } from './userDb';

declare global {
    namespace Express {
        interface Request {
            user?: UserDb;
        }
    }
}
