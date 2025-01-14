import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): Response | void {
    const authHeader = req.header('Authorization'); 
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "No token provided or incorrect format" });
    }
    const token = authHeader.split(' ')[1]; 
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }; 
        req.userId = decoded.userId; 
        next(); 
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
}
