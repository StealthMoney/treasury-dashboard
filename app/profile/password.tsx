"use client";

import { useState } from "react";
import { PasswordField } from "../components/reusables/general_inputs";
import { AiOutlineCheck } from "react-icons/ai";
import { KYBStepWrapper } from "../components/reusables/kybstepwraper";

interface PasswordCriteria {
  minChars: boolean;
  uppercase: boolean;
  special: boolean;
  lowercase: boolean;
  numbers: boolean;
}

export function PasswordSettingTab() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [criteria, setCriteria] = useState<PasswordCriteria>({
    minChars: false,
    uppercase: false,
    special: false,
    lowercase: false,
    numbers: false,
  });

  const checkPasswordCriteria = (password: string) => {
    setCriteria({
      minChars: password.length >= 10,
      uppercase: /[A-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /[0-9]/.test(password),
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!oldPassword.trim()) {
      newErrors.oldPassword = "Old password is required";
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 10) {
      newErrors.newPassword = "Password must be at least 10 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (newPassword === oldPassword) {
      newErrors.newPassword =
        "New password must be different from old password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    checkPasswordCriteria(value);
  };

  const handleSave = () => {
    if (validateForm()) {
      alert("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setCriteria({
        minChars: false,
        uppercase: false,
        special: false,
        lowercase: false,
        numbers: false,
      });
    }
  };

  return (
    <KYBStepWrapper title="Password Settings">
      <div className="space-y-6">
        <div>
          <div className="space-y-4 max-w-xl">
            {/* Old Password */}
            <div>
              <h4 className="text-sm font-medium mb-2">Old Password</h4>
              <PasswordField
                label=""
                id="oldPassword"
                placeholder="Password"
                value={oldPassword}
                onChange={setOldPassword}
                error={errors.oldPassword}
              />
            </div>

            {/* New Password and Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">New Password</h4>
                <PasswordField
                  label=""
                  id="newPassword"
                  placeholder="Password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  error={errors.newPassword}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Confirm Password</h4>
                <PasswordField
                  label=""
                  id="confirmPassword"
                  placeholder="Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  error={errors.confirmPassword}
                />
              </div>
            </div>

            {/* Password Criteria */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer border border-(--grey-1) rounded-full px-2 py-1">
                  <div
                    className={`w-4 h-4 flex items-center border-2 justify-center rounded-full shrink-0 transition-all duration-200 ${criteria.minChars ? "bg-[#009D50] border-[#009D50]" : "border-(--grey-1)"}`}
                  >
                    {criteria.minChars && (
                      <AiOutlineCheck className="w-3 h-3 text-background" />
                    )}
                  </div>
                  <span className="text-sm">10 characters</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer border border-(--grey-1) rounded-full px-2 py-1">
                  <div
                    className={`w-4 h-4 flex items-center border-2 justify-center rounded-full shrink-0 transition-all duration-200 ${criteria.uppercase ? "bg-[#009D50] border-[#009D50]" : "border-(--grey-1)"}`}
                  >
                    {criteria.uppercase && (
                      <AiOutlineCheck className="w-3 h-3 text-background" />
                    )}
                  </div>
                  <span className="text-sm">Uppercase</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer border border-(--grey-1) rounded-full px-2 py-1">
                  <div
                    className={`w-4 h-4 flex items-center border-2 justify-center rounded-full shrink-0 transition-all duration-200 ${criteria.special ? "bg-[#009D50] border-[#009D50]" : "border-(--grey-1)"}`}
                  >
                    {criteria.special && (
                      <AiOutlineCheck className="w-3 h-3 text-background" />
                    )}
                  </div>
                  <span className="text-sm">Special Character</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer border border-(--grey-1) rounded-full px-2 py-1">
                  <div
                    className={`w-4 h-4 flex items-center border-2 justify-center rounded-full shrink-0 transition-all duration-200 ${criteria.lowercase ? "bg-[#009D50] border-[#009D50]" : "border-(--grey-1)"}`}
                  >
                    {criteria.lowercase && (
                      <AiOutlineCheck className="w-3 h-3 text-background" />
                    )}
                  </div>
                  <span className="text-sm">Lowercase</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer border border-(--grey-1) rounded-full px-2 py-1">
                  <div
                    className={`w-4 h-4 flex items-center border-2 justify-center rounded-full shrink-0 transition-all duration-200 ${criteria.numbers ? "bg-[#009D50] border-[#009D50]" : "border-(--grey-1)"}`}
                  >
                    {criteria.numbers && (
                      <AiOutlineCheck className="w-3 h-3 text-background" />
                    )}
                  </div>
                  <span className="text-sm">Numbers</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-foreground text-background rounded-lg font-medium hover:cursor-pointer transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </KYBStepWrapper>
  );
}
