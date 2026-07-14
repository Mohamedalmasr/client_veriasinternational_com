"use client";

import { useState, useMemo } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import {
  FormErrorsDisplay,
  FormErrorsSummary,
  type FormError,
} from "@/components/forms/FormErrorsDisplay";
import {
  commissionAmendmentSchema,
  type CommissionAmendmentFormValues,
} from "@/types/commission-amendment";

const defaultValues: CommissionAmendmentFormValues = {
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

const ROW = "flex items-center gap-2";
const INPUT =
  "flex-1 min-w-0 h-8 text-[0.88rem] rounded border border-[#d1d5db] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] placeholder:text-gray-400 leading-[1.4]";
const TEXTAREA =
  "w-full min-h-[100px] resize-y rounded border border-[#d1d5db] text-[0.88rem] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] placeholder:text-gray-400 leading-[1.4] p-1";

function SignatureBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3 p-3 rounded border border-dashed border-[#9ca3af] bg-[#f5f5ff]">
      <h3 className="m-0 mb-2 text-[0.95rem] uppercase tracking-[0.07em]">{title}</h3>
      {children}
    </div>
  );
}

export default function CommissionAmendmentFormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CommissionAmendmentFormValues>({
    resolver: zodResolver(commissionAmendmentSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    watch,
    register,
    setValue,
    formState: { errors },
    setFocus,
  } = form;

  const formErrors = useMemo(() => {
    const errorList: FormError[] = [];
    Object.entries(errors).forEach(([key, error]) => {
      if (error && typeof error === "object" && "message" in error) {
        errorList.push({
          field: key.charAt(0).toUpperCase() + key.slice(1),
          message: String(error.message),
          severity: "error",
        });
      }
    });
    return errorList;
  }, [errors]);

  const onSubmit = async (data: CommissionAmendmentFormValues) => {
    if (formErrors.length > 0) {
      toast.error(`Please fix ${formErrors.length} error(s) before submitting`);
      return;
    }
    setIsSubmitting(true);
    try {
      console.log("Form submitted:", data);
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Commission Amendment saved successfully!");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("caf_draft", JSON.stringify(form.getValues()));
    toast.success("Draft saved locally");
  };

  const handleCancel = () => {
    window.parent.postMessage(
      { type: "tfd-close-tab", key: "Commission_Amendment_Form" },
      "*",
    );
  };

  return (
    <div className="max-w-[900px] mx-auto bg-white rounded-[10px] shadow-[0_2px_6px_rgba(15,23,42,0.08)] border border-[#d1d5db] p-7 pt-8 pb-8">
      {formErrors.length > 0 && <FormErrorsSummary errors={formErrors} />}

      <header className="border-b-2 border-[#9ca3af] pb-3 mb-3">
        <h1 className="m-0 mb-1 text-[1.25rem] uppercase tracking-[0.08em] text-gray-900">
          Commission Amendment / Listing Agreement Amendment
        </h1>
        <p className="m-0 text-[0.9rem] text-gray-600">
          This form is to be used to document any change to the commission terms set out in the original Listing Agreement.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Section 1: Transaction Details */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-2 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">1</span>
            Transaction Details
          </h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-2">
            <div className={ROW}>
              <label htmlFor="mlsFileNumber" className="w-[160px] text-[0.8rem] font-semibold flex-none">MLS / File Number</label>
              <Input id="mlsFileNumber" {...register("mlsFileNumber")} className={INPUT} />
            </div>
            <div className={ROW}>
              <label htmlFor="sellerNames" className="w-[160px] text-[0.8rem] font-semibold flex-none">Seller(s) Name(s)</label>
              <Input id="sellerNames" {...register("sellerNames")} className={INPUT} />
            </div>
            <div className={ROW}>
              <label htmlFor="brokerageName" className="w-[160px] text-[0.8rem] font-semibold flex-none">Brokerage Name</label>
              <Input id="brokerageName" {...register("brokerageName")} className={INPUT} />
            </div>
          </div>
          <div className="mt-2">
            <label htmlFor="propertyAddress" className="block text-[0.8rem] font-semibold mb-1">Property Address</label>
            <textarea
              id="propertyAddress"
              {...register("propertyAddress")}
              placeholder="Full address is brought from DB"
              className={TEXTAREA}
            />
          </div>
        </section>

        {/* Section 2: Previous Commission Terms */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-1 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">2</span>
            Previous Commission Terms
          </h2>
          <p className="m-0 mb-2 text-[0.85rem] text-gray-500 italic">
            As per the original Listing Agreement, the commission terms were as follows:
          </p>
          <textarea
            {...register("previousCommissionTerms")}
            placeholder="Describe previous commission structure (e.g., X% of sale price; minimum commission; split arrangements, etc.)."
            className={TEXTAREA}
          />
        </section>

        {/* Section 3: New Commission Terms */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-1 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">3</span>
            New Commission Terms
          </h2>
          <p className="m-0 mb-2 text-[0.85rem] text-gray-500 italic">
            The parties agree to amend the Listing Agreement commission terms as follows:
          </p>
          <textarea
            {...register("newCommissionTerms")}
            placeholder="Describe new commission structure and any special conditions or limitations."
            className={TEXTAREA}
          />
        </section>

        {/* Section 4: Effective Date and Transaction Affected */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-2 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">4</span>
            Effective Date and Transaction Affected
          </h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-2">
            <div className={ROW}>
              <label htmlFor="effectiveDate" className="w-[180px] text-[0.8rem] font-semibold flex-none">Effective Date of Amendment</label>
              <DatePicker value={watch("effectiveDate")} onChange={(v) => setValue("effectiveDate", v)} />
            </div>
            <div className={ROW}>
              <label htmlFor="apsDate" className="w-[180px] text-[0.8rem] font-semibold flex-none">APS Date (if applicable)</label>
              <DatePicker value={watch("apsDate")} onChange={(v) => setValue("apsDate", v)} />
            </div>
            <div className={`${ROW} col-span-2`}>
              <label htmlFor="transactionsAffected" className="w-[180px] text-[0.8rem] font-semibold flex-none">Transaction(s) Affected</label>
              <Input id="transactionsAffected" {...register("transactionsAffected")} className={INPUT} />
            </div>
          </div>
        </section>

        {/* Section 5: Acknowledgement and Signatures */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-1 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">5</span>
            Acknowledgement and Signatures
          </h2>
          <p className="m-0 mb-2 text-[0.85rem] text-gray-500 italic">
            By signing below, the undersigned confirm that they agree to the changes described in this Commission Amendment / Listing Agreement Amendment form. All other terms of the original Listing Agreement remain unchanged.
          </p>

          {/* Seller(s) */}
          <SignatureBlock title="Seller(s)">
            <div className="grid grid-cols-3 gap-x-5 gap-y-2">
              <div className={ROW}>
                <label htmlFor="seller1Name" className="w-[80px] text-[0.8rem] font-semibold flex-none">Name</label>
                <Input id="seller1Name" {...register("seller1Name")} className={INPUT} />
              </div>
              <div className={ROW}>
                <label htmlFor="seller1Signature" className="w-[80px] text-[0.8rem] font-semibold flex-none">Signature</label>
                <Input id="seller1Signature" {...register("seller1Signature")} className={INPUT} />
              </div>
              <div className={ROW}>
                <label htmlFor="seller1Date" className="w-[50px] text-[0.8rem] font-semibold flex-none">Date</label>
                <DatePicker value={watch("seller1Date")} onChange={(v) => setValue("seller1Date", v)} />
              </div>
              <div className={ROW}>
                <label htmlFor="seller2Name" className="w-[80px] text-[0.8rem] font-semibold flex-none">Seller 2</label>
                <Input id="seller2Name" {...register("seller2Name")} placeholder="if applicable" className={INPUT} />
              </div>
              <div className={ROW}>
                <label htmlFor="seller2Signature" className="w-[80px] text-[0.8rem] font-semibold flex-none">Signature</label>
                <Input id="seller2Signature" {...register("seller2Signature")} className={INPUT} />
              </div>
              <div className={ROW}>
                <label htmlFor="seller2Date" className="w-[50px] text-[0.8rem] font-semibold flex-none">Date</label>
                <DatePicker value={watch("seller2Date")} onChange={(v) => setValue("seller2Date", v)} />
              </div>
            </div>
          </SignatureBlock>

          {/* Brokerage */}
          <SignatureBlock title="Brokerage">
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
              <div className={`${ROW} col-span-2`}>
                <label htmlFor="brokerageRepName" className="w-[260px] text-[0.8rem] font-semibold flex-none whitespace-nowrap">Authorized Brokerage Representative Name</label>
                <Input id="brokerageRepName" {...register("brokerageRepName")} className={INPUT} />
              </div>
              <div className={`${ROW} col-span-2`}>
                <label htmlFor="brokerageRepSignature" className="w-[260px] text-[0.8rem] font-semibold flex-none whitespace-nowrap">Authorized Brokerage Representative Signature</label>
                <Input id="brokerageRepSignature" {...register("brokerageRepSignature")} className={INPUT} />
              </div>
              <div className={ROW}>
                <label htmlFor="brokerageRepTitle" className="w-[120px] text-[0.8rem] font-semibold flex-none">Title / Position</label>
                <Input id="brokerageRepTitle" {...register("brokerageRepTitle")} className={INPUT} />
              </div>
              <div className={ROW}>
                <label htmlFor="brokerageRepDate" className="w-[50px] text-[0.8rem] font-semibold flex-none">Date</label>
                <DatePicker value={watch("brokerageRepDate")} onChange={(v) => setValue("brokerageRepDate", v)} />
              </div>
            </div>
          </SignatureBlock>
        </section>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting} className="hover:bg-red-50">
            Cancel
          </Button>
          <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isSubmitting} className="hover:bg-amber-50">
            Save Draft
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isSubmitting ? "Submitting..." : "Submit Form"}
          </Button>
        </div>
      </form>

      {formErrors.length > 0 && (
        <FormErrorsDisplay
          errors={formErrors}
          onClose={() => {}}
          onFieldClick={(fieldName) => {
            setFocus(fieldName as Path<CommissionAmendmentFormValues>);
          }}
        />
      )}
    </div>
  );
}
