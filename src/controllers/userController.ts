import { NextFunction, Request, Response } from 'express';

import { ResultError } from '../utils/customErrors/resultError';
import { CreateUserDTO, UserDTO } from '../models/user.dto';
import { getService } from '../di/container';
import { IUserAuthenticationService } from '../interfaces/service/userAuthenticationService.interface';

const authService = getService<IUserAuthenticationService>(
    'UserAuthenticationService'
);

/**
 * @description Register a new user
 * @param req
 * @param res
 * @param next
 * @route POST /api/v1/users/register
 */
export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const createUserDto: CreateUserDTO = req.body;

    if (
        !createUserDto.name ||
        !createUserDto.email ||
        !createUserDto.password
    ) {
        const error = new ResultError(
            'Name, email, and password are required',
            400
        );
        return next(error);
    }

    try {
        const newUser = await authService.registerUser(createUserDto);

        res.status(201).json({
            message: 'User created successfully',
            user: newUser,
        });
    } catch (error: any) {
        next(error);
    }
};

/**
 * @description Login a user
 * @param req
 * @param res
 * @param next
 * @route POST /api/v1/users/login
 */
export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userDto: UserDTO = req.body;

    if (!userDto.email || !userDto.password) {
        const error = new ResultError('Email and password are required', 400);
        return next(error);
    }

    try {
        const token = await authService.loginUser(
            userDto.email,
            userDto.password
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        next(error);
    }
};
