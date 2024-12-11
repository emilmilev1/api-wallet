import dbClient from '../../src/database/dbClient';
import { UserRepository } from '../../src/repositories/userRepository';

jest.mock('../../src/database/dbClient', () => ({
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
}));

describe('UserRepository', () => {
    const userRepository = new UserRepository();

    describe('findUserByEmail', () => {
        it('should return a user if found', async () => {
            // Arrange
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                name: 'Test User',
                password: 'hashedPassword',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            (dbClient.user.findUnique as jest.Mock).mockResolvedValueOnce(
                mockUser
            );

            // Act
            const result =
                await userRepository.findUserByEmail('test@example.com');

            // Assert
            expect(result).toEqual(mockUser);
            expect(dbClient.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
            });
        });

        it('should return null if user is not found', async () => {
            // Arrange
            (dbClient.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

            // Act
            const result = await userRepository.findUserByEmail(
                'notfound@example.com'
            );

            // Assert
            expect(result).toBeNull();
            expect(dbClient.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'notfound@example.com' },
            });
        });
    });

    describe('createUser', () => {
        it('should create a user and return the user data', async () => {
            // Arrange
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedPassword',
            };
            const createdUser = {
                id: '1',
                ...userData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            (dbClient.user.create as jest.Mock).mockResolvedValueOnce(
                createdUser
            );

            // Act
            const result = await userRepository.createUser(userData);

            // Assert
            expect(result).toEqual(createdUser);
            expect(dbClient.user.create).toHaveBeenCalledWith({
                data: userData,
            });
        });

        it('should throw an error if user creation fails', async () => {
            // Arrange
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedPassword',
            };
            (dbClient.user.create as jest.Mock).mockRejectedValueOnce(
                new Error('User creation failed')
            );

            // Act and Assert
            await expect(userRepository.createUser(userData)).rejects.toThrow(
                'User creation failed'
            );
            expect(dbClient.user.create).toHaveBeenCalledWith({
                data: userData,
            });
        });
    });
});
