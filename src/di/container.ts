import { TransactionRepository } from '../repositories/transactionRepository';
import { UserRepository } from '../repositories/userRepository';
import { TransactionService } from '../services/transaction';
import { UserAuthenticationService } from '../services/userAuthentication';
import { ResultError } from '../utils/customErrors/resultError';

const container = new Map<string, () => any>();

// Register factories
container.set('TransactionRepository', () => new TransactionRepository());
container.set('UserRepository', () => new UserRepository());

// Register services
container.set(
    'TransactionService',
    () =>
        new TransactionService(
            getService<TransactionRepository>('TransactionRepository')
        )
);
container.set(
    'UserAuthenticationService',
    () =>
        new UserAuthenticationService(
            getService<UserRepository>('UserRepository')
        )
);

// Lazy initialization with factories
export const getService = <T>(serviceName: string): T => {
    const serviceFactory = container.get(serviceName);

    if (!serviceFactory) {
        throw new ResultError(
            `Service ${serviceName} not found in DI container`,
            404
        );
    }

    // Create or return the service instance
    return serviceFactory() as T;
};
