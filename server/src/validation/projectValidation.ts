import { z } from "zod";


const collaborationRequestSchema = z.object({
    userId: z.string().min(1, { message: "User ID is required" }),
    status: z.enum(["pending", "accepted", "rejected"]).default("pending"),
});


export const projectValidationSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, { message: "Title is required" })
        .max(100, { message: "Title cannot exceed 100 characters" }),
    description: z
        .string()
        .trim()
        .min(1, { message: "Description is required" })
        .max(1000, { message: "Description cannot exceed 1000 characters" }),
    techStacks: z
        .array(z.string().min(1, { message: "Each tech stack must be a non-empty string" }))
        .min(1, { message: "At least one tech stack is required" }),
    collaborators: z
        .array(z.string().min(1, { message: "Each collaborator ID must be a valid string" }))
        .optional(),
    status: z
        .enum(["open", "in-progress", "completed"])
        .default("open"),
    collaborationRequests: z
        .array(collaborationRequestSchema)
        .optional(), 
});


export const validateProject = (data: unknown) => {
    return projectValidationSchema.parse(data);
};
