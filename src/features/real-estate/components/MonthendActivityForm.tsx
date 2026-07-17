"use client";

import { useState } from "react";
import { useForm, useFieldArray, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { FormTextarea } from "@/components/forms/FormTextarea";
import {
  FormErrorsDisplay,
  FormErrorsSummary,
} from "@/components/forms/FormErrorsDisplay";
import {
  monthendActivitySchema,
  type MonthendActivityFormValues,
} from "@/types/monthend-activity";
import { ROW } from "@/features/real-estate/constants/form-config";
import { monthendActivityDefaultValues } from "@/features/real-estate/constants/default-values";
import { useFormErrors } from "@/features/real-estate/utils/form-errors";

interface CheckpointRow {
  checkpoint: string;
  key: string;
}

const SECTION_S1: CheckpointRow[] = [
  { checkpoint: "All trust transactions for the month have been recorded in the trust ledger.", key: "s1_1" },
  { checkpoint: "All closed deals have been updated for trust movements (deposits/withdrawals).", key: "s1_2" },
  { checkpoint: "Complete month-end bank statement obtained for the trust account.", key: "s1_3" },
];

const SECTION_S2: CheckpointRow[] = [
  { checkpoint: "Listing of all trust balances by file/client prepared as of month-end.", key: "s2_1" },
  { checkpoint: "Each active file/client has a clearly identifiable balance.", key: "s2_2" },
  { checkpoint: "Total trust liability calculated from listing.", key: "s2_3" },
  { checkpoint: "Unusual or long-standing balances identified and flagged.", key: "s2_4" },
];

const SECTION_S3_CONTROLS: CheckpointRow[] = [
  { checkpoint: "Reconciliation prepared using month-end bank statement closing balance.", key: "s3_1" },
  { checkpoint: "All outstanding deposits are listed and traceable to the trust ledger.", key: "s3_2" },
  { checkpoint: "All outstanding cheques/withdrawals are listed and traceable to the trust ledger.", key: "s3_3" },
  { checkpoint: "All bank errors/adjustments documented with supporting evidence and explanations.", key: "s3_4" },
];

const SECTION_S4_CONTROLS: CheckpointRow[] = [
  { checkpoint: "Reconciled bank balance equals total trust liability (difference is $0).", key: "s4_1" },
  { checkpoint: "If difference is not zero, difference investigated and explained; temporary discrepancy documented with LM involvement.", key: "s4_2" },
];

const SECTION_S5: CheckpointRow[] = [
  { checkpoint: "Month-end bank statement for the trust account.", key: "s5_1" },
  { checkpoint: "Completed bank reconciliation worksheet (Section 3).", key: "s5_2" },
  { checkpoint: "Trust liability listing (Section 2).", key: "s5_3" },
  { checkpoint: "Reconciling Items Log (if any items remain outstanding).", key: "s5_4" },
  { checkpoint: "Supporting documents (bank advices, corrections, correspondence, etc.).", key: "s5_5" },
  { checkpoint: "This Monthly Trust Account Reconciliation Checklist completed in full.", key: "s5_6" },
];

const SECTION_S6: CheckpointRow[] = [
  { checkpoint: "I have reviewed the full reconciliation package for completeness and reasonableness.", key: "s6_1" },
  { checkpoint: "I confirm that the reconciled bank balance equals the total trust liability, or that any temporary discrepancy is properly documented and under investigation.", key: "s6_2" },
  { checkpoint: "I have reviewed long-standing/unusual items and I am satisfied with the action plan.", key: "s6_3" },
];

const SECTION_S7: CheckpointRow[] = [
  { checkpoint: "No trust account deposits, withdrawals, or transfers occurred during the month.", key: "s7_1" },
  { checkpoint: "Trust ledger balance at month-end agrees to the trust bank account balance.", key: "s7_2" },
  { checkpoint: "Month-end bank statement (or online printout) obtained and attached to this form.", key: "s7_3" },
];

function CheckpointTable({
  rows,
  register,
  watch,
  setValue,
  prefix,
  section,
  showDetails = true,
}: {
  rows: CheckpointRow[];
  register: ReturnType<typeof useForm<MonthendActivityFormValues>>["register"];
  watch: ReturnType<typeof useForm<MonthendActivityFormValues>>["watch"];
  setValue: ReturnType<typeof useForm<MonthendActivityFormValues>>["setValue"];
  prefix: string;
  section: string;
  showDetails?: boolean;
}) {
  return (
    <div className="overflow-x-auto ril-scrollbar">
      <Table className="border border-[#d1d5db] rounded-lg overflow-visible">
        <TableHeader>
          <TableRow className="bg-[#eef2ff] hover:bg-[#eef2ff]">
            <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[50px] text-center">#</TableHead>
            <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold">Requirement</TableHead>
            <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[60px] text-center">Y/N</TableHead>
            {showDetails && (
              <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold min-w-[250px]">Details / Exceptions</TableHead>
            )}
            <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[50px] text-center">Init</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {rows.map((row, idx) => (
          <TableRow key={row.key} className="hover:bg-transparent">
            <TableCell className="py-1.5 px-2 text-[0.75rem] text-center text-gray-500">{section}.{idx + 1}</TableCell>
            <TableCell className="py-1.5 px-2 text-[0.85rem]">{row.checkpoint}</TableCell>
            <TableCell className="py-1.5 px-1 text-center">
              <Select
                value={String(watch(`${prefix}.${row.key}.status` as Path<MonthendActivityFormValues>))}
                onValueChange={(v) => setValue(`${prefix}.${row.key}.status` as Path<MonthendActivityFormValues>, v)}
              >
                <SelectTrigger className="h-8 w-[60px] text-[0.8rem] mx-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Y">Y</SelectItem>
                  <SelectItem value="N">N</SelectItem>
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            {showDetails && (
              <TableCell className="py-1.5 px-2">
                <textarea
                  {...register(`${prefix}.${row.key}.comments` as Path<MonthendActivityFormValues>)}
                  className="w-full min-h-[32px] resize-y rounded border border-[#d1d5db] text-[0.8rem] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] placeholder:text-gray-400 leading-[1.4] p-1"
                />
              </TableCell>
            )}
            <TableCell className="py-1.5 px-1 text-center">
              <Checkbox
                checked={Boolean(watch(`${prefix}.${row.key}.init` as Path<MonthendActivityFormValues>))}
                onCheckedChange={(checked) => setValue(`${prefix}.${row.key}.init` as Path<MonthendActivityFormValues>, Boolean(checked))}
                className="mx-auto"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}

function SummaryField({
  label,
  name,
  watch,
  setValue,
  isTotal,
}: {
  label: string;
  name: Path<MonthendActivityFormValues>;
  watch: ReturnType<typeof useForm<MonthendActivityFormValues>>["watch"];
  setValue: ReturnType<typeof useForm<MonthendActivityFormValues>>["setValue"];
  isTotal?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 ${isTotal ? "mt-2 pt-2 border-t border-dashed border-[#d1d5db]" : ""}`}>
      <label className="flex-1 text-[0.8rem] font-semibold text-gray-700">{label}</label>
      <div className="inline-flex items-center rounded border border-[#d1d5db] overflow-hidden bg-white">
        <span className="px-2 py-1 bg-gray-100 border-r border-[#d1d5db] text-[0.8rem] text-gray-600">$</span>
        <Input
          value={String(watch(name))}
          onChange={(e) => setValue(name, e.target.value)}
          className="h-8 w-[140px] border-none rounded-none text-[0.8rem] bg-transparent focus:outline-[#1f4f8f]"
        />
      </div>
    </div>
  );
}

function SignOffBlock({
  title,
  description,
  namePath,
  sigPath,
  datePath,
  register,
  watch,
  setValue,
}: {
  title: string;
  description: string;
  namePath: string;
  sigPath: string;
  datePath: string;
  register: ReturnType<typeof useForm<MonthendActivityFormValues>>["register"];
  watch: ReturnType<typeof useForm<MonthendActivityFormValues>>["watch"];
  setValue: ReturnType<typeof useForm<MonthendActivityFormValues>>["setValue"];
}) {
  return (
    <div className="mt-3 p-3 rounded border border-dashed border-[#9ca3af] bg-[#f5f5ff]">
      <h3 className="m-0 mb-1 text-[0.95rem] uppercase tracking-[0.07em]">{title}</h3>
      <p className="m-0 mb-2 text-[0.9rem] text-gray-500">{description}</p>
      <div className="grid grid-cols-3 gap-x-5 gap-y-2">
        <div className={ROW}>
          <label htmlFor={namePath} className="w-[80px] text-[0.8rem] font-semibold flex-none">Name</label>
          <Input id={namePath} {...register(namePath as Path<MonthendActivityFormValues>)} className="flex-1 min-w-0 h-8 text-[0.8rem] rounded border border-[#d1d5db] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] placeholder:text-gray-400" />
        </div>
        <div className={ROW}>
          <label htmlFor={sigPath} className="w-[80px] text-[0.8rem] font-semibold flex-none">Signature</label>
          <Input id={sigPath} {...register(sigPath as Path<MonthendActivityFormValues>)} className="flex-1 min-w-0 h-8 text-[0.8rem] rounded border border-[#d1d5db] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] placeholder:text-gray-400" />
        </div>
        <div className={ROW}>
          <label htmlFor={datePath} className="w-[80px] text-[0.8rem] font-semibold flex-none">Date</label>
          <DatePicker value={String(watch(datePath as Path<MonthendActivityFormValues>))} onChange={(v) => setValue(datePath as Path<MonthendActivityFormValues>, v)} />
        </div>
      </div>
    </div>
  );
}

export function MonthendActivityForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MonthendActivityFormValues>({
    resolver: zodResolver(monthendActivitySchema),
    defaultValues: monthendActivityDefaultValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    watch,
    register,
    setValue,
    control,
    formState: { errors },
    setFocus,
  } = form;

  const unusualBalanceFields = useFieldArray({ control, name: "unusualBalances" });

  const formErrors = useFormErrors(errors);

  const onSubmit = async (data: MonthendActivityFormValues) => {
    if (formErrors.length > 0) {
      toast.error(`Please fix ${formErrors.length} error(s) before submitting`);
      return;
    }
    setIsSubmitting(true);
    try {
      console.log("Form submitted:", data);
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Month-End Activity form saved successfully!");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("mea_draft", JSON.stringify(form.getValues()));
    toast.success("Draft saved locally");
  };

  const handleCancel = () => {
    window.parent.postMessage(
      { type: "tfd-close-tab", key: "Monthend_activity" },
      "*",
    );
  };

  const monthType = watch("monthType");

  return (
    <div className="max-w-[1200px] mx-auto bg-white rounded-[10px] shadow-[0_2px_6px_rgba(15,23,42,0.08)] border border-[#d1d5db] p-7 pt-8 pb-8">
      {formErrors.length > 0 && <FormErrorsSummary errors={formErrors} />}

      <header className="border-b-2 border-[#9ca3af] pb-3 mb-3">
        <div className="inline-block px-2 py-0.5 rounded-full border border-[#1f4f8f] text-[#1f4f8f] text-[0.7rem] uppercase tracking-[0.12em] mb-1">
          Appendix A
        </div>
        <h1 className="m-0 mb-1 text-[1.25rem] uppercase tracking-[0.08em] text-gray-900">
          Monthly Trust Account Reconciliation Checklist &amp; Sign-Off
        </h1>
        <p className="m-0 text-[0.9rem] text-gray-600">
          Use this form each month to document trust account reconciliation and Licensed Manager review.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header fields */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <div className="grid grid-cols-2 gap-x-5 gap-y-2">
            <div className={ROW}>
              <label htmlFor="trustAccount" className="w-[200px] text-[0.8rem] font-semibold flex-none">Trust Account</label>
              <Input id="trustAccount" {...register("trustAccount")} className="flex-1 min-w-0 h-8 text-[0.8rem] rounded border border-[#d1d5db] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] placeholder:text-gray-400" />
            </div>
            <div className={ROW}>
              <label htmlFor="monthEndDate" className="w-[200px] text-[0.8rem] font-semibold flex-none">Month-End Date</label>
              <DatePicker value={watch("monthEndDate")} onChange={(v) => setValue("monthEndDate", v)} />
            </div>
            <div className={ROW}>
              <label htmlFor="preparerName" className="w-[200px] text-[0.8rem] font-semibold flex-none">Preparer Name &amp; Position</label>
              <Input id="preparerName" {...register("preparerName")} className="flex-1 min-w-0 h-8 text-[0.8rem] rounded border border-[#d1d5db] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] placeholder:text-gray-400" />
            </div>
            <div className={ROW}>
              <label htmlFor="datePrepared" className="w-[200px] text-[0.8rem] font-semibold flex-none">Date Prepared</label>
              <DatePicker value={watch("datePrepared")} onChange={(v) => setValue("datePrepared", v)} />
            </div>
            <div className={ROW}>
              <label htmlFor="lmName" className="w-[200px] text-[0.8rem] font-semibold flex-none">Licensed Manager (LM) Name</label>
              <Input id="lmName" {...register("lmName")} className="flex-1 min-w-0 h-8 text-[0.8rem] rounded border border-[#d1d5db] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] placeholder:text-gray-400" />
            </div>
            <div className={ROW}>
              <label htmlFor="dateReviewed" className="w-[200px] text-[0.8rem] font-semibold flex-none">Date Reviewed</label>
              <DatePicker value={watch("dateReviewed")} onChange={(v) => setValue("dateReviewed", v)} />
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-dashed border-[#d1d5db]">
            <span className="text-[0.8rem] font-semibold text-gray-700 mr-3">Month Type (check one):</span>
            <RadioGroup
              value={monthType}
              onValueChange={(v) => setValue("monthType", v)}
              className="flex flex-col gap-2 mt-2"
            >
              <label className="flex items-center gap-2 text-[0.85rem] text-gray-800 cursor-pointer">
                <RadioGroupItem value="normal" />
                Normal month – trust activity occurred (complete Sections 1–6; Section 7 if applicable)
              </label>
              <label className="flex items-center gap-2 text-[0.85rem] text-gray-800 cursor-pointer">
                <RadioGroupItem value="noActivity" />
                No activity month – complete Section 7 only
              </label>
            </RadioGroup>
          </div>
        </section>

        {/* Section 1: Month-End Cut-Off */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-1 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">1</span>
            Month-End Cut-Off
          </h2>
          <p className="m-0 mb-2 text-[0.85rem] text-gray-500 italic">
            Objective: All trust activity for the month is recorded and supported by a complete bank statement.
          </p>
          <CheckpointTable rows={SECTION_S1} register={register} watch={watch} setValue={setValue} prefix="s1" section="1" />
        </section>

        {/* Section 2: Trust Liability Listing */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-1 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">2</span>
            Trust Liability Listing
          </h2>
          <p className="m-0 mb-2 text-[0.85rem] text-gray-500 italic">
            Objective: Trust liability listing is complete and reconciles to individual files/clients.
          </p>
          <CheckpointTable rows={SECTION_S2} register={register} watch={watch} setValue={setValue} prefix="s2" section="2" />

          {/* Section 2.5: Unusual / Long-Standing Balances */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="m-0 text-[0.9rem] uppercase tracking-[0.06em]">2.5 Unusual / Long-Standing Balances (if any)</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-[#1f4f8f] border-[#1f4f8f] hover:bg-[#e6f0ff]"
                onClick={() =>
                  unusualBalanceFields.append({
                    fileClientId: "",
                    clientName: "",
                    amount: "",
                    natureOfIssue: "",
                    actionPlan: "",
                    targetResolutionDate: "",
                    init: false,
                  })
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Row
              </Button>
            </div>
            <div className="overflow-x-auto ril-scrollbar">
              <Table className="border border-[#d1d5db] rounded-lg overflow-visible" style={{ minWidth: "1100px" }}>
                <TableHeader>
                  <TableRow className="bg-[#eef2ff] hover:bg-[#eef2ff]">
                    <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[130px] min-w-[130px]">File/Client ID</TableHead>
                    <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[160px] min-w-[160px]">Client Name</TableHead>
                    <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[100px] min-w-[100px]">Amount</TableHead>
                    <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[220px] min-w-[220px]">Nature of Issue / Reason</TableHead>
                    <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[220px] min-w-[220px]">Action Plan</TableHead>
                    <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[140px] min-w-[140px]">Target Resolution</TableHead>
                    <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[50px] min-w-[50px] text-center">Init</TableHead>
                    <TableHead className="h-9 w-[50px] min-w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unusualBalanceFields.fields.map((field, idx) => (
                    <TableRow key={field.id} className="hover:bg-transparent">
                      <TableCell className="py-1.5 px-2">
                        <Input
                          {...register(`unusualBalances.${idx}.fileClientId`)}
                          className="h-8 text-[0.8rem]"
                        />
                      </TableCell>
                      <TableCell className="py-1.5 px-2">
                        <Input
                          {...register(`unusualBalances.${idx}.clientName`)}
                          className="h-8 text-[0.8rem]"
                        />
                      </TableCell>
                      <TableCell className="py-1.5 px-2">
                        <div className="flex items-center">
                          <span className="flex-none h-8 flex items-center px-2 bg-gray-100 border border-r-0 border-[#d1d5db] rounded-l-lg text-[0.8rem] text-gray-600">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...register(`unusualBalances.${idx}.amount`)}
                            className="h-8 text-[0.8rem] rounded-l-none text-right w-full"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-1.5 px-2">
                        <textarea
                          {...register(`unusualBalances.${idx}.natureOfIssue`)}
                          className="w-full min-h-[32px] resize-y rounded border border-[#d1d5db] text-[0.8rem] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] placeholder:text-gray-400 leading-[1.4] p-1"
                        />
                      </TableCell>
                      <TableCell className="py-1.5 px-2">
                        <textarea
                          {...register(`unusualBalances.${idx}.actionPlan`)}
                          className="w-full min-h-[32px] resize-y rounded border border-[#d1d5db] text-[0.8rem] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] placeholder:text-gray-400 leading-[1.4] p-1"
                        />
                      </TableCell>
                      <TableCell className="py-1.5 px-2">
                        <DatePicker
                          value={watch(`unusualBalances.${idx}.targetResolutionDate`)}
                          onChange={(v) => setValue(`unusualBalances.${idx}.targetResolutionDate`, v)}
                        />
                      </TableCell>
                      <TableCell className="py-1.5 px-1 text-center">
                        <Checkbox
                          checked={Boolean(watch(`unusualBalances.${idx}.init`))}
                          onCheckedChange={(checked) => setValue(`unusualBalances.${idx}.init`, Boolean(checked))}
                          className="mx-auto"
                        />
                      </TableCell>
                      <TableCell className="py-1.5 px-1">
                        {unusualBalanceFields.fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => unusualBalanceFields.remove(idx)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-0 leading-none"
                            title="Remove row"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Section 3: Bank Reconciliation */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-1 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">3</span>
            Bank Reconciliation
          </h2>
          <p className="m-0 mb-2 text-[0.85rem] text-gray-500 italic">
            Objective: Prepare a full bank reconciliation from the bank statement to the reconciled bank balance.
          </p>

          {/* 3.1 Reconciliation Summary */}
          <div className="mb-3">
            <h3 className="m-0 mb-2 text-[0.9rem] uppercase tracking-[0.06em]">3.1 Reconciliation Summary</h3>
            <SummaryField label="Bank Statement Closing Balance (as at month-end)" name="s3.bankClosingBalance" watch={watch} setValue={setValue} />
            <SummaryField label="Add: Outstanding deposits (recorded in ledger but not yet on statement)" name="s3.outstandingDeposits" watch={watch} setValue={setValue} />
            <SummaryField label="Less: Outstanding cheques/withdrawals (recorded in ledger but not yet cleared)" name="s3.outstandingCheques" watch={watch} setValue={setValue} />
            <SummaryField label="Plus / Minus: Other adjustments (bank errors, service charges, interest, etc.) – attach documentation" name="s3.otherAdjustments" watch={watch} setValue={setValue} />
            <SummaryField label="Reconciled Bank Balance" name="s3.reconciledBalance" watch={watch} setValue={setValue} isTotal />
          </div>

          {/* 3.2 Bank Reconciliation Controls */}
          <div>
            <h3 className="m-0 mb-2 text-[0.9rem] uppercase tracking-[0.06em]">3.2 Bank Reconciliation Controls</h3>
            <CheckpointTable rows={SECTION_S3_CONTROLS} register={register} watch={watch} setValue={setValue} prefix="s3.controls" section="3.2" />
          </div>
        </section>

        {/* Section 4: Comparison */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-1 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">4</span>
            Comparison – Reconciled Bank Balance vs Trust Liability
          </h2>
          <p className="m-0 mb-2 text-[0.85rem] text-gray-500 italic">
            Objective: Confirm the reconciled bank balance equals the total trust liability.
          </p>

          <SummaryField label="Reconciled Bank Balance (from Section 3)" name="s4.reconciledBankBalance" watch={watch} setValue={setValue} />
          <SummaryField label="Total Trust Liability (from Section 2)" name="s4.totalTrustLiability" watch={watch} setValue={setValue} />
          <SummaryField label="Difference" name="s4.difference" watch={watch} setValue={setValue} isTotal />

          <div className="mt-3">
            <CheckpointTable rows={SECTION_S4_CONTROLS} register={register} watch={watch} setValue={setValue} prefix="s4.controls" section="4" />
          </div>

          <div className="mt-2">
            <FormTextarea
              label="If Difference ≠ $0, explain and document"
              {...register("s4.differenceExplanation")}
              className="min-h-[60px]"
              placeholder=""
            />
          </div>
        </section>

        {/* Section 5: Reconciliation Package Assembly */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-1 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">5</span>
            Reconciliation Package Assembly
          </h2>
          <p className="m-0 mb-2 text-[0.85rem] text-gray-500 italic">
            Objective: Ensure a complete monthly package is compiled and ready for LM review.
          </p>
          <CheckpointTable rows={SECTION_S5} register={register} watch={watch} setValue={setValue} prefix="s5" section="5" showDetails={false} />

          <SignOffBlock
            title="Preparer Certification"
            description="I certify that the above reconciliation has been prepared based on the information available and that, to the best of my knowledge, it is complete and accurate."
            namePath="preparerCert.name"
            sigPath="preparerCert.signature"
            datePath="preparerCert.date"
            register={register}
            watch={watch}
            setValue={setValue}
          />
        </section>

        {/* Section 6: Licensed Manager Review */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-1 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">6</span>
            Licensed Manager Review
          </h2>
          <p className="m-0 mb-2 text-[0.85rem] text-gray-500 italic">
            Objective: LM reviews, challenges where necessary, and formally approves the reconciliation.
          </p>
          <CheckpointTable rows={SECTION_S6} register={register} watch={watch} setValue={setValue} prefix="s6" section="6" showDetails={false} />

          <div className="mt-2">
            <FormTextarea
              label="LM Comments (if any)"
              {...register("s6.lmComments")}
              className="min-h-[60px]"
              placeholder=""
            />
          </div>

          <SignOffBlock
            title="Licensed Manager Approval"
            description="I have reviewed the reconciliation package and approve it as complete and accurate."
            namePath="lmReview.name"
            sigPath="lmReview.signature"
            datePath="lmReview.date"
            register={register}
            watch={watch}
            setValue={setValue}
          />
        </section>

        {/* Section 7: Months With No Activity */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-1 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">7</span>
            Months With No Activity
          </h2>
          <p className="m-0 mb-2 text-[0.85rem] text-gray-500 italic">
            (Complete this section only if &quot;No activity month&quot; was selected at the top.) Objective: Document that there was no activity, and that ledger and bank balances are consistent.
          </p>
          <CheckpointTable rows={SECTION_S7} register={register} watch={watch} setValue={setValue} prefix="s7" section="7" />

          <SignOffBlock
            title="Preparer Certification – No Activity Month"
            description="I certify that there was no trust account activity during the month and that the trust ledger and bank statement balances agree."
            namePath="s7PreparerCert.name"
            sigPath="s7PreparerCert.signature"
            datePath="s7PreparerCert.date"
            register={register}
            watch={watch}
            setValue={setValue}
          />

          <SignOffBlock
            title="Licensed Manager Review – No Activity Month"
            description="I have reviewed this no-activity reconciliation and am satisfied that it is complete and accurate."
            namePath="s7LmReview.name"
            sigPath="s7LmReview.signature"
            datePath="s7LmReview.date"
            register={register}
            watch={watch}
            setValue={setValue}
          />

          <p className="mt-3 text-[0.8rem] text-gray-500 italic">
            If preferred, Section 7 and its header may be copied into a separate one-page form titled
            &quot;Monthly Trust Account Reconciliation – No Activity Certification (Trust Account)&quot; for quiet months.
          </p>
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
            setFocus(fieldName as Path<MonthendActivityFormValues>);
          }}
        />
      )}
    </div>
  );
}
