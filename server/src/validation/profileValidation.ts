import { z } from "zod";


export const userProfileSchema = z.object({
    firstname: z
        .string(),
    lastname: z
        .string(),
    email: z.string().email("Invalid email address"),
    bio: z.string().max(300, "Bio must be 300 characters or fewer").optional(),
    profilePicture: z.string().url("Profile picture must be a valid URL").optional(),
    socialLinks: z
        .object({
            github: z.string().url("GitHub link must be a valid URL").optional(),
            linkedin: z.string().url("LinkedIn link must be a valid URL").optional(),
        })
        .optional(),
    techStacks: z
        .array(z.string().min(1, "Tech stack item cannot be empty"))
        .optional(),
});


export const validateUserProfile = (data: any) => {
    return userProfileSchema.parse(data);
};
