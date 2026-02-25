"use client";

import { useState, useRef, ChangeEvent } from "react";
import { TextField, SelectField } from "../reusables/general_inputs";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { KYBStepWrapper } from "../reusables/kybstepwraper";
import Image from "next/image";

interface ProfileTabProps {
  onSave?: (data: ProfileData) => void;
}

interface ProfileData {
  businessName: string;
  businessEmail: string;
  businessWebsite: string;
  businessEntity: string;
  logoFile?: File;
}

export function ProfileTab({ onSave }: ProfileTabProps) {
  const [data, setData] = useState<ProfileData>({
    businessName: "Moneywave",
    businessEmail: "moneywave@gmail.com",
    businessWebsite: "moneywave.com",
    businessEntity: "Sole Proprietorship",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }

    if (!data.businessEmail.trim()) {
      newErrors.businessEmail = "Business email is required";
    } else if (!validateEmail(data.businessEmail)) {
      newErrors.businessEmail =
        "Please enter a valid email (e.g., name@domain.com)";
    }

    if (!data.businessWebsite.trim()) {
      newErrors.businessWebsite = "Business website is required";
    }

    if (!data.businessEntity.trim()) {
      newErrors.businessEntity = "Business entity is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          logo: "Only image files are allowed",
        }));
        return;
      }

      setUploadedFileName(file.name);
      setData((prev) => ({ ...prev, logoFile: file }));
      setLogoPreview(URL.createObjectURL(file));

      setErrors((prev) => {
        const { logo, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave?.(data);
      alert("Profile saved successfully!");
    }
  };

  return (
    <KYBStepWrapper title="Business Profile">
      <div className="space-y-6">
        <div>
          {/* Logo Upload */}
          <div className="mb-6 flex items-start gap-4">
            <div className="shrink-0">
              <div className="w-20 h-20 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                <Image
                  src={logoPreview || "/images/pending.svg"}
                  alt="Business logo preview"
                  className="w-full h-full object-cover rounded-full"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="space-y-2">
                <h4 className="font-medium">Business Logo</h4>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
                >
                  <span className="text-xl">+</span>
                  <span>Upload file</span>
                </button>
                {errors.logo && (
                  <p className="text-xs text-red-500">{errors.logo}</p>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload business logo"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Business Name"
                id="businessName"
                placeholder="Enter business name"
                value={data.businessName}
                onChange={(v) =>
                  setData((prev) => ({ ...prev, businessName: v }))
                }
                error={errors.businessName}
              />
              <TextField
                label="Business Email"
                id="businessEmail"
                placeholder="Enter business email"
                type="email"
                value={data.businessEmail}
                onChange={(v) =>
                  setData((prev) => ({ ...prev, businessEmail: v }))
                }
                error={errors.businessEmail}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Business Website"
                id="businessWebsite"
                placeholder="moneywave.com"
                prefix="https://"
                value={data.businessWebsite}
                onChange={(v) =>
                  setData((prev) => ({ ...prev, businessWebsite: v }))
                }
                error={errors.businessWebsite}
              />
              <SelectField
                label="Business Entity"
                id="businessEntity"
                value={data.businessEntity}
                onChange={(v) =>
                  setData((prev) => ({ ...prev, businessEntity: v }))
                }
                options={[
                  "Sole Proprietorship",
                  "Partnership",
                  "Limited Liability Company",
                  "Corporation",
                  "Non-profit",
                ]}
                placeholder="Select business entity"
                error={errors.businessEntity}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-black/90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </KYBStepWrapper>
  );
}
