import { Request, Response } from "express";
import Swipe from "../models/swipeModel"; 
import { validateSwipe } from "../validation/swipeValidation";
import Project from "../models/projectModel";

export const createSwipe = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData = validateSwipe(req.body);
        const projectExists = await Project.findById(validatedData.swipedOnId);
        if (!projectExists) {
            res.status(404).json({ message: "The project you are trying to swipe on does not exist." });
            return;
        }
        const swipeData = {
            ...validatedData,
            swiperId: req.userId,
        };
        const swipe = new Swipe(swipeData);
        await swipe.save();
        res.status(201).json(swipe);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};


export const getUserSwipes = async (req: Request, res: Response): Promise<void> => {
    try {
        const swipes = await Swipe.find({ swiperId: req.userId });

        res.status(200).json(swipes);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getLikesForEntity = async (req: Request, res: Response): Promise<void> => {
    try {
        const { swipedOnId } = req.params;

        const likes = await Swipe.find({ swipedOnId, action: "like" });

        res.status(200).json(likes);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
