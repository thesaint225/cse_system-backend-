import { z } from "zod";

// Define the student validation schema
export const studentSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z.string().optional(),

  email: z.string().email("Please enter a valid email address").toLowerCase(),

  password: z.string().min(6, "Password must be at least 6 characters long"),

  role: z.enum(["admin", "student"]).default("student"),

  studentInfo: z
    .object({
      bio: z.string().trim().optional(),
      profilePicture: z.string().optional(),
      history: z.array(z.string()).optional(),
    })
    .optional(),
});

// ✅ TypeScript Type from Zod Schema
export type StudentType = z.infer<typeof studentSchema>;
