"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SelectField, TextField } from "../reusables/general_inputs";

// ─── Types ────────────────────────────────────────────────────────────────────
interface StepOneData {
  businessName: string;
  businessWebsite: string;
  entityType: string;
}
interface StepTwoData {
  streetAddress: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
}

const ENTITY_TYPES = [
  "LLC",
  "Corporation",
  "Partnership",
  "Sole Proprietorship",
  "Non-Profit",
  "Other",
];
const COUNTRIES = [
  "Nigeria",
  "United States",
  "United Kingdom",
  "Canada",
  "Ghana",
  "Kenya",
  "South Africa",
];
const STATES: Record<string, string[]> = {
  Nigeria: ["Lagos", "Abuja", "Rivers", "Kano", "Oyo", "Kaduna"],
  "United States": ["California", "New York", "Texas", "Florida", "Washington"],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  Canada: ["Ontario", "Quebec", "British Columbia", "Alberta"],
  Ghana: ["Greater Accra", "Ashanti", "Western", "Eastern"],
  Kenya: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"],
  "South Africa": ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape"],
};
const CITIES: Record<string, string[]> = {
  Lagos: ["Ikeja", "Victoria Island", "Lekki", "Yaba", "Surulere"],
  Abuja: ["Garki", "Wuse", "Maitama", "Asokoro"],
  California: ["Los Angeles", "San Francisco", "San Diego", "San Jose"],
  "New York": ["New York City", "Buffalo", "Albany", "Rochester"],
  London: ["Central London", "East London", "West London", "North London"],
  England: ["London", "Manchester", "Birmingham", "Leeds"],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isValidUrl(url: string) {
  try {
    new URL("https://" + url);
    return url.length > 0;
  } catch {
    return false;
  }
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────
function StepOne({ onNext }: { onNext: (data: StepOneData) => void }) {
  const [data, setData] = useState<StepOneData>({
    businessName: "",
    businessWebsite: "",
    entityType: "",
  });
  const [errors, setErrors] = useState<Partial<StepOneData>>({});

  const set = (k: keyof StepOneData) => (v: string) =>
    setData((d) => ({ ...d, [k]: v }));

  const validate = () => {
    const e: Partial<StepOneData> = {};
    if (!data.businessName.trim()) e.businessName = "Business Name is required";
    if (!data.businessWebsite.trim())
      e.businessWebsite = "Business Website is required";
    else if (!isValidUrl(data.businessWebsite))
      e.businessWebsite = "Incorrect format for Business Website";
    if (!data.entityType) e.entityType = "Entity Type is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-5">
      <TextField
        label="Business Name"
        id="businessName"
        placeholder="e.g., Moneywave"
        value={data.businessName}
        onChange={set("businessName")}
        error={errors.businessName}
      />
      <TextField
        label="Business Website"
        id="businessWebsite"
        placeholder="e.g., Moneywave"
        value={data.businessWebsite}
        onChange={set("businessWebsite")}
        error={errors.businessWebsite}
        prefix="https://"
      />
      <SelectField
        label="Entity Type"
        id="entityType"
        value={data.entityType}
        onChange={set("entityType")}
        options={ENTITY_TYPES}
        placeholder="Select entity type"
        error={errors.entityType}
      />
      <div className="pt-4">
        <button
          type="button"
          onClick={() => {
            if (validate()) onNext(data);
          }}
          className="w-full bg-gray-900 hover:bg-gray-800 active:bg-black text-white font-medium py-3 rounded-xl transition-colors text-sm"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────
function StepTwo({
  onBack,
  onFinish,
}: {
  onBack: () => void;
  onFinish: (data: StepTwoData) => void;
}) {
  const [data, setData] = useState<StepTwoData>({
    streetAddress: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
  });
  const [errors, setErrors] = useState<Partial<StepTwoData>>({});

  const set = (k: keyof StepTwoData) => (v: string) => {
    setData((d) => {
      const next = { ...d, [k]: v };
      if (k === "country") {
        next.state = "";
        next.city = "";
      }
      if (k === "state") {
        next.city = "";
      }
      return next;
    });
  };

  const validate = () => {
    const e: Partial<StepTwoData> = {};
    if (!data.streetAddress.trim())
      e.streetAddress = "Street Address is required";
    if (!data.country) e.country = "Country is required";
    if (!data.state) e.state = "State is required";
    if (!data.city) e.city = "City is required";
    if (!data.zipCode.trim()) e.zipCode = "Zip Code is required";
    else if (!/^\d{4,10}$/.test(data.zipCode.trim()))
      e.zipCode = "Incorrect format for Zip Code";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const availableStates = data.country ? STATES[data.country] || [] : [];
  const availableCities = data.state
    ? CITIES[data.state] || ["City 1", "City 2", "City 3"]
    : [];

  return (
    <div className="space-y-5">
      <TextField
        label="Street Address"
        id="streetAddress"
        placeholder="e.g., Moneywave"
        value={data.streetAddress}
        onChange={set("streetAddress")}
        error={errors.streetAddress}
      />
      <SelectField
        label="Country"
        id="country"
        value={data.country}
        onChange={set("country")}
        options={COUNTRIES}
        placeholder="Select Country"
        error={errors.country}
      />
      <SelectField
        label="State"
        id="state"
        value={data.state}
        onChange={set("state")}
        options={availableStates}
        placeholder="Select State"
        error={errors.state}
        disabled={!data.country}
      />
      <SelectField
        label="City"
        id="city"
        value={data.city}
        onChange={set("city")}
        options={availableCities}
        placeholder="Select City"
        error={errors.city}
        disabled={!data.state}
      />
      <TextField
        label="Zip Code"
        id="zipCode"
        placeholder="00000"
        value={data.zipCode}
        onChange={set("zipCode")}
        error={errors.zipCode}
      />
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-(--grey-1) bg-background hover:cursor-pointer text-foreground font-medium py-3 rounded-xl transition-colors text-[16px]"
        >
          Go Back
        </button>
        <button
          type="button"
          onClick={() => {
            if (validate()) onFinish(data);
          }}
          className="flex-1 bg-foreground hover:cursor-pointer active:bg-foreground text-background font-medium py-3 rounded-xl transition-colors text-[16px]"
        >
          Create Your Account
        </button>
      </div>
    </div>
  );
}

// ─── Onboarding Page ──────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const handleStepOneNext = (_data: StepOneData) => setStep(2);
  const handleFinish = (_data: StepTwoData) => router.push("/overview");

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl border border-(--grey-1) w-full max-w-150 overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[20px] font-medium text-foreground">
              Create Your Account
            </h1>
            <p className="text-(--text-1) text-[16px] mt-1">
              {step === 1
                ? "Let's start with basic information."
                : "Now add your physical address details."}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-(--grey-1)">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-xs font-bold text-foreground tracking-widest">
                STEP {step}
              </span>
              <span className="text-xs text-(--text-1) tracking-widest">
                /2 —
              </span>
              <span className="text-[16px] font-medium text-(--text-1) tracking-widest">
                {step === 1 ? "BUSINESS INFO" : "BUSINESS ADDRESS"}
              </span>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Steps */}
          {step === 1 ? (
            <StepOne onNext={handleStepOneNext} />
          ) : (
            <StepTwo onBack={() => setStep(1)} onFinish={handleFinish} />
          )}
        </div>
      </div>
    </div>
  );
}
