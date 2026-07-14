import * as z from "zod";

export const commissionAmendmentSchema = z.object({
  mlsFileNumber: z.string(),
  sellerNames: z.string(),
  brokerageName: z.string(),
  propertyAddress: z.string(),

  previousCommissionTerms: z.string(),
  newCommissionTerms: z.string(),

  effectiveDate: z.string(),
  apsDate: z.string(),
  transactionsAffected: z.string(),

  seller1Name: z.string(),
  seller1Signature: z.string(),
  seller1Date: z.string(),
  seller2Name: z.string(),
  seller2Signature: z.string(),
  seller2Date: z.string(),

  brokerageRepName: z.string(),
  brokerageRepSignature: z.string(),
  brokerageRepTitle: z.string(),
  brokerageRepDate: z.string(),
});

export type CommissionAmendmentFormValues = z.infer<typeof commissionAmendmentSchema>;
