import { Request, Response } from "express";
import Project from "../models/projectModel"; 
import { validateProject } from "../validation/projectValidation"; 

export const createProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData = validateProject(req.body);
        const projectData = {
            ...validatedData,
            ownerId: req.userId as string, 
        };
        const project = new Project(projectData);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const validatedData = validateProject(req.body);
        const project = await Project.findById(id);
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        if (project.ownerId !== req.userId) {
            res.status(403).json({ message: "You are not authorized to update this project" });
            return;
        }
        const updatedProject = await Project.findByIdAndUpdate(id, validatedData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(updatedProject);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        if (project.ownerId !== req.userId) {
            res.status(403).json({ message: "You are not authorized to delete this project" });
            return;
        }
        await Project.findByIdAndDelete(id);
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllProjects = async (_req: Request, res: Response): Promise<void> => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};


export const searchProjectsByTechStack = async (req: Request, res: Response): Promise<void> => {
    try {
        const techStack = req.query.techStack as string; 
        if (!techStack || typeof techStack !== "string") {
            res.status(400).json({ message: "Tech stack query parameter is required" });
            return;
        }
        const projects = await Project.find({ techStacks: { $regex: techStack, $options: "i" } });

        res.status(200).json(projects);
    } catch (error) {
        console.log("Error searching projects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default {
    createProject,
    updateProject,
    deleteProject,
    getAllProjects,
    getProjectById,
    searchProjectsByTechStack,
};
