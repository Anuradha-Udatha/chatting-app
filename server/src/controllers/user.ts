import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { validateUser } from "../validation/userValidation";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";
export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = validateUser(req.body);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email is already registered" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Validation failed" });
    }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = validateUser(req.body);
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Sign-in successful", token });
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Validation failed" });
    }
};
