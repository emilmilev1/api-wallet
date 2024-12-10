import { CreateUserDTO } from '../models/user.dto';
import { User } from './user';

export interface IUserRepository {
    findUserByEmail(email: string): Promise<User | null>;

    createUser(userData: CreateUserDTO): Promise<User>;
}
