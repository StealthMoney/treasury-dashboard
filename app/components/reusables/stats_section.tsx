"use client";
import { HiPlus } from "react-icons/hi";

// ---- API / endpoint shape ----
export interface StatValueRow {
  main: string | number;
  suffix?: "USDC" | "USDT";
}

export interface StatData {
  label: string;
  value?: string | number;
  valueRow?: StatValueRow;
  footer?: string;
}

// ---- UI-only config ----
export interface StatUIConfig {
  index: number;
  footerClass?: string;
  showButton?: boolean;
}

export interface StatsSectionProps {
  actionDisabled: boolean;
  stats: StatData[];
  uiConfig?: StatUIConfig[];
  buttonLabel?: string;
  onButtonClick?: () => void;
  showPlus?: boolean;
}

export const StatsSection = ({
  actionDisabled,
  stats,
  uiConfig = [],
  buttonLabel = "Fund Treasury",
  onButtonClick,
  showPlus,
}: StatsSectionProps) => {
  return (
    <div
      className="
        grid grid-cols-1 sm:grid-cols-2 gap-4
        lg:flex lg:flex-nowrap lg:overflow-x-auto
        lg:gap-6
        mb-8 px-4
        border border-(--grey-1) rounded-lg
      "
    >
      {stats.map((stat, index) => {
        const isLast = index === stats.length - 1;
        const ui = uiConfig.find((c) => c.index === index);
        return (
          <div key={index} className="flex lg:items-center lg:flex-1">
            {/* Card */}
            <div
              className={`flex-1 ${ui?.showButton ? "lg:flex lg:items-center" : ""}`}
            >
              <div className="rounded-lg p-4 sm:p-6 bg-background">
                <p className="text-(--text-1) text-[16px] mb-2">{stat.label}</p>
                {stat.valueRow ? (
                  <div className="flex items-baseline gap-2 mb-2">
                    <h2 className="text-[24px] font-bold text-foreground">
                      {stat.valueRow.main}
                    </h2>
                    {stat.valueRow.suffix && (
                      <span className="text-(--text-1) text-[24px] font-medium">
                        {stat.valueRow.suffix}
                      </span>
                    )}
                  </div>
                ) : (
                  <h2 className="text-[24px] font-bold text-foreground mb-2 text-nowrap">
                    {stat.value}
                  </h2>
                )}
                {stat.footer && (
                  <p
                    className={`text-[16px] text-nowrap ${ui?.footerClass ?? "text-(--grey-3)"}`}
                  >
                    {index === 0 && "Start Date:"} {stat.footer}
                  </p>
                )}
              </div>
              {/* Optional Button — UI-only */}
              {ui?.showButton && (
                <div className="mt-4">
                  <button
                    disabled={actionDisabled}
                    onClick={onButtonClick}
                    className="flex items-center cursor-pointer gap-2 px-3 sm:px-8 py-2 sm:py-3 bg-foreground text-background text-[16px] rounded-full hover:bg-gray-800 transition whitespace-nowrap"
                  >
                    {showPlus && <HiPlus className="w-4 h-4 sm:w-5 sm:h-5" />}
                    <span>{buttonLabel}</span>
                  </button>
                </div>
              )}
            </div>
            {/* Divider — laptop and up */}
            {!isLast && (
              <div className="hidden lg:flex w-2 h-[80%] border-r border-r-(--grey-1) ml-6"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};
