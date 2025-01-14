import { z } from "zod";

export const userValidationSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email format" })
        .nonempty({ message: "Email is required" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .nonempty({ message: "Password is required" }),
});


export const validateUser = (data: unknown) => {
    return userValidationSchema.parse(data);
};
