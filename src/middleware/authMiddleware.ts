import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET as string;

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const token = req.header("Authorization");

    if (!token || token === "" || token === undefined) {
        res.status(403).json({ message: "Access denied. No token provided." });
        return;
    }

    try {
        const decoded = jwt.verify(
            token.replace("Bearer ", ""),
            secret as string
        ) as {
            id: string;
            email: string;
        };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};
