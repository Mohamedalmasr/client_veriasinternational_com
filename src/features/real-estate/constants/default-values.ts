import type { TransactionFileDocumentationFormValues } from "@/types/transaction-file-documentation";
import type { ThirdPartyDepositFormValues } from "@/types/third-party-deposit";
import type { MonthendActivityFormValues } from "@/types/monthend-activity";
import type { SalesRecordSheetFormValues } from "@/types/sales-record-sheet";
import type { ReconcilingItemsLogFormValues } from "@/types/reconciling-items-log";
import type { MonthlyTrustReconciliationChecklistFormValues } from "@/types/monthly-trust-reconciliation-checklist";
import type { MonthlyTrustAccountChecklistFormValues } from "@/types/monthly-trust-account-checklist";
import type { ComplianceActionRegisterFormValues } from "@/types/compliance-action-register";
import type { CommissionAmendmentFormValues } from "@/types/commission-amendment";

export const transactionFileDocumentationDefaultValues: TransactionFileDocumentationFormValues = {
  brokerageName: "",
  branch: "",
  preparedBy: "",
  datePrepared: new Date().toISOString().split("T")[0],
  reviewedBy: "",
  dateReviewed: "",
  transactionFileNo: "",
  sequentialSalesNo: "",
  mlsNo: "",
  internalRefNo: "",
  transactionType: "",
  otherTransactionType: "",
  status: "",
  civicAddress: "",
  municipality: "",
  province: "",
  postalCode: "",
  vendorNames: "",
  vendorContact: "",
  purchaserNames: "",
  purchaserContact: "",
  mlsListingStartDate: "",
  expiryDate: "",
  dateOfferReceived: "",
  dateOfferAccepted: "",
  scheduledClosingDate: "",
  revisedClosingDate1: "",
  revisedClosingDate2: "",
  actualClosingDate: "",
  deposits: [
    {
      number: "Deposit 1",
      amount: "",
      dateReceived: "",
      method: "",
      dateDeposited: "",
      trustAccount: "",
    },
    {
      number: "Deposit 2",
      amount: "",
      dateReceived: "",
      method: "",
      dateDeposited: "",
      trustAccount: "",
    },
  ],
  totalDeposits: "",
  trustLedgerRef: "",
  didTransactionClose: "",
  disbursements: [
    { description: "Disbursement to Vendor's Lawyer", amount: "", date: "" },
    {
      description: "Disbursement to Brokerage (Commission/Fees)",
      amount: "",
      date: "",
    },
    { description: "Refund to Purchaser (if any)", amount: "", date: "" },
    { description: "Other Disbursements (specify)", amount: "", date: "" },
  ],
  trustBalance: "",
  reasonIfNotClosed: "",
  conditions: [
    { condition: "Financing", status: "", date: "", docInFile: "" },
    { condition: "Inspection", status: "", date: "", docInFile: "" },
    {
      condition: "Sale of Purchaser's Property",
      status: "",
      date: "",
      docInFile: "",
    },
    { condition: "Other 1", status: "", date: "", docInFile: "" },
    { condition: "Other 2", status: "", date: "", docInFile: "" },
  ],
  documents: [
    { document: "Listing Agreement", inFile: "", comments: "" },
    { document: "MLS® Listing Sheet", inFile: "", comments: "" },
    {
      document: "Agreement of Purchase and Sale (APS)",
      inFile: "",
      comments: "",
    },
    { document: "Waivers / Notices of Fulfillment", inFile: "", comments: "" },
    { document: "Amendments to APS or Listing", inFile: "", comments: "" },
    { document: "Trust Deposit Receipts", inFile: "", comments: "" },
    {
      document: "Deposit Direction / Mutual Release (if applicable)",
      inFile: "",
      comments: "",
    },
    {
      document: "Commission Statement / Trade Record Sheet",
      inFile: "",
      comments: "",
    },
    {
      document: "Brokerage Disbursement Instructions / Statements",
      inFile: "",
      comments: "",
    },
    { document: "Inspection Report", inFile: "", comments: "" },
    { document: "Appraisal", inFile: "", comments: "" },
    {
      document: "Direction re: Commission / Referral Agreements",
      inFile: "",
      comments: "",
    },
    {
      document: "Relevant Email / Written Correspondence",
      inFile: "",
      comments: "",
    },
  ],
  missingDocuments: "",
  depositsDepositedWithoutDelay: "",
  depositsDetails: "",
  trustFundsDisbursed: "",
  trustFundsDetails: "",
  trustLedgerAgrees: "",
  trustLedgerDetails: "",
  preparedByName: "",
  preparedSignature: "",
  preparedDate: "",
  reviewedByName: "",
  reviewedSignature: "",
  reviewedDate: "",
};

export const thirdPartyDepositDefaultValues: ThirdPartyDepositFormValues = {
  brokerageName: "",

  transactionFileNo: "",
  propertyAddress1: "",
  propertyAddress2: "",
  apsDate: "",
  purchaser1: "",
  purchaser2: "",
  vendor1: "",
  vendor2: "",

  thirdPartyName: "",
  relationshipToPurchaser: "",
  thirdPartyAddress1: "",
  thirdPartyAddress2: "",
  thirdPartyPhone: "",
  thirdPartyEmail: "",

  depositAmount: "",
  depositFormCash: false,
  depositFormCheque: false,
  depositFormBankDraft: false,
  depositFormInterac: false,
  depositFormOther: false,
  depositFormOtherText: "",
  depositReceivedDate: "",

  closesDirection: false,
  closesOther: "",

  depositReturnTo: "",
  depositReturnOther: "",

  releasedToSeller: false,
  additionalTerms: "",

  thirdPartySignature: "",
  thirdPartyPrintName: "",
  thirdPartyDate: "",

  purchaser1Signature: "",
  purchaser1PrintName: "",
  purchaser1Date: "",
  purchaser2Signature: "",
  purchaser2PrintName: "",
  purchaser2Date: "",
  additionalPurchasers: "",

  brokerageNameAck: "",
  brokerageRepName: "",
  brokerageRepTitle: "",
  brokerageRepSignature: "",
  brokerageRepDate: "",
};

export const monthendActivityDefaultValues: MonthendActivityFormValues = {
  trustAccount: "",
  monthEndDate: "",
  preparerName: "",
  datePrepared: "",
  lmName: "",
  dateReviewed: "",
  monthType: "normal",

  s1: {
    s1_1: { status: "", comments: "", init: false },
    s1_2: { status: "", comments: "", init: false },
    s1_3: { status: "", comments: "", init: false },
  },

  s2: {
    s2_1: { status: "", comments: "", init: false },
    s2_2: { status: "", comments: "", init: false },
    s2_3: { status: "", comments: "", init: false },
    s2_4: { status: "", comments: "", init: false },
  },

  unusualBalances: [
    {
      fileClientId: "",
      clientName: "",
      amount: "",
      natureOfIssue: "",
      actionPlan: "",
      targetResolutionDate: "",
      init: false,
    },
  ],

  s3: {
    bankClosingBalance: "",
    outstandingDeposits: "",
    outstandingCheques: "",
    otherAdjustments: "",
    reconciledBalance: "",
    controls: {
      s3_1: { status: "", comments: "", init: false },
      s3_2: { status: "", comments: "", init: false },
      s3_3: { status: "", comments: "", init: false },
      s3_4: { status: "", comments: "", init: false },
    },
  },

  s4: {
    reconciledBankBalance: "",
    totalTrustLiability: "",
    difference: "",
    controls: {
      s4_1: { status: "", comments: "", init: false },
      s4_2: { status: "", comments: "", init: false },
    },
    differenceExplanation: "",
  },

  s5: {
    s5_1: { status: "", comments: "", init: false },
    s5_2: { status: "", comments: "", init: false },
    s5_3: { status: "", comments: "", init: false },
    s5_4: { status: "", comments: "", init: false },
    s5_5: { status: "", comments: "", init: false },
    s5_6: { status: "", comments: "", init: false },
  },

  preparerCert: { name: "", signature: "", date: "" },

  s6: {
    s6_1: { status: "", comments: "", init: false },
    s6_2: { status: "", comments: "", init: false },
    s6_3: { status: "", comments: "", init: false },
    lmComments: "",
  },

  lmReview: { name: "", signature: "", date: "" },

  s7: {
    s7_1: { status: "", comments: "", init: false },
    s7_2: { status: "", comments: "", init: false },
    s7_3: { status: "", comments: "", init: false },
  },

  s7PreparerCert: { name: "", signature: "", date: "" },
  s7LmReview: { name: "", signature: "", date: "" },
};

export const salesRecordSheetDefaultValues: SalesRecordSheetFormValues = {
  dealStatus: "Firm",
  salesFileNo: "",
  mlsNo: "",

  vendorEntries: [{ entityType: "individual", identifierType: "name", name: "" }],
  vendorTel: "",
  vendorEmail: "",
  purchaserEntries: [{ entityType: "individual", identifierType: "name", name: "" }],
  purchaserTel: "",
  purchaserEmail: "",

  unitNumber: "",
  streetNumber: "",
  streetName: "",
  city: "",
  province: "",
  postalCode: "",

  listingSide: "L",
  purchasePrice: "",

  commissionType: "rate",
  commissionRate: "",
  commissionAmount: "",

  listingAgreementDate: "",
  apsDate: "",
  scheduledClosingDate: "",
  revisedClosingNotes: "",

  deposits: [
    { depositNo: "Deposit 1", amount: "", dateReceived: "", method: "Cash", dateToTrust: "", bankRef: "", trustReceipt: "", ledgerRef: "" },
  ],

  conditions: "",
  conditionsMetDate: "",
  trustDisbursementDate: "",
  disbursedTo: "",
  fileClosedDate: "",

  preparedBy: "",
  preparedDate: "",
  managerReviewBy: "",
  reviewDate: "",
  managerNotes: "",
};

export const reconcilingItemsLogDefaultValues: ReconcilingItemsLogFormValues = {
  trustAccountName: "",
  monthPeriod: "",
  trustAccountNumber: "",

  items: [
    {
      itemNumber: "",
      dateIdentified: "",
      description: "",
      amount: "",
      type: "",
      expectedResolutionDate: "",
      actionNotes: "",
      actualResolutionDate: "",
      resolvedBy: "",
    },
  ],
};

export const monthlyTrustReconciliationChecklistDefaultValues: MonthlyTrustReconciliationChecklistFormValues = {
  month: "",
  date: "",
  preparedBy: "",
  licensedManager: "",

  b: {
    b1: { status: "Y", comments: "" },
    b2: { status: "Y", comments: "" },
    b3: { status: "Y", comments: "" },
  },
  c: {
    c1: { status: "Y", comments: "" },
    c2: { status: "Y", comments: "" },
    c3: { status: "Y", comments: "" },
    c4: { status: "Y", comments: "" },
  },
  d: {
    d1: { status: "Y", comments: "" },
    d2: { status: "Y", comments: "" },
    d3: { status: "Y", comments: "" },
    d4: { status: "Y", comments: "" },
  },
  e: {
    e1: { status: "Y", comments: "" },
    e2: { status: "Y", comments: "" },
    differenceDetails: "",
  },
  f: {
    f1: { status: "Y", comments: "" },
    f2: { status: "Y", comments: "" },
    f3: { status: "Y", comments: "" },
    notes: "",
  },
  g: {
    g1: { status: "Y", comments: "" },
    g2: { status: "Y", comments: "" },
    g3: { status: "Y", comments: "" },
  },

  preparer: { name: "", signature: "", date: "" },
  licensedManagerReview: { name: "", signature: "", date: "" },
  filing: { location: "", dateFiled: "", annualReview: "" },
};

export const monthlyTrustAccountChecklistDefaultValues: MonthlyTrustAccountChecklistFormValues = {
  monthYear: "",
  preparedBy: "",
  preparedDate: "",
  reviewedBy: "",
  reviewedDate: "",

  s1_1: {
    items: { s1_1_1: false, s1_1_2: false, s1_1_3: false, s1_1_4: false, s1_1_5: false, s1_1_6: false },
    initials: { preparerInitials: "", preparerDate: "", managerInitials: "", managerDate: "" },
  },
  s1_2: {
    items: { s1_2_1: false, s1_2_2: false, s1_2_2_a: false, s1_2_2_b: false, s1_2_2_c: false, s1_2_2_d: false, s1_2_3: false },
    initials: { preparerInitials: "", preparerDate: "", managerInitials: "", managerDate: "" },
  },
  s1_3: {
    items: { s1_3_1: false, s1_3_2: false, s1_3_3: false, s1_3_4: false },
    initials: { preparerInitials: "", preparerDate: "", managerInitials: "", managerDate: "" },
  },
};

export const complianceActionRegisterDefaultValues: ComplianceActionRegisterFormValues = {
  items: [
    {
      itemNumber: "",
      recommendationId: "",
      deficiencySummary: "",
      inspectorRecommendation: "",
      actionSteps: "",
      responsiblePerson: "",
      targetCompletionDate: "",
      status: "",
      actualCompletionDate: "",
      policyReference: "",
      notes: "",
    },
  ],
};

export const commissionAmendmentDefaultValues: CommissionAmendmentFormValues = {
  mlsFileNumber: "",
  sellerNames: "",
  brokerageName: "",
  propertyAddress: "",
  previousCommissionTerms: "",
  newCommissionTerms: "",
  effectiveDate: "",
  apsDate: "",
  transactionsAffected: "",
  seller1Name: "",
  seller1Signature: "",
  seller1Date: "",
  seller2Name: "",
  seller2Signature: "",
  seller2Date: "",
  brokerageRepName: "",
  brokerageRepSignature: "",
  brokerageRepTitle: "",
  brokerageRepDate: "",
};
