"use client";

import React, { useState, useEffect } from "react";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  currency: "NGN" | "USD";
  onCurrencyChange: (currency: "NGN" | "USD") => void;
  placeholder?: string;
  label?: string;
  description: string;
  balance?: number;
  showmax: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  currency,
  onCurrencyChange,
  placeholder = "Amount to purchase",
  label,
  description = "you will receive:",
  balance,
  showmax = false,
}) => {
  const [receivedAmount, setReceivedAmount] = useState("0.00");

  // Mock exchange rates
  const exchangeRates = {
    NGN: 1456,
    USD: 1,
  };

  useEffect(() => {
    if (value && !isNaN(Number(value))) {
      const amount = Number(value);
      const rateUSDT = exchangeRates[currency];
      const received = (amount / rateUSDT).toFixed(2);
      setReceivedAmount(received);
    } else {
      setReceivedAmount("0.00");
    }
  }, [value, currency]);

  return (
    <div className="space-y-4">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="flex">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 border bg-(--grey-4) text-(--text-1) border-(--grey-1) rounded-bl-lg rounded-tl-lg focus:outline-none"
        />
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value as "NGN" | "USD")}
          className="px-4 py-3 border border-(--grey-1) rounded-br-lg rounded-tr-lg bg-background focus:outline-none cursor-pointer font-medium"
        >
          <option value="NGN">NGN</option>
          <option value="USD">USD</option>
        </select>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-(--text-1)">
          {description}{" "}
          <span className="font-semibold text-foreground">
            {balance?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            }) || receivedAmount}{" "}
            USDT
          </span>
        </p>

        {showmax && (
          <button className="px-3 py-1 text-xs font-medium text-foreground">
            Max
          </button>
        )}
      </div>
    </div>
  );
};
