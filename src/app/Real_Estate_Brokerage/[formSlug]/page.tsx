"use client";

import { notFound, useParams } from "next/navigation";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/ui/form-skeleton";
import { buildSlugMap } from "@/features/real-estate/constants/form-registry";

const formComponents = buildSlugMap(() => <FormSkeleton variant="page" />);

export default function FormSlugPage() {
  const params = useParams();
  const slug = params.formSlug as string;
  const FormComponent = formComponents[slug];

  if (!FormComponent) {
    return notFound();
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-auto w-full">
        <div className="max-w-[1200px] mx-auto w-full p-6">
          <Suspense fallback={<FormSkeleton variant="page" />}>
            <FormComponent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
