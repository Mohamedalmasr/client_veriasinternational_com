"use client";

import { useState, useMemo } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/date-picker";
import { FormField } from "@/components/forms/FormField";
import { FormTextarea } from "@/components/forms/FormTextarea";
import {
  FormErrorsDisplay,
  FormErrorsSummary,
  FormError,
} from "@/components/forms/FormErrorsDisplay";
import {
  thirdPartyDepositSchema,
  type ThirdPartyDepositFormValues,
} from "@/types/third-party-deposit";

const defaultValues: ThirdPartyDepositFormValues = {
  brokerageName: "",

  transactionFileNo: "",
  propertyAddress1: "",
  propertyAddress2: "",
  apsDate: "",
  purchaser1: "",
  purchaser2: "",
  vendor1: "",
  vendor2: "",

  thirdPartyName: "",
  relationshipToPurchaser: "",
  thirdPartyAddress1: "",
  thirdPartyAddress2: "",
  thirdPartyPhone: "",
  thirdPartyEmail: "",

  depositAmount: "",
  depositFormCash: false,
  depositFormCheque: false,
  depositFormBankDraft: false,
  depositFormInterac: false,
  depositFormOther: false,
  depositFormOtherText: "",
  depositReceivedDate: "",

  closesDirection: false,
  closesOther: "",

  depositReturnTo: "",
  depositReturnOther: "",

  releasedToSeller: false,
  additionalTerms: "",

  thirdPartySignature: "",
  thirdPartyPrintName: "",
  thirdPartyDate: "",

  purchaser1Signature: "",
  purchaser1PrintName: "",
  purchaser1Date: "",
  purchaser2Signature: "",
  purchaser2PrintName: "",
  purchaser2Date: "",
  additionalPurchasers: "",

  brokerageNameAck: "",
  brokerageRepName: "",
  brokerageRepTitle: "",
  brokerageRepSignature: "",
  brokerageRepDate: "",
};

const INPUT =
  "flex-1 min-w-0 rounded border border-[#d1d5db] text-[0.88rem] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] placeholder:text-gray-400 leading-[1.4]";
const ROW = "flex items-center gap-2";

export default function ThirdPartyDepositAcknowledgementFormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ThirdPartyDepositFormValues>({
    resolver: zodResolver(thirdPartyDepositSchema),
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

  const onSubmit = async (data: ThirdPartyDepositFormValues) => {
    if (formErrors.length > 0) {
      toast.error(`Please fix ${formErrors.length} error(s) before submitting`);
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Form submitted:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Third-Party Deposit Acknowledgement saved successfully!");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    const data = form.getValues();
    localStorage.setItem("tpd_draft", JSON.stringify(data));
    toast.success("Draft saved locally");
  };

  const handleCancel = () => {
    window.parent.postMessage(
      { type: "tfd-close-tab", key: "Third_Party_Deposit_Acknowledgement_Form" },
      "*",
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto bg-white rounded-[10px] shadow-[0_2px_6px_rgba(15,23,42,0.08)] border border-[#d1d5db] p-7 pt-8 pb-8">
      {formErrors.length > 0 && <FormErrorsSummary errors={formErrors} />}

      <header className="border-b-2 border-[#9ca3af] pb-3 mb-3">
        <h1 className="m-0 mb-1 text-[1.25rem] uppercase tracking-[0.08em] text-gray-900">
          Third-Party Deposit Acknowledgement Form
        </h1>
        <p className="m-0 text-[0.9rem] text-gray-600">
          To be completed for any deposit received from someone who is not a party
          to the Agreement of Purchase and Sale and placed in the transaction file.
        </p>

        <div className="grid grid-cols-1 gap-1 mt-3">
          <FormField
            label="Brokerage Name"
            placeholder="Enter brokerage name"
            error={errors.brokerageName?.message}
            {...register("brokerageName")}
          />
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Section 1: Transaction Details */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">
              1
            </span>
            Transaction Details
          </h2>
          <div className="grid grid-cols-1 gap-y-2">
            <FormField
              label="Transaction / File No."
              placeholder="Enter file number"
              error={errors.transactionFileNo?.message}
              {...register("transactionFileNo")}
            />
            <FormField
              label="Property Address"
              placeholder="Line 1"
              error={errors.propertyAddress1?.message}
              {...register("propertyAddress1")}
            />
            <div className={ROW + " pl-[146px]"}>
              <input
                type="text"
                {...register("propertyAddress2")}
                className={INPUT}
                placeholder="Line 2 (optional)"
              />
            </div>
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold flex-none">
                APS Date
              </label>
              <DatePicker
                value={watch("apsDate")}
                onChange={(v) => setValue("apsDate", v)}
              />
              <span className="text-[0.8rem] text-gray-500">YYYY-MM-DD</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-5 mt-3">
            <div>
              <div className="text-[0.9rem] font-semibold mb-1">
                Purchaser(s) (as named in APS)
              </div>
              <div className="grid grid-cols-1 gap-y-1">
                <FormField
                  label="Purchaser 1"
                  placeholder=""
                  error={errors.purchaser1?.message}
                  {...register("purchaser1")}
                />
                <FormField
                  label="Purchaser 2"
                  placeholder=""
                  error={errors.purchaser2?.message}
                  {...register("purchaser2")}
                />
              </div>
            </div>
            <div>
              <div className="text-[0.9rem] font-semibold mb-1">
                Vendor(s) (as named in APS)
              </div>
              <div className="grid grid-cols-1 gap-y-1">
                <FormField
                  label="Vendor 1"
                  placeholder=""
                  error={errors.vendor1?.message}
                  {...register("vendor1")}
                />
                <FormField
                  label="Vendor 2"
                  placeholder=""
                  error={errors.vendor2?.message}
                  {...register("vendor2")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Third-Party Payor Information */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">
              2
            </span>
            Third-Party Payor Information
          </h2>
          <div className="grid grid-cols-1 gap-y-2">
            <FormField
              label="Name of Third-Party Payor"
              placeholder="Enter full name"
              error={errors.thirdPartyName?.message}
              {...register("thirdPartyName")}
            />
            <FormField
              label="Relationship to Purchaser(s)"
              placeholder="e.g., Parent, Friend, Employer"
              error={errors.relationshipToPurchaser?.message}
              {...register("relationshipToPurchaser")}
            />
            <FormField
              label="Mailing Address"
              placeholder="Line 1"
              error={errors.thirdPartyAddress1?.message}
              {...register("thirdPartyAddress1")}
            />
            <div className={ROW + " pl-[146px]"}>
              <input
                type="text"
                {...register("thirdPartyAddress2")}
                className={INPUT}
                placeholder="Line 2 (optional)"
              />
            </div>
            <div className="grid grid-cols-2 gap-x-5">
              <FormField
                label="Phone"
                placeholder=""
                type="tel"
                error={errors.thirdPartyPhone?.message}
                {...register("thirdPartyPhone")}
              />
              <FormField
                label="Email"
                placeholder=""
                type="email"
                error={errors.thirdPartyEmail?.message}
                {...register("thirdPartyEmail")}
              />
            </div>
          </div>
        </section>

        {/* Section 3: Deposit Details */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">
              3
            </span>
            Deposit Details
          </h2>
          <div className="grid grid-cols-1 gap-y-3">
            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold">
                Amount of Deposit
              </label>
              <div className="inline-flex items-center border border-[#d1d5db] rounded overflow-hidden bg-white">
                <span className="px-2 py-1.5 bg-gray-100 border-r border-[#d1d5db] text-[0.88rem]">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("depositAmount")}
                  className="flex-1 min-w-0 px-2 py-1.5 border-none rounded-none text-[0.88rem] bg-white focus:outline-[#1f4f8f]"
                />
              </div>
            </div>

            <div>
              <label className="w-[230px] text-[0.8rem] font-semibold block mb-2">
                Form of Deposit
              </label>
              <div className="flex flex-wrap gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <label className="inline-flex items-center gap-2 text-[0.88rem] cursor-pointer hover:text-blue-600 transition-colors">
                  <Checkbox
                    checked={watch("depositFormCash")}
                    onCheckedChange={(checked) =>
                      setValue("depositFormCash", !!checked)
                    }
                  />
                  <span>Cash</span>
                </label>
                <label className="inline-flex items-center gap-2 text-[0.88rem] cursor-pointer hover:text-blue-600 transition-colors">
                  <Checkbox
                    checked={watch("depositFormCheque")}
                    onCheckedChange={(checked) =>
                      setValue("depositFormCheque", !!checked)
                    }
                  />
                  <span>Cheque</span>
                </label>
                <label className="inline-flex items-center gap-2 text-[0.88rem] cursor-pointer hover:text-blue-600 transition-colors">
                  <Checkbox
                    checked={watch("depositFormBankDraft")}
                    onCheckedChange={(checked) =>
                      setValue("depositFormBankDraft", !!checked)
                    }
                  />
                  <span>Bank Draft</span>
                </label>
                <label className="inline-flex items-center gap-2 text-[0.88rem] cursor-pointer hover:text-blue-600 transition-colors">
                  <Checkbox
                    checked={watch("depositFormInterac")}
                    onCheckedChange={(checked) =>
                      setValue("depositFormInterac", !!checked)
                    }
                  />
                  <span>Interac e-Transfer</span>
                </label>
                <label className="inline-flex items-center gap-2 text-[0.88rem]">
                  <Checkbox
                    checked={watch("depositFormOther")}
                    onCheckedChange={(checked) =>
                      setValue("depositFormOther", !!checked)
                    }
                  />
                  <span>Other:</span>
                  <input
                    type="text"
                    {...register("depositFormOtherText")}
                    className="w-[180px] px-2 py-1 rounded border border-gray-300 text-[0.85rem]"
                    placeholder="Specify"
                  />
                </label>
              </div>
            </div>

            <div className={ROW}>
              <label className="w-[230px] text-[0.8rem] font-semibold flex-none">
                Date Deposit Received by Brokerage
              </label>
              <DatePicker
                value={watch("depositReceivedDate")}
                onChange={(v) => setValue("depositReceivedDate", v)}
              />
              <span className="text-[0.8rem] text-gray-500">YYYY-MM-DD</span>
            </div>
          </div>
        </section>

        {/* Section 4: Purpose and Authority */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">
              4
            </span>
            Purpose and Authority
          </h2>
          <div className="space-y-3">
            <p className="text-[0.92rem] text-gray-600 m-0">
              I/We, the undersigned Third-Party Payor, confirm that the Deposit
              described above is being paid to:
            </p>
            <FormField
              label="Name of Brokerage"
              placeholder="Enter brokerage name"
              error={errors.brokerageName?.message}
              {...register("brokerageName")}
            />
            <p className="text-[0.92rem] text-gray-600 m-0">
              on behalf of the Purchaser(s) named in Section 1, in connection
              with the APS for the property described above.
            </p>
            <p className="text-[0.92rem] text-gray-600 m-0">
              I/We acknowledge and agree that:
            </p>
            <ul className="ml-6 text-[0.9rem] text-gray-600 space-y-1">
              <li>
                The Deposit is held in the Brokerage&apos;s trust account in
                accordance with the APS and applicable legislation.
              </li>
              <li>
                The Purchaser(s) named in the APS are the parties to the contract
                of purchase and sale.
              </li>
              <li>
                My/Our rights, if any, to reimbursement of the Deposit are
                between me/us and the Purchaser(s), and not against the Brokerage
                or the Vendor(s), except as set out below.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 5: Direction as to Who is Entitled to the Funds */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">
              5
            </span>
            Direction as to Who is Entitled to the Funds
          </h2>

          {/* 5A: If transaction closes */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mb-3">
            <h3 className="text-[0.9rem] uppercase tracking-[0.06em] m-0 mb-2 font-semibold text-gray-700">
              (A) If the transaction CLOSES
            </h3>
            <p className="text-[0.92rem] text-gray-600 m-0 mb-2">
              If the purchase and sale transaction closes in accordance with the
              APS:
            </p>
            <label className="inline-flex items-start gap-2 text-[0.88rem] cursor-pointer hover:text-blue-600 transition-colors mb-3">
              <Checkbox
                checked={watch("closesDirection")}
                onCheckedChange={(checked) =>
                  setValue("closesDirection", !!checked)
                }
                className="mt-0.5"
              />
              <span>
                The Deposit shall be credited toward the Purchaser(s)&apos;
                obligations under the APS (e.g., purchase price, adjustments,
                etc.) for the benefit of the Purchaser(s).
              </span>
            </label>
            <div className="mt-2">
              <label className="text-[0.8rem] font-semibold block mb-1">
                Other (if different arrangement is agreed)
              </label>
              <textarea
                {...register("closesOther")}
                className="w-full min-h-[70px] resize-y rounded border border-[#d1d5db] text-[0.88rem] bg-[#f9fafb] shadow-none focus:outline-[#1f4f8f] focus:border-[#1f4f8f] focus:bg-white focus:outline-[1px] placeholder:text-gray-400 leading-[1.4]"
                placeholder="Specify other arrangement"
              />
            </div>
          </div>

          {/* 5B: If transaction fails */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mb-3">
            <h3 className="text-[0.9rem] uppercase tracking-[0.06em] m-0 mb-2 font-semibold text-gray-700">
              (B) If the transaction FAILS and the Deposit is to be RETURNED
            </h3>
            <p className="text-[0.92rem] text-gray-600 m-0 mb-2">
              If the APS is terminated and the Deposit is to be returned in
              accordance with the APS and/or any mutual release:
            </p>
            <p className="text-[0.8rem] font-semibold mb-2">
              Return the Deposit to (select one):
            </p>
            <RadioGroup
              value={watch("depositReturnTo")}
              onValueChange={(v) => setValue("depositReturnTo", v)}
              className="flex flex-col gap-2"
            >
              <div className="inline-flex items-center gap-2 text-[0.88rem] cursor-pointer">
                <RadioGroupItem value="purchasers" id="ret-purchasers" />
                <Label htmlFor="ret-purchasers" className="cursor-pointer">
                  The Purchaser(s) named in the APS.
                </Label>
              </div>
              <div className="inline-flex items-center gap-2 text-[0.88rem] cursor-pointer">
                <RadioGroupItem value="thirdParty" id="ret-thirdParty" />
                <Label htmlFor="ret-thirdParty" className="cursor-pointer">
                  The Third-Party Payor named in Section 2.
                </Label>
              </div>
              <div className="inline-flex items-center gap-2 text-[0.88rem]">
                <RadioGroupItem value="other" id="ret-other" />
                <Label htmlFor="ret-other" className="cursor-pointer">
                  Other (specify):
                </Label>
                <input
                  type="text"
                  {...register("depositReturnOther")}
                  className="w-[200px] px-2 py-1 rounded border border-gray-300 text-[0.85rem]"
                  placeholder="Specify"
                />
              </div>
            </RadioGroup>
          </div>

          {/* 5C: Released to seller */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-[0.9rem] uppercase tracking-[0.06em] m-0 mb-2 font-semibold text-gray-700">
              (C) If the Deposit is RELEASED TO THE SELLER
            </h3>
            <p className="text-[0.92rem] text-gray-600 m-0 mb-2">
              If the APS is terminated and, under the APS and/or any mutual
              release or court order, the Deposit is released to the Seller:
            </p>
            <label className="inline-flex items-start gap-2 text-[0.88rem] cursor-pointer hover:text-blue-600 transition-colors mb-3">
              <Checkbox
                checked={watch("releasedToSeller")}
                onCheckedChange={(checked) =>
                  setValue("releasedToSeller", !!checked)
                }
                className="mt-0.5"
              />
              <span>
                The Seller shall be entitled to receive and retain the Deposit in
                accordance with the APS, mutual release, or court order.
              </span>
            </label>
            <p className="text-[0.88rem] text-gray-500 m-0 mt-2">
              By signing below, the Third-Party Payor and Purchaser(s) acknowledge
              and agree that once the Deposit is properly paid out to the Seller
              in accordance with the APS and any related documents, the Brokerage
              has no further liability regarding the Deposit, and any remaining
              rights or claims (if any) are strictly between the Purchaser(s), the
              Seller, and/or the Third-Party Payor.
            </p>
            <div className="mt-2">
              <FormTextarea
                label="Additional terms (if any)"
                {...register("additionalTerms")}
                className="min-h-[70px]"
                placeholder="Specify additional terms"
              />
            </div>
          </div>
        </section>

        {/* Section 6: Acknowledgements and Signatures */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">
              6
            </span>
            Acknowledgements and Signatures
          </h2>

          {/* Third-Party Payor */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mb-3">
            <h3 className="text-[0.9rem] uppercase tracking-[0.06em] m-0 mb-2 font-semibold text-gray-700">
              Third-Party Payor
            </h3>
            <p className="text-[0.92rem] text-gray-600 m-0 mb-3">
              I/We confirm that I/we have read and understand this Third-Party
              Deposit Acknowledgement Form, and that the directions given above
              accurately reflect my/our instructions.
            </p>
              <div className="grid grid-cols-3 gap-x-5">
              <FormField
                label="Signature"
                placeholder=""
                error={errors.thirdPartySignature?.message}
                {...register("thirdPartySignature")}
              />
              <FormField
                label="Name (print)"
                placeholder=""
                error={errors.thirdPartyPrintName?.message}
                {...register("thirdPartyPrintName")}
              />
              <div className="flex items-center gap-2">
                <label className="text-[0.8rem] font-semibold flex-none">
                  Date
                </label>
                <DatePicker
                  value={watch("thirdPartyDate")}
                  onChange={(v) => setValue("thirdPartyDate", v)}
                />
              </div>
            </div>
          </div>

          {/* Purchaser(s) */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-[0.9rem] uppercase tracking-[0.06em] m-0 mb-2 font-semibold text-gray-700">
              Purchaser(s)
            </h3>
            <p className="text-[0.92rem] text-gray-600 m-0 mb-3">
              I/We acknowledge that the Deposit has been provided by the
              Third-Party Payor named above on my/our behalf and agree to the
              directions regarding entitlement to the Deposit as set out in this
              form.
            </p>
            <div className="grid grid-cols-2 gap-x-5">
              <div>
                <div className="grid grid-cols-1 gap-y-1">
                  <FormField
                    label="Purchaser 1 Signature"
                    placeholder=""
                    error={errors.purchaser1Signature?.message}
                    {...register("purchaser1Signature")}
                  />
                  <FormField
                    label="Name (print)"
                    placeholder=""
                    error={errors.purchaser1PrintName?.message}
                    {...register("purchaser1PrintName")}
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-[0.8rem] font-semibold flex-none">
                      Date
                    </label>
                    <DatePicker
                      value={watch("purchaser1Date")}
                      onChange={(v) => setValue("purchaser1Date", v)}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-1 gap-y-1">
                  <FormField
                    label="Purchaser 2 Signature"
                    placeholder=""
                    error={errors.purchaser2Signature?.message}
                    {...register("purchaser2Signature")}
                  />
                  <FormField
                    label="Name (print)"
                    placeholder=""
                    error={errors.purchaser2PrintName?.message}
                    {...register("purchaser2PrintName")}
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-[0.8rem] font-semibold flex-none">
                      Date
                    </label>
                    <DatePicker
                      value={watch("purchaser2Date")}
                      onChange={(v) => setValue("purchaser2Date", v)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <FormTextarea
                label="Additional Purchasers (use if more than two purchasers)"
                {...register("additionalPurchasers")}
                className="min-h-[40px]"
                placeholder="Enter additional purchaser names"
              />
            </div>
          </div>
        </section>

        {/* Section 7: Brokerage Acknowledgement */}
        <section className="mt-5 pt-4 border-t border-dashed border-[#d1d5db]">
          <h2 className="m-0 mb-3 text-[1rem] uppercase tracking-[0.07em] text-[#1f4f8f] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1f4f8f] text-white text-xs font-bold">
              7
            </span>
            Brokerage Acknowledgement
          </h2>
          <div className="space-y-3">
            <p className="text-[0.92rem] text-gray-600 m-0">
              The undersigned acknowledges receipt of the Deposit described in
              this form and confirms that it will be held and disbursed strictly
              in accordance with:
            </p>
            <ul className="ml-6 text-[0.9rem] text-gray-600 space-y-1">
              <li>The terms of the APS and any amendments;</li>
              <li>Any mutual releases or court orders; and</li>
              <li>
                The directions contained in this Third-Party Deposit
                Acknowledgement Form, to the extent they are consistent with the
                APS and applicable law.
              </li>
            </ul>
            <div className="grid grid-cols-2 gap-x-5">
              <div className="grid grid-cols-1 gap-y-1">
                <FormField
                  label="Name of Brokerage"
                  placeholder=""
                  error={errors.brokerageNameAck?.message}
                  {...register("brokerageNameAck")}
                />
                <FormField
                  label="Name of Representative"
                  placeholder=""
                  error={errors.brokerageRepName?.message}
                  {...register("brokerageRepName")}
                />
              </div>
              <div className="grid grid-cols-1 gap-y-1">
                <FormField
                  label="Title / Role"
                  placeholder=""
                  error={errors.brokerageRepTitle?.message}
                  {...register("brokerageRepTitle")}
                />
                <FormField
                  label="Signature of Representative"
                  placeholder=""
                  error={errors.brokerageRepSignature?.message}
                  {...register("brokerageRepSignature")}
                />
                <div className="flex items-center gap-2">
                    <label className="text-[0.8rem] font-semibold flex-none">
                      Date
                    </label>
                    <DatePicker
                      value={watch("brokerageRepDate")}
                      onChange={(v) => setValue("brokerageRepDate", v)}
                    />
                  </div>
              </div>
            </div>
            <p className="text-[0.85rem] text-gray-500 italic m-0 mt-2">
              This completed form must be placed in the transaction file together
              with the APS and related documents.
            </p>
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

      {formErrors.length > 0 && (
        <FormErrorsDisplay
          errors={formErrors}
          onClose={() => {}}
          onFieldClick={(fieldName) => {
            setFocus(fieldName as Path<ThirdPartyDepositFormValues>);
          }}
        />
      )}
    </div>
  );
}
