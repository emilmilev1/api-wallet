import { CreateUserDTO } from '../models/user.dto';
import { UserDb } from '../types/userDb';

export interface IUserAuthentication {
    registerUser(userData: CreateUserDTO): Promise<UserDb>;

    loginUser(email: string, password: string): Promise<string>;
}
