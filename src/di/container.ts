import { UserAuthenticationService } from '../services/userAuthentication';
import { ResultError } from '../utils/customErrors/resultError';

const container = new Map<string, any>();

// Register services
container.set('UserAuthenticationService', new UserAuthenticationService());

// Retrieve services
export const getService = <T>(serviceName: string): T => {
    const service = container.get(serviceName);

    if (!service) {
        throw new ResultError(
            `Service ${serviceName} not found in DI container`,
            404
        );
    }

    return service as T;
};
