"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineCheck,
} from "react-icons/ai";
import Image from "next/image";

// ─── Password criteria ───────────────────────────────────────────────────────
const PASSWORD_CRITERIA = [
  {
    key: "length",
    label: "10 characters",
    test: (p: string) => p.length >= 10,
  },
  { key: "upper", label: "Uppercase", test: (p: string) => /[A-Z]/.test(p) },
  {
    key: "special",
    label: "Special Character",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
  { key: "lower", label: "Lowercase", test: (p: string) => /[a-z]/.test(p) },
  { key: "number", label: "Numbers", test: (p: string) => /[0-9]/.test(p) },
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Left panel (shared) ─────────────────────────────────────────────────────
function LeftPanel() {
  return (
    <div className="hidden md:flex flex-col w-1/2 bg-white">
      {/* Isometric illustration placeholder */}
      <div className="flex-1 bg-[#f5f5f3] flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-105 md:h-130 lg:h-75">
          <Image
            src="/images/treasury.svg"
            alt="treasury dashboard"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* Features */}
      <div className="p-10 space-y-6 bg-[#FBFBFB]">
        <div>
          <h3 className="text-foreground text-[16px] font-medium mb-1">
            Automate Your Stablecoin Treasury
          </h3>
          <p className="text-(--text-1) text-[16px] leading-relaxed">
            Set up automated USDT & USDC accumulation tailored to your business
            cash flow.
          </p>
        </div>
        <div>
          <h3 className="font-medium text-[16px] text-foreground mb-1">
            Upgrade Your Financial Stack
          </h3>
          <p className="text-(--text-1) text-[16px] leading-relaxed">
            Move beyond traditional banking rails with programmable, stable
            digital assets.
          </p>
        </div>
        <div>
          <h3 className="font-medium text-[16px] text-foreground mb-1">
            Treasury That Works in the Background
          </h3>
          <p className="text-(--text-1) text-[16px] leading-relaxed">
            Connect your payment or bookkeeping tools and automatically allocate
            a portion of revenue to stablecoins.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-10 py-4 flex items-center gap-4 text-xs text-(--text-1) bg-[#FBFBFB]">
        <span>© Stealth Treasury</span>
        <span>·</span>
        <a href="#" className="hover:cursor-pointer transition-colors">
          Privacy & Terms
        </a>
        <span>·</span>
        <a href="#" className="hover:cursor-pointer transition-colors">
          Support
        </a>
      </div>
    </div>
  );
}

// ─── Input component ──────────────────────────────────────────────────────────
interface InputFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  prefix?: string;
  showToggle?: boolean;
  showPassword?: boolean;
  onToggle?: () => void;
}
function InputField({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  prefix,
  showToggle,
  showPassword,
  onToggle,
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div
        className={`flex items-center border rounded-lg bg-gray-50 focus-within:bg-white transition-all ${error ? "border-(--red-1) focus-within:border-(--red-1) focus-within:ring-1 focus-within:ring-red-200" : "border-gray-200 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-200"}`}
      >
        {prefix && (
          <span className="pl-3 text-gray-400 text-sm select-none whitespace-nowrap border-r border-gray-200 pr-3 py-2.5">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={showToggle ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2.5 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="pr-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={18} />
            ) : (
              <AiOutlineEye size={18} />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-(--red-1) mt-1">{error}</p>}
    </div>
  );
}

// ─── Sign Up Form ─────────────────────────────────────────────────────────────
function SignUpForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPw, setShowPw] = useState(false);

  const set = (k: string) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First Name is required";
    if (!form.lastName.trim()) e.lastName = "Last Name is required";
    if (!form.email.trim()) e.email = "Email Address is required";
    else if (!isValidEmail(form.email))
      e.email = "Incorrect format for Email Address";
    if (!form.password) e.password = "Password is required";
    else if (PASSWORD_CRITERIA.some((c) => !c.test(form.password)))
      e.password = "Password does not meet all criteria";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSuccess();
  };

  const criteriaMet = PASSWORD_CRITERIA.map((c) => c.test(form.password));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="First Name"
          id="firstName"
          placeholder="e.g., Moneywave"
          value={form.firstName}
          onChange={set("firstName")}
          error={errors.firstName}
        />
        <InputField
          label="Last Name"
          id="lastName"
          placeholder="e.g., Moneywave"
          value={form.lastName}
          onChange={set("lastName")}
          error={errors.lastName}
        />
      </div>
      <InputField
        label="Email Address"
        id="email"
        type="email"
        placeholder="e.g., Moneywave"
        value={form.email}
        onChange={set("email")}
        error={errors.email}
      />
      <InputField
        label="Password"
        id="password"
        placeholder="Password"
        value={form.password}
        onChange={set("password")}
        error={errors.password}
        showToggle
        showPassword={showPw}
        onToggle={() => setShowPw(!showPw)}
      />

      {/* Password criteria */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {PASSWORD_CRITERIA.map((c, i) => (
          <div
            key={c.key}
            className="flex items-center gap-1.5 border border-(--grey-1) rounded-full py-1 px-1"
          >
            <div
              className={`w-4 h-4 flex items-center border-2 justify-center rounded-full shrink-0 transition-all duration-200 ${criteriaMet[i] ? "bg-[#009D50] border-[#009D50]" : "border-(--grey-1)"}`}
            >
              {criteriaMet[i] && (
                <AiOutlineCheck size={10} className="text-white" />
              )}
            </div>
            <span
              className={`text-xs transition-colors duration-200 ${criteriaMet[i] ? "text-[#009D50] font-medium" : "text-gray-500"}`}
            >
              {c.label}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full bg-gray-900 hover:bg-gray-800 active:bg-black text-white font-medium py-3 rounded-xl transition-colors text-sm"
        >
          Create Account
        </button>
      </div>
      <p className="text-center text-xs text-gray-500">
        By creating an account, you agree to Stealth Treasury&apos;s
        <a
          href="#"
          className="underline font-medium text-gray-700 hover:text-gray-900"
        >
          Terms
        </a>
      </p>
    </form>
  );
}

// ─── Sign In Form ─────────────────────────────────────────────────────────────
function SignInForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPw, setShowPw] = useState(false);

  const set = (k: string) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.trim()) e.email = "Email Address is required";
    else if (!isValidEmail(form.email))
      e.email = "Incorrect format for Email Address";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Email Address"
        id="signinEmail"
        type="email"
        placeholder="e.g., Moneywave"
        value={form.email}
        onChange={set("email")}
        error={errors.email}
      />
      <InputField
        label="Password"
        id="signinPassword"
        placeholder="Password"
        value={form.password}
        onChange={set("password")}
        error={errors.password}
        showToggle
        showPassword={showPw}
        onToggle={() => setShowPw(!showPw)}
      />
      <p className="text-center text-[16px] text-(--text-1)">
        Forgot your password?{" "}
        <a
          href="#"
          className="font-medium underline text-foreground hover:cursor-pointer"
        >
          Click here
        </a>
      </p>
      <div className="lg:mt-32">
        <button
          type="submit"
          className="w-full bg-foreground hover:cursor-pointer active:bg-foreground text-background font-medium py-3 rounded-xl transition-colors text-sm"
        >
          Sign In
        </button>
      </div>
    </form>
  );
}

// ─── Main Auth Page ───────────────────────────────────────────────────────────
export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signup" | "signin">("signup");

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col">
      {/* Top nav */}
      <div className="flex justify-center py-4">
        <div className="flex bg-[#F5F5F5] rounded-full p-1">
          <button
            onClick={() => setTab("signup")}
            className={`px-6 py-2 rounded-full text-[16px] font-medium transition-all cursor-pointer ${tab === "signup" ? "bg-background text-foreground shadow-sm border border-(--grey-1)" : "text-(--text-1)"}`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setTab("signin")}
            className={`px-6 py-2 rounded-full text-[16px] font-medium transition-all cursor-pointer ${tab === "signin" ? "bg-background text-foreground shadow-sm border border-(--grey-1)" : "text-(--text-1)"}`}
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 bg-background lg:max-w-[90%] m-auto">
        <LeftPanel />

        {/* Right panel */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-10 overflow-y-auto">
          <div className="max-w-md w-full mx-auto">
            {tab === "signup" ? (
              <>
                <div className="mb-6">
                  <h1 className="text-[20px] font-medium text-foreground">
                    Create Your Account
                  </h1>
                  <p className="text-(--text-1) text-[16px] mt-1">
                    Let&apos;s start with basic information.
                  </p>
                </div>
                <SignUpForm onSuccess={() => router.push("/onboarding")} />
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h1 className="text-[20px] font-medium text-foreground">
                    Welcome Back
                  </h1>
                  <p className="text-(--text-1) text-[16px] mt-1">
                    Enter your email and password to pick up where you stopped.
                  </p>
                </div>
                <SignInForm onSuccess={() => router.push("/overview")} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom black bar */}
      <div className="h-16" />
    </div>
  );
}
