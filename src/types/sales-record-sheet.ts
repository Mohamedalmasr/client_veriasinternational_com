import * as z from 'zod';

const vendorEntrySchema = z.object({
  entityType: z.string(),
  identifierType: z.string(),
  name: z.string(),
});

const purchaserEntrySchema = z.object({
  entityType: z.string(),
  identifierType: z.string(),
  name: z.string(),
});

const depositRowSchema = z.object({
  depositNo: z.string(),
  amount: z.string(),
  dateReceived: z.string(),
  method: z.string(),
  dateToTrust: z.string(),
  bankRef: z.string(),
  trustReceipt: z.string(),
  ledgerRef: z.string(),
});

export const salesRecordSheetSchema = z.object({
  dealStatus: z.string(),
  salesFileNo: z.string(),
  mlsNo: z.string(),

  vendorEntries: z.array(vendorEntrySchema),
  vendorTel: z.string(),
  vendorEmail: z.string(),
  purchaserEntries: z.array(purchaserEntrySchema),
  purchaserTel: z.string(),
  purchaserEmail: z.string(),

  unitNumber: z.string(),
  streetNumber: z.string(),
  streetName: z.string(),
  city: z.string(),
  province: z.string(),
  postalCode: z.string(),

  listingSide: z.string(),
  purchasePrice: z.string(),

  commissionType: z.string(),
  commissionRate: z.string(),
  commissionAmount: z.string(),

  listingAgreementDate: z.string(),
  apsDate: z.string(),
  scheduledClosingDate: z.string(),
  revisedClosingNotes: z.string(),

  deposits: z.array(depositRowSchema),

  conditions: z.string(),
  conditionsMetDate: z.string(),
  trustDisbursementDate: z.string(),
  disbursedTo: z.string(),
  fileClosedDate: z.string(),

  preparedBy: z.string(),
  preparedDate: z.string(),
  managerReviewBy: z.string(),
  reviewDate: z.string(),
  managerNotes: z.string(),
});

export type SalesRecordSheetFormValues = z.infer<typeof salesRecordSheetSchema>;
