"use client";
interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  currency: "NGN" | "USD";
  onCurrencyChange: (currency: "NGN" | "USD") => void;
  placeholder?: string;
  label?: string;
  description: string;
  minamount?: number;
  assetName?: string;
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
  minamount,
  assetName = false,
  balance,
  showmax = false,
}) => {
  // Mock exchange rates
  const exchangeRates = {
    NGN: 1456,
    USD: 1,
  };

  const receivedAmount = (() => {
    if (value && !isNaN(Number(value))) {
      const amount = Number(value);
      const rateUSDT = exchangeRates[currency];
      return (amount / rateUSDT).toFixed(2);
    }
    return "0.00";
  })();

  const formatDisplay = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    return Number(digits).toLocaleString("en-US");
  };

  const stripCommas = (formatted: string) => formatted.replace(/,/g, "");

  const displayValue = formatDisplay(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = stripCommas(e.target.value);
    if (raw && !/^\d+$/.test(raw)) return;

    onChange(raw);
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <div className="flex">
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 border bg-(--grey-4) text-(--text-1) border-(--grey-1) rounded-bl-lg rounded-tl-lg focus:outline-none"
        />
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value as "NGN" | "USD")}
          className="px-4 py-3 border border-(--grey-1) rounded-br-lg rounded-tr-lg bg-background focus:outline-none cursor-pointer font-medium"
        >
          <option value="NGN">NGN</option>
          {/* <option value="USD">USD</option> */}
        </select>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-(--text-1)">
          {description}{" "}
          <span className="font-semibold text-foreground">
            {balance?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            }) || receivedAmount}{" "}
          </span>
          {assetName && <span className="ml-2">{assetName}</span>}
          {minamount && (
            <span className="font-semibold text-foreground">
              -{" "}
              {minamount?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}{" "}
            </span>
          )}
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
