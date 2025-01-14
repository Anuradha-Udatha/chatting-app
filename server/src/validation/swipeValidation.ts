import { z } from "zod";

export const swipeSchema = z.object({
    swiperId: z.string().min(1, { message: "Swiper ID is required" }).optional(),  
    swipedOnId: z.string().min(1, { message: "SwipedOnId is required" }), 
    action: z.enum(["like", "dislike"], { required_error: "Action is required" }), 
    createdAt: z.date().optional(), 
});

export const validateSwipe = (data: unknown) => swipeSchema.parse(data);
