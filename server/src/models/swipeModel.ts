import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISwipe extends Document {
    swiperId: Types.ObjectId;       
    swipedOnId: Types.ObjectId;     
    action: "like" | "dislike";     
    createdAt: Date;                
}

const SwipeSchema: Schema = new Schema(
    {
        swiperId: { type: Schema.Types.ObjectId, ref: "User", required: true },  
        swipedOnId: { type: Schema.Types.ObjectId, ref: "Project", required: true }, 
        action: { type: String, enum: ["like", "dislike"], required: true },    
    },
    { timestamps: true } 
);

export default mongoose.model<ISwipe>("Swipe", SwipeSchema);
