"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/date-picker";
import {
  FormErrorsDisplay,
  FormErrorsSummary,
  FormError,
} from "@/components/forms/FormErrorsDisplay";
import {
  formSchema,
  type TransactionFileDocumentationFormValues,
} from "@/types/transaction-file-documentation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const defaultValues: TransactionFileDocumentationFormValues = {
  brokerageName: "",
  branch: "",
  preparedBy: "",
  datePrepared: new Date().toISOString().split("T")[0],
  reviewedBy: "",
  dateReviewed: "",
  transactionFileNo: "",
  sequentialSalesNo: "",
  mlsNo: "",
  internalRefNo: "",
  transactionType: "",
  otherTransactionType: "",
  status: "",
  civicAddress: "",
  municipality: "",
  province: "",
  postalCode: "",
  vendorNames: "",
  vendorContact: "",
  purchaserNames: "",
  purchaserContact: "",
  mlsListingStartDate: "",
  expiryDate: "",
  dateOfferReceived: "",
  dateOfferAccepted: "",
  scheduledClosingDate: "",
  revisedClosingDate1: "",
  revisedClosingDate2: "",
  actualClosingDate: "",
  deposits: [
    {
      number: "Deposit 1",
      amount: "",
      dateReceived: "",
      method: "",
      dateDeposited: "",
      trustAccount: "",
    },
    {
      number: "Deposit 2",
      amount: "",
      dateReceived: "",
      method: "",
      dateDeposited: "",
      trustAccount: "",
    },
  ],
  totalDeposits: "",
  trustLedgerRef: "",
  didTransactionClose: "",
  disbursements: [
    { description: "Disbursement to Vendor's Lawyer", amount: "", date: "" },
    {
      description: "Disbursement to Brokerage (Commission/Fees)",
      amount: "",
      date: "",
    },
    { description: "Refund to Purchaser (if any)", amount: "", date: "" },
    { description: "Other Disbursements (specify)", amount: "", date: "" },
  ],
  trustBalance: "",
  reasonIfNotClosed: "",
  conditions: [
    { condition: "Financing", status: "", date: "", docInFile: "" },
    { condition: "Inspection", status: "", date: "", docInFile: "" },
    {
      condition: "Sale of Purchaser's Property",
      status: "",
      date: "",
      docInFile: "",
    },
    { condition: "Other 1", status: "", date: "", docInFile: "" },
    { condition: "Other 2", status: "", date: "", docInFile: "" },
  ],
  documents: [
    { document: "Listing Agreement", inFile: "", comments: "" },
    { document: "MLS® Listing Sheet", inFile: "", comments: "" },
    {
      document: "Agreement of Purchase and Sale (APS)",
      inFile: "",
      comments: "",
    },
    { document: "Waivers / Notices of Fulfillment", inFile: "", comments: "" },
    { document: "Amendments to APS or Listing", inFile: "", comments: "" },
    { document: "Trust Deposit Receipts", inFile: "", comments: "" },
    {
      document: "Deposit Direction / Mutual Release (if applicable)",
      inFile: "",
      comments: "",
    },
    {
      document: "Commission Statement / Trade Record Sheet",
      inFile: "",
      comments: "",
    },
    {
      document: "Brokerage Disbursement Instructions / Statements",
      inFile: "",
      comments: "",
    },
    { document: "Inspection Report", inFile: "", comments: "" },
    { document: "Appraisal", inFile: "", comments: "" },
    {
      document: "Direction re: Commission / Referral Agreements",
      inFile: "",
      comments: "",
    },
    {
      document: "Relevant Email / Written Correspondence",
      inFile: "",
      comments: "",
    },
  ],
  missingDocuments: "",
  depositsDepositedWithoutDelay: "",
  depositsDetails: "",
  trustFundsDisbursed: "",
  trustFundsDetails: "",
  trustLedgerAgrees: "",
  trustLedgerDetails: "",
  preparedByName: "",
  preparedSignature: "",
  preparedDate: "",
  reviewedByName: "",
  reviewedSignature: "",
  reviewedDate: "",
};

const INPUT =
  "flex-1 min-w-0 rounded border border-[#d1d5db] text-[0.88rem] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] placeholder:text-gray-400 leading-[1.4]";
const ROW = "flex items-center gap-2";

export default function TransactionFileDocumentationFormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<TransactionFileDocumentationFormValues>({
    resolver: zodResolver(formSchema),
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

  const onSubmit = async (data: TransactionFileDocumentationFormValues) => {
    if (formErrors.length > 0) {
      toast.error(`Please fix ${formErrors.length} error(s) before submitting`);
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Form submitted:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Transaction file documentation saved successfully!");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    const data = form.getValues();
    localStorage.setItem("tfd_draft", JSON.stringify(data));
    toast.success("Draft saved locally");
  };

  const handleCancel = () => {
    window.parent.postMessage(
      { type: "tfd-close-tab", key: "Transaction_File_Documentation_Form" },
      "*",
    );
  };

  const transactionTypes = [
    "Residential Sale",
    "Commercial Sale",
    "Lease – Residential",
    "Lease – Commercial",
    "Farm / Land",
  ];
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleTypeCheck = (type: string, checked: boolean) => {
    const next = checked
      ? [...selectedTypes, type]
      : selectedTypes.filter((t) => t !== type);
    setSelectedTypes(next);
    setValue("transactionType", next.join(", "));
  };

  return (
    <div className="max-w-[1200px] mx-auto bg-white rounded-[10px] shadow-[0_2px_6px_rgba(15,23,42,0.08)] border border-[#d1d5db] p-7 pt-8 pb-8">
      {/* Form Errors Summary */}
      {formErrors.length > 0 && <FormErrorsSummary errors={formErrors} />}

      <header className="border-b-2 border-[#9ca3af] pb-3 mb-3">
        <h1 className="m-0 mb-1 text-[1.25rem] uppercase tracking-[0.08em] text-gray-900">
          Transaction File Documentation
        </h1>
        <p className="m-0 text-[0.9rem] text-gray-600">
          Use this form to document the key elements of each transaction file,
          including identification, property details, parties, trust funds,
          documentation, and compliance review.
        </p>

        <div className="grid grid-cols-1 gap-2 mt-3">
          <div className={ROW}>
            <label className="w-[230px] text-[0.8rem] font-semibold">
              Brokerage Name
            </label>
            <Input
              {...register("brokerageName")}
              className={INPUT}
              placeholder="Enter brokerage name"
            />
          </div>
          <div className={ROW}>
            <label className="w-[230px] text-[0.8rem] font-semibold">
              Branch (if applicable)
            </label>
            <Input
              {...register("branch")}
              className={INPUT}
              placeholder="Enter branch name"
            />
          </div>
          <div className={ROW}>
            <label className="w-[230px] text-[0.8rem] font-semibold">
              Prepared By
            </label>
            <Input
              {...register("preparedBy")}
              className={INPUT}
              placeholder="Enter preparer name"
            />
            <label className="w-[120px] text-[0.8rem] font-semibold ml-3">
              Date Prepared
            </label>
            <DatePicker
              value={watch("datePrepared")}
              onChange={(v) => setValue("datePrepared", v)}
            />
          </div>
          <div className={ROW}>
            <label className="w-[230px] text-[0.8rem] font-semibold">
              Reviewed By
            </label>
            <Input
              {...register("reviewedBy")}
              className={INPUT}
              placeholder="Enter reviewer name"
            />
            <label className="w-[120px] text-[0.8rem] font-semibold ml-3">
              Date Reviewed
            </label>
            <DatePicker
              value={watch("dateReviewed")}
              onChange={(v) => setValue("dateReviewed", v)}
            />
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 1. File Identification */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">
              1
            </span>
            File Identification
          </h2>
          <div className="grid grid-cols-2 gap-y-2 gap-x-5">
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Transaction File No.
              </label>
              <Input
                {...register("transactionFileNo")}
                className={INPUT}
                placeholder="Enter file number"
              />
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Sequential Sales No.
              </label>
              <Input
                {...register("sequentialSalesNo")}
                className={INPUT}
                placeholder="Enter sales number"
              />
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                MLS® / Listing No.
              </label>
              <Input
                {...register("mlsNo")}
                className={INPUT}
                placeholder="Enter MLS number"
              />
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Internal Reference No.
              </label>
              <Input
                {...register("internalRefNo")}
                className={INPUT}
                placeholder="Enter reference number"
              />
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-[0.9rem] uppercase tracking-[0.06em] m-0 mb-3 font-semibold text-gray-700">
              Type of Transaction
            </h3>
            <div className="flex flex-wrap gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              {transactionTypes.map((type) => (
                <label
                  key={type}
                  className="inline-flex items-center gap-2 text-[0.88rem] cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <Checkbox
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={(checked) =>
                      handleTypeCheck(type, !!checked)
                    }
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-[0.9rem] uppercase tracking-[0.06em] m-0 mb-3 font-semibold text-gray-700">
              Status
            </h3>
            <RadioGroup
              value={watch("status")}
              onValueChange={(v) => setValue("status", v)}
              className="flex flex-wrap gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              {[
                "Open",
                "Conditionally Sold",
                "Firm",
                "Did Not Close / Collapsed",
                "Closed & Archived",
              ].map((s) => (
                <div
                  key={s}
                  className="inline-flex items-center gap-2 text-[0.88rem] cursor-pointer"
                >
                  <RadioGroupItem value={s} id={`status-${s}`} />
                  <Label htmlFor={`status-${s}`} className="cursor-pointer">
                    {s}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </section>

        {/* 2. Property Details */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">
              2
            </span>
            Property Details
          </h2>
          <div className="grid grid-cols-1 gap-y-2">
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Civic Address
              </label>
              <Input
                {...register("civicAddress")}
                className={INPUT}
                placeholder="Enter property address"
              />
            </div>
            <div className="grid grid-cols-3 gap-x-5">
              <div className={ROW}>
                <label className="w-[230px] text-[0.8rem] font-semibold">
                  Municipality
                </label>
                <Input
                  {...register("municipality")}
                  className={INPUT}
                  placeholder="Enter municipality"
                />
              </div>
              <div className={ROW}>
                <label className="w-[230px] text-[0.8rem] font-semibold">
                  Province
                </label>
                <Input
                  {...register("province")}
                  className={INPUT}
                  placeholder="Enter province"
                />
              </div>
              <div className={ROW}>
                <label className="w-[230px] text-[0.8rem] font-semibold">
                  Postal Code
                </label>
                <Input
                  {...register("postalCode")}
                  className={INPUT}
                  placeholder="Enter postal code"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Parties */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">
              3
            </span>
            Parties
          </h2>
          <div className="grid grid-cols-1 gap-y-2">
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Vendor(s) Names
              </label>
              <Input
                {...register("vendorNames")}
                className={INPUT}
                placeholder="Enter vendor name(s)"
              />
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Vendor Contact Info
              </label>
              <Textarea
                {...register("vendorContact")}
                className={INPUT}
                rows={3}
                placeholder="Enter vendor contact details"
              />
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Purchaser(s) Names
              </label>
              <Input
                {...register("purchaserNames")}
                className={INPUT}
                placeholder="Enter purchaser name(s)"
              />
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Purchaser Contact Info
              </label>
              <Textarea
                {...register("purchaserContact")}
                className={INPUT}
                rows={3}
                placeholder="Enter purchaser contact details"
              />
            </div>
          </div>
        </section>

        {/* 4. Key Dates */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">
              4
            </span>
            Key Dates
          </h2>
          <div className="grid grid-cols-2 gap-y-2 gap-x-5">
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                MLS® Listing Start Date
              </label>
              <DatePicker
                value={watch("mlsListingStartDate")}
                onChange={(v) => setValue("mlsListingStartDate", v)}
              />
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Expiry Date
              </label>
              <DatePicker
                value={watch("expiryDate")}
                onChange={(v) => setValue("expiryDate", v)}
              />
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Date Offer Received
              </label>
              <DatePicker
                value={watch("dateOfferReceived")}
                onChange={(v) => setValue("dateOfferReceived", v)}
              />
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Date Offer Accepted
              </label>
              <DatePicker
                value={watch("dateOfferAccepted")}
                onChange={(v) => setValue("dateOfferAccepted", v)}
              />
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Scheduled Closing Date (original)
              </label>
              <DatePicker
                value={watch("scheduledClosingDate")}
                onChange={(v) => setValue("scheduledClosingDate", v)}
              />
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Revised Closing Date 1
              </label>
              <DatePicker
                value={watch("revisedClosingDate1")}
                onChange={(v) => setValue("revisedClosingDate1", v)}
              />
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Revised Closing Date 2
              </label>
              <DatePicker
                value={watch("revisedClosingDate2")}
                onChange={(v) => setValue("revisedClosingDate2", v)}
              />
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Actual Closing Date
              </label>
              <DatePicker
                value={watch("actualClosingDate")}
                onChange={(v) => setValue("actualClosingDate", v)}
              />
            </div>
          </div>
        </section>

        {/* 6. Trust Funds – Deposits */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">
              6
            </span>
            Trust Funds – Deposits
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[0.85rem] border-collapse">
              <thead>
                <tr className="bg-[#f0f4f8]">
                  <th className="p-2 text-left font-semibold border border-[#d1d5db]">
                    Deposit #
                  </th>
                  <th className="p-2 text-left font-semibold border border-[#d1d5db]">
                    Amount
                  </th>
                  <th className="p-2 text-left font-semibold border border-[#d1d5db]">
                    Date Received
                  </th>
                  <th className="p-2 text-left font-semibold border border-[#d1d5db]">
                    Method (Cheque/EMT/Other)
                  </th>
                  <th className="p-2 text-left font-semibold border border-[#d1d5db]">
                    Date Deposited to Trust
                  </th>
                  <th className="p-2 text-left font-semibold border border-[#d1d5db]">
                    Trust Account Name & No.
                  </th>
                </tr>
              </thead>
              <tbody>
                {watch("deposits")?.map((_, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-medium border border-[#d1d5db]">{`Deposit ${idx + 1}`}</td>
                    <td className="p-2 border border-[#d1d5db]">
                      <div className="flex items-center gap-1">
                        <span className="text-[0.8rem]">$</span>
                        <Input
                          {...register(`deposits.${idx}.amount`)}
                          type="number"
                          step="0.01"
                          className={INPUT}
                        />
                      </div>
                    </td>
                    <td className="p-2 border border-[#d1d5db]">
                      <DatePicker
                        value={watch(`deposits.${idx}.dateReceived`)}
                        onChange={(v) => setValue(`deposits.${idx}.dateReceived`, v)}
                      />
                    </td>
                    <td className="p-2 border border-[#d1d5db]">
                      <Input
                        {...register(`deposits.${idx}.method`)}
                        className={INPUT}
                      />
                    </td>
                    <td className="p-2 border border-[#d1d5db]">
                      <DatePicker
                        value={watch(`deposits.${idx}.dateDeposited`)}
                        onChange={(v) => setValue(`deposits.${idx}.dateDeposited`, v)}
                      />
                    </td>
                    <td className="p-2 border border-[#d1d5db]">
                      <Input
                        {...register(`deposits.${idx}.trustAccount`)}
                        className={INPUT}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-5 mt-3">
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Total Deposits Held in Trust
              </label>
              <div className="flex items-center gap-1">
                <span className="text-[0.8rem]">$</span>
                <Input
                  {...register("totalDeposits")}
                  type="number"
                  step="0.01"
                  className={INPUT}
                />
              </div>
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Trust Ledger Reference No.
              </label>
              <Input
                {...register("trustLedgerRef")}
                className={INPUT}
                placeholder="Enter ledger reference"
              />
            </div>
          </div>
        </section>

        {/* 7. Trust Funds – Disbursements & Final Reconciliation */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">
              7
            </span>
            Trust Funds – Disbursements & Final Reconciliation
          </h2>
          <div className={ROW + " mb-3"}>
            <label className="w-[300px] text-[0.8rem] font-semibold">
              Did the transaction close? (Yes/No)
            </label>
            <Input
              {...register("didTransactionClose")}
              className={INPUT}
              placeholder="Yes or No"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[0.85rem] border-collapse">
              <thead>
                <tr className="bg-[#f0f4f8]">
                  <th className="p-2 text-left font-semibold border border-[#d1d5db]">
                    Description
                  </th>
                  <th className="p-2 text-left font-semibold border border-[#d1d5db]">
                    Amount
                  </th>
                  <th className="p-2 text-left font-semibold border border-[#d1d5db]">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {watch("disbursements")?.map((d, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border border-[#d1d5db]">{d.description}</td>
                    <td className="p-2 border border-[#d1d5db]">
                      <Input
                        {...register(`disbursements.${idx}.amount`)}
                        type="number"
                        step="0.01"
                        className={INPUT}
                      />
                    </td>
                    <td className="p-2 border border-[#d1d5db]">
                      <DatePicker
                        value={watch(`disbursements.${idx}.date`)}
                        onChange={(v) => setValue(`disbursements.${idx}.date`, v)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 gap-y-2 mt-3">
            <div className={ROW}>
              <label className="w-[300px] text-[0.8rem] font-semibold">
                Trust Balance After Final Disbursement
              </label>
              <div className="flex items-center gap-1">
                <span className="text-[0.8rem]">$</span>
                <Input
                  {...register("trustBalance")}
                  type="number"
                  step="0.01"
                  className={INPUT}
                />
              </div>
            </div>
            <div className={ROW}>
              <label className="w-[300px] text-[0.8rem] font-semibold">
                If did not close – Reason and Deposit Direction
              </label>
              <Textarea
                {...register("reasonIfNotClosed")}
                className={INPUT}
                rows={3}
                placeholder="Enter reason and deposit direction"
              />
            </div>
          </div>
        </section>

        {/* 8. Conditions & Waivers */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">
              8
            </span>
            Conditions & Waivers
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[0.85rem] border-collapse">
              <thead>
                <tr className="bg-[#f0f4f8]">
                  <th className="p-2 text-left font-semibold border border-[#d1d5db]">
                    Condition
                  </th>
                  <th className="p-2 text-left font-semibold border border-[#d1d5db]">
                    Fulfilled / Waived / N/A
                  </th>
                  <th className="p-2 text-left font-semibold border border-[#d1d5db]">
                    Date
                  </th>
                  <th className="p-2 text-left font-semibold border border-[#d1d5db]">
                    Doc in File (Y/N)
                  </th>
                </tr>
              </thead>
              <tbody>
                {watch("conditions")?.map((c, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border border-[#d1d5db]">{c.condition}</td>
                    <td className="p-2 border border-[#d1d5db]">
                      <Input
                        {...register(`conditions.${idx}.status`)}
                        className={INPUT}
                      />
                    </td>
                    <td className="p-2 border border-[#d1d5db]">
                      <DatePicker
                        value={watch(`conditions.${idx}.date`)}
                        onChange={(v) => setValue(`conditions.${idx}.date`, v)}
                      />
                    </td>
                    <td className="p-2 border border-[#d1d5db]">
                      <Input
                        {...register(`conditions.${idx}.docInFile`)}
                        className={INPUT}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 9. Key Documents Checklist */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">
              9
            </span>
            Key Documents Checklist
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[0.85rem] border-collapse">
              <thead>
                <tr className="bg-[#f0f4f8]">
                  <th className="p-2 text-left font-semibold border border-[#d1d5db]">
                    Document
                  </th>
                  <th className="p-2 text-left font-semibold border border-[#d1d5db]">
                    In File (Y/N)
                  </th>
                  <th className="p-2 text-left font-semibold border border-[#d1d5db]">
                    Comments / Location
                  </th>
                </tr>
              </thead>
              <tbody>
                {watch("documents")?.map((doc, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border border-[#d1d5db]">{doc.document}</td>
                    <td className="p-2 border border-[#d1d5db]">
                      <Input
                        {...register(`documents.${idx}.inFile`)}
                        className={INPUT}
                      />
                    </td>
                    <td className="p-2 border border-[#d1d5db]">
                      <Input
                        {...register(`documents.${idx}.comments`)}
                        className={INPUT}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={ROW + " mt-3"}>
            <label className="w-[300px] text-[0.8rem] font-semibold">
              Missing Documents / Exceptions
            </label>
            <Textarea
              {...register("missingDocuments")}
              className={INPUT}
              rows={3}
              placeholder="List any missing documents or exceptions"
            />
          </div>
        </section>

        {/* 10. Compliance Review */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">
              10
            </span>
            Compliance Review
          </h2>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className={ROW + " mb-2"}>
                <label className="w-[400px] text-[0.8rem] font-semibold">
                  Were all deposits deposited into trust without delay? (Yes/No)
                </label>
                <Input
                  {...register("depositsDepositedWithoutDelay")}
                  className={INPUT}
                  placeholder="Yes or No"
                />
              </div>
              <div className={ROW}>
                <label className="w-[120px] text-[0.8rem] font-semibold">
                  Details if No
                </label>
                <Textarea
                  {...register("depositsDetails")}
                  className={INPUT}
                  rows={2}
                  placeholder="Provide details"
                />
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className={ROW + " mb-2"}>
                <label className="w-[400px] text-[0.8rem] font-semibold">
                  Were trust funds disbursed in accordance with terms received? (Yes/No)
                </label>
                <Input
                  {...register("trustFundsDisbursed")}
                  className={INPUT}
                  placeholder="Yes or No"
                />
              </div>
              <div className={ROW}>
                <label className="w-[120px] text-[0.8rem] font-semibold">
                  Details if No
                </label>
                <Textarea
                  {...register("trustFundsDetails")}
                  className={INPUT}
                  rows={2}
                  placeholder="Provide details"
                />
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className={ROW + " mb-2"}>
                <label className="w-[400px] text-[0.8rem] font-semibold">
                  Does trust ledger balance agree with monthly trust bank reconciliation? (Yes/No)
                </label>
                <Input
                  {...register("trustLedgerAgrees")}
                  className={INPUT}
                  placeholder="Yes or No"
                />
              </div>
              <div className={ROW}>
                <label className="w-[120px] text-[0.8rem] font-semibold">
                  Details / follow-up
                </label>
                <Textarea
                  {...register("trustLedgerDetails")}
                  className={INPUT}
                  rows={2}
                  placeholder="Provide details"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 11. Sign-Off */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">
              11
            </span>
            Sign-Off
          </h2>
          <div className="grid grid-cols-2 gap-y-2 gap-x-5">
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Prepared By (Name)
              </label>
              <Input
                {...register("preparedByName")}
                className={INPUT}
                placeholder="Enter preparer name"
              />
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Signature
              </label>
              <Input
                {...register("preparedSignature")}
                className={INPUT}
                placeholder="Enter signature"
              />
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Date
              </label>
              <DatePicker
                value={watch("preparedDate")}
                onChange={(v) => setValue("preparedDate", v)}
              />
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Reviewed By (Manager/Broker)
              </label>
              <Input
                {...register("reviewedByName")}
                className={INPUT}
                placeholder="Enter reviewer name"
              />
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Signature
              </label>
              <Input
                {...register("reviewedSignature")}
                className={INPUT}
                placeholder="Enter signature"
              />
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Date
              </label>
              <DatePicker
                value={watch("reviewedDate")}
                onChange={(v) => setValue("reviewedDate", v)}
              />
            </div>
          </div>
        </section>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="hover:bg-red-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="hover:bg-amber-50"
          >
            Save Draft
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit Form"}
          </Button>
        </div>
      </form>

      {/* Floating Error Panel */}
      {formErrors.length > 0 && (
        <FormErrorsDisplay
          errors={formErrors}
          onClose={() => {}}
          onFieldClick={(fieldName) => {
            setFocus(fieldName as any);
          }}
        />
      )}
    </div>
  );
}
