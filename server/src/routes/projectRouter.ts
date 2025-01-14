import express from "express";
import {
    createProject,
    updateProject,
    deleteProject,
    getAllProjects,
    getProjectById,
    searchProjectsByTechStack,
} from "../controllers/project"; 
import { authMiddleware } from "../middlewares/auth";

const projectRouter = express.Router();

projectRouter.get("/search", authMiddleware, searchProjectsByTechStack);
projectRouter.get("/:id", authMiddleware, getProjectById);
projectRouter.post("/", authMiddleware, createProject);
projectRouter.put("/:id", authMiddleware, updateProject);
projectRouter.delete("/:id", authMiddleware, deleteProject);
projectRouter.get("/", authMiddleware, getAllProjects);


export default projectRouter;
