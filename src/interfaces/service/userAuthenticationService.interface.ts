import { CreateUserDTO } from '../../models/user.dto';
import { UserDb } from '../../types/userDb';

export interface IUserAuthenticationService {
    registerUser(userData: CreateUserDTO): Promise<UserDb>;

    loginUser(email: string, password: string): Promise<string>;
}
