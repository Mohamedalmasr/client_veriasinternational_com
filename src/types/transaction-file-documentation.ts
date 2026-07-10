import * as z from 'zod';

export const depositSchema = z.object({
  number: z.string(),
  amount: z.string(),
  dateReceived: z.string(),
  method: z.string(),
  dateDeposited: z.string(),
  trustAccount: z.string(),
});

export type Deposit = z.infer<typeof depositSchema>;

export const disbursementSchema = z.object({
  description: z.string(),
  amount: z.string(),
  date: z.string(),
});

export type Disbursement = z.infer<typeof disbursementSchema>;

export const conditionSchema = z.object({
  condition: z.string(),
  status: z.string(),
  date: z.string(),
  docInFile: z.string(),
});

export type Condition = z.infer<typeof conditionSchema>;

export const tfdDocumentSchema = z.object({
  document: z.string(),
  inFile: z.string(),
  comments: z.string(),
});

export type TfdDocument = z.infer<typeof tfdDocumentSchema>;

export const formSchema = z.object({
  brokerageName: z.string().min(1, 'Brokerage name is required'),
  branch: z.string(),
  preparedBy: z.string(),
  datePrepared: z.string(),
  reviewedBy: z.string(),
  dateReviewed: z.string(),

  transactionFileNo: z.string(),
  sequentialSalesNo: z.string(),
  mlsNo: z.string(),
  internalRefNo: z.string(),
  transactionType: z.string(),
  otherTransactionType: z.string(),
  status: z.string(),

  civicAddress: z.string(),
  municipality: z.string(),
  province: z.string(),
  postalCode: z.string(),

  vendorNames: z.string(),
  vendorContact: z.string(),
  purchaserNames: z.string(),
  purchaserContact: z.string(),

  mlsListingStartDate: z.string(),
  expiryDate: z.string(),
  dateOfferReceived: z.string(),
  dateOfferAccepted: z.string(),
  scheduledClosingDate: z.string(),
  revisedClosingDate1: z.string(),
  revisedClosingDate2: z.string(),
  actualClosingDate: z.string(),

  deposits: z.array(depositSchema),
  totalDeposits: z.string(),
  trustLedgerRef: z.string(),

  didTransactionClose: z.string(),
  disbursements: z.array(disbursementSchema),
  trustBalance: z.string(),
  reasonIfNotClosed: z.string(),

  conditions: z.array(conditionSchema),

  documents: z.array(tfdDocumentSchema),
  missingDocuments: z.string(),

  depositsDepositedWithoutDelay: z.string(),
  depositsDetails: z.string(),
  trustFundsDisbursed: z.string(),
  trustFundsDetails: z.string(),
  trustLedgerAgrees: z.string(),
  trustLedgerDetails: z.string(),

  preparedByName: z.string(),
  preparedSignature: z.string(),
  preparedDate: z.string(),
  reviewedByName: z.string(),
  reviewedSignature: z.string(),
  reviewedDate: z.string(),
});

export type TransactionFileDocumentationFormValues = z.infer<typeof formSchema>;
