"use client";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import React, { useState, ChangeEvent, useRef } from "react";
import { HiX } from "react-icons/hi";

type SelectOption = string | { label: string; value: string };

export function SelectField({
  label,
  id,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled,
}: {
  label: string | React.ReactNode;
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder: string;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-(--text-1)">
        {label}
      </label>
      <div
        className={`relative border rounded-lg bg-(--grey-4) transition-all ${error ? "border-(--red-1)" : "border-(--grey-1) focus-within:border-(--grey-1)"} ${disabled ? "opacity-50" : ""}`}
      >
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2.5 bg-transparent text-sm text-(--text-1) outline-none appearance-none cursor-pointer"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) =>
            typeof o === "string" ? (
              <option key={o} value={o}>
                {o}
              </option>
            ) : (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ),
          )}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--text-1)">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path
              d="M1 1L6 6L11 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-(--red-1)">{error}</p>}
    </div>
  );
}

export function FilePickerField({
  label,
  file,
  onFileChange,
  onFileRemove,
  error,
  required = false,
}: {
  label: string | React.ReactNode;
  file: File | null;
  onFileChange: (file: File | null) => void;
  onFileRemove: () => void;
  error?: string;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    onFileChange(picked);
  };

  return (
    <div>
      <label
        className="text-[14px] text-(--text-1) mb-2"
        aria-label={typeof label === "string" ? label : undefined}
      >
        {label} {required && "*"}
      </label>
      <input
        title="upload file"
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        className="hidden"
        onChange={handleFileChange}
      />
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-(--grey-1) rounded-lg p-4 text-center cursor-pointer bg-(--grey-4) transition hover:border-(--grey-2)"
      >
        <p className="text-(--text-1) text-[14px]">+ Choose file</p>
      </div>
      {file && (
        <div className="flex items-center justify-between bg-(--grey-4) p-2 rounded-lg mt-2">
          <p className="text-[12px] text-foreground truncate flex-1">
            📎 {file.name}
          </p>
          <button
            title="remove file"
            onClick={(e) => {
              e.stopPropagation();
              onFileRemove();
            }}
            className="p-1 hover:bg-(--grey-3) rounded-full transition"
            type="button"
          >
            <HiX className="w-4 h-4 text-(--red-1)" />
          </button>
        </div>
      )}
      {error && <p className="text-(--red-1) text-sm mt-1">{error}</p>}
    </div>
  );
}

// export function TextField({
//   label,
//   id,
//   placeholder,
//   value,
//   onChange,
//   error,
//   prefix,
// }: {
//   label: string;
//   id: string;
//   placeholder?: string;
//   value: string;
//   onChange: (v: string) => void;
//   error?: string;
//   prefix?: string;
// }) {
//   return (
//     <div className="space-y-1.5">
//       <label htmlFor={id} className="block text-sm font-medium text-(--text-1)">
//         {label}
//       </label>
//       <div
//         className={`flex items-center border rounded-lg bg-(--grey-4) transition-all ${error ? "border-(--red-1) focus-within:border-(--red-1)" : "border-(--grey-1) focus-within:border-(--grey-1)"}`}
//       >
//         {prefix && (
//           <span className="pl-3 pr-2 text-(--text-1) text-[14px] select-none border bg-background border-(--grey-1) py-2.5">
//             {prefix}
//           </span>
//         )}
//         <input
//           id={id}
//           type="text"
//           placeholder={placeholder}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           className="flex-1 px-3 py-2.5 bg-transparent text-[14px] text-foreground placeholder-(--text-1) outline-none"
//         />
//       </div>
//       {error && <p className="text-xs text-(--red-1)">{error}</p>}
//     </div>
//   );
// }

interface TextFieldProps {
  label: string;
  id: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  prefix?: string;
  type?: string;
  disabled?: boolean;
}

export function TextField({
  label,
  id,
  placeholder,
  value,
  onChange,
  error,
  prefix,
  type = "text",
  disabled = false,
}: TextFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div
        className={`flex items-center border rounded-lg bg-(--grey-4) transition-all ${error ? "border-(--red-1) focus-within:border-(--red-1)" : "border-(--grey-1) focus-within:border-(--grey-1)"}`}
      >
        {prefix && (
          <span className="pl-3 pr-2 text-(--text-1) text-[14px] select-none border bg-background border-(--grey-1) py-2.5">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          disabled={disabled}
          className="flex-1 px-3 py-2.5 bg-transparent text-[14px] text-foreground placeholder-(--text-1) outline-none"
        />
      </div>
      {error && <p className="text-xs text-(--red-1)">{error}</p>}
    </div>
  );
}

interface PasswordFieldProps {
  label: string;
  id: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  disabled?: boolean;
}

export function PasswordField({
  label,
  id,
  placeholder = "Password",
  value,
  onChange,
  error,
  disabled = false,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div
        className={`flex items-center border rounded-lg bg-(--grey-4) transition-all ${error ? "border-(--red-1) focus-within:border-(--red-1)" : "border-(--grey-1) focus-within:border-(--grey-1)"}`}
      >
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          disabled={disabled}
          className="flex-1 px-3 py-2.5 bg-transparent text-[14px] text-foreground placeholder-(--text-1) outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="pr-3 text-muted-foreground hover:text-foreground transition-colors"
          disabled={disabled}
        >
          {showPassword ? (
            <AiOutlineEyeInvisible size={20} />
          ) : (
            <AiOutlineEye size={20} />
          )}
        </button>
      </div>
      {error && <p className="text-xs text-(--red-1)">{error}</p>}
    </div>
  );
}
