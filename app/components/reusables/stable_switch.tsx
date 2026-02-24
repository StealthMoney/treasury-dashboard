"use client";

type Stable = "USDC" | "USDT";

export default function StableSwitch({
  value,
  onChange,
}: {
  value: Stable;
  onChange: (v: Stable) => void;
}) {
  const isUSDC = value === "USDC";

  return (
    <div className="relative w-fit bg-(--grey-1) rounded-xl px-1 py-2 flex">
      {/* Sliding pill */}
      <div
        className={`
          absolute
          top-1
          left-1
          h-[calc(100%-8px)]
          w-1/2
          bg-background
          rounded-lg
          transition-transform
          duration-300
          ease-out
          ${isUSDC ? "translate-x-0" : "translate-x-full"}
        `}
      />

      {/* USDC */}
      <button
        onClick={() => onChange("USDC")}
        className={`
          relative z-10
          px-4 sm:px-6 py-2
          text-sm font-medium
          rounded-lg
          transition-colors
          cursor-pointer
          ${isUSDC ? "text-foreground" : "text-(--text-1)"}
        `}
      >
        Buy USDC
      </button>

      {/* USDT */}
      <button
        onClick={() => onChange("USDT")}
        className={`
          relative z-10
          px-4 sm:px-6 py-2
          text-sm font-medium
          rounded-lg
          transition-colors
          cursor-pointer
          ${!isUSDC ? "text-foreground" : "text-(--text-1)"}
        `}
      >
        Buy USDT
      </button>
    </div>
  );
}
