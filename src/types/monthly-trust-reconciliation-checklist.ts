import * as z from "zod";

const checkpointRowSchema = z.object({
  status: z.string(),
  comments: z.string(),
});

export const monthlyTrustReconciliationChecklistSchema = z.object({
  month: z.string(),
  date: z.string(),
  preparedBy: z.string(),
  licensedManager: z.string(),

  b: z.object({
    b1: checkpointRowSchema,
    b2: checkpointRowSchema,
    b3: checkpointRowSchema,
  }),

  c: z.object({
    c1: checkpointRowSchema,
    c2: checkpointRowSchema,
    c3: checkpointRowSchema,
    c4: checkpointRowSchema,
  }),

  d: z.object({
    d1: checkpointRowSchema,
    d2: checkpointRowSchema,
    d3: checkpointRowSchema,
    d4: checkpointRowSchema,
  }),

  e: z.object({
    e1: checkpointRowSchema,
    e2: checkpointRowSchema,
    differenceDetails: z.string(),
  }),

  f: z.object({
    f1: checkpointRowSchema,
    f2: checkpointRowSchema,
    f3: checkpointRowSchema,
    notes: z.string(),
  }),

  g: z.object({
    g1: checkpointRowSchema,
    g2: checkpointRowSchema,
    g3: checkpointRowSchema,
  }),

  preparer: z.object({
    name: z.string(),
    signature: z.string(),
    date: z.string(),
  }),

  licensedManagerReview: z.object({
    name: z.string(),
    signature: z.string(),
    date: z.string(),
  }),

  filing: z.object({
    location: z.string(),
    dateFiled: z.string(),
    annualReview: z.string(),
  }),
});

export type MonthlyTrustReconciliationChecklistFormValues = z.infer<typeof monthlyTrustReconciliationChecklistSchema>;
