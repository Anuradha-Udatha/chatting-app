import mongoose, { Schema, Document } from "mongoose";

export interface IUserProfile extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    bio?: string;
    profilePicture?: string;
    socialLinks?: {
        github?: string;
        linkedin?: string;
    };
    techStacks?: string[]; 
    createdAt: Date;
    updatedAt: Date;
}

const UserProfileSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        firstname:{type: String, required:true},
        lastname:{type: String, required:true},
        email: { type: String, required: true, unique: true, lowercase: true },
        bio: { type: String, maxlength: 300 },
        profilePicture: { type: String }, 
        socialLinks: {
            github: { type: String },
            linkedin: { type: String },
        },
        techStacks: { type: [String] }, 
    },
    {
        timestamps: true,
    }
);


const UserProfile = mongoose.model<IUserProfile>("UserProfile", UserProfileSchema);
export default UserProfile;
