import { Request, Response } from "express";
import UserProfile from "../models/profileModel"; 
import Project from "../models/projectModel";

export const getUserFeed = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const user = await UserProfile.findOne({ userId: req.userId });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const userTechStacks = user.techStacks || [];
        if (userTechStacks.length === 0) {
            res.status(200).json({ message: "No tech stacks found for the user", projects: [] });
            return;
        }
        const projects = await Project.find({
            techStacks: { $in: userTechStacks },
        })
            .lean()
            .exec();
        const sortedProjects = projects
            .map((project) => {
                const matches = project.techStacks.filter((tech: string) =>
                    userTechStacks.includes(tech)
                ).length;
                return { ...project, matchCount: matches };
            })
            .sort((a, b) => b.matchCount - a.matchCount);

        res.status(200).json(sortedProjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
