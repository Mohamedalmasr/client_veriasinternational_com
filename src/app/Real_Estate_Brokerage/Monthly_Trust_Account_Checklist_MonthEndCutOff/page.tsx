"use client";

import { useState, useMemo } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { FormField } from "@/components/forms/FormField";
import {
  FormErrorsDisplay,
  FormErrorsSummary,
  type FormError,
} from "@/components/forms/FormErrorsDisplay";
import {
  monthlyTrustAccountChecklistSchema,
  type MonthlyTrustAccountChecklistFormValues,
} from "@/types/monthly-trust-account-checklist";

const defaultValues: MonthlyTrustAccountChecklistFormValues = {
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

const ROW = "flex items-center gap-2";

function InitialsBlock({ prefix, register, watch, setValue }: {
  prefix: string;
  register: ReturnType<typeof useForm<MonthlyTrustAccountChecklistFormValues>>["register"];
  watch: ReturnType<typeof useForm<MonthlyTrustAccountChecklistFormValues>>["watch"];
  setValue: ReturnType<typeof useForm<MonthlyTrustAccountChecklistFormValues>>["setValue"];
}) {
  return (
    <div className="mt-2 pt-2 border-t border-dashed border-[#d1d5db] flex flex-col gap-1">
      <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-3 gap-y-1 items-center">
        <label className="w-[140px] text-[0.8rem] font-semibold flex-none">Preparer initials</label>
        <input
          type="text"
          {...register(`${prefix}.initials.preparerInitials` as Path<MonthlyTrustAccountChecklistFormValues>)}
          className="w-[80px] min-w-0 rounded border border-[#d1d5db] text-[0.85rem] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] px-2 py-1"
        />
        <label className="w-[40px] text-[0.8rem] font-semibold flex-none">Date</label>
        <DatePicker
          value={String(watch(`${prefix}.initials.preparerDate` as Path<MonthlyTrustAccountChecklistFormValues>))}
          onChange={(v) => setValue(`${prefix}.initials.preparerDate` as Path<MonthlyTrustAccountChecklistFormValues>, v)}
        />
      </div>
      <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-3 gap-y-1 items-center">
        <label className="w-[140px] text-[0.8rem] font-semibold flex-none">Manager review initials</label>
        <input
          type="text"
          {...register(`${prefix}.initials.managerInitials` as Path<MonthlyTrustAccountChecklistFormValues>)}
          className="w-[80px] min-w-0 rounded border border-[#d1d5db] text-[0.85rem] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] px-2 py-1"
        />
        <label className="w-[40px] text-[0.8rem] font-semibold flex-none">Date</label>
        <DatePicker
          value={String(watch(`${prefix}.initials.managerDate` as Path<MonthlyTrustAccountChecklistFormValues>))}
          onChange={(v) => setValue(`${prefix}.initials.managerDate` as Path<MonthlyTrustAccountChecklistFormValues>, v)}
        />
      </div>
    </div>
  );
}

function ChecklistItem({ label, checked, onCheckedChange }: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-2 mb-1 text-[0.9rem] cursor-pointer">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} className="mt-0.5" />
      <span className="flex-1">{label}</span>
    </label>
  );
}

export default function MonthlyTrustAccountChecklistMonthEndCutOffPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MonthlyTrustAccountChecklistFormValues>({
    resolver: zodResolver(monthlyTrustAccountChecklistSchema),
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

  const onSubmit = async (data: MonthlyTrustAccountChecklistFormValues) => {
    if (formErrors.length > 0) {
      toast.error(`Please fix ${formErrors.length} error(s) before submitting`);
      return;
    }
    setIsSubmitting(true);
    try {
      console.log("Form submitted:", data);
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Monthly Trust Account Checklist saved successfully!");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("mtc_draft", JSON.stringify(form.getValues()));
    toast.success("Draft saved locally");
  };

  const handleCancel = () => {
    window.parent.postMessage(
      { type: "tfd-close-tab", key: "Monthly_Trust_Account_Checklist_MonthEndCutOff" },
      "*",
    );
  };

  return (
    <div className="max-w-[900px] mx-auto bg-white rounded-[10px] shadow-[0_2px_6px_rgba(15,23,42,0.08)] border border-[#d1d5db] p-7 pt-8 pb-8">
      {formErrors.length > 0 && <FormErrorsSummary errors={formErrors} />}

      <header className="border-b-2 border-[#9ca3af] pb-3 mb-3">
        <h1 className="m-0 mb-1 text-[1.15rem] uppercase tracking-[0.08em] text-gray-900">
          Monthly Trust Account Checklist – Section 1: Month-End Cut-Off
        </h1>
        <p className="m-0 text-[0.9rem] text-gray-600">
          Use this checklist each month to document completion and review of month-end cut-off procedures for the trust account.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header fields */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <div className="flex flex-col gap-2">
            <div className={ROW}>
              <label className="w-[100px] text-[0.8rem] font-semibold flex-none">Month/Year</label>
              <input
                type="text"
                {...register("monthYear")}
                placeholder="e.g., March 2025"
                className="flex-1 min-w-0 max-w-[200px] rounded border border-[#d1d5db] text-[0.85rem] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] px-2 py-1"
              />
            </div>
            <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-3 gap-y-1 items-center">
              <label className="w-[100px] text-[0.8rem] font-semibold flex-none">Prepared by</label>
              <input
                type="text"
                {...register("preparedBy")}
                className="w-full min-w-0 rounded border border-[#d1d5db] text-[0.85rem] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] px-2 py-1"
              />
              <label className="w-[40px] text-[0.8rem] font-semibold flex-none">Date</label>
              <DatePicker value={watch("preparedDate")} onChange={(v) => setValue("preparedDate", v)} />
            </div>
            <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-3 gap-y-1 items-center">
              <label className="w-[100px] text-[0.8rem] font-semibold flex-none">Reviewed by</label>
              <input
                type="text"
                {...register("reviewedBy")}
                className="w-full min-w-0 rounded border border-[#d1d5db] text-[0.85rem] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] px-2 py-1"
              />
              <label className="w-[40px] text-[0.8rem] font-semibold flex-none">Date</label>
              <DatePicker value={watch("reviewedDate")} onChange={(v) => setValue("reviewedDate", v)} />
            </div>
          </div>
        </section>

        {/* Section 1: Month-End Cut-Off */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-2 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">1</span>
            Month-End Cut-Off
          </h2>

          {/* Subsection 1.1 */}
          <div className="mt-3 pt-2 border-t border-dashed border-[#d1d5db]">
            <h3 className="m-0 mb-2 text-[0.95rem] font-semibold">1.1 Ensure all trust transactions for the month are recorded in the trust ledger</h3>
            <div className="pl-1">
              <ChecklistItem label="1.1.1 Run a report from the trust bank (online banking / statement export) showing all trust account activity for the month." checked={watch("s1_1.items.s1_1_1")} onCheckedChange={(v) => setValue("s1_1.items.s1_1_1", v)} />
              <ChecklistItem label="1.1.2 Compare bank activity to the trust ledger and all sales files for the month." checked={watch("s1_1.items.s1_1_2")} onCheckedChange={(v) => setValue("s1_1.items.s1_1_2", v)} />
              <ChecklistItem label="1.1.3 Confirm all deposits have been recorded to the correct file and trust ledger account." checked={watch("s1_1.items.s1_1_3")} onCheckedChange={(v) => setValue("s1_1.items.s1_1_3", v)} />
              <ChecklistItem label="1.1.4 Confirm all disbursements (including refunds, commissions, payouts, etc.) have been recorded to the correct file and trust ledger account." checked={watch("s1_1.items.s1_1_4")} onCheckedChange={(v) => setValue("s1_1.items.s1_1_4", v)} />
              <ChecklistItem label="1.1.5 Record any outstanding or missing transactions identified and correct the trust ledger before reconciling the bank." checked={watch("s1_1.items.s1_1_5")} onCheckedChange={(v) => setValue("s1_1.items.s1_1_5", v)} />
              <ChecklistItem label="1.1.6 Document any adjusting journal entries made to correct errors (attach a copy to this checklist)." checked={watch("s1_1.items.s1_1_6")} onCheckedChange={(v) => setValue("s1_1.items.s1_1_6", v)} />
            </div>
            <InitialsBlock prefix="s1_1" register={register} watch={watch} setValue={setValue} />
          </div>

          {/* Subsection 1.2 */}
          <div className="mt-3 pt-2 border-t border-dashed border-[#d1d5db]">
            <h3 className="m-0 mb-2 text-[0.95rem] font-semibold">1.2 Verify that all closed deals have been updated for trust movements</h3>
            <div className="pl-1">
              <ChecklistItem label="1.2.1 Obtain a listing of all deals that closed this month from the sales activity listing / deal log." checked={watch("s1_2.items.s1_2_1")} onCheckedChange={(v) => setValue("s1_2.items.s1_2_1", v)} />
              <ChecklistItem label="1.2.2 For each closed deal, confirm that:" checked={watch("s1_2.items.s1_2_2")} onCheckedChange={(v) => setValue("s1_2.items.s1_2_2", v)} />
              <div className="ml-6 mt-1">
                <ChecklistItem label="a) All trust deposits have been transferred or disbursed according to the Agreement of Purchase and Sale or written instructions." checked={watch("s1_2.items.s1_2_2_a")} onCheckedChange={(v) => setValue("s1_2.items.s1_2_2_a", v)} />
                <ChecklistItem label="b) Any overages or remaining balances have been returned or paid out correctly (e.g., to vendor's lawyer, purchaser, etc.)." checked={watch("s1_2.items.s1_2_2_b")} onCheckedChange={(v) => setValue("s1_2.items.s1_2_2_b", v)} />
                <ChecklistItem label="c) No trust funds for closed deals remain incorrectly sitting in the trust account or general account." checked={watch("s1_2.items.s1_2_2_c")} onCheckedChange={(v) => setValue("s1_2.items.s1_2_2_c", v)} />
                <ChecklistItem label="d) The sales file and trust ledger agree on final trust balances (no remaining trust balance on closed deals unless funds are being held back per written terms)." checked={watch("s1_2.items.s1_2_2_d")} onCheckedChange={(v) => setValue("s1_2.items.s1_2_2_d", v)} />
              </div>
              <ChecklistItem label="1.2.3 Prepare a closed-deal trust clearance list showing each file and confirming trust funds have been cleared or held per terms. Attach this list to this checklist." checked={watch("s1_2.items.s1_2_3")} onCheckedChange={(v) => setValue("s1_2.items.s1_2_3", v)} />
            </div>
            <InitialsBlock prefix="s1_2" register={register} watch={watch} setValue={setValue} />
          </div>

          {/* Subsection 1.3 */}
          <div className="mt-3 pt-2 border-t border-dashed border-[#d1d5db]">
            <h3 className="m-0 mb-2 text-[0.95rem] font-semibold">1.3 Obtain the complete month-end bank statement</h3>
            <div className="pl-1">
              <ChecklistItem label="1.3.1 Download or obtain the official month-end bank statement for the trust account directly from the financial institution." checked={watch("s1_3.items.s1_3_1")} onCheckedChange={(v) => setValue("s1_3.items.s1_3_1", v)} />
              <ChecklistItem label="1.3.2 Confirm that the statement covers the period from the first to the last day of the month with no gaps." checked={watch("s1_3.items.s1_3_2")} onCheckedChange={(v) => setValue("s1_3.items.s1_3_2", v)} />
              <ChecklistItem label="1.3.3 Verify the ending balance on the bank statement will be used as the base for the trust bank reconciliation." checked={watch("s1_3.items.s1_3_3")} onCheckedChange={(v) => setValue("s1_3.items.s1_3_3", v)} />
              <ChecklistItem label="1.3.4 Print or save a locked PDF of the bank statement and attach it to the monthly reconciliation package along with this checklist." checked={watch("s1_3.items.s1_3_4")} onCheckedChange={(v) => setValue("s1_3.items.s1_3_4", v)} />
            </div>
            <InitialsBlock prefix="s1_3" register={register} watch={watch} setValue={setValue} />
          </div>
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
            setFocus(fieldName as Path<MonthlyTrustAccountChecklistFormValues>);
          }}
        />
      )}
    </div>
  );
}
