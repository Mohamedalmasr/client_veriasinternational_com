"use client";

import { useState, useMemo } from "react";
import { useForm, useFieldArray, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Plus, Trash2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { FormField } from "@/components/forms/FormField";
import { FormTextarea } from "@/components/forms/FormTextarea";
import {
  FormErrorsDisplay,
  FormErrorsSummary,
  type FormError,
} from "@/components/forms/FormErrorsDisplay";
import {
  reconcilingItemsLogSchema,
  type ReconcilingItemsLogFormValues,
} from "@/types/reconciling-items-log";

const defaultValues: ReconcilingItemsLogFormValues = {
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

const INPUT =
  "flex-1 min-w-0 rounded border border-[#d1d5db] text-[0.88rem] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] placeholder:text-gray-400 leading-[1.4]";
const ROW = "flex items-center gap-2";

const TYPE_OPTIONS = [
  "Outstanding Cheque",
  "Outstanding Deposit",
  "Bank Error",
  "Other",
];

export default function ReconcilingItemsLogPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReconcilingItemsLogFormValues>({
    resolver: zodResolver(reconcilingItemsLogSchema),
    defaultValues,
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

  const itemFields = useFieldArray({ control, name: "items" });

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

  const onSubmit = async (data: ReconcilingItemsLogFormValues) => {
    if (formErrors.length > 0) {
      toast.error(`Please fix ${formErrors.length} error(s) before submitting`);
      return;
    }
    setIsSubmitting(true);
    try {
      console.log("Form submitted:", data);
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Reconciling Items Log saved successfully!");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("ril_draft", JSON.stringify(form.getValues()));
    toast.success("Draft saved locally");
  };

  const handleCancel = () => {
    window.parent.postMessage(
      { type: "tfd-close-tab", key: "Reconciling_Items_Log" },
      "*",
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto bg-white rounded-[10px] shadow-[0_2px_6px_rgba(15,23,42,0.08)] border border-[#d1d5db] p-7 pt-8 pb-8">
      {formErrors.length > 0 && <FormErrorsSummary errors={formErrors} />}

      <header className="border-b-2 border-[#9ca3af] pb-3 mb-3">
        <h1 className="m-0 mb-1 text-[1.25rem] uppercase tracking-[0.08em] text-gray-900">
          Reconciling Items Log
        </h1>
        <p className="m-0 text-[0.9rem] text-gray-600">
          Use this log to track all reconciling items identified during the monthly
          trust bank reconciliation until they are fully resolved and cleared from
          the bank reconciliation.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Section 1: Account Information */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">1</span>
            Account Information
          </h2>
          <div className="grid grid-cols-3 gap-x-5">
            <FormField
              label="Trust Account Name"
              placeholder=""
              error={errors.trustAccountName?.message}
              {...register("trustAccountName")}
            />
            <FormField
              label="Month / Period"
              placeholder="e.g., March 2025"
              error={errors.monthPeriod?.message}
              {...register("monthPeriod")}
            />
            <FormField
              label="Trust Account Number"
              placeholder=""
              error={errors.trustAccountNumber?.message}
              {...register("trustAccountNumber")}
            />
          </div>
        </section>

        {/* Section 2: Reconciling Items */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="m-0 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">2</span>
              Reconciling Items
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-[#1f4f8f] border-[#1f4f8f] hover:bg-[#e6f0ff]"
              onClick={() =>
                itemFields.append({
                  itemNumber: "",
                  dateIdentified: "",
                  description: "",
                  amount: "",
                  type: "",
                  expectedResolutionDate: "",
                  actionNotes: "",
                  actualResolutionDate: "",
                  resolvedBy: "",
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>
          <p className="text-[0.8rem] text-gray-500 m-0 mb-3">
            Each reconciling item should be carried forward to subsequent months until resolved.
            Ensure aged items (over two months old) are reviewed and escalated to the Licensed Manager as required.
          </p>
          <div className="overflow-x-auto ril-scrollbar">
            <Table className="border border-[#d1d5db] rounded-lg overflow-visible" style={{ minWidth: "1400px" }}>
              <TableHeader>
                <TableRow className="bg-[#eef2ff] hover:bg-[#eef2ff]">
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[70px] min-w-[70px]">Item #</TableHead>
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[140px] min-w-[140px]">Date Identified</TableHead>
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[220px] min-w-[220px]">Description of Item</TableHead>
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[180px] min-w-[180px]">Amount</TableHead>
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[180px] min-w-[180px]">Type</TableHead>
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[150px] min-w-[150px]">Expected Resolution</TableHead>
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[220px] min-w-[220px]">Action Taken / Notes</TableHead>
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[150px] min-w-[150px]">Actual Resolution</TableHead>
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[150px] min-w-[150px]">Resolved By</TableHead>
                  <TableHead className="h-9 w-[50px] min-w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemFields.fields.map((field, idx) => (
                  <TableRow key={field.id} className="hover:bg-transparent">
                    <TableCell className="py-1.5 px-2">
                      <Input
                        {...register(`items.${idx}.itemNumber`)}
                        className="h-8 text-[0.8rem] text-center"
                      />
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      <DatePicker
                        value={watch(`items.${idx}.dateIdentified`)}
                        onChange={(v) => setValue(`items.${idx}.dateIdentified`, v)}
                      />
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      <textarea
                        {...register(`items.${idx}.description`)}
                        className="w-full min-h-[32px] resize-y rounded border border-[#d1d5db] text-[0.8rem] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] placeholder:text-gray-400 leading-[1.4] p-1"
                      />
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      <div className="flex items-center">
                        <span className="flex-none h-8 flex items-center px-2 bg-gray-100 border border-r-0 border-[#d1d5db] rounded-l-lg text-[0.8rem] text-gray-600">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...register(`items.${idx}.amount`)}
                          className="h-8 text-[0.8rem] rounded-l-none text-right w-full"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      <Select
                        value={watch(`items.${idx}.type`)}
                        onValueChange={(v) => setValue(`items.${idx}.type`, v)}
                      >
                        <SelectTrigger className="h-8 text-[0.8rem]">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {TYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      <DatePicker
                        value={watch(`items.${idx}.expectedResolutionDate`)}
                        onChange={(v) => setValue(`items.${idx}.expectedResolutionDate`, v)}
                      />
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      <textarea
                        {...register(`items.${idx}.actionNotes`)}
                        className="w-full min-h-[32px] resize-y rounded border border-[#d1d5db] text-[0.8rem] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] placeholder:text-gray-400 leading-[1.4] p-1"
                      />
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      <DatePicker
                        value={watch(`items.${idx}.actualResolutionDate`)}
                        onChange={(v) => setValue(`items.${idx}.actualResolutionDate`, v)}
                      />
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      <Input
                        {...register(`items.${idx}.resolvedBy`)}
                        className="h-8 text-[0.8rem]"
                      />
                    </TableCell>
                    <TableCell className="py-1.5 px-1">
                      {itemFields.fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => itemFields.remove(idx)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-0 leading-none"
                          title="Remove item"
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
          <p className="mt-2 text-[0.8rem] text-gray-500 italic">
            Note: Each reconciling item should be carried forward to subsequent months until resolved.
            Ensure aged items (over two months old) are reviewed and escalated to the Licensed Manager as required.
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
            setFocus(fieldName as Path<ReconcilingItemsLogFormValues>);
          }}
        />
      )}
    </div>
  );
}
