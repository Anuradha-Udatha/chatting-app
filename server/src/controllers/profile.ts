import { Request, Response } from "express";
import UserProfile, {IUserProfile} from "../models/profileModel";
import { validateUserProfile } from "../validation/profileValidation";
import { Document } from "mongoose";

export const createUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.userId) {
            res.status(403).json({ message: "Unauthorized. Please provide a valid token." });
            return;
        }
        const existingProfile = await UserProfile.findOne({ userId: req.userId });
        if (existingProfile) {
            res.status(400).json({ message: "User already has a profile" });
            return;
        }
        const validatedData = validateUserProfile(req.body);
        const userProfileData = { ...validatedData, userId: req.userId };
        const userProfile = new UserProfile(userProfileData);
        await userProfile.save();
        res.status(201).json(userProfile);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};



export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userProfile = await UserProfile.findById(id);
        if (!userProfile) {
            res.status(404).json({ message: "User profile not found" });
            return;
        }
        res.status(200).json(userProfile);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};


export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.userId) {
            res.status(403).json({ message: "Unauthorized. Please provide a valid token." });
            return;
        }
        const validatedData = validateUserProfile(req.body);
        const updatedProfile = await UserProfile.findByIdAndUpdate(
            req.params.id,
            validatedData,
            { new: true, runValidators: true }
        ) as (Document & IUserProfile & { _id: string }); 
        if (!updatedProfile) {
            res.status(404).json({ message: "User profile not found" });
            return;
        }
        if (updatedProfile.userId.toString() !== req.userId) {
            res.status(403).json({ message: "You are not authorized to update this profile" });
            return;
        }
        res.status(200).json(updatedProfile);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};

export default {
    createUserProfile,
    getUserProfile,
    updateUserProfile,
};
