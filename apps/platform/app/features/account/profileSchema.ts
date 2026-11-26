import * as z from "zod";

export const profileUpdateSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Enter a display name.")
    .max(50, "Use at most 50 characters."),
});

export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
