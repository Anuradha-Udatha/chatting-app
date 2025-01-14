import mongoose, { Schema, Document } from "mongoose";

interface ICollaborationRequest {
    userId: string;
    status: "pending" | "accepted" | "rejected";
}

export interface IProject extends Document {
    title: string;
    description: string;
    techStacks: string[];
    ownerId: string;
    status: "open" | "in-progress" | "completed";
    collaborators: string[];
    collaborationRequests: ICollaborationRequest[];
}

const projectSchema = new Schema<IProject>({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    techStacks: { type: [String], required: true, validate: (v: string[]) => v.length > 0 }, 
    ownerId: { type: String, required: true },
    status: {
        type: String,
        enum: ["open", "in-progress", "completed"],
        default: "open",
    },
    collaborators: {
        type: [String],
        default: [],
    },
    collaborationRequests: [
        {
            userId: { type: String, required: true },
            status: {
                type: String,
                enum: ["pending", "accepted", "rejected"],
                default: "pending",
            },
        },
    ],
});


const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project;
