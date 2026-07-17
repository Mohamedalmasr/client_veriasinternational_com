"use client";

import { Suspense } from "react";
import { FormSkeleton } from "@/components/ui/form-skeleton";
import { buildTabKeyMap } from "@/features/real-estate/constants/form-registry";

const formComponents = buildTabKeyMap(() => <FormSkeleton />);

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
