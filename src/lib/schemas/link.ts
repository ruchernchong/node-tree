import { z } from "zod";

export const linkSchema = z
  .object({
    slug: z
      .string()
      .min(1, "Slug is required")
      .max(50, "Slug must be 50 characters or less")
      .regex(
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens",
      ),
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title must be 100 characters or less"),
    url: z.string().url("Must be a valid URL"),
    icon: z.string().optional(),
    description: z
      .string()
      .max(200, "Description must be 200 characters or less")
      .optional(),
    category: z.enum(["social", "projects", "contact", "other"]).optional(),
    isActive: z.boolean(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

export type LinkFormData = z.infer<typeof linkSchema>;
