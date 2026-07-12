import * as z from 'zod';

export const thirdPartyDepositSchema = z.object({
  brokerageName: z.string().min(1, 'Brokerage name is required'),

  transactionFileNo: z.string(),
  propertyAddress1: z.string(),
  propertyAddress2: z.string(),
  apsDate: z.string(),
  purchaser1: z.string(),
  purchaser2: z.string(),
  vendor1: z.string(),
  vendor2: z.string(),

  thirdPartyName: z.string(),
  relationshipToPurchaser: z.string(),
  thirdPartyAddress1: z.string(),
  thirdPartyAddress2: z.string(),
  thirdPartyPhone: z.string(),
  thirdPartyEmail: z.string(),

  depositAmount: z.string(),
  depositFormCash: z.boolean(),
  depositFormCheque: z.boolean(),
  depositFormBankDraft: z.boolean(),
  depositFormInterac: z.boolean(),
  depositFormOther: z.boolean(),
  depositFormOtherText: z.string(),
  depositReceivedDate: z.string(),

  closesDirection: z.boolean(),
  closesOther: z.string(),

  depositReturnTo: z.string(),
  depositReturnOther: z.string(),

  releasedToSeller: z.boolean(),
  additionalTerms: z.string(),

  thirdPartySignature: z.string(),
  thirdPartyPrintName: z.string(),
  thirdPartyDate: z.string(),

  purchaser1Signature: z.string(),
  purchaser1PrintName: z.string(),
  purchaser1Date: z.string(),
  purchaser2Signature: z.string(),
  purchaser2PrintName: z.string(),
  purchaser2Date: z.string(),
  additionalPurchasers: z.string(),

  brokerageNameAck: z.string(),
  brokerageRepName: z.string(),
  brokerageRepTitle: z.string(),
  brokerageRepSignature: z.string(),
  brokerageRepDate: z.string(),
});

export type ThirdPartyDepositFormValues = z.infer<typeof thirdPartyDepositSchema>;
