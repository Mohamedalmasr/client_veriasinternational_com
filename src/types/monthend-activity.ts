import * as z from "zod";

const checkpointRowSchema = z.object({
  status: z.string(),
  comments: z.string(),
});

const unusualBalanceSchema = z.object({
  fileClientId: z.string(),
  clientName: z.string(),
  amount: z.string(),
  natureOfIssue: z.string(),
  actionPlan: z.string(),
  targetResolutionDate: z.string(),
});

export const monthendActivitySchema = z.object({
  trustAccount: z.string(),
  monthEndDate: z.string(),
  preparerName: z.string(),
  datePrepared: z.string(),
  lmName: z.string(),
  dateReviewed: z.string(),
  monthType: z.string(),

  s1: z.object({
    s1_1: checkpointRowSchema,
    s1_2: checkpointRowSchema,
    s1_3: checkpointRowSchema,
  }),

  s2: z.object({
    s2_1: checkpointRowSchema,
    s2_2: checkpointRowSchema,
    s2_3: checkpointRowSchema,
    s2_4: checkpointRowSchema,
  }),

  unusualBalances: z.array(unusualBalanceSchema),

  s3: z.object({
    bankClosingBalance: z.string(),
    outstandingDeposits: z.string(),
    outstandingCheques: z.string(),
    otherAdjustments: z.string(),
    reconciledBalance: z.string(),
    controls: z.object({
      s3_1: checkpointRowSchema,
      s3_2: checkpointRowSchema,
      s3_3: checkpointRowSchema,
      s3_4: checkpointRowSchema,
    }),
  }),

  s4: z.object({
    reconciledBankBalance: z.string(),
    totalTrustLiability: z.string(),
    difference: z.string(),
    controls: z.object({
      s4_1: checkpointRowSchema,
      s4_2: checkpointRowSchema,
    }),
    differenceExplanation: z.string(),
  }),

  s5: z.object({
    s5_1: checkpointRowSchema,
    s5_2: checkpointRowSchema,
    s5_3: checkpointRowSchema,
    s5_4: checkpointRowSchema,
    s5_5: checkpointRowSchema,
    s5_6: checkpointRowSchema,
  }),

  preparerCert: z.object({
    name: z.string(),
    signature: z.string(),
    date: z.string(),
  }),

  s6: z.object({
    s6_1: checkpointRowSchema,
    s6_2: checkpointRowSchema,
    s6_3: checkpointRowSchema,
    lmComments: z.string(),
  }),

  lmReview: z.object({
    name: z.string(),
    signature: z.string(),
    date: z.string(),
  }),

  s7: z.object({
    s7_1: checkpointRowSchema,
    s7_2: checkpointRowSchema,
    s7_3: checkpointRowSchema,
  }),

  s7PreparerCert: z.object({
    name: z.string(),
    signature: z.string(),
    date: z.string(),
  }),

  s7LmReview: z.object({
    name: z.string(),
    signature: z.string(),
    date: z.string(),
  }),
});

export type MonthendActivityFormValues = z.infer<typeof monthendActivitySchema>;
