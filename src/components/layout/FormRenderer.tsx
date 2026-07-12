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

const formComponents: Record<string, React.ComponentType> = {
  Transaction_File_Documentation_Form: TransactionFileDocumentationForm,
  Third_Party_Deposit_Acknowledgement_Form: ThirdPartyDepositAcknowledgementForm,
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
