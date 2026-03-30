"use client";

import { useState } from "react";
import { KYBStepWrapper } from "../reusables/kybstepwraper";
import { SelectField, TextField } from "../reusables/general_inputs";
import { AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";

interface BankDetail {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface BankDetailErrors {
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

const BANK_OPTIONS = [
  { value: "access", label: "Access Bank" },
  { value: "gtb", label: "Guaranty Trust Bank" },
  { value: "zenith", label: "Zenith Bank" },
  { value: "first_bank", label: "First Bank of Nigeria" },
  { value: "uba", label: "United Bank for Africa" },
  { value: "stanbic", label: "Stanbic IBTC Bank" },
  { value: "sterling", label: "Sterling Bank" },
  { value: "union", label: "Union Bank" },
  { value: "wema", label: "Wema Bank" },
  { value: "fidelity", label: "Fidelity Bank" },
  { value: "polaris", label: "Polaris Bank" },
  { value: "keystone", label: "Keystone Bank" },
];

const EMPTY_BANK_DETAIL: BankDetail = {
  bankName: "",
  accountNumber: "",
  accountName: "",
};

function BankDetailForm({
  data,
  errors,
  onChange,
  disabled,
  idPrefix = "",
}: {
  data: BankDetail;
  errors: BankDetailErrors;
  onChange: (field: keyof BankDetail, value: string) => void;
  disabled: boolean;
  idPrefix?: string;
}) {
  return (
    <div
      className={`space-y-4 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <SelectField
        label=""
        id={`${idPrefix}bankName`}
        value={data.bankName}
        onChange={(v) => onChange("bankName", v)}
        options={BANK_OPTIONS}
        placeholder="Bank Name*"
        error={errors.bankName}
        disabled={disabled}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label=""
          id={`${idPrefix}accountNumber`}
          placeholder="Account Number*"
          value={data.accountNumber}
          onChange={(v) => onChange("accountNumber", v)}
          error={errors.accountNumber}
          disabled={disabled}
        />
        <TextField
          label=""
          id={`${idPrefix}accountName`}
          placeholder="Account Name*"
          value={data.accountName}
          onChange={(v) => onChange("accountName", v)}
          error={errors.accountName}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

function validateBankDetail(data: BankDetail): BankDetailErrors {
  const errors: BankDetailErrors = {};

  if (!data.bankName) errors.bankName = "Bank name is required";

  if (!data.accountNumber.trim()) {
    errors.accountNumber = "Account number is required";
  } else if (!/^\d{10}$/.test(data.accountNumber.trim())) {
    errors.accountNumber = "Account number must be exactly 10 digits";
  }

  if (!data.accountName.trim()) {
    errors.accountName = "Account name is required";
  }

  return errors;
}

export function BankAccountDetailTab() {
  const [bankDetails, setBankDetails] = useState<BankDetail[]>([
    { ...EMPTY_BANK_DETAIL },
  ]);

  const [errors, setErrors] = useState<BankDetailErrors[]>([{}]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleEditToggle = () => {
    if (isEditing) setErrors([{}]);
    setIsEditing((prev) => !prev);
  };

  const handleChange = (
    index: number,
    field: keyof BankDetail,
    value: string,
  ) => {
    const updated = [...bankDetails];
    updated[index][field] = value;
    setBankDetails(updated);

    if (errors[index]?.[field]) {
      const updatedErrors = [...errors];
      updatedErrors[index][field] = undefined;
      setErrors(updatedErrors);
    }
  };

  const handleAdd = () => {
    setBankDetails((prev) => [...prev, { ...EMPTY_BANK_DETAIL }]);
    setErrors((prev) => [...prev, {}]);
  };

  const handleRemove = (index: number) => {
    if (index === 0) return;

    setBankDetails((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const validationErrors = bankDetails.map(validateBankDetail);
    setErrors(validationErrors);

    const hasErrors = validationErrors.some(
      (err) => Object.keys(err).length > 0,
    );
    if (hasErrors) return;

    setIsSaving(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KYBStepWrapper title="Bank Account Detail">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-6">
          <h2 className="text-xl md:text-[20px] font-semibold text-foreground">
            Business Payout Details {bankDetails.length > 1 ? "1" : ""}
          </h2>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={handleEditToggle}
              className="flex items-center justify-center gap-1.5 px-4 py-2 border border-(--grey-1) rounded-lg text-sm font-medium hover:bg-(--grey-4) transition-colors order-2 sm:order-1"
            >
              <AiOutlineEdit className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isEditing ? "Cancel" : "Edit Details"}
              </span>
              <span className="sm:hidden">{isEditing ? "Cancel" : "Edit"}</span>
            </button>

            <button
              onClick={handleAdd}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity order-1 sm:order-2"
            >
              <AiOutlinePlus className="w-4 h-4" />
              <span className="sm:inline">Add Bank Details</span>
            </button>
          </div>
        </div>

        {bankDetails.map((detail, index) => (
          <div key={index} className="space-y-6">
            {index !== 0 && (
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl md:text-[20px] font-semibold text-foreground">
                  Business Payout Details {index + 1}
                </h2>
                <button
                  onClick={() => handleRemove(index)}
                  className="text-sm text-(--text-2) cursor-pointer transition-colors whitespace-nowrap"
                >
                  Remove
                </button>
              </div>
            )}

            <BankDetailForm
              data={detail}
              errors={errors[index] || {}}
              onChange={(field, value) => handleChange(index, field, value)}
              disabled={!isEditing}
              idPrefix={`bank-${index}-`}
            />
          </div>
        ))}

        {isEditing && (
          <div className="flex justify-center mt-8 px-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full md:max-w-md py-3 bg-foreground text-background rounded-lg font-medium transition-colors disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {!isEditing && (
          <div className="flex justify-center pt-4 px-2">
            <button
              disabled
              className="w-full md:max-w-md py-3 bg-foreground text-background rounded-lg font-medium opacity-60 cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </KYBStepWrapper>
  );
}
