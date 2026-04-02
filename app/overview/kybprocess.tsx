"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { HiPlus, HiX } from "react-icons/hi";
import { KYBStepWrapper } from "../components/reusables/kybstepwraper";
import {
  baseButtonBlack,
  baseButtonWhite,
  baseInput,
  baseSelect,
  splitLeft,
  splitRight,
} from "../components/reusables/classes";
import Kyc_status_banner from "../components/reusables/kyc_status_banner";
import { FaArrowLeft } from "react-icons/fa";
import { FilePickerField } from "../components/reusables/general_inputs";
import { uploadKybDoc } from "../server/upgrade_account";
import { Spinner } from "../components/reusables/spinner";
import { fileToBase64 } from "../functions/helpers/base64";

interface OwnerInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dayOfBirth: string;
  monthOfBirth: string;
  yearOfBirth: string;
  idDoc1: string;
  idNumber1: string;
  idUpload: File | null;
  homeState: string;
  homeCity: string;
  homePostalCode: string;
  homeStreet: string;
  homeProofUpload: File | null;
}

interface KYBFormData {
  // Step 1
  companyName: string;
  businessDescription: string;
  staffSize: string;
  annualSalesVolume: string;
  annualSalesVolumeCurrency: string;
  industry: string;
  businessType: string;

  // Step 2
  businessEmail: string;
  supportEmail: string;
  disputeEmail: string;
  phoneNumber: string;
  phoneNumberCountry: string;
  website: string;
  linkedin: string;
  twitter: string;
  instagram: string;

  // Step 3
  officeCountry: string;
  officeState: string;
  officeCity: string;
  officePostalCode: string;
  officeStreet: string;

  // Step 4 - Now an array of owners
  owners: OwnerInfo[];

  // Step 5
  incorporationDoc: File | null;
  taxFilingDoc: File | null;
  registrationStatus: File | null;
  mouDoc: File | null;
  boardRegisterDoc: File | null;
  proofOfAddressDoc: File | null;
  DueDiligenceDoc: File | null;
  amlDoc: File | null;
  supportingDoc: File[];

  // Step 6
  bankName: string;
  accountNumber: string;
  accountName: string;
}

const initialFormData: KYBFormData = {
  companyName: "",
  businessDescription: "",
  staffSize: "",
  annualSalesVolume: "",
  annualSalesVolumeCurrency: "NGN",
  industry: "",
  businessType: "",
  businessEmail: "",
  supportEmail: "",
  disputeEmail: "",
  phoneNumber: "",
  phoneNumberCountry: "NGN",
  website: "",
  linkedin: "",
  twitter: "",
  instagram: "",
  officeCountry: "",
  officeState: "",
  officeCity: "",
  officePostalCode: "",
  officeStreet: "",
  owners: [
    {
      id: crypto.randomUUID?.() || Date.now().toString(),
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dayOfBirth: "",
      monthOfBirth: "",
      yearOfBirth: "",
      idDoc1: "",
      idNumber1: "",
      idUpload: null,
      homeState: "",
      homeCity: "",
      homePostalCode: "",
      homeStreet: "",
      homeProofUpload: null,
    },
  ],
  incorporationDoc: null,
  taxFilingDoc: null,
  registrationStatus: null,
  mouDoc: null,
  boardRegisterDoc: null,
  proofOfAddressDoc: null,
  DueDiligenceDoc: null,
  amlDoc: null,
  supportingDoc: [],
  bankName: "",
  accountNumber: "",
  accountName: "",
};

interface KYBScreensProps {
  onClose: () => void;
  onComplete: () => void;
}

// Multi-file picker with individual file removal
function MultiFilePickerField({
  label,
  files,
  onFilesChange,
  error,
}: {
  label: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked: File[] = Array.from(e.target.files ?? []);
    const merged: File[] = [
      ...files,
      ...picked.filter((p) => !files.some((f) => f.name === p.name)),
    ];
    onFilesChange(merged);
    e.target.value = "";
  };

  const removeFile = (fileName: string) => {
    onFilesChange(files.filter((f) => f.name !== fileName));
  };

  return (
    <div>
      <p className="text-[14px] text-(--text-1) mb-2" aria-label={label}>
        {label} *
      </p>
      <input
        title="file-picker"
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-(--grey-1) rounded-lg p-4 text-center cursor-pointer bg-(--grey-4) transition hover:border-(--grey-2)"
      >
        <p className="text-(--text-1) text-[14px]">+ Choose file(s)</p>
      </div>
      {files.length > 0 && (
        <div className="mt-2 space-y-2">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-(--grey-4) p-2 rounded-lg"
            >
              <p className="text-[12px] text-foreground truncate flex-1">
                📎 {file.name}
              </p>
              <button
                title="upload"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file.name);
                }}
                className="p-1 hover:bg-(--grey-3) rounded-full transition"
                type="button"
              >
                <HiX className="w-4 h-4 text-(--red-1)" />
              </button>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-(--red-1) text-sm mt-1">{error}</p>}
    </div>
  );
}

// ─── email format helper ───────────────────────────────────────────────────────
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// ─── phone format helper (must start with + and have country code digits) ─────
// e.g. +2348012345678  or  +14155551234
const isValidPhone = (v: string) => /^\+\d{7,15}$/.test(v.replace(/\s/g, ""));

// ─── website format helper ────────────────────────────────────────────────────
const isValidWebsite = (v: string) =>
  /^(https?:\/\/)?([\w-]+\.)+[\w]{2,}(\/.*)?$/.test(v);

// ─── account number: digits only, 10 chars (Nigerian standard) ────────────────
const isValidAccountNumber = (v: string) => /^\d{10}$/.test(v);

export function KYBScreens({ onClose, onComplete }: KYBScreensProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<KYBFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const updateFormData = useCallback((updates: Partial<KYBFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(updates).forEach((key) => delete newErrors[key]);
      return newErrors;
    });
  }, []);

  // Update specific owner field
  const updateOwner = useCallback(
    (ownerId: string, updates: Partial<OwnerInfo>) => {
      setFormData((prev) => ({
        ...prev,
        owners: prev.owners.map((owner) =>
          owner.id === ownerId ? { ...owner, ...updates } : owner,
        ),
      }));
      // Clear errors for this owner's fields
      setErrors((prev) => {
        const newErrors = { ...prev };
        Object.keys(updates).forEach((key) => {
          delete newErrors[`owner_${ownerId}_${key}`];
        });
        return newErrors;
      });
    },
    [],
  );

  const addOwner = useCallback(() => {
    const newOwner: OwnerInfo = {
      id: crypto.randomUUID?.() || Date.now().toString(),
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dayOfBirth: "",
      monthOfBirth: "",
      yearOfBirth: "",
      idDoc1: "",
      idNumber1: "",
      idUpload: null,
      homeState: "",
      homeCity: "",
      homePostalCode: "",
      homeStreet: "",
      homeProofUpload: null,
    };
    setFormData((prev) => ({
      ...prev,
      owners: [newOwner, ...prev.owners], // Add new owner at the top
    }));
  }, []);

  // Cache on mount/unmount
  useEffect(() => {
    return () => setFormData(initialFormData);
  }, []);

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.companyName)
          newErrors.companyName = "Company Name is required";
        if (!formData.businessDescription)
          newErrors.businessDescription = "Business Description is required";
        if (!formData.staffSize) newErrors.staffSize = "Staff Size is required";
        if (!formData.annualSalesVolume)
          newErrors.annualSalesVolume =
            "Annual Projected Sales Volume is required";
        else if (
          isNaN(Number(formData.annualSalesVolume)) ||
          Number(formData.annualSalesVolume) <= 0
        )
          newErrors.annualSalesVolume =
            "Enter a valid positive number (e.g. 5000000)";
        if (!formData.industry) newErrors.industry = "Industry is required";
        if (!formData.businessType)
          newErrors.businessType = "Business Type is required";
        break;

      case 2:
        if (!formData.businessEmail)
          newErrors.businessEmail = "Business Email is required";
        else if (!isValidEmail(formData.businessEmail))
          newErrors.businessEmail =
            "Enter a valid email (e.g. info@company.com)";

        if (!formData.supportEmail)
          newErrors.supportEmail = "Support Email is required";
        else if (!isValidEmail(formData.supportEmail))
          newErrors.supportEmail =
            "Enter a valid email (e.g. support@company.com)";

        if (!formData.disputeEmail)
          newErrors.disputeEmail = "Dispute Email is required";
        else if (!isValidEmail(formData.disputeEmail))
          newErrors.disputeEmail =
            "Enter a valid email (e.g. disputes@company.com)";

        if (!formData.phoneNumber)
          newErrors.phoneNumber = "Phone Number is required";
        else if (!isValidPhone(formData.phoneNumber))
          newErrors.phoneNumber = "Include country code (e.g. +2348012345678)";

        if (!formData.website) newErrors.website = "Website is required";
        else if (!isValidWebsite(formData.website))
          newErrors.website = "Enter a valid URL (e.g. https://company.com)";

        // optional socials – validate format only if provided
        if (formData.linkedin && !isValidWebsite(formData.linkedin))
          newErrors.linkedin =
            "Enter a valid LinkedIn URL (e.g. https://linkedin.com/company/name)";
        if (formData.twitter && !isValidWebsite(formData.twitter))
          newErrors.twitter =
            "Enter a valid Twitter URL (e.g. https://twitter.com/handle)";
        if (formData.instagram && !isValidWebsite(formData.instagram))
          newErrors.instagram =
            "Enter a valid Instagram URL (e.g. https://instagram.com/handle)";
        break;

      case 3:
        if (!formData.officeCountry)
          newErrors.officeCountry = "Country is required";
        if (!formData.officeState)
          newErrors.officeState = "State or Region is required";
        if (!formData.officeCity) newErrors.officeCity = "City is required";
        if (!formData.officePostalCode)
          newErrors.officePostalCode = "Postal Code is required";
        else if (!/^\d{5,10}$/.test(formData.officePostalCode))
          newErrors.officePostalCode =
            "Enter a valid postal code (e.g. 100001)";
        if (!formData.officeStreet)
          newErrors.officeStreet = "Street Address is required";
        break;

      case 4:
        formData.owners.forEach((owner) => {
          if (!owner.firstName)
            newErrors[`owner_${owner.id}_firstName`] = "First Name is required";
          if (!owner.lastName)
            newErrors[`owner_${owner.id}_lastName`] = "Last Name is required";
          if (!owner.email)
            newErrors[`owner_${owner.id}_email`] = "email is required";
          if (!owner.phoneNumber)
            newErrors[`owner_${owner.id}_phoneNumber`] =
              "phoneNumber is required";
          if (!owner.dayOfBirth)
            newErrors[`owner_${owner.id}_dayOfBirth`] =
              "Day of Birth is required";
          if (!owner.monthOfBirth)
            newErrors[`owner_${owner.id}_monthOfBirth`] =
              "Month of Birth is required";
          if (!owner.yearOfBirth)
            newErrors[`owner_${owner.id}_yearOfBirth`] =
              "Year of Birth is required";
          if (!owner.idDoc1)
            newErrors[`owner_${owner.id}_idDoc1`] =
              "Identification Document is required";
          if (!owner.idNumber1)
            newErrors[`owner_${owner.id}_idNumber1`] =
              "Identification Number is required";
          if (!owner.idUpload)
            newErrors[`owner_${owner.id}_idUpload`] =
              "Identification Document Upload is required";
          if (!owner.homeState)
            newErrors[`owner_${owner.id}_homeState`] =
              "State or Region is required";
          if (!owner.homeCity)
            newErrors[`owner_${owner.id}_homeCity`] = "City is required";
          if (!owner.homePostalCode)
            newErrors[`owner_${owner.id}_homePostalCode`] =
              "Postal Code is required";
          if (!owner.homeStreet)
            newErrors[`owner_${owner.id}_homeStreet`] =
              "Street Address is required";
          if (!owner.homeProofUpload)
            newErrors[`owner_${owner.id}_homeProofUpload`] =
              "Proof of Address Upload is required";
        });
        break;

      case 5:
        // Required docs (marked with *)
        if (!formData.incorporationDoc)
          newErrors.incorporationDoc =
            "Certification of Incorporation is required";
        if (!formData.registrationStatus)
          newErrors.registrationStatus = "Status of Registration is required";
        if (!formData.mouDoc)
          newErrors.mouDoc = "Memorandum of Understanding is required";
        if (!formData.boardRegisterDoc)
          newErrors.boardRegisterDoc =
            "Register of Board of Directors is required";
        if (!formData.proofOfAddressDoc)
          newErrors.proofOfAddressDoc = "Proof of Address is required";
        if (!formData.amlDoc)
          newErrors.amlDoc = "AML Policy and Procedures document is required";
        if (!formData.DueDiligenceDoc)
          newErrors.DueDiligenceDoc = "Customer Due Diligence Doc is required";
        if (!formData.supportingDoc || formData.supportingDoc.length === 0)
          newErrors.supportingDoc = "Supporting Document is required";
        // taxFilingDoc is optional – no validation
        break;

      case 6:
        if (!formData.bankName) newErrors.bankName = "Bank Name is required";
        if (!formData.accountNumber)
          newErrors.accountNumber = "Account Number is required";
        else if (!isValidAccountNumber(formData.accountNumber))
          newErrors.accountNumber =
            "Enter a valid 10-digit account number (e.g. 0123456789)";
        if (!formData.accountName)
          newErrors.accountName = "Account Name is required";
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData(initialFormData);
    onClose();
  };

  const mapDocType = (value: string): string => {
    switch (value) {
      case "Passport":
        return "PASSPORT";
      case "Driver License":
        return "DRIVER_LICENSE";
      case "National ID":
        return "NATIONAL_ID";
      case "Proof of Address":
        return "PROOF_OF_ADDRESS";
      case "Bank Statement":
        return "BANK_STATEMENT";
      case "Invoice":
        return "INVOICE";
      default:
        return "OTHER";
    }
  };

  type DocPayload = {
    fileBase64: string;
    fileName: string;
    contentType: string;
    identificationNumber: string;
    otherDocumentDescription?: string;
    documentType: string;
  };

  const toDoc = async (file: File, typeValue: string, idNumber = "") => {
    const documentType = mapDocType(typeValue);

    const base: DocPayload = {
      fileBase64: await fileToBase64(file),
      fileName: file.name,
      contentType: file.type,
      identificationNumber: idNumber,
      documentType,
    };

    // ONLY include this for OTHER
    if (documentType === "OTHER") {
      base.otherDocumentDescription = file.name;
    }

    return base;
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      setLoading(true);

      const companyDocuments = await Promise.all(
        [
          formData.incorporationDoc &&
            toDoc(formData.incorporationDoc, "OTHER"),

          formData.taxFilingDoc && toDoc(formData.taxFilingDoc, "INVOICE"),

          formData.registrationStatus &&
            toDoc(formData.registrationStatus, "OTHER"),

          formData.mouDoc && toDoc(formData.mouDoc, "OTHER"),

          formData.boardRegisterDoc &&
            toDoc(formData.boardRegisterDoc, "OTHER"),

          formData.proofOfAddressDoc &&
            toDoc(formData.proofOfAddressDoc, "PROOF_OF_ADDRESS"),

          formData.DueDiligenceDoc && toDoc(formData.DueDiligenceDoc, "OTHER"),

          formData.amlDoc && toDoc(formData.amlDoc, "OTHER"),

          ...formData.supportingDoc.map((file) => toDoc(file, "OTHER")),
        ].filter(Boolean) as Promise<DocPayload>[],
      );

      const businessDirectors = await Promise.all(
        formData.owners.map(async (owner) => {
          const dob = `${owner.yearOfBirth}-${String(
            owner.monthOfBirth,
          ).padStart(2, "0")}-${String(owner.dayOfBirth).padStart(2, "0")}`;

          return {
            firstName: owner.firstName,
            lastName: owner.lastName,
            email: owner.email,
            phoneNumber: owner.phoneNumber,
            dob,
            addressLine1: owner.homeStreet,
            addressLine2: owner.homeState,
            city: owner.homeCity,
            state: owner.homeState,
            country: formData.officeCountry || "Nigeria",
            postalCode: owner.homePostalCode,

            ...(owner.idUpload &&
              owner.idDoc1 && {
                passportDocument: await toDoc(
                  owner.idUpload,
                  owner.idDoc1,
                  owner.idNumber1,
                ),
              }),

            ...(owner.homeProofUpload && {
              proofOfAddressDocument: await toDoc(
                owner.homeProofUpload,
                "Proof of Address",
              ),
            }),

            role: "DIRECTOR",
            ownershipPercentage: 0,
            isPep: false,
          };
        }),
      );

      const payload = {
        businessName: formData.companyName,
        businessDescription: formData.businessDescription,
        staffSize: formData.staffSize,
        industry: formData.industry,
        annualRevenue: Number(formData.annualSalesVolume) || 0,
        annualRevenueCurrency: formData.annualSalesVolumeCurrency,
        website: formData.website,
        linkedIn: formData.linkedin,
        twitter: formData.twitter,
        instagram: formData.instagram,
        phoneNumber: formData.phoneNumber,
        email: formData.businessEmail,
        disputeEmail: formData.disputeEmail,
        supportEmail: formData.supportEmail,
        businessType: formData.businessType,
        addressLine1: formData.officeStreet,
        addressLine2: "N/A",
        city: formData.officeCity,
        state: formData.officeState,
        country: formData.officeCountry,
        postalCode: formData.officePostalCode,
        businessDirectors,
        companyDocuments,
        bankDetail: {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          accountName: formData.accountName,
        },
      };

      console.log(payload, "FINAL PAYLOAD");

      const result = await uploadKybDoc(JSON.stringify(payload));

      console.log(result, "SUCCESS");

      if (result.success) {
        setCurrentStep(1);
        setFormData(initialFormData);
        localStorage.removeItem("profile_cache")
        onComplete();
      }
    } catch (err) {
      console.error("KYB submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background px-6 py-8 md:max-w-[80%]">
      {/* Header with Back Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();

          if (currentStep > 1) {
            handlePrevious();
          } else {
            handleClose();
          }
        }}
        className="flex items-center gap-2 text-foreground mb-6 hover:text-foreground/85 text-[16px] transition"
      >
        <FaArrowLeft className="w-8 h-8 bg-background border border-(--grey-1) rounded-lg" />
        Go Back
      </button>

      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-[20px] font-bold text-foreground mb-2">
            Complete KYB
          </h1>
          <p className="text-(--text-1) text-[14px]">
            Submit your business details and documents to meet regulatory
            requirements.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="text-center mb-8 flex items-center justify-center">
          <div className="w-[42%] border-t border-t-(--grey-1) h-full"></div>
          <p className="text-foreground text-s[16px] font-medium tracking-widest lg:mx-2">
            KYB STEP {currentStep}/
            <span className="text-(--text-1) lg:w-[20%]">7</span>
          </p>
          <div className="w-[42%] border-t border-t-(--grey-1) h-full"></div>
        </div>

        {/* Step 1: Company Profile */}
        {currentStep === 1 && (
          <KYBStepWrapper
            title="Business Profile"
            footer={
              <div className="flex justify-center items-center gap-4 pt-6">
                <button
                  onClick={handleNext}
                  className={`${baseButtonBlack} py-3`}
                >
                  Proceed to Company Contact
                </button>
              </div>
            }
          >
            <div className="bg-background px-6 py-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Company Name*"
                    value={formData.companyName}
                    onChange={(e) =>
                      updateFormData({ companyName: e.target.value })
                    }
                    className={baseInput}
                  />
                  {errors.companyName && (
                    <p className="text-(--red-1) text-sm">
                      {errors.companyName}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Business Description*"
                    value={formData.businessDescription}
                    onChange={(e) =>
                      updateFormData({ businessDescription: e.target.value })
                    }
                    className={baseInput}
                  />
                  {errors.businessDescription && (
                    <p className="text-(--red-1) text-sm">
                      {errors.businessDescription}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <select
                    title="staff-size"
                    value={formData.staffSize}
                    onChange={(e) =>
                      updateFormData({ staffSize: e.target.value })
                    }
                    className={baseSelect}
                  >
                    <option value="">Staff Size*</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="200+">200+</option>
                  </select>
                  {errors.staffSize && (
                    <p className="text-(--red-1) text-sm">{errors.staffSize}</p>
                  )}
                </div>

                <div className="flex flex-col w-full">
                  <div className="w-full flex">
                    <input
                      type="number"
                      placeholder="Annual Projected Sales Volume*"
                      value={formData.annualSalesVolume}
                      onChange={(e) =>
                        updateFormData({ annualSalesVolume: e.target.value })
                      }
                      className={splitLeft}
                    />
                    <select
                      title="annual-sales-volume"
                      value={formData.annualSalesVolumeCurrency}
                      onChange={(e) =>
                        updateFormData({
                          annualSalesVolumeCurrency: e.target.value,
                        })
                      }
                      className={splitRight}
                    >
                      <option value="NGN">NGN</option>
                    </select>
                  </div>
                  {(errors.annualSalesVolume ||
                    errors.annualSalesVolumeCurrency) && (
                    <p className="text-(--red-1) text-sm">
                      {errors.annualSalesVolume}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <select
                    title="industry"
                    value={formData.industry}
                    onChange={(e) =>
                      updateFormData({ industry: e.target.value })
                    }
                    className={baseSelect}
                  >
                    <option value="">Industry*</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                  </select>
                  {errors.industry && (
                    <p className="text-(--red-1) text-sm">{errors.industry}</p>
                  )}
                </div>

                <div className="w-full">
                  <select
                    title="business type"
                    value={formData.businessType}
                    onChange={(e) =>
                      updateFormData({ businessType: e.target.value })
                    }
                    className={baseSelect}
                  >
                    <option value="">Business Type*</option>
                    <option value="Sole Proprietorship">
                      Sole Proprietorship
                    </option>
                    <option value="Partnership">Partnership</option>
                    <option value="Corporation">Corporation</option>
                    <option value="LLC">LLC</option>
                  </select>
                  {errors.businessType && (
                    <p className="text-(--red-1) text-sm">
                      {errors.businessType}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </KYBStepWrapper>
        )}

        {/* Step 2: Company Contact */}
        {currentStep === 2 && (
          <KYBStepWrapper
            title="Company Contact"
            footer={
              <div className="flex md:flex-row flex-col gap-4 pt-6">
                <button onClick={handlePrevious} className={baseButtonWhite}>
                  Go Back
                </button>
                <button onClick={handleNext} className={baseButtonBlack}>
                  Proceed to Office Address
                </button>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
                <input
                  type="email"
                  placeholder="Business Email* (e.g. info@company.com)"
                  value={formData.businessEmail}
                  onChange={(e) =>
                    updateFormData({ businessEmail: e.target.value })
                  }
                  className={baseInput}
                />
                {errors.businessEmail && (
                  <p className="text-(--red-1) text-sm">
                    {errors.businessEmail}
                  </p>
                )}
              </div>

              <div className="w-full">
                <input
                  type="email"
                  placeholder="Support Email* (e.g. support@company.com)"
                  value={formData.supportEmail}
                  onChange={(e) =>
                    updateFormData({ supportEmail: e.target.value })
                  }
                  className={baseInput}
                />
                {errors.supportEmail && (
                  <p className="text-(--red-1) text-sm">
                    {errors.supportEmail}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
                <input
                  type="email"
                  placeholder="Dispute Email* (e.g. disputes@company.com)"
                  value={formData.disputeEmail}
                  onChange={(e) =>
                    updateFormData({ disputeEmail: e.target.value })
                  }
                  className={baseInput}
                />
                {errors.disputeEmail && (
                  <p className="text-(--red-1) text-sm">
                    {errors.disputeEmail}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex w-full">
                  <input
                    type="tel"
                    placeholder="Phone Number* (e.g. +2348012345678)"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      updateFormData({ phoneNumber: e.target.value })
                    }
                    className={baseInput}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-(--red-1) text-sm">{errors.phoneNumber}</p>
                )}
              </div>

              <div className="w-full">
                <input
                  type="text"
                  placeholder="Website* (e.g. https://company.com)"
                  value={formData.website}
                  onChange={(e) => updateFormData({ website: e.target.value })}
                  className={baseInput}
                />
                {errors.website && (
                  <p className="text-(--red-1) text-sm">{errors.website}</p>
                )}
              </div>

              <div className="w-full">
                <input
                  type="text"
                  placeholder="Linkedin (e.g. https://linkedin.com/company/name)"
                  value={formData.linkedin}
                  onChange={(e) => updateFormData({ linkedin: e.target.value })}
                  className={baseInput}
                />
                {errors.linkedin && (
                  <p className="text-(--red-1) text-sm">{errors.linkedin}</p>
                )}
              </div>

              <div className="w-full">
                <input
                  type="text"
                  placeholder="Twitter (e.g. https://twitter.com/handle)"
                  value={formData.twitter}
                  onChange={(e) => updateFormData({ twitter: e.target.value })}
                  className={baseInput}
                />
                {errors.twitter && (
                  <p className="text-(--red-1) text-sm">{errors.twitter}</p>
                )}
              </div>

              <div className="w-full">
                <input
                  type="text"
                  placeholder="Instagram (e.g. https://instagram.com/handle)"
                  value={formData.instagram}
                  onChange={(e) =>
                    updateFormData({ instagram: e.target.value })
                  }
                  className={baseInput}
                />
                {errors.instagram && (
                  <p className="text-(--red-1) text-sm">{errors.instagram}</p>
                )}
              </div>
            </div>
          </KYBStepWrapper>
        )}

        {/* Step 3: Office Address */}
        {currentStep === 3 && (
          <KYBStepWrapper
            title="Office Address"
            footer={
              <div className="flex md:flex-row flex-col gap-4 pt-6">
                <button onClick={handlePrevious} className={baseButtonWhite}>
                  Go Back
                </button>
                <button onClick={handleNext} className={baseButtonBlack}>
                  Proceed to Owner&apos;s Information
                </button>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <select
                  title="office country"
                  value={formData.officeCountry}
                  onChange={(e) =>
                    updateFormData({ officeCountry: e.target.value })
                  }
                  className={baseSelect}
                >
                  <option value="">Country*</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                </select>
                {errors.officeCountry && (
                  <p className="text-(--red-1) text-sm">
                    {errors.officeCountry}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <select
                  title="office state"
                  value={formData.officeState}
                  onChange={(e) =>
                    updateFormData({ officeState: e.target.value })
                  }
                  className={baseSelect}
                >
                  <option value="">State or Region*</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Kano">Kano</option>
                </select>
                {errors.officeState && (
                  <p className="text-(--red-1) text-sm">{errors.officeState}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <select
                  title="office city"
                  value={formData.officeCity}
                  onChange={(e) =>
                    updateFormData({ officeCity: e.target.value })
                  }
                  className={baseSelect}
                >
                  <option value="">City*</option>
                  <option value="Ikeja">Ikeja</option>
                  <option value="Victoria Island">Victoria Island</option>
                  <option value="Lekki">Lekki</option>
                </select>
                {errors.officeCity && (
                  <p className="text-(--red-1) text-sm">{errors.officeCity}</p>
                )}
              </div>

              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="Postal Code* (e.g. 100001)"
                  value={formData.officePostalCode}
                  onChange={(e) =>
                    updateFormData({ officePostalCode: e.target.value })
                  }
                  className={baseInput}
                />
                {errors.officePostalCode && (
                  <p className="text-(--red-1) text-sm">
                    {errors.officePostalCode}
                  </p>
                )}
              </div>
            </div>

            <input
              type="text"
              placeholder="Street Address*"
              value={formData.officeStreet}
              onChange={(e) => updateFormData({ officeStreet: e.target.value })}
              className={`${baseInput} w-full`}
            />
            {errors.officeStreet && (
              <p className="text-(--red-1) text-sm">{errors.officeStreet}</p>
            )}

            <div className="flex gap-4 pt-6"></div>
          </KYBStepWrapper>
        )}

        {/* Step 4: Owner's Information */}
        {currentStep === 4 && (
          <KYBStepWrapper
            title={
              <div className="flex justify-between items-center rounded-lg">
                <p className="font-semibold text-foreground text-[14px]">
                  Owner(s) Information
                </p>

                <div className="flex md:flex-row flex-col items-center gap-x-2">
                  <small className="text-(--text-1) md:flex hidden">
                    Multiple Owners?
                  </small>
                  <button
                    onClick={addOwner}
                    className="flex items-center gap-2 px-3 py-2 bg-foreground text-background text-sm rounded hover:bg-foreground/85 cursor-pointer transition"
                  >
                    <HiPlus className="w-4 h-4" />
                    Add Owner
                  </button>
                </div>
              </div>
            }
            footer={
              <div className="flex md:flex-row flex-col gap-4 pt-6">
                <button onClick={handlePrevious} className={baseButtonWhite}>
                  Go Back
                </button>
                <button onClick={handleNext} className={baseButtonBlack}>
                  Proceed to Company Documents
                </button>
              </div>
            }
          >
            <div className="space-y-8">
              {formData.owners.map((owner, index) => (
                <div
                  key={owner.id}
                  className="space-y-6 border-b border-(--grey-1) pb-8 last:border-0"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-900">
                      Owner {formData.owners.length - index}
                    </p>
                    {formData.owners.length > 1 && (
                      <button
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            owners: prev.owners.filter(
                              (o) => o.id !== owner.id,
                            ),
                          }));
                        }}
                        className="text-(--red-1) text-sm hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Identification Section */}
                  <div className="space-y-4">
                    <div className="relative flex items-center justify-center my-6">
                      <div className="absolute inset-x-0 top-1/2 border-t border-(--grey-1)" />
                      <span className="relative bg-background font-medium px-4 text-foreground uppercase text-[14px]">
                        IDENTIFICATION
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <input
                          title="first name"
                          placeholder="firstname"
                          value={owner.firstName}
                          onChange={(e) =>
                            updateOwner(owner.id, { firstName: e.target.value })
                          }
                          className={baseInput}
                        />
                        {errors[`owner_${owner.id}_firstName`] && (
                          <p className="text-(--red-1) text-sm">
                            {errors[`owner_${owner.id}_firstName`]}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <input
                          title="last name"
                          placeholder="lastname"
                          value={owner.lastName}
                          onChange={(e) =>
                            updateOwner(owner.id, { lastName: e.target.value })
                          }
                          className={baseInput}
                        />
                        {errors[`owner_${owner.id}_lastName`] && (
                          <p className="text-(--red-1) text-sm">
                            {errors[`owner_${owner.id}_lastName`]}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <input
                          title="email"
                          value={owner.email}
                          placeholder="email"
                          onChange={(e) =>
                            updateOwner(owner.id, { email: e.target.value })
                          }
                          className={baseInput}
                        />
                        {errors[`owner_${owner.id}_email`] && (
                          <p className="text-(--red-1) text-sm">
                            {errors[`owner_${owner.id}_email`]}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <input
                          title="phone number"
                          placeholder="phone number"
                          value={owner.phoneNumber}
                          onChange={(e) =>
                            updateOwner(owner.id, {
                              phoneNumber: e.target.value,
                            })
                          }
                          className={baseInput}
                        />
                        {errors[`owner_${owner.id}_phoneNumber`] && (
                          <p className="text-(--red-1) text-sm">
                            {errors[`owner_${owner.id}_phoneNumber`]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <select
                          title="dob"
                          value={owner.dayOfBirth}
                          onChange={(e) =>
                            updateOwner(owner.id, {
                              dayOfBirth: e.target.value,
                            })
                          }
                          className={baseSelect}
                        >
                          <option value="">Day of Birth*</option>
                          {[...Array(31)].map((_, i) => (
                            <option key={i + 1} value={String(i + 1)}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        {errors[`owner_${owner.id}_dayOfBirth`] && (
                          <p className="text-(--red-1) text-sm">
                            {errors[`owner_${owner.id}_dayOfBirth`]}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <select
                          title="mob"
                          value={owner.monthOfBirth}
                          onChange={(e) =>
                            updateOwner(owner.id, {
                              monthOfBirth: e.target.value,
                            })
                          }
                          className={baseSelect}
                        >
                          <option value="">Month of Birth*</option>
                          {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={String(i + 1)}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        {errors[`owner_${owner.id}_monthOfBirth`] && (
                          <p className="text-(--red-1) text-sm">
                            {errors[`owner_${owner.id}_monthOfBirth`]}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <select
                          title="yob"
                          value={owner.yearOfBirth}
                          onChange={(e) =>
                            updateOwner(owner.id, {
                              yearOfBirth: e.target.value,
                            })
                          }
                          className={baseSelect}
                        >
                          <option value="">Year of Birth*</option>
                          {[...Array(100)].map((_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                              <option key={year} value={String(year)}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                        {errors[`owner_${owner.id}_yearOfBirth`] && (
                          <p className="text-(--red-1) text-sm">
                            {errors[`owner_${owner.id}_yearOfBirth`]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <select
                          title="owner document"
                          value={owner.idDoc1}
                          onChange={(e) =>
                            updateOwner(owner.id, { idDoc1: e.target.value })
                          }
                          className={baseSelect}
                        >
                          <option value="">Identification Document*</option>
                          <option value="Passport">Passport</option>
                          <option value="Driver License">Driver License</option>
                          <option value="National ID">National ID</option>
                        </select>
                        {errors[`owner_${owner.id}_idDoc1`] && (
                          <p className="text-(--red-1) text-sm">
                            {errors[`owner_${owner.id}_idDoc1`]}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <input
                          type="text"
                          placeholder="Identification Number*"
                          value={owner.idNumber1}
                          onChange={(e) =>
                            updateOwner(owner.id, { idNumber1: e.target.value })
                          }
                          className={baseInput}
                        />
                      </div>
                      {errors[`owner_${owner.id}_idNumber1`] && (
                        <p className="text-(--red-1) text-sm">
                          {errors[`owner_${owner.id}_idNumber1`]}
                        </p>
                      )}
                    </div>

                    <FilePickerField
                      label="Upload Identification Document"
                      file={owner.idUpload}
                      onFileChange={(file) =>
                        updateOwner(owner.id, { idUpload: file })
                      }
                      onFileRemove={() =>
                        updateOwner(owner.id, { idUpload: null })
                      }
                      error={errors[`owner_${owner.id}_idUpload`]}
                      required
                    />
                  </div>

                  {/* Home Address Section */}
                  <div className="space-y-4 pt-6">
                    <div className="relative flex items-center justify-center my-6">
                      <div className="absolute inset-x-0 top-1/2 border-t border-(--grey-1)" />
                      <span className="relative bg-background font-medium px-4 text-foreground uppercase text-[14px]">
                        HOME ADDRESS
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <select
                          title="state"
                          value={owner.homeState}
                          onChange={(e) =>
                            updateOwner(owner.id, { homeState: e.target.value })
                          }
                          className={baseInput}
                        >
                          <option value="">State or Region*</option>
                          <option value="Lagos">Lagos</option>
                          <option value="Abuja">Abuja</option>
                        </select>
                        {errors[`owner_${owner.id}_homeState`] && (
                          <p className="text-(--red-1) text-sm">
                            {errors[`owner_${owner.id}_homeState`]}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <select
                          title="city"
                          value={owner.homeCity}
                          onChange={(e) =>
                            updateOwner(owner.id, { homeCity: e.target.value })
                          }
                          className={baseSelect}
                        >
                          <option value="">City*</option>
                          <option value="Ikeja">Ikeja</option>
                          <option value="Victoria Island">
                            Victoria Island
                          </option>
                        </select>
                        {errors[`owner_${owner.id}_homeCity`] && (
                          <p className="text-(--red-1) text-sm">
                            {errors[`owner_${owner.id}_homeCity`]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <select
                          title="postal code"
                          value={owner.homePostalCode}
                          onChange={(e) =>
                            updateOwner(owner.id, {
                              homePostalCode: e.target.value,
                            })
                          }
                          className={baseSelect}
                        >
                          <option value="">Postal Code*</option>
                          <option value="100001">100001</option>
                          <option value="100002">100002</option>
                        </select>
                        {errors[`owner_${owner.id}_homePostalCode`] && (
                          <p className="text-(--red-1) text-sm">
                            {errors[`owner_${owner.id}_homePostalCode`]}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <input
                          title="street"
                          placeholder="Street Address"
                          value={owner.homeStreet}
                          onChange={(e) =>
                            updateOwner(owner.id, {
                              homeStreet: e.target.value,
                            })
                          }
                          className={baseInput}
                        />
                        {errors[`owner_${owner.id}_homeStreet`] && (
                          <p className="text-(--red-1) text-sm">
                            {errors[`owner_${owner.id}_homeStreet`]}
                          </p>
                        )}
                      </div>
                    </div>

                    <FilePickerField
                      label="Proof of Address"
                      file={owner.homeProofUpload}
                      onFileChange={(file) =>
                        updateOwner(owner.id, { homeProofUpload: file })
                      }
                      onFileRemove={() =>
                        updateOwner(owner.id, { homeProofUpload: null })
                      }
                      error={errors[`owner_${owner.id}_homeProofUpload`]}
                      required
                    />

                    <div className="bg-background border border-(--grey-1) mt-12 rounded-lg text-[14px] text-(--text-1) space-y-2">
                      <div className="bg-(--grey-4) py-4 px-2">
                        <p className="font-semibold text-foreground">
                          This action requires:
                        </p>
                      </div>
                      <div className="p-4 space-y-3">
                        <p className="text-xs">
                          Proof of address can be any of the following
                          documents:
                        </p>
                        <ol className="list-decimal list-inside text-xs space-y-1">
                          <li>Utility bill (not later than 3 months old).</li>
                          <li>
                            Bank statement showing current address (not later
                            than 6 months old).
                          </li>
                          <li>Tax statements (last two taxable years).</li>
                          <li>Government-issued ID with address.</li>
                          <li>Letter from a public authority.</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </KYBStepWrapper>
        )}

        {/* Step 5: Company Documents */}
        {currentStep === 5 && (
          <KYBStepWrapper
            title="Company Documents"
            footer={
              <div className="flex md:flex-row flex-col gap-4">
                <button onClick={handlePrevious} className={baseButtonWhite}>
                  Go Back
                </button>
                <button onClick={handleNext} className={baseButtonBlack}>
                  Proceed to Bank Details
                </button>
              </div>
            }
          >
            <p className="text-(--text-1) text-[16px]">
              Please upload all the relevant documents as requested
            </p>

            {/* Incorporation Documents */}
            <div>
              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-x-0 top-1/2 border-t border-(--grey-1)" />
                <span className="relative bg-background px-4 text-(--text-1) uppercase font-medium text-[14px]">
                  Incorporation Documents
                </span>
              </div>

              <div className="space-y-3">
                <FilePickerField
                  label="Certification of Incorporation (Formation)"
                  file={formData.incorporationDoc}
                  onFileChange={(file) =>
                    updateFormData({ incorporationDoc: file })
                  }
                  onFileRemove={() =>
                    updateFormData({ incorporationDoc: null })
                  }
                  error={errors.incorporationDoc}
                  required
                />
                <FilePickerField
                  label="Tax Filing Document (Optional)"
                  file={formData.taxFilingDoc}
                  onFileChange={(file) =>
                    updateFormData({ taxFilingDoc: file })
                  }
                  onFileRemove={() => updateFormData({ taxFilingDoc: null })}
                />
                <FilePickerField
                  label="Status of Registration"
                  file={formData.registrationStatus}
                  onFileChange={(file) =>
                    updateFormData({ registrationStatus: file })
                  }
                  onFileRemove={() =>
                    updateFormData({ registrationStatus: null })
                  }
                  error={errors.registrationStatus}
                  required
                />
                <FilePickerField
                  label="Memorandum of Understanding"
                  file={formData.mouDoc}
                  onFileChange={(file) => updateFormData({ mouDoc: file })}
                  onFileRemove={() => updateFormData({ mouDoc: null })}
                  error={errors.mouDoc}
                  required
                />
                <FilePickerField
                  label="Register of Board of Directors"
                  file={formData.boardRegisterDoc}
                  onFileChange={(file) =>
                    updateFormData({ boardRegisterDoc: file })
                  }
                  onFileRemove={() =>
                    updateFormData({ boardRegisterDoc: null })
                  }
                  error={errors.boardRegisterDoc}
                  required
                />
              </div>
            </div>

            {/* Proof of Address */}
            <div>
              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-x-0 top-1/2 border-t border-(--grey-1)" />
                <span className="relative bg-background px-4 text-foreground uppercase text-[16px] font-medium">
                  PROOF OF ADDRESS
                </span>
              </div>
              <p className="text-(--text-1) text-[14px] mb-4">
                You are to upload one of the following document- Utility bill,
                bank statement and tax filing showing the registered address of
                the company
              </p>
              <FilePickerField
                label="Proof of Address"
                file={formData.proofOfAddressDoc}
                onFileChange={(file) =>
                  updateFormData({ proofOfAddressDoc: file })
                }
                onFileRemove={() => updateFormData({ proofOfAddressDoc: null })}
                error={errors.proofOfAddressDoc}
                required
              />
            </div>

            {/* AML Document */}
            <div>
              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-x-0 top-1/2 border-t border-(--grey-1)" />
                <span className="relative bg-background px-4 text-foreground uppercase text-[16px] font-medium">
                  AML DOCUMENT
                </span>
              </div>
              <p className="text-(--text-1) text-[14px] mb-4">
                Please upload your AML (Anti-Money Laundering) compliance
                document. This is required to ensure regulatory compliance.
              </p>
              <div className="space-y-3">
                <FilePickerField
                  label="Customer Due Diligence"
                  file={formData.DueDiligenceDoc}
                  onFileChange={(file) =>
                    updateFormData({ DueDiligenceDoc: file })
                  }
                  onFileRemove={() => updateFormData({ DueDiligenceDoc: null })}
                  error={errors.DueDiligenceDoc}
                  required
                />
                <FilePickerField
                  label="AML Policy and Procedures"
                  file={formData.amlDoc}
                  onFileChange={(file) => updateFormData({ amlDoc: file })}
                  onFileRemove={() => updateFormData({ amlDoc: null })}
                  error={errors.amlDoc}
                  required
                />
              </div>
            </div>

            {/* Supporting Documents */}
            <div>
              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-x-0 top-1/2 border-t border-(--grey-1)" />
                <span className="relative bg-background px-4 text-foreground uppercase text-[16px] font-medium">
                  OTHER SUPPORTING DOCUMENTS
                </span>
              </div>
              <p className="text-(--text-1) text-[14px] mb-4">
                Upload other supporting documents
              </p>
              <MultiFilePickerField
                label="Supporting Document"
                files={formData.supportingDoc}
                onFilesChange={(files) =>
                  updateFormData({ supportingDoc: files })
                }
                error={errors.supportingDoc}
              />
            </div>
          </KYBStepWrapper>
        )}

        {/* Step 6: Bank Account Details */}
        {currentStep === 6 && (
          <KYBStepWrapper
            title="Bank Account Details"
            footer={
              <div className="flex md:flex-row flex-col gap-4">
                <button onClick={handlePrevious} className={baseButtonWhite}>
                  Go Back
                </button>
                <button onClick={handleNext} className={baseButtonBlack}>
                  Proceed to Submit
                </button>
              </div>
            }
          >
            <p className="text-(--text-1) text-[14px]">
              To help us verify your account, the name on your bank account
              should match the name you provided as the owner of your business
            </p>

            <select
              title="bank name"
              value={formData.bankName}
              onChange={(e) => updateFormData({ bankName: e.target.value })}
              className={`${baseSelect} w-full`}
            >
              <option value="">Bank Name*</option>
              <option value="First Bank">First Bank</option>
              <option value="GTBank">GTBank</option>
              <option value="Access Bank">Access Bank</option>
              <option value="Zenith Bank">Zenith Bank</option>
            </select>
            {errors.bankName && (
              <p className="text-(--red-1) text-sm -mt-6 ml-1">
                {errors.bankName}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Account Number* (10 digits, e.g. 0123456789)"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    updateFormData({ accountNumber: e.target.value })
                  }
                  className={baseInput}
                />
                {errors.accountNumber && (
                  <p className="text-(--red-1) text-sm">
                    {errors.accountNumber}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Account Name*"
                  value={formData.accountName}
                  onChange={(e) =>
                    updateFormData({ accountName: e.target.value })
                  }
                  className={baseInput}
                />
                {errors.accountName && (
                  <p className="text-(--red-1) text-sm">{errors.accountName}</p>
                )}
              </div>
            </div>
          </KYBStepWrapper>
        )}

        {/* Step 7: Service of Agreement */}
        {currentStep === 7 && (
          <KYBStepWrapper
            title={<p className="font-semibold text-gray-900">Notice</p>}
            footer={
              <div className="flex md:flex-row flex-col gap-4">
                <button onClick={handlePrevious} className={baseButtonWhite}>
                  Go Back
                </button>
                <button onClick={handleSubmit} className={baseButtonBlack}>
                  Submit {loading && <Spinner />}
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              <Kyc_status_banner status="pending" />
            </div>
          </KYBStepWrapper>
        )}
      </div>
    </div>
  );
}
