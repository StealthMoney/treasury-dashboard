"use client";

import { HiCheckCircle } from "react-icons/hi";
import { StatData } from "../components/reusables/stats_section";
import {
  StatsSection,
  StatUIConfig,
} from "../components/reusables/stats_section";
import { Table } from "../components/reusables/table";
import { useState } from "react";
import { StepConfig } from "../components/reusables/modal";
import { StepModal } from "../components/reusables/modal";
import { CurrencyInput } from "../components/reusables/currencyInput";
import Image from "next/image";
import Success_table from "../components/reusables/success_table";

interface AllocationItem {
  id: number;
  asset: string;
  amount: string;
  amountUnit: string;
  value: string;
  allocation: string;
  allocationValue: string;
  pnl: string;
}

const allocationData: AllocationItem[] = [
  {
    id: 1,
    asset: "USDT",
    amount: "9,900.00",
    amountUnit: "USDT",
    value: "$9,900.00",
    allocation: "+$500",
    allocationValue: "green",
    pnl: "2.8%",
  },
  {
    id: 2,
    asset: "USDC",
    amount: "7,700.00",
    amountUnit: "USDC",
    value: "$7,700.00",
    allocation: "+$400",
    allocationValue: "green",
    pnl: "2.8%",
  },
];

const vaultActivityItems = [
  "Purchased: 9,900.00 USDT",
  "USDT moved into vault",
  "Transfer approved to operation",
];

export const vaultStatsData: StatData[] = [
  {
    label: "Total Vault Value",
    value: "$6,392.90",
    footer: "≈ $6,392.90",
  },
  {
    label: "Total PnL",
    value: "+$300",
    footer: "2.8%",
  },
  {
    label: "APY",
    value: "2.8%",
    footer: "Since — Jan 2026",
  },
];

export const vaultStatsUIConfig: StatUIConfig[] = [
  {
    index: 0,
    showButton: false,
  },
  {
    index: 1,
    footerClass: "text-(--green-1) font-semibold",
  },
  {
    index: 2,
    footerClass: "text-(--green-1) font-semibold",
  },
];

const allocationColumns = [
  {
    header: "Asset",
    accessor: (row: AllocationItem) => (
      <p className="text-[14px] font-semibold text-foreground">{row.asset}</p>
    ),
  },
  {
    header: "Amount",
    accessor: (row: AllocationItem) => (
      <p className="text-[14px] text-foreground">
        {row.amount} <span className="text-(--text-1)">{row.amountUnit}</span>
      </p>
    ),
  },
  {
    header: "Value",
    accessor: (row: AllocationItem) => (
      <p className="text-[14px] font-semibold text-foreground">{row.value}</p>
    ),
  },
  {
    header: "Allocation",
    accessor: (row: AllocationItem) => (
      <p className="text-[14px] font-semibold text-(--green-1)">
        {row.allocation}
      </p>
    ),
  },
  {
    header: "PnL",
    accessor: (row: AllocationItem) => (
      <p className="text-[14px] text-foreground">{row.pnl}</p>
    ),
  },
];

export default function Page() {
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [addFundsStep, setAddFundsStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // Add Funds Modal State
  const [selectedSource, setSelectedSource] = useState<string>(
    "Operations Balance - USDT",
  );
  const [selectedAllocation, setSelectedAllocation] =
    useState<string>("Balanced");
  const [addFundsAmount, setAddFundsAmount] = useState("10000");
  const [addFundsCurrency, setAddFundsCurrency] = useState<"USD" | "NGN">(
    "USD",
  );

  const handleAddVault = () => {
    setIsAddFundsOpen(true);
    setAddFundsStep(0);
    setIsSuccess(false);
  };

  const fundSources = [
    {
      id: "ops-usdt",
      name: "Operations Balance - USDT",
      amount: "$52,800",
      icon: "/images/usdt.svg",
    },
    {
      id: "ops-usdc",
      name: "Operations Balance - USDC",
      amount: "$452,800",
      icon: "/images/usdc.svg",
    },
    {
      id: "external",
      name: "External Wallet",
      amount: "00.00",
      icon: "/images/wallet.svg",
    },
    {
      id: "bank",
      name: "Bank/On-ramp",
      amount: "00.00",
      icon: "/images/home.svg",
    },
  ];

  const allocations = [
    {
      id: "conservative",
      name: "Conservative",
      desc: "70% USDT, 30% Stable yield",
      icon: "/images/wallet.svg",
    },
    {
      id: "balanced",
      name: "Balanced",
      desc: "50% USDT, 50% Stable yield",
      icon: "/images/wallet.svg",
    },
    {
      id: "stable",
      name: "Stable Yield",
      desc: "0% USDT, 100% Stable yield",
      icon: "/images/wallet.svg",
    },
    {
      id: "custom",
      name: "Custom",
      desc: "Manage your allocations",
      icon: "/images/wallet.svg",
    },
  ];

  const estimatedAPY = 6.8;
  const monthlyYield = (Number(addFundsAmount) * (estimatedAPY / 100)) / 12;
  const yearlyYield = Number(addFundsAmount) * (estimatedAPY / 100);

  const addFundsSteps: StepConfig[] = [
    {
      title: "SOURCE OF FUND",
      content: (
        <div className="grid grid-cols-2 gap-4">
          {fundSources.map((source) => (
            <button
              key={source.id}
              onClick={() => setSelectedSource(source.name)}
              className={`p-4 rounded-lg transition text-center bg-background border border-(--grey-1)`}
            >
              <div className="flex justify-center items-center mb-3 relative">
                <div className="w-8 h-8">
                  <Image
                    src={source.icon}
                    alt="icon"
                    width={100}
                    height={100}
                  />
                </div>
                {/* <span className="text-2xl">{source.icon}</span> */}
                {selectedSource === source.name && (
                  <div className="w-5 h-5 bg-foreground rounded-full flex items-center justify-center absolute right-0">
                    <span className="text-background text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-[14px] text-(--text-1) mb-1">{source.name}</p>
              <p className="text-[24px] font-bold text-foreground">
                {source.amount}
              </p>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "ALLOCATIONS",
      content: (
        <div className="grid grid-cols-2 gap-4">
          {allocations.map((allocation) => (
            <button
              key={allocation.id}
              onClick={() => setSelectedAllocation(allocation.name)}
              className={`p-4 rounded-lg border transition text-center bg-background border-(--grey-1)`}
            >
              <div className="flex justify-start items-center mb-3 relative flex-col">
                {selectedAllocation === allocation.name && (
                  <div className="w-5 h-5 bg-foreground rounded-full flex items-center justify-center absolute right-0">
                    <span className="text-background text-xs">✓</span>
                  </div>
                )}
                <div className="w-8 h-8">
                  <Image
                    src={allocation.icon}
                    width={100}
                    height={100}
                    alt="icon"
                  />
                </div>
                <p className="text-[24px] font-bold text-foreground">
                  {allocation.name}
                </p>
                <p className="text-[14px] text-(--text-1)">{allocation.desc}</p>
              </div>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "YIELD PREVIEW",
      content: (
        <div className="space-y-6">
          <CurrencyInput
            value={addFundsAmount}
            onChange={setAddFundsAmount}
            currency={addFundsCurrency}
            onCurrencyChange={setAddFundsCurrency}
            placeholder="Amount to purchase"
            description={`usdT balance:`}
            balance={52800}
            showmax={true}
          />

          <p className="text-sm text-(--text-1)">
            If you add{" "}
            <span className="font-semibold text-foreground">
              ${addFundsAmount}
            </span>{" "}
            with{" "}
            <span className="font-semibold text-foreground">
              {selectedAllocation} strategy
            </span>
          </p>

          <div className="space-y-4">
            <div className="border border-(--grey-1) rounded-lg p-4 bg-background">
              <p className="text-xs text-gray-600 mb-1">Estimated APY:</p>
              <p className="text-2xl font-bold text-gray-900">
                {estimatedAPY}%
              </p>
            </div>
            <div className="border border-(--grey-1) rounded-lg p-4 bg-background">
              <p className="text-xs text-gray-600 mb-1">
                Estimated monthly yield:
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${monthlyYield.toFixed(2)}
              </p>
            </div>
            <div className="border border-(--grey-1) rounded-lg p-4 bg-background">
              <p className="text-xs text-gray-600 mb-1">
                Estimated yearly yield:
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${yearlyYield.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "CONFIRMATIONS",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-(--grey-1)">
              <span className="text-(--text-1) text-[14px]">Source:</span>
              <span className="font-semibold text-foreground text-[14px]">
                {selectedSource}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-(--grey-1)">
              <span className="text-(--text-1) text-[14px]">Amount:</span>
              <span className="font-semibold text-foreground text-[14px]">
                ${addFundsAmount}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-(--grey-1)">
              <span className="text-(--text-1) text-[14px]">Strategy:</span>
              <span className="font-semibold text-foreground text-[14px]">
                {selectedAllocation}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-(--grey-1)">
              <span className="text-(--text-1) text-[14px]">Expected APY:</span>
              <span className="font-semibold text-foreground text-[14px]">
                {estimatedAPY}%
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-(--text-1) text-sm">Approvals:</span>
              <span className="font-semibold text-foreground text-[14px]">
                2 approvals
              </span>
            </div>
          </div>

          <div className="bg-background border border-(--grey-1) rounded-lg space-y-3">
            <div className="bg-(--grey-4) p-4">
              <p className="font-semibold text-foreground text-[14px]">
                This action requires:
              </p>
            </div>
            <ul className="space-y-4 text-[14px] text-(--text-1) py-2 px-4">
              <li className="flex gap-2">
                <span>•</span>
                <span>2 of 5 multisig approvals</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Funds moved to cold storage</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  Estimated completion time: ~30 minutes after approval
                </span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const handleAddFundsNext = () => {
    if (addFundsStep < addFundsSteps.length - 1) {
      setAddFundsStep(addFundsStep + 1);
    }
  };

  const handleAddFundsPrevious = () => {
    if (addFundsStep > 0) {
      setAddFundsStep(addFundsStep - 1);
    }
  };

  const handleAddFundsSubmit = () => {
    const formData = {
      source: selectedSource,
      amount: addFundsAmount,
      currency: addFundsCurrency,
      allocation: selectedAllocation,
      apy: estimatedAPY,
      monthlyYield: monthlyYield.toFixed(2),
      yearlyYield: yearlyYield.toFixed(2),
    };
    console.log("[v0] Add Funds to Yield Vault Submitted:", formData);
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen w-full lg:px-6 bg-background">
      <div className="w-full overflow-x-auto md:max-w-[80%]">
        {/* Main content */}
        <div className="px-4 sm:px-6 lg:px-6 py-8 mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8">
            <div className="md:mb-0 mb-6">
              <h1 className="text-[20px] font-semibold text-foreground mb-2">
                Vault
              </h1>
              <p className="text-(--text-1) text-[16px]">
                Manage your vault value here
              </p>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <button className="px-4 sm:px-6 py-2 bg-background text-foreground text-sm font-medium border border-(--grey-1) rounded-lg hover:bg-gray-50 transition whitespace-nowrap">
                Move to Operations
              </button>
              <button className="px-4 sm:px-6 py-2 bg-background text-foreground text-sm font-medium border border-(--grey-1) rounded-lg hover:bg-gray-50 transition whitespace-nowrap">
                Reallocate Assets
              </button>
              <button
                onClick={handleAddVault}
                className="px-4 sm:px-6 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-gray-800 transition whitespace-nowrap"
              >
                Add to Vault
              </button>
            </div>
          </div>
          {/* Stats Cards */}
          <StatsSection
            actionDisabled={false}
            stats={vaultStatsData}
            uiConfig={vaultStatsUIConfig}
            buttonLabel="Fund Vault"
            onButtonClick={() => console.log("Funding vault")}
          />
          {/* Allocations Section */}
          <Table
            kybStatus="unverified"
            data={allocationData}
            columns={allocationColumns}
            extraHeader="Allocations"
          />
          ;{/* Bottom Section - Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vault Security Status */}
            <div className="border border-(--grey-1) rounded-lg bg-background">
              <div className="px-4 sm:px-6 py-4 border-b border-(--grey-1) bg-gray-50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Vault Security Status
                </h3>
                <div className="flex items-center gap-2 border border-(--grey-1) rounded-lg bg-background px-2 py-1">
                  <HiCheckCircle className="w-5 h-5 text-(--green-1)" />
                  <span className="text-xs sm:text-sm text-(--text-1) font-medium">
                    Secure
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-(--grey-1) px-4 sm:px-6 py-4">
                  <p className="text-gray-500 text-xs sm:text-sm mb-2">
                    Custody:
                  </p>
                  <p className="text-sm sm:text-base text-foreground font-medium">
                    3-of-5 Multisig Cold Storage
                  </p>
                </div>
                <div className="flex justify-between items-center border-b border-(--grey-1) px-4 sm:px-6 py-2">
                  <p className="text-gray-500 text-xs sm:text-sm mb-2">
                    Key Holders:
                  </p>
                  <p className="text-sm sm:text-base text-foreground font-medium">
                    5
                  </p>
                </div>
                <div className="flex justify-between items-center border-b border-(--grey-1) px-4 sm:px-6 py-2">
                  <p className="text-gray-500 text-xs sm:text-sm mb-2">
                    Withdrawal Rule:
                  </p>
                  <p className="text-sm sm:text-base text-foreground font-medium">
                    2 approval required
                  </p>
                </div>
              </div>
            </div>

            {/* Vault Activity */}
            <div className="border border-(--grey-1) rounded-lg bg-background">
              <div className="px-4 sm:px-6 py-4 border-b border-(--grey-1) bg-(--grey-4)">
                <h3 className="text-sm font-semibold text-foreground">
                  Vault Activity
                </h3>
              </div>

              <div className="py-6 space-y-4">
                {vaultActivityItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 border-b border-(--grey-1) px-4 sm:px-6 py-4"
                  >
                    <p className="text-xs sm:text-sm text-foreground font-semibold">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <StepModal
            isOpen={isAddFundsOpen}
            onClose={() => setIsAddFundsOpen(false)}
            title="Add Funds to Yield Vault"
            steps={addFundsSteps}
            currentStep={addFundsStep}
            onNextStep={handleAddFundsNext}
            onPreviousStep={handleAddFundsPrevious}
            onSubmit={handleAddFundsSubmit}
            isSuccess={isSuccess}
            successTitle="Vault allocation request submitted"
            successMessage={`Your request to allocate $${addFundsAmount} from ${selectedSource} into the ${selectedAllocation} Yield Strategy has been submitted.\nThis action requires 2 of 5 multisig approvals before funds are moved into cold storage and begin earning yield.`}
            successButtonLabel="Go to vault"
            successtable={<Success_table />}
          />
        </div>
      </div>
    </div>
  );
}
