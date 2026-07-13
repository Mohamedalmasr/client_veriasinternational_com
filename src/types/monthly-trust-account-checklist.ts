import * as z from "zod";

const initialsBlockSchema = z.object({
  preparerInitials: z.string(),
  preparerDate: z.string(),
  managerInitials: z.string(),
  managerDate: z.string(),
});

export const monthlyTrustAccountChecklistSchema = z.object({
  monthYear: z.string(),
  preparedBy: z.string(),
  preparedDate: z.string(),
  reviewedBy: z.string(),
  reviewedDate: z.string(),

  s1_1: z.object({
    items: z.object({
      s1_1_1: z.boolean(),
      s1_1_2: z.boolean(),
      s1_1_3: z.boolean(),
      s1_1_4: z.boolean(),
      s1_1_5: z.boolean(),
      s1_1_6: z.boolean(),
    }),
    initials: initialsBlockSchema,
  }),

  s1_2: z.object({
    items: z.object({
      s1_2_1: z.boolean(),
      s1_2_2: z.boolean(),
      s1_2_2_a: z.boolean(),
      s1_2_2_b: z.boolean(),
      s1_2_2_c: z.boolean(),
      s1_2_2_d: z.boolean(),
      s1_2_3: z.boolean(),
    }),
    initials: initialsBlockSchema,
  }),

  s1_3: z.object({
    items: z.object({
      s1_3_1: z.boolean(),
      s1_3_2: z.boolean(),
      s1_3_3: z.boolean(),
      s1_3_4: z.boolean(),
    }),
    initials: initialsBlockSchema,
  }),
});

export type MonthlyTrustAccountChecklistFormValues = z.infer<typeof monthlyTrustAccountChecklistSchema>;
