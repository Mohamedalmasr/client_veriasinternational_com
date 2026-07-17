"use client";

import { useState } from "react";
import { useForm, type Path, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { MonthPicker } from "@/components/ui/month-picker";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { FormField } from "@/components/forms/FormField";
import { FormTextarea } from "@/components/forms/FormTextarea";
import {
  FormErrorsDisplay,
  FormErrorsSummary,
} from "@/components/forms/FormErrorsDisplay";
import {
  monthlyTrustReconciliationChecklistSchema,
  type MonthlyTrustReconciliationChecklistFormValues,
} from "@/types/monthly-trust-reconciliation-checklist";
import { ROW } from "@/features/real-estate/constants/form-config";
import { monthlyTrustReconciliationChecklistDefaultValues } from "@/features/real-estate/constants/default-values";
import { useFormErrors } from "@/features/real-estate/utils/form-errors";

type CheckpointKey = `b${1|2|3}` | `c${1|2|3|4}` | `d${1|2|3|4}` | `e${1|2}` | `f${1|2|3}` | `g${1|2|3}`;

interface CheckpointRow {
  checkpoint: string;
  key: CheckpointKey;
}

const SECTION_B: CheckpointRow[] = [
  { checkpoint: "All trust transactions for the month recorded.", key: "b1" },
  { checkpoint: "All closed deals updated for trust movements.", key: "b2" },
  { checkpoint: "Complete month-end bank statement obtained.", key: "b3" },
];

const SECTION_C: CheckpointRow[] = [
  { checkpoint: "Trust liability listing prepared as of month-end.", key: "c1" },
  { checkpoint: "File-level / client-level balances clearly shown.", key: "c2" },
  { checkpoint: "Total trust liability calculated.", key: "c3" },
  { checkpoint: "Unusual or long-standing balances identified and flagged for review.", key: "c4" },
];

const SECTION_D: CheckpointRow[] = [
  { checkpoint: "Outstanding deposits listed and support attached.", key: "d1" },
  { checkpoint: "Outstanding cheques / withdrawals listed and support attached.", key: "d2" },
  { checkpoint: "Bank errors or other adjustments documented with explanations.", key: "d3" },
  { checkpoint: "Reconciled bank balance calculated and documented on reconciliation worksheet.", key: "d4" },
];

const SECTION_E: CheckpointRow[] = [
  { checkpoint: "Reconciled bank balance equals total trust liability listing.", key: "e1" },
  { checkpoint: "Any differences identified, investigated, and corrected before month-end sign-off.", key: "e2" },
];

const SECTION_F: CheckpointRow[] = [
  { checkpoint: "Reconciling items log updated for current month.", key: "f1" },
  { checkpoint: "All reconciling items over two months old reviewed and followed up.", key: "f2" },
  { checkpoint: "Any stale-dated, unexplained, or irregular items escalated to Licensed Manager for review.", key: "f3" },
];

const SECTION_G: CheckpointRow[] = [
  { checkpoint: "Confirmed there were no trust receipts or disbursements this month.", key: "g1" },
  { checkpoint: "Trust account bank balance agrees to prior month and to trust liability listing.", key: "g2" },
  { checkpoint: "Prior reconciling items (if any) still valid and explained.", key: "g3" },
];

function CheckpointTable({ rows, register, watch, setValue, prefix }: {
  rows: CheckpointRow[];
  register: ReturnType<typeof useForm<MonthlyTrustReconciliationChecklistFormValues>>["register"];
  watch: ReturnType<typeof useForm<MonthlyTrustReconciliationChecklistFormValues>>["watch"];
  setValue: ReturnType<typeof useForm<MonthlyTrustReconciliationChecklistFormValues>>["setValue"];
  prefix: string;
}) {
  return (
    <Table className="border border-[#d1d5db] rounded-lg overflow-hidden">
      <TableHeader>
        <TableRow className="bg-[#eef2ff] hover:bg-[#eef2ff]">
          <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold">Checkpoint</TableHead>
          <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[60px] text-center">Y/N</TableHead>
          <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold min-w-[250px]">Comments / Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.key} className="hover:bg-transparent">
            <TableCell className="py-1.5 px-2 text-[0.85rem]">{row.checkpoint}</TableCell>
            <TableCell className="py-1.5 px-1 text-center">
              <Select
                value={String(watch(`${prefix}.${row.key}.status` as Path<MonthlyTrustReconciliationChecklistFormValues>))}
                onValueChange={(v) => setValue(`${prefix}.${row.key}.status` as Path<MonthlyTrustReconciliationChecklistFormValues>, v)}
              >
                <SelectTrigger className="h-8 w-[60px] text-[0.8rem] mx-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Y">Y</SelectItem>
                  <SelectItem value="N">N</SelectItem>
                  <SelectItem value="YN">Y/N</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="py-1.5 px-2">
              <textarea
                {...register(`${prefix}.${row.key}.comments` as Path<MonthlyTrustReconciliationChecklistFormValues>)}
                className="w-full min-h-[32px] resize-y rounded border border-[#d1d5db] text-[0.8rem] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] placeholder:text-gray-400 leading-[1.4] p-1"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function SignOffBlock({ title, description, namePath, sigPath, datePath, register, watch, setValue }: {
  title: string;
  description: string;
  namePath: string;
  sigPath: string;
  datePath: string;
  register: ReturnType<typeof useForm<MonthlyTrustReconciliationChecklistFormValues>>["register"];
  watch: ReturnType<typeof useForm<MonthlyTrustReconciliationChecklistFormValues>>["watch"];
  setValue: ReturnType<typeof useForm<MonthlyTrustReconciliationChecklistFormValues>>["setValue"];
}) {
  return (
    <div className="mt-3 p-3 rounded border border-dashed border-[#9ca3af] bg-[#f5f5ff]">
      <h3 className="m-0 mb-1 text-[0.95rem] uppercase tracking-[0.07em]">{title}</h3>
      <p className="m-0 mb-2 text-[0.9rem] text-gray-500">{description}</p>
      <div className="grid grid-cols-3 gap-x-5 gap-y-2">
        <FormField label="Name" placeholder="" {...register(namePath as Path<MonthlyTrustReconciliationChecklistFormValues>)} />
        <FormField label="Signature" placeholder="" {...register(sigPath as Path<MonthlyTrustReconciliationChecklistFormValues>)} />
        <div className={ROW}>
          <label className="w-[50px] text-[0.8rem] font-semibold flex-none">Date</label>
          <DatePicker value={String(watch(datePath as Path<MonthlyTrustReconciliationChecklistFormValues>))} onChange={(v) => setValue(datePath as Path<MonthlyTrustReconciliationChecklistFormValues>, v)} />
        </div>
      </div>
    </div>
  );
}

export function MonthlyTrustReconciliationChecklistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MonthlyTrustReconciliationChecklistFormValues>({
    resolver: zodResolver(monthlyTrustReconciliationChecklistSchema),
    defaultValues: monthlyTrustReconciliationChecklistDefaultValues,
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

  const formErrors = useFormErrors(errors);

  const onSubmit = async (data: MonthlyTrustReconciliationChecklistFormValues) => {
    if (formErrors.length > 0) {
      toast.error(`Please fix ${formErrors.length} error(s) before submitting`);
      return;
    }
    setIsSubmitting(true);
    try {
      console.log("Form submitted:", data);
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Monthly Trust Reconciliation Checklist saved successfully!");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("mtrc_draft", JSON.stringify(form.getValues()));
    toast.success("Draft saved locally");
  };

  const handleCancel = () => {
    window.parent.postMessage(
      { type: "tfd-close-tab", key: "Monthly_Trust_Reconciliation_Checklist_Form" },
      "*",
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto bg-white rounded-[10px] shadow-[0_2px_6px_rgba(15,23,42,0.08)] border border-[#d1d5db] p-7 pt-8 pb-8">
      {formErrors.length > 0 && <FormErrorsSummary errors={formErrors} />}

      <header className="border-b-2 border-[#9ca3af] pb-3 mb-3">
        <h1 className="m-0 mb-1 text-[1.25rem] uppercase tracking-[0.08em] text-gray-900">
          Monthly Trust Reconciliation Checklist
        </h1>
        <p className="m-0 text-[0.9rem] text-gray-600">
          Use one checklist per trust account per month. Attach this form to the full bank reconciliation package.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header fields */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <div className="grid grid-cols-2 gap-x-5 gap-y-2">
            <div className={ROW}>
              <label className="w-[100px] text-[0.8rem] font-semibold flex-none">Month</label>
              <MonthPicker value={watch("month")} onChange={(v) => setValue("month", v)} placeholder="Pick a month" />
            </div>
            <div className={ROW}>
              <label className="w-[100px] text-[0.8rem] font-semibold flex-none">Date</label>
              <DatePicker value={watch("date")} onChange={(v) => setValue("date", v)} />
            </div>
            <FormField label="Prepared By" placeholder="" {...register("preparedBy")} labelClassName="w-[100px] text-[0.8rem] font-semibold flex-none" />
            <FormField label="Licensed Manager" placeholder="" {...register("licensedManager")} labelClassName="w-[130px] text-[0.8rem] font-semibold flex-none whitespace-nowrap" />
          </div>
        </section>

        {/* Section B: Month-End Cut-Off */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-2 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">B</span>
            Month-End Cut-Off
          </h2>
          <CheckpointTable rows={SECTION_B} register={register} watch={watch} setValue={setValue} prefix="b" />
        </section>

        {/* Section C: Trust Liability Listing */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-2 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">C</span>
            Trust Liability Listing
          </h2>
          <CheckpointTable rows={SECTION_C} register={register} watch={watch} setValue={setValue} prefix="c" />
        </section>

        {/* Section D: Bank Reconciliation */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-2 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">D</span>
            Bank Reconciliation
          </h2>
          <CheckpointTable rows={SECTION_D} register={register} watch={watch} setValue={setValue} prefix="d" />
        </section>

        {/* Section E: Comparison */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-2 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">E</span>
            Comparison – Reconciled Bank Balance vs. Trust Liability
          </h2>
          <CheckpointTable rows={SECTION_E} register={register} watch={watch} setValue={setValue} prefix="e" />
          <div className="mt-2">
            <FormTextarea
              label="If there is a difference, describe cause and correction"
              {...register("e.differenceDetails")}
              className="min-h-[60px]"
              placeholder=""
            />
          </div>
        </section>

        {/* Section F: Reconciling Items Log */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-2 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">F</span>
            Reconciling Items Log
          </h2>
          <CheckpointTable rows={SECTION_F} register={register} watch={watch} setValue={setValue} prefix="f" />
          <div className="mt-2">
            <FormTextarea
              label="Notes / follow-up required on aged items"
              {...register("f.notes")}
              className="min-h-[60px]"
              placeholder=""
            />
          </div>
        </section>

        {/* Section G: Months With No Activity */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-2 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">G</span>
            Months With No Activity (If Applicable)
          </h2>
          <p className="m-0 mb-2 text-[0.8rem] text-gray-500">
            Complete this section only if there were no trust transactions during the month.
          </p>
          <CheckpointTable rows={SECTION_G} register={register} watch={watch} setValue={setValue} prefix="g" />
        </section>

        {/* Section H: Sign-Off & Filing */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-2 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">H</span>
            Sign-Off &amp; Filing
          </h2>

          <SignOffBlock
            title="Preparer Declaration"
            description="I confirm that this monthly trust account reconciliation summary is complete and accurate and that it is supported by the underlying reconciliation package (including the bank reconciliation, trust liability listing, and reconciling items log)."
            namePath="preparer.name"
            sigPath="preparer.signature"
            datePath="preparer.date"
            register={register}
            watch={watch}
            setValue={setValue}
          />

          <SignOffBlock
            title="Licensed Manager Review"
            description="I have reviewed the monthly trust account reconciliation and I am satisfied that it has been properly prepared and that the reconciled bank balance agrees to the total trust liability."
            namePath="licensedManagerReview.name"
            sigPath="licensedManagerReview.signature"
            datePath="licensedManagerReview.date"
            register={register}
            watch={watch}
            setValue={setValue}
          />

          {/* Filing Details */}
          <div className="mt-3 p-3 rounded border border-dashed border-[#9ca3af] bg-[#f5f5ff]">
            <h3 className="m-0 mb-2 text-[0.95rem] uppercase tracking-[0.07em]">Filing Details</h3>
            <div className="grid grid-cols-[2fr_1fr_1fr] gap-x-5 gap-y-2">
              <FormField label="Filed In (Location / Folder / System ID)" placeholder="" {...register("filing.location")} labelClassName="w-[260px] text-[0.8rem] font-semibold flex-none" />
              <div className={ROW}>
                <label className="w-[80px] text-[0.8rem] font-semibold flex-none">Date Filed</label>
                <DatePicker value={watch("filing.dateFiled")} onChange={(v) => setValue("filing.dateFiled", v)} />
              </div>
              <div className={ROW}>
                <label className="w-[140px] text-[0.8rem] font-semibold flex-none text-[0.75rem]">Annual Review?</label>
                <Select value={watch("filing.annualReview")} onValueChange={(v) => setValue("filing.annualReview", v)}>
                  <SelectTrigger className="h-8 w-[80px] text-[0.8rem]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="na">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
            setFocus(fieldName as Path<MonthlyTrustReconciliationChecklistFormValues>);
          }}
        />
      )}
    </div>
  );
}
