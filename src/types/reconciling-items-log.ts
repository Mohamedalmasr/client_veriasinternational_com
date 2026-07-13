import * as z from "zod";

const reconcilingItemRowSchema = z.object({
  itemNumber: z.string(),
  dateIdentified: z.string(),
  description: z.string(),
  amount: z.string(),
  type: z.string(),
  expectedResolutionDate: z.string(),
  actionNotes: z.string(),
  actualResolutionDate: z.string(),
  resolvedBy: z.string(),
});

export const reconcilingItemsLogSchema = z.object({
  trustAccountName: z.string(),
  monthPeriod: z.string(),
  trustAccountNumber: z.string(),

  items: z.array(reconcilingItemRowSchema),
});

export type ReconcilingItemsLogFormValues = z.infer<typeof reconcilingItemsLogSchema>;
