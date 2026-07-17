import dynamic from "next/dynamic";
import type { ComponentType, ReactNode } from "react";

interface FormEntry {
  slug: string;
  tabKey: string;
  title: string;
  load: () => Promise<{ default: ComponentType }>;
}

export const formRegistry: FormEntry[] = [
  {
    slug: "transaction-file-documentation",
    tabKey: "Transaction_File_Documentation_Form",
    title: "Transaction File Documentation",
    load: () =>
      import("@/features/real-estate/components/TransactionFileDocumentationForm").then(
        (m) => ({ default: m.TransactionFileDocumentationForm }),
      ),
  },
  {
    slug: "third-party-deposit-acknowledgement",
    tabKey: "Third_Party_Deposit_Acknowledgement_Form",
    title: "Third Party Deposit Acknowledgement",
    load: () =>
      import("@/features/real-estate/components/ThirdPartyDepositAcknowledgementForm").then(
        (m) => ({ default: m.ThirdPartyDepositAcknowledgementForm }),
      ),
  },
  {
    slug: "sales-record-sheet",
    tabKey: "Sales_Record_Sheet_Template",
    title: "Sales Record Sheet",
    load: () =>
      import("@/features/real-estate/components/SalesRecordSheetForm").then(
        (m) => ({ default: m.SalesRecordSheetForm }),
      ),
  },
  {
    slug: "reconciling-items-log",
    tabKey: "Reconciling_Items_Log",
    title: "Reconciling Items Log",
    load: () =>
      import("@/features/real-estate/components/ReconcilingItemsLogForm").then(
        (m) => ({ default: m.ReconcilingItemsLogForm }),
      ),
  },
  {
    slug: "monthly-trust-reconciliation-checklist",
    tabKey: "Monthly_Trust_Reconciliation_Checklist_Form",
    title: "Monthly Trust Reconciliation Checklist",
    load: () =>
      import("@/features/real-estate/components/MonthlyTrustReconciliationChecklistForm").then(
        (m) => ({ default: m.MonthlyTrustReconciliationChecklistForm }),
      ),
  },
  {
    slug: "monthly-trust-account-checklist",
    tabKey: "Monthly_Trust_Account_Checklist_MonthEndCutOff",
    title: "Monthly Trust Account Checklist",
    load: () =>
      import("@/features/real-estate/components/MonthlyTrustAccountChecklistForm").then(
        (m) => ({ default: m.MonthlyTrustAccountChecklistForm }),
      ),
  },
  {
    slug: "monthend-activity",
    tabKey: "Monthend_activity",
    title: "Monthend Activity",
    load: () =>
      import("@/features/real-estate/components/MonthendActivityForm").then(
        (m) => ({ default: m.MonthendActivityForm }),
      ),
  },
  {
    slug: "compliance-action-register",
    tabKey: "Compliance_Action_Register",
    title: "Compliance Action Register",
    load: () =>
      import("@/features/real-estate/components/ComplianceActionRegisterForm").then(
        (m) => ({ default: m.ComplianceActionRegisterForm }),
      ),
  },
  {
    slug: "commission-amendment",
    tabKey: "Commission_Amendment_Form",
    title: "Commission Amendment",
    load: () =>
      import("@/features/real-estate/components/CommissionAmendmentForm").then(
        (m) => ({ default: m.CommissionAmendmentForm }),
      ),
  },
];

export function buildSlugMap(loading: () => ReactNode) {
  const map: Record<string, ComponentType> = {};
  for (const entry of formRegistry) {
    map[entry.slug] = dynamic(entry.load, { loading });
  }
  return map;
}

export function buildTabKeyMap(loading: () => ReactNode) {
  const map: Record<string, ComponentType> = {};
  for (const entry of formRegistry) {
    map[entry.tabKey] = dynamic(entry.load, { loading });
  }
  return map;
}
