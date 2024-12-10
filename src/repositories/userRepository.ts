import dbClient from '../database/dbClient';
import { User } from '../interfaces/user';
import { IUserRepository } from '../interfaces/userRepository.interface';

export class UserRepository implements IUserRepository {
    /**
     * Find a user by email.
     * @param email - User's email address.
     * @returns A user object or null if not found.
     */
    async findUserByEmail(email: string): Promise<User | null> {
        return await dbClient.user.findUnique({
            where: { email },
        });
    }

    /**
     * Create a new user in the database.
     * @param userData - Object containing user details.
     * @returns The created user.
     */
    async createUser(userData: {
        name: string;
        email: string;
        password: string;
    }): Promise<User> {
        return await dbClient.user.create({
            data: userData,
        });
    }
}
