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
