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
  FormError,
} from "@/components/forms/FormErrorsDisplay";
import {
  salesRecordSheetSchema,
  type SalesRecordSheetFormValues,
} from "@/types/sales-record-sheet";

const defaultValues: SalesRecordSheetFormValues = {
  dealStatus: "Firm",
  salesFileNo: "",
  mlsNo: "",

  vendorEntries: [{ entityType: "individual", identifierType: "name", name: "" }],
  vendorTel: "",
  vendorEmail: "",
  purchaserEntries: [{ entityType: "individual", identifierType: "name", name: "" }],
  purchaserTel: "",
  purchaserEmail: "",

  unitNumber: "",
  streetNumber: "",
  streetName: "",
  city: "",
  province: "",
  postalCode: "",

  listingSide: "L",
  purchasePrice: "",

  commissionType: "rate",
  commissionRate: "",
  commissionAmount: "",

  listingAgreementDate: "",
  apsDate: "",
  scheduledClosingDate: "",
  revisedClosingNotes: "",

  deposits: [
    { depositNo: "Deposit 1", amount: "", dateReceived: "", method: "Cash", dateToTrust: "", bankRef: "", trustReceipt: "", ledgerRef: "" },
  ],

  conditions: "",
  conditionsMetDate: "",
  trustDisbursementDate: "",
  disbursedTo: "",
  fileClosedDate: "",

  preparedBy: "",
  preparedDate: "",
  managerReviewBy: "",
  reviewDate: "",
  managerNotes: "",
};

const INPUT =
  "flex-1 min-w-0 rounded border border-[#d1d5db] text-[0.88rem] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] placeholder:text-gray-400 leading-[1.4]";
const ROW = "flex items-center gap-2";

export default function SalesRecordSheetTemplatePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SalesRecordSheetFormValues>({
    resolver: zodResolver(salesRecordSheetSchema),
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

  const vendorFields = useFieldArray({ control, name: "vendorEntries" });
  const purchaserFields = useFieldArray({ control, name: "purchaserEntries" });
  const depositFields = useFieldArray({ control, name: "deposits" });

  const commissionType = watch("commissionType");

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

  const onSubmit = async (data: SalesRecordSheetFormValues) => {
    if (formErrors.length > 0) {
      toast.error(`Please fix ${formErrors.length} error(s) before submitting`);
      return;
    }
    setIsSubmitting(true);
    try {
      console.log("Form submitted:", data);
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Sales Record Sheet saved successfully!");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("srs_draft", JSON.stringify(form.getValues()));
    toast.success("Draft saved locally");
  };

  const handleCancel = () => {
    window.parent.postMessage(
      { type: "tfd-close-tab", key: "Sales_Record_Sheet_Template" },
      "*",
    );
  };

  const renderEntryRow = (
    entry: { id: string; entityType: string; identifierType: string; name: string },
    index: number,
    type: "vendor" | "purchaser",
  ) => {
    const entityTypePath = `${type}Entries.${index}.entityType` as Path<SalesRecordSheetFormValues>;
    const identifierTypePath = `${type}Entries.${index}.identifierType` as Path<SalesRecordSheetFormValues>;
    const namePath = `${type}Entries.${index}.name` as Path<SalesRecordSheetFormValues>;
    const fields = type === "vendor" ? vendorFields : purchaserFields;

    return (
      <div key={entry.id} className="grid grid-cols-[90px_110px_1fr_28px] gap-2 items-center">
        <Select value={String(watch(entityTypePath))} onValueChange={(v) => setValue(entityTypePath, v)}>
          <SelectTrigger className="h-8 text-[0.8rem]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="org">Org</SelectItem>
          </SelectContent>
        </Select>
        <Select value={String(watch(identifierTypePath))} onValueChange={(v) => setValue(identifierTypePath, v)}>
          <SelectTrigger className="h-8 text-[0.8rem]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value={`${type}Id`}>{type === "vendor" ? "Vendor ID" : "Purchaser ID"}</SelectItem>
          </SelectContent>
        </Select>
        <Input
          {...register(namePath)}
          className="h-8 text-[0.88rem]"
          placeholder={`${type === "vendor" ? "Vendor" : "Purchaser"} name`}
        />
        {fields.fields.length > 1 && (
          <button
            type="button"
            onClick={() => fields.remove(index)}
            className="text-gray-300 hover:text-red-500 transition-colors p-0 leading-none flex items-center justify-center"
            title="Remove"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto bg-white rounded-[10px] shadow-[0_2px_6px_rgba(15,23,42,0.08)] border border-[#d1d5db] p-7 pt-8 pb-8">
      {formErrors.length > 0 && <FormErrorsSummary errors={formErrors} />}

      <header className="border-b-2 border-[#9ca3af] pb-3 mb-3">
        <h1 className="m-0 mb-1 text-[1.25rem] uppercase tracking-[0.08em] text-gray-900">
          Sales Record Sheet
        </h1>
        <p className="m-0 text-[0.9rem] text-gray-600">
          Use this sheet to capture key details for each sales transaction,
          including file information, parties, deposits, status and
          disbursement. One sheet per sales file.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Section 1: File Information */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">1</span>
            File Information
          </h2>
          <div className="grid grid-cols-3 gap-x-5">
            <div className={ROW}>
              <label className="w-[120px] text-[0.8rem] font-semibold flex-none">Deal Status</label>
              <Select value={watch("dealStatus")} onValueChange={(v) => setValue("dealStatus", v)}>
                <SelectTrigger className={INPUT}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Firm">Firm</SelectItem>
                  <SelectItem value="Collapsed">Collapsed</SelectItem>
                  <SelectItem value="Not Proceeded">Not Proceeded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FormField label="Sales File #" placeholder="" error={errors.salesFileNo?.message} {...register("salesFileNo")} />
            <FormField label="MLS #" placeholder="" error={errors.mlsNo?.message} {...register("mlsNo")} />
          </div>
        </section>

        {/* Section 2: Parties */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">2</span>
            Parties
          </h2>
          <div className="grid grid-cols-1 gap-y-3">
            <div>
              <label className="text-[0.8rem] font-semibold block mb-1">Vendor(s) Names</label>
              <div className="flex flex-col gap-2">
                {vendorFields.fields.map((field, index) => renderEntryRow(field, index, "vendor"))}
              </div>
              <button
                type="button"
                onClick={() => vendorFields.append({ entityType: "individual", identifierType: "name", name: "" })}
                className="mt-2 text-gray-400 hover:text-[#1f4f8f] transition-colors p-0 leading-none flex items-center gap-1 text-[0.8rem]"
              >
                <Plus className="h-3 w-3" />
                Add Vendor
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-5">
              <FormField label="Vendor Tel" placeholder="+1 (555) 123-4567" type="tel" error={errors.vendorTel?.message} {...register("vendorTel")} />
              <FormField label="Vendor Email" placeholder="name@example.com" type="email" error={errors.vendorEmail?.message} {...register("vendorEmail")} />
            </div>
            <div>
              <label className="text-[0.8rem] font-semibold block mb-1">Purchaser(s) Names</label>
              <div className="flex flex-col gap-2">
                {purchaserFields.fields.map((field, index) => renderEntryRow(field, index, "purchaser"))}
              </div>
              <button
                type="button"
                onClick={() => purchaserFields.append({ entityType: "individual", identifierType: "name", name: "" })}
                className="mt-2 text-gray-400 hover:text-[#1f4f8f] transition-colors p-0 leading-none flex items-center gap-1 text-[0.8rem]"
              >
                <Plus className="h-3 w-3" />
                Add Purchaser
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-5">
              <FormField label="Purchaser Tel" placeholder="+1 (555) 123-4567" type="tel" error={errors.purchaserTel?.message} {...register("purchaserTel")} />
              <FormField label="Purchaser Email" placeholder="name@example.com" type="email" error={errors.purchaserEmail?.message} {...register("purchaserEmail")} />
            </div>
          </div>
        </section>

        {/* Section 3: Property & Transaction Details */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">3</span>
            Property &amp; Transaction Details
          </h2>
          <div className="grid grid-cols-1 gap-y-2">
            {/* Property Address */}
            <div className="grid grid-cols-[70px_90px_1fr_150px_90px_120px] gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[0.75rem] text-gray-500 font-medium">Unit</label>
                <input type="text" {...register("unitNumber")} className={INPUT + " text-center"} placeholder="00000" maxLength={5} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[0.75rem] text-gray-500 font-medium">Street Number</label>
                <input type="text" {...register("streetNumber")} className={INPUT + " text-center"} placeholder="00000" maxLength={5} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[0.75rem] text-gray-500 font-medium">Street Name</label>
                <input type="text" {...register("streetName")} className={INPUT} placeholder="Street Name" maxLength={50} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[0.75rem] text-gray-500 font-medium">City</label>
                <Select value={watch("city")} onValueChange={(v) => setValue("city", v)}>
                  <SelectTrigger className={INPUT}><SelectValue placeholder="City" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Toronto">Toronto</SelectItem>
                    <SelectItem value="Ottawa">Ottawa</SelectItem>
                    <SelectItem value="Montreal">Montreal</SelectItem>
                    <SelectItem value="Vancouver">Vancouver</SelectItem>
                    <SelectItem value="Calgary">Calgary</SelectItem>
                    <SelectItem value="Edmonton">Edmonton</SelectItem>
                    <SelectItem value="Winnipeg">Winnipeg</SelectItem>
                    <SelectItem value="Halifax">Halifax</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[0.75rem] text-gray-500 font-medium">Prov</label>
                <Select value={watch("province")} onValueChange={(v) => setValue("province", v)}>
                  <SelectTrigger className={INPUT}><SelectValue placeholder="Prov" /></SelectTrigger>
                  <SelectContent>
                    {["ON","QC","BC","AB","SK","MB","NS","NB","PE","NL","YT","NT","NU"].map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[0.75rem] text-gray-500 font-medium">Postal Code</label>
                <input type="text" {...register("postalCode")} className={INPUT} placeholder="E5L 1R1" maxLength={7} />
              </div>
            </div>

            {/* Listing Side & Purchase Price */}
            <div className="grid grid-cols-2 gap-x-5">
              <div className={ROW}>
                <label className="w-[160px] text-[0.8rem] font-semibold flex-none">Listing Side</label>
                <Select value={watch("listingSide")} onValueChange={(v) => setValue("listingSide", v)}>
                  <SelectTrigger className={INPUT}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className={ROW}>
                <label className="w-[160px] text-[0.8rem] font-semibold flex-none">Purchase Price</label>
                <div className="inline-flex items-center border border-[#d1d5db] rounded overflow-hidden bg-white">
                  <span className="px-2 py-1.5 bg-gray-100 border-r border-[#d1d5db] text-[0.88rem]">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("purchasePrice")}
                    className="flex-1 min-w-0 px-2 py-1.5 border-none rounded-none text-[0.88rem] bg-white focus:outline-[#1f4f8f]"
                  />
                </div>
              </div>
            </div>

            {/* Commission */}
            <div className={ROW + " items-start"}>
              <label className="w-[160px] text-[0.8rem] font-semibold flex-none mt-1.5">Commission</label>
              <div className="flex gap-2 flex-1">
                <div className="w-[130px]">
                  <Select value={watch("commissionType")} onValueChange={(v) => setValue("commissionType", v)}>
                    <SelectTrigger className={INPUT}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rate">Rate (%)</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {commissionType === "rate" ? (
                  <div className="inline-flex items-center border border-[#d1d5db] rounded overflow-hidden bg-white">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      {...register("commissionRate")}
                      className="w-[100px] px-2 py-1.5 border-none rounded-none text-[0.88rem] bg-white focus:outline-[#1f4f8f] text-right"
                    />
                    <span className="px-2 py-1.5 bg-gray-100 border-l border-[#d1d5db] text-[0.88rem]">%</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center border border-[#d1d5db] rounded overflow-hidden bg-white">
                    <span className="px-2 py-1.5 bg-gray-100 border-r border-[#d1d5db] text-[0.88rem]">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register("commissionAmount")}
                      className="w-[120px] px-2 py-1.5 border-none rounded-none text-[0.88rem] bg-white focus:outline-[#1f4f8f]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-3 gap-x-5">
              <div className={ROW}>
                <label className="w-[140px] text-[0.8rem] font-semibold flex-none">Listing Agreement</label>
                <DatePicker value={watch("listingAgreementDate")} onChange={(v) => setValue("listingAgreementDate", v)} />
              </div>
              <div className={ROW}>
                <label className="w-[80px] text-[0.8rem] font-semibold flex-none">APS Date</label>
                <DatePicker value={watch("apsDate")} onChange={(v) => setValue("apsDate", v)} />
              </div>
              <div className={ROW}>
                <label className="w-[140px] text-[0.8rem] font-semibold flex-none">Scheduled Closing</label>
                <DatePicker value={watch("scheduledClosingDate")} onChange={(v) => setValue("scheduledClosingDate", v)} />
              </div>
            </div>

            {/* Revised Closing Notes */}
            <FormTextarea
              label="Revised Closing Dates / Notes"
              {...register("revisedClosingNotes")}
              className="min-h-[60px]"
              placeholder=""
            />
          </div>
        </section>

        {/* Section 4: Deposit Details */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="m-0 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">4</span>
              Deposit Details
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-[#1f4f8f] border-[#1f4f8f] hover:bg-[#e6f0ff]"
              onClick={() => depositFields.append({ depositNo: `Deposit ${depositFields.fields.length + 1}`, amount: "", dateReceived: "", method: "Cash", dateToTrust: "", bankRef: "", trustReceipt: "", ledgerRef: "" })}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Deposit
            </Button>
          </div>
          <p className="text-[0.8rem] text-gray-500 m-0 mb-3">
            Record each deposit related to this file. Add additional rows as needed.
          </p>
          <Table className="border border-[#d1d5db] rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow className="bg-[#eef2ff] hover:bg-[#eef2ff]">
                <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold">Deposit #</TableHead>
                <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold">Amount</TableHead>
                <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold">Date Received</TableHead>
                <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold">Method</TableHead>
                <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold">Date to Trust</TableHead>
                <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold">Bank Ref #</TableHead>
                <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold">Receipt #</TableHead>
                <TableHead className="h-9 text-[0.7rem] uppercase tracking-wider text-gray-600 font-semibold">Ledger Ref</TableHead>
                <TableHead className="h-9 w-[30px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {depositFields.fields.map((field, idx) => (
                <TableRow key={field.id} className="hover:bg-transparent">
                  <TableCell className="py-1.5 px-2">
                    <Input
                      {...register(`deposits.${idx}.depositNo`)}
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
                        {...register(`deposits.${idx}.amount`)}
                        className="h-8 text-[0.8rem] rounded-l-none text-right"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="py-1.5 px-2">
                    <DatePicker value={watch(`deposits.${idx}.dateReceived`)} onChange={(v) => setValue(`deposits.${idx}.dateReceived`, v)} />
                  </TableCell>
                  <TableCell className="py-1.5 px-2">
                    <Select value={watch(`deposits.${idx}.method`)} onValueChange={(v) => setValue(`deposits.${idx}.method`, v)}>
                      <SelectTrigger className="h-8 text-[0.8rem]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                        <SelectItem value="EMT">EMT</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="py-1.5 px-2">
                    <DatePicker value={watch(`deposits.${idx}.dateToTrust`)} onChange={(v) => setValue(`deposits.${idx}.dateToTrust`, v)} />
                  </TableCell>
                  <TableCell className="py-1.5 px-2">
                    <Input
                      {...register(`deposits.${idx}.bankRef`)}
                      className="h-8 text-[0.8rem]"
                    />
                  </TableCell>
                  <TableCell className="py-1.5 px-2">
                    <Input
                      {...register(`deposits.${idx}.trustReceipt`)}
                      className="h-8 text-[0.8rem]"
                    />
                  </TableCell>
                  <TableCell className="py-1.5 px-2">
                    <Input
                      {...register(`deposits.${idx}.ledgerRef`)}
                      className="h-8 text-[0.8rem]"
                    />
                  </TableCell>
                  <TableCell className="py-1.5 px-1 w-[30px]">
                    {depositFields.fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => depositFields.remove(idx)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-0 leading-none"
                        title="Remove deposit"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        {/* Section 5: Deal Status / Conditions */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">5</span>
            Deal Status / Conditions
          </h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-2">
            <div className="col-span-2">
              <FormTextarea
                label="Conditions (e.g. Financing, Inspection)"
                {...register("conditions")}
                className="min-h-[60px]"
                placeholder=""
              />
            </div>
            <div className={ROW}>
              <label className="w-[180px] text-[0.8rem] font-semibold flex-none">Conditions Met Date</label>
              <DatePicker value={watch("conditionsMetDate")} onChange={(v) => setValue("conditionsMetDate", v)} />
            </div>
            <div className={ROW}>
              <label className="w-[180px] text-[0.8rem] font-semibold flex-none">Trust Disbursement Date</label>
              <DatePicker value={watch("trustDisbursementDate")} onChange={(v) => setValue("trustDisbursementDate", v)} />
            </div>
            <div className="col-span-2">
              <FormField label="Disbursed To" placeholder="" error={errors.disbursedTo?.message} {...register("disbursedTo")} />
            </div>
            <div className={ROW}>
              <label className="w-[140px] text-[0.8rem] font-semibold flex-none">File Closed Date</label>
              <DatePicker value={watch("fileClosedDate")} onChange={(v) => setValue("fileClosedDate", v)} />
            </div>
          </div>
        </section>

        {/* Section 6: Prepared & Review */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">6</span>
            Prepared &amp; Review
          </h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-2">
            <FormField label="Prepared By" placeholder="" error={errors.preparedBy?.message} {...register("preparedBy")} />
            <div className={ROW}>
              <label className="w-[120px] text-[0.8rem] font-semibold flex-none">Prepared Date</label>
              <DatePicker value={watch("preparedDate")} onChange={(v) => setValue("preparedDate", v)} />
            </div>
            <FormField label="Manager Review By" placeholder="" error={errors.managerReviewBy?.message} {...register("managerReviewBy")} />
            <div className={ROW}>
              <label className="w-[120px] text-[0.8rem] font-semibold flex-none">Review Date</label>
              <DatePicker value={watch("reviewDate")} onChange={(v) => setValue("reviewDate", v)} />
            </div>
          </div>
          <div className="mt-2">
            <FormTextarea
              label="Manager Review Notes"
              {...register("managerNotes")}
              className="min-h-[60px]"
              placeholder=""
            />
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
            setFocus(fieldName as Path<SalesRecordSheetFormValues>);
          }}
        />
      )}
    </div>
  );
}
