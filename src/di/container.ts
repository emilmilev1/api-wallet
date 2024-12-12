import { AnalyticsRepository } from '../repositories/analyticsRepository';
import { TransactionRepository } from '../repositories/transactionRepository';
import { UserRepository } from '../repositories/userRepository';
import { AnalyticsService } from '../services/analyticsService';
import { TransactionService } from '../services/transactionService';
import { UserAuthenticationService } from '../services/userAuthenticationService';
import { ResultError } from '../utils/customErrors/resultError';

const container = new Map<string, () => any>();

// Register factories
container.set('UserRepository', () => new UserRepository());
container.set('TransactionRepository', () => new TransactionRepository());
container.set('AnalyticsRepository', () => new AnalyticsRepository());

// Register services
container.set(
    'UserAuthenticationService',
    () =>
        new UserAuthenticationService(
            getService<UserRepository>('UserRepository')
        )
);
container.set(
    'TransactionService',
    () =>
        new TransactionService(
            getService<TransactionRepository>('TransactionRepository')
        )
);
container.set(
    'AnalyticsService',
    () =>
        new AnalyticsService(
            getService<AnalyticsRepository>('AnalyticsRepository')
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
