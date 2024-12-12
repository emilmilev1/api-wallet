import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { constants } from '../common/constants';
import { ResultError } from '../utils/customErrors/resultError';
import { UserDb } from '../types/userDb';
import { User } from '../interfaces/user';
import { UserJwtPayload } from '../interfaces/userJwtPayload';
import { CreateUserDTO } from '../models/user.dto';
import { UserRepository } from '../repositories/userRepository';
import { IUserAuthenticationService } from '../interfaces/service/userAuthenticationService.interface';

export class UserAuthenticationService implements IUserAuthenticationService {
    // DI
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async registerUser(createUserDto: CreateUserDTO): Promise<UserDb> {
        const existingUser: User | null =
            await this.userRepository.findUserByEmail(createUserDto.email);
        if (existingUser) {
            throw new ResultError('User already exists', 409);
        }

        const hashedPassword = await bcrypt.hash(
            createUserDto.password,
            constants.BCRYPT_SALT_ROUNDS
        );
        createUserDto.password = hashedPassword;

        return await this.userRepository.createUser(createUserDto);
    }

    async loginUser(email: string, password: string): Promise<string> {
        const user: User | null =
            await this.userRepository.findUserByEmail(email);
        if (!user) {
            throw new ResultError('Invalid email or password', 401);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ResultError('Invalid email or password', 401);
        }

        const userData: UserJwtPayload = {
            id: user.id,
            email: user.email,
            name: user.name,
        };

        const token = jwt.sign(userData, process.env.JWT_SECRET as string, {
            expiresIn: '30m',
        });

        if (!token) {
            throw new ResultError('Error creating token', 500);
        }

        return token;
    }
}
