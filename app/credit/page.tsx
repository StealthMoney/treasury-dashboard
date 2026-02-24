"use client";

import { StatData, StatUIConfig } from "../components/reusables/stats_section";
import { StatsSection } from "../components/reusables/stats_section";
import { Table } from "../components/reusables/table";
import { useState } from "react";
import { StepConfig } from "../components/reusables/modal";
import { StepModal } from "../components/reusables/modal";
import Image from "next/image";
import { CurrencyInput } from "../components/reusables/currencyInput";
import Success_table from "../components/reusables/success_table";

interface ActiveLoan {
  id: string;
  borrowed: string;
  borrowedUSDT: string;
  collateral: string;
  ltv: string;
  apr: string;
  nextDue: string;
  nextDueTime: string;
  status: string;
}

interface CollateralAsset {
  id: number;
  asset: string;
  totalLocked: string;
  value: string;
  usedForLoans: string;
  freeCollateral: string;
}

const activeLoansMock: ActiveLoan[] = [
  {
    id: "#LN-021",
    borrowed: "$10,000",
    borrowedUSDT: "10,000 USDT",
    collateral: "15,000 USDT",
    ltv: "38%",
    apr: "8.5%",
    nextDue: "09-10-2026",
    nextDueTime: "14:57 PM",
    status: "Healthy",
  },
  {
    id: "#LN-018",
    borrowed: "$8,400",
    borrowedUSDT: "8,000 USDT",
    collateral: "15,000 USDT",
    ltv: "38%",
    apr: "8.5%",
    nextDue: "09-10-2026",
    nextDueTime: "14:57 PM",
    status: "Healthy",
  },
  {
    id: "#LN-018",
    borrowed: "$8,400",
    borrowedUSDT: "8,000 USDT",
    collateral: "15,000 USDT",
    ltv: "38%",
    apr: "8.5%",
    nextDue: "09-10-2026",
    nextDueTime: "14:57 PM",
    status: "Healthy",
  },
];

const collateralAssetsMock: CollateralAsset[] = [
  {
    id: 1,
    asset: "USDT",
    totalLocked: "45,000 USDT",
    value: "$45,000",
    usedForLoans: "38,200 USDT",
    freeCollateral: "6,800 USDT",
  },
  {
    id: 2,
    asset: "USDC",
    totalLocked: "28,500 USDC",
    value: "$28,500",
    usedForLoans: "22,800 USDC",
    freeCollateral: "5,700 USDC",
  },
  {
    id: 3,
    asset: "ETH",
    totalLocked: "5.5 ETH",
    value: "$18,700",
    usedForLoans: "4.2 ETH",
    freeCollateral: "1.3 ETH",
  },
  {
    id: 4,
    asset: "BTC",
    totalLocked: "0.85 BTC",
    value: "$35,700",
    usedForLoans: "0.64 BTC",
    freeCollateral: "0.21 BTC",
  },
];

export const creditStatsData: StatData[] = [
  {
    label: "Total Borrowed",
    value: "$18,400",
  },
  {
    label: "Total Collateral Value",
    value: "$52,800",
  },
  {
    label: "Current LTV",
    value: "34.8%",
  },
  {
    label: "Health Status",
    value: "Solid",
  },
  {
    label: "Avg Interest Rate",
    value: "9.2% APR",
  },
];

export const creditStatsUIConfig: StatUIConfig[] = [
  // Example: no button here, but you could add later
  { index: 2, footerClass: "text-(--green-1) font-semibold" },
];

export const activeLoansColumns = [
  {
    header: "Loan ID",
    accessor: (loan: ActiveLoan) => (
      <p className="text-xs sm:text-sm font-semibold text-gray-900">
        {loan.id}
      </p>
    ),
  },
  {
    header: "Borrowed",
    accessor: (loan: ActiveLoan) => (
      <>
        <p className="text-xs sm:text-sm font-semibold text-gray-900">
          {loan.borrowed}
        </p>
        <p className="text-xs text-gray-500">{loan.borrowedUSDT}</p>
      </>
    ),
  },
  {
    header: "Collateral",
    accessor: (loan: ActiveLoan) => (
      <p className="text-xs sm:text-sm font-semibold text-gray-900">
        {loan.collateral}
      </p>
    ),
  },
  {
    header: "LTV",
    accessor: (loan: ActiveLoan) => (
      <p className="text-xs sm:text-sm font-semibold text-gray-900">
        {loan.ltv}
      </p>
    ),
  },
  {
    header: "APR",
    accessor: (loan: ActiveLoan) => (
      <p className="text-xs sm:text-sm font-semibold text-gray-900">
        {loan.apr}
      </p>
    ),
  },
  {
    header: "Next Due",
    accessor: (loan: ActiveLoan) => (
      <>
        <p className="text-xs sm:text-sm font-semibold text-gray-900">
          {loan.nextDue}
        </p>
        <p className="text-xs text-gray-500">{loan.nextDueTime}</p>
      </>
    ),
  },
  {
    header: "Status",
    accessor: (loan: ActiveLoan) => (
      <p className="text-xs sm:text-sm font-semibold text-gray-900">
        {loan.status}
      </p>
    ),
  },
];

export const collateralAssetsColumns = [
  {
    header: "Asset",
    accessor: (asset: CollateralAsset) => (
      <p className="text-xs sm:text-sm font-semibold text-gray-900">
        {asset.asset}
      </p>
    ),
  },
  {
    header: "Total Locked",
    accessor: (asset: CollateralAsset) => (
      <p className="text-xs sm:text-sm font-semibold text-gray-900">
        {asset.totalLocked}
      </p>
    ),
  },
  {
    header: "Value",
    accessor: (asset: CollateralAsset) => (
      <p className="text-xs sm:text-sm font-semibold text-gray-900">
        {asset.value}
      </p>
    ),
  },
  {
    header: "Used for Loans",
    accessor: (asset: CollateralAsset) => (
      <p className="text-xs sm:text-sm font-semibold text-gray-900">
        {asset.usedForLoans}
      </p>
    ),
  },
  {
    header: "Free Collateral",
    accessor: (asset: CollateralAsset) => (
      <p className="text-xs sm:text-sm font-semibold text-green-600">
        {asset.freeCollateral}
      </p>
    ),
  },
];

export default function CreditsPage() {
  const [isBorrowOpen, setIsBorrowOpen] = useState(false);
  const [borrowStep, setBorrowStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // Borrow Modal State
  const [selectedCollateral, setSelectedCollateral] =
    useState("Yield Vault USDT");
  const [borrowAmount, setBorrowAmount] = useState("10000");
  const [borrowCurrency, setBorrowCurrency] = useState<"USD" | "NGN">("USD");

  const collateralSources = [
    {
      id: "usdt",
      name: "Yield Vault USDT",
      amount: "$52,800",
      icon: "/images/usdt.svg",
    },
    {
      id: "usdc",
      name: "Yield Vault USDC",
      amount: "$100,800",
      icon: "/images/usdc.svg",
    },
  ];

  const borrowAPR = 9.4;
  const lockCollateralAmount = (Number(borrowAmount) * 1.2).toFixed(0);
  const resultingLTV = (
    (Number(borrowAmount) /
      (Number(borrowAmount) + Number(lockCollateralAmount))) *
    100
  ).toFixed(0);
  const effectiveAPR = 4.0;

  const handlBorrowFund = () => {
    setIsBorrowOpen(true);
    setBorrowStep(0);
    setIsSuccess(false);
  };

  const borrowSteps: StepConfig[] = [
    {
      title: "COLLATERAL SOURCE",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {collateralSources.map((source) => (
            <button
              key={source.id}
              onClick={() => setSelectedCollateral(source.name)}
              className={`p-4 rounded-lg border-2 transition text-center bg-background border-(--grey-1)`}
            >
              <div className="flex justify-start items-center mb-3 relative flex-col">
                {selectedCollateral === source.name && (
                  <div className="w-5 h-5 bg-foreground rounded-full flex items-center justify-center absolute right-0">
                    <span className="text-background text-xs">✓</span>
                  </div>
                )}
                <div className="w-8 h-8">
                  <Image
                    src={source.icon}
                    width={100}
                    height={100}
                    alt="icon"
                  />
                </div>
                <p className="text-[14px] text-(--text-1)">{source.name}</p>
                <p className="text-[24px] font-semibold text-foreground">
                  {source.amount}
                </p>
              </div>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "ENTER AMOUNT",
      content: (
        <div className="space-y-6">
          <CurrencyInput
            value={borrowAmount}
            onChange={setBorrowAmount}
            onCurrencyChange={setBorrowCurrency}
            placeholder="Amount to borrow"
            description={`usdT balance:`}
            balance={52800}
            showmax={true}
            currency="USD"
          />
        </div>
      ),
    },
    {
      title: "TERMS & GOVERNANCE",
      content: (
        <div className="border border-(--grey-1) rounded-lg space-y-3">
          <div className="p-4 bg-(--grey-1)">
            <p className="font-semibold text-foreground text-[14px]">
              Please Note:
            </p>
          </div>
          <ul className="space-y-2 text-[14px] text-(--text-1) p-4">
            <li className="flex gap-2">
              <span>•</span>
              <span>APR: {borrowAPR}%</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Interest accrues daily</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>No fixed repayment date</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Requires 2-of-5 multisig approvals</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Funds sent to Operations wallet after approval</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "SUMMARY",
      content: (
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-(--grey-1)">
            <span className="text-(--text-1) text-[14px]">
              Amount Borrowed:
            </span>
            <span className="font-semibold text-foreground text-[14px]">
              ${borrowAmount} {borrowCurrency}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-(--grey-1)">
            <span className="text-(--text-1) text-[14px]">Collateral:</span>
            <span className="font-semibold text-foreground text-[14px]">
              {lockCollateralAmount} USDC from Yield Vault
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-(--grey-1)">
            <span className="text-(--text-1) text-[14px]">Resulting LTV:</span>
            <span className="font-semibold text-foreground text-[14px]">
              {resultingLTV}%
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-(--grey-1)">
            <span className="text-(--text-1) text-[14px]">APR:</span>
            <span className="font-semibold text-foreground text-[14px]">
              {effectiveAPR.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-(-text-1) text-[14px]">Approvals:</span>
            <span className="font-semibold text-foreground text-[14px]">
              2 approvals
            </span>
          </div>
        </div>
      ),
    },
  ];

  const handleBorrowNext = () => {
    if (borrowStep < borrowSteps.length - 1) {
      setBorrowStep(borrowStep + 1);
    }
  };

  const handleBorrowPrevious = () => {
    if (borrowStep > 0) {
      setBorrowStep(borrowStep - 1);
    }
  };

  const handleBorrowSubmit = () => {
    const formData = {
      collateral: selectedCollateral,
      amountBorrowed: borrowAmount,
      currency: borrowCurrency,
      collateralLocked: lockCollateralAmount,
      resultingLTV,
      apr: effectiveAPR,
    };
    console.log("[v0] Borrow Against Treasury Submitted:", formData);
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen w-full px-6 bg-background">
      <div className="w-full overflow-x-auto md:max-w-[80%]">
        {/* Main content */}
        <div className="px-4 sm:px-6 lg:px-6 py-8 mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-[20px] font-bold text-foreground">
                Credit Overview
              </h1>
              <p className="text-(--text-1) text-[16px] mt-1">
                Manage your credit here
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-4 sm:px-6 py-2 bg-background text-foreground text-sm font-medium border border-(--grey-1) rounded-lg cursor-pointer transition">
                Repay loan
              </button>
              <button className="px-4 sm:px-6 py-2 bg-background text-foreground text-sm font-medium border border-(--grey-1) rounded-lg cursor-pointer transition">
                Add collateral
              </button>
              <button
                onClick={handlBorrowFund}
                className="px-4 sm:px-6 py-2 bg-foreground text-background text-sm font-semibold rounded-lg cursor-pointer transition"
              >
                Borrow against Treasury
              </button>
            </div>
          </div>
          {/* Stats Cards */}
          <StatsSection
            stats={creditStatsData}
            uiConfig={creditStatsUIConfig}
            buttonLabel="Optional Button"
            onButtonClick={() => console.log("Button clicked")}
          />
          ;{/* Active Loans Table */}
          <Table
            data={activeLoansMock}
            columns={activeLoansColumns}
            extraHeader="Active Loans"
          />
          {/* Collateral Backing Loans Table */}
          <Table
            data={collateralAssetsMock}
            columns={collateralAssetsColumns}
            extraHeader="Colleteral Backing Loans"
          />
        </div>

        <StepModal
          isOpen={isBorrowOpen}
          onClose={() => setIsBorrowOpen(false)}
          title="Borrow Against Treasury"
          subtitle="Borrow stable liquidity without selling your vault assets."
          steps={borrowSteps}
          currentStep={borrowStep}
          onNextStep={handleBorrowNext}
          onPreviousStep={handleBorrowPrevious}
          onSubmit={handleBorrowSubmit}
          isSuccess={isSuccess}
          successTitle="Borrow request submitted"
          successMessage={`Your request to borrow $${borrowAmount} ${borrowCurrency} against Yield Vault BTC has been submitted.\n${lockCollateralAmount} USDT will be locked as collateral once 2 of 5 multisig approvals are completed. Funds will be released to the Operations wallet after approval.`}
          successtable={<Success_table />}
          successButtonLabel="Go to Credit"
        />
      </div>
    </div>
  );
}
