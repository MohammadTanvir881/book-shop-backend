import { z } from "zod";

export const createUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "User name is required",
      })
      .min(1, "User name cannot be empty"),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters long"),
    role: z
      .enum(["admin", "user"], {
        invalid_type_error: "Role must be either 'admin' or 'user'",
      })
      .default("user"),
    isBlocked: z.boolean().optional(),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "Old password is required",
    }),
    newPassword: z.string({ required_error: "Password is required" }),
  }),
});

export const userValidation = {
  createUserValidationSchema,
  changePasswordValidationSchema,
};
