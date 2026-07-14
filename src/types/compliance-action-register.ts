import * as z from "zod";

const complianceItemSchema = z.object({
  itemNumber: z.string(),
  recommendationId: z.string(),
  deficiencySummary: z.string(),
  inspectorRecommendation: z.string(),
  actionSteps: z.string(),
  responsiblePerson: z.string(),
  targetCompletionDate: z.string(),
  status: z.string(),
  actualCompletionDate: z.string(),
  policyReference: z.string(),
  notes: z.string(),
});

export const complianceActionRegisterSchema = z.object({
  items: z.array(complianceItemSchema),
});

export type ComplianceActionRegisterFormValues = z.infer<typeof complianceActionRegisterSchema>;
