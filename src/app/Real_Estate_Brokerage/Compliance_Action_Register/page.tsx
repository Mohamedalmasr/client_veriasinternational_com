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
import {
  FormErrorsDisplay,
  FormErrorsSummary,
  type FormError,
} from "@/components/forms/FormErrorsDisplay";
import {
  complianceActionRegisterSchema,
  type ComplianceActionRegisterFormValues,
} from "@/types/compliance-action-register";

const STATUS_OPTIONS = [
  "Not Started",
  "In Progress",
  "Completed",
  "Ongoing",
];

const defaultValues: ComplianceActionRegisterFormValues = {
  items: [
    {
      itemNumber: "",
      recommendationId: "",
      deficiencySummary: "",
      inspectorRecommendation: "",
      actionSteps: "",
      responsiblePerson: "",
      targetCompletionDate: "",
      status: "",
      actualCompletionDate: "",
      policyReference: "",
      notes: "",
    },
  ],
};

const TEXTAREA =
  "w-full min-h-[50px] resize-y rounded border border-[#d1d5db] text-[0.8rem] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] placeholder:text-gray-400 leading-[1.4] p-1";

export default function ComplianceActionRegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ComplianceActionRegisterFormValues>({
    resolver: zodResolver(complianceActionRegisterSchema),
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

  const onSubmit = async (data: ComplianceActionRegisterFormValues) => {
    if (formErrors.length > 0) {
      toast.error(`Please fix ${formErrors.length} error(s) before submitting`);
      return;
    }
    setIsSubmitting(true);
    try {
      console.log("Form submitted:", data);
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Compliance Action Register saved successfully!");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("car_draft", JSON.stringify(form.getValues()));
    toast.success("Draft saved locally");
  };

  const handleCancel = () => {
    window.parent.postMessage(
      { type: "tfd-close-tab", key: "Compliance_Action_Register" },
      "*",
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto bg-white rounded-[10px] shadow-[0_2px_6px_rgba(15,23,42,0.08)] border border-[#d1d5db] p-7 pt-8 pb-8">
      {formErrors.length > 0 && <FormErrorsSummary errors={formErrors} />}

      <header className="border-b-2 border-[#9ca3af] pb-3 mb-3">
        <div className="text-[0.82rem] uppercase tracking-[0.12em] text-[#1f4f8f] font-semibold">
          Brokerage Compliance
        </div>
        <h1 className="m-0 mb-1 text-[1.25rem] uppercase tracking-[0.08em] text-gray-900">
          Compliance Action Register
        </h1>
        <p className="m-0 text-[0.9rem] text-gray-600">
          Used to track implementation of inspection recommendations and significant internal findings.
        </p>
        <p className="m-0 mt-1 text-[0.82rem] text-gray-500">
          Complete one line for each recommendation or deficiency. Update status and completion details as actions progress.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="m-0 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">1</span>
              Action Items
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-[#1f4f8f] border-[#1f4f8f] hover:bg-[#e6f0ff]"
              onClick={() =>
                itemFields.append({
                  itemNumber: "",
                  recommendationId: "",
                  deficiencySummary: "",
                  inspectorRecommendation: "",
                  actionSteps: "",
                  responsiblePerson: "",
                  targetCompletionDate: "",
                  status: "",
                  actualCompletionDate: "",
                  policyReference: "",
                  notes: "",
                })
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>
          <p className="text-[0.8rem] text-gray-500 m-0 mb-3">
            Status options: Not Started, In Progress, Completed, Ongoing. Update this register monthly as part of your compliance review.
          </p>
          <div className="overflow-x-auto ril-scrollbar">
            <Table className="border border-[#d1d5db] rounded-lg overflow-visible" style={{ minWidth: "1500px" }}>
              <TableHeader>
                <TableRow className="bg-[#eef2ff] hover:bg-[#eef2ff]">
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[60px] min-w-[60px] text-center">Item #</TableHead>
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[180px] min-w-[180px]">Recommendation ID / Section</TableHead>
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[200px] min-w-[200px]">Deficiency Summary</TableHead>
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[200px] min-w-[200px]">Inspector&apos;s Recommendation</TableHead>
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[220px] min-w-[220px]">Action Steps the Brokerage Will Take</TableHead>
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[130px] min-w-[130px]">Responsible Person</TableHead>
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[140px] min-w-[140px]">Target Completion</TableHead>
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[120px] min-w-[120px]">Status</TableHead>
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[140px] min-w-[140px]">Actual Completion</TableHead>
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[180px] min-w-[180px]">Reference to Updated Policy / Procedure</TableHead>
                  <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold w-[200px] min-w-[200px]">Notes / Follow-Up Required</TableHead>
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
                      <Input
                        {...register(`items.${idx}.recommendationId`)}
                        placeholder="e.g., 1.1, 2.3, Internal finding #4"
                        className="h-8 text-[0.8rem]"
                      />
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      <textarea
                        {...register(`items.${idx}.deficiencySummary`)}
                        className={TEXTAREA}
                      />
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      <textarea
                        {...register(`items.${idx}.inspectorRecommendation`)}
                        className={TEXTAREA}
                      />
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      <textarea
                        {...register(`items.${idx}.actionSteps`)}
                        placeholder="List concrete steps, owners, and milestones."
                        className={TEXTAREA}
                      />
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      <Input
                        {...register(`items.${idx}.responsiblePerson`)}
                        placeholder="Name / Role"
                        className="h-8 text-[0.8rem]"
                      />
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      <DatePicker
                        value={watch(`items.${idx}.targetCompletionDate`)}
                        onChange={(v) => setValue(`items.${idx}.targetCompletionDate`, v)}
                      />
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      <Select
                        value={watch(`items.${idx}.status`)}
                        onValueChange={(v) => setValue(`items.${idx}.status`, v)}
                      >
                        <SelectTrigger className="h-8 text-[0.8rem]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      <DatePicker
                        value={watch(`items.${idx}.actualCompletionDate`)}
                        onChange={(v) => setValue(`items.${idx}.actualCompletionDate`, v)}
                      />
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      <Input
                        {...register(`items.${idx}.policyReference`)}
                        placeholder="Manual section / policy ID"
                        className="h-8 text-[0.8rem]"
                      />
                    </TableCell>
                    <TableCell className="py-1.5 px-2">
                      <textarea
                        {...register(`items.${idx}.notes`)}
                        className={TEXTAREA}
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
            setFocus(fieldName as Path<ComplianceActionRegisterFormValues>);
          }}
        />
      )}
    </div>
  );
}
