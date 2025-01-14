import { Request, Response } from "express";
import Project from "../models/projectModel";

export const sendCollaborationRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { projectId } = req.params;
        console.log(projectId);
        const userId = req.userId as string; // Ensure userId is explicitly typed as string

        // Check if userId exists (auth middleware should set this)
        if (!userId) {
            res.status(403).json({ message: "Unauthorized. User ID is missing." });
            return;
        }

        // Find the project
        const project = await Project.findById(projectId);
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }

        // Check if the user already sent a request
        const existingRequest = project.collaborationRequests.find(
            (request) => request.userId === userId
        );
        if (existingRequest) {
            res.status(400).json({ message: "Collaboration request already sent" });
            return;
        }

        // Add the request to the collaborationRequests array
        project.collaborationRequests.push({ userId, status: "pending" });
        await project.save();

        res.status(200).json({ message: "Collaboration request sent successfully" });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};


export const respondToCollaborationRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { projectId } = req.params;
        const { response } = req.body; // "accept" or "reject"
        const userId = req.userId as string; // Extracting from authMiddleware

        // Validate response
        if (!["accept", "reject"].includes(response)) {
            res.status(400).json({ message: "Invalid response. Use 'accept' or 'reject'." });
            return;
        }

        // Find the project
        const project = await Project.findById(projectId);
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }

        // Check if the authenticated user is the owner
        if (project.ownerId !== req.userId) {
            res.status(403).json({ message: "You are not authorized to respond to this request" });
            return;
        }

        // Find the collaboration request for the current authenticated user
        const request = project.collaborationRequests.find(
            (req) => req.userId === userId && req.status === "pending"
        );
        if (!request) {
            res.status(404).json({ message: "Collaboration request not found" });
            return;
        }

        // Update the request status
        request.status = response === "accept" ? "accepted" : "rejected";

        // Add the user to collaborators if accepted
        if (response === "accept") {
            project.collaborators = project.collaborators || [];
            project.collaborators.push(userId);
        }

        await project.save();

        res.status(200).json({ message: `Request ${response}ed successfully` });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getCollaborationRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        const { projectId } = req.params;

        // Find the project
        const project = await Project.findById(projectId);
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }

        // Check if the authenticated user is the owner
        if (project.ownerId !== req.userId) {
            res.status(403).json({ message: "You are not authorized to view these requests" });
            return;
        }

        // Filter pending requests
        const pendingRequests = project.collaborationRequests.filter(
            (request) => request.status === "pending"
        );

        res.status(200).json(pendingRequests);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
