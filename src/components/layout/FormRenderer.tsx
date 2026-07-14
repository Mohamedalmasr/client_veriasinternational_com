"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function FormSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-1/4" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

// Dynamic imports for forms
const TransactionFileDocumentationForm = dynamic(
  () =>
    import("@/app/Real_Estate_Brokerage/Transaction_File_Documentation_Form/page").then(
      (mod) => ({ default: mod.default }),
    ),
  { loading: () => <FormSkeleton /> },
);

const ThirdPartyDepositAcknowledgementForm = dynamic(
  () =>
    import("@/app/Real_Estate_Brokerage/Third_Party_Deposit_Acknowledgement_Form/page").then(
      (mod) => ({ default: mod.default }),
    ),
  { loading: () => <FormSkeleton /> },
);

const SalesRecordSheetForm = dynamic(
  () =>
    import("@/app/Real_Estate_Brokerage/Sales_Record_Sheet_Template/page").then(
      (mod) => ({ default: mod.default }),
    ),
  { loading: () => <FormSkeleton /> },
);

const ReconcilingItemsLogForm = dynamic(
  () =>
    import("@/app/Real_Estate_Brokerage/Reconciling_Items_Log/page").then(
      (mod) => ({ default: mod.default }),
    ),
  { loading: () => <FormSkeleton /> },
);

const MonthlyTrustReconciliationChecklistForm = dynamic(
  () =>
    import("@/app/Real_Estate_Brokerage/Monthly_Trust_Reconciliation_Checklist_Form/page").then(
      (mod) => ({ default: mod.default }),
    ),
  { loading: () => <FormSkeleton /> },
);

const MonthlyTrustAccountChecklistMonthEndCutOffForm = dynamic(
  () =>
    import("@/app/Real_Estate_Brokerage/Monthly_Trust_Account_Checklist_MonthEndCutOff/page").then(
      (mod) => ({ default: mod.default }),
    ),
  { loading: () => <FormSkeleton /> },
);

const MonthendActivityForm = dynamic(
  () =>
    import("@/app/Real_Estate_Brokerage/Monthend_activity/page").then(
      (mod) => ({ default: mod.default }),
    ),
  { loading: () => <FormSkeleton /> },
);

const ComplianceActionRegisterForm = dynamic(
  () =>
    import("@/app/Real_Estate_Brokerage/Compliance_Action_Register/page").then(
      (mod) => ({ default: mod.default }),
    ),
  { loading: () => <FormSkeleton /> },
);

const CommissionAmendmentForm = dynamic(
  () =>
    import("@/app/Real_Estate_Brokerage/Commission_Amendment_Form/page").then(
      (mod) => ({ default: mod.default }),
    ),
  { loading: () => <FormSkeleton /> },
);

const formComponents: Record<string, React.ComponentType> = {
  Transaction_File_Documentation_Form: TransactionFileDocumentationForm,
  Third_Party_Deposit_Acknowledgement_Form: ThirdPartyDepositAcknowledgementForm,
  Sales_Record_Sheet_Template: SalesRecordSheetForm,
  Reconciling_Items_Log: ReconcilingItemsLogForm,
  Monthly_Trust_Reconciliation_Checklist_Form: MonthlyTrustReconciliationChecklistForm,
  Monthly_Trust_Account_Checklist_MonthEndCutOff: MonthlyTrustAccountChecklistMonthEndCutOffForm,
  Monthend_activity: MonthendActivityForm,
  Compliance_Action_Register: ComplianceActionRegisterForm,
  Commission_Amendment_Form: CommissionAmendmentForm,
};

export function FormRenderer({ formKey }: { formKey: string }) {
  const FormComponent = formComponents[formKey];

  if (!FormComponent) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Form not found
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto w-full">
      <div className="max-w-[1200px] mx-auto w-full p-6">
        <Suspense fallback={<FormSkeleton />}>
          <FormComponent />
        </Suspense>
      </div>
    </div>
  );
}
