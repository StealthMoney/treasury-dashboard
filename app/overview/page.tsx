"use client";

import { useState } from "react";
import { HiOutlineRefresh, HiCheckCircle } from "react-icons/hi";
import StableSwitch from "../components/reusables/stable_switch";
import {
  StatsSection,
  StatUIConfig,
} from "../components/reusables/stats_section";
import { StatData } from "../components/reusables/stats_section";
import { Table } from "../components/reusables/table";
import { CurrencyInput } from "../components/reusables/currencyInput";
import { StepModal, type StepConfig } from "../components/reusables/modal";

interface Transaction {
  id: number;
  date: string;
  time: string;
  amount: string;
  amountUSDT: string;
  walletAddress: string;
  type: string;
  vault: string;
  vaultType: string;
  status: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: "09-10-2025",
    time: "14:57 PM",
    amount: "$12,567,890.89",
    amountUSDT: "12,567,890.89 USDT",
    walletAddress: "1Lbcfr7s67yhgs ****4ZnX71",
    type: "Multi-sig",
    vault: "Vault One",
    vaultType: "Trezor",
    status: "Successful",
  },
  {
    id: 2,
    date: "09-10-2025",
    time: "14:57 PM",
    amount: "$12,567,890.89",
    amountUSDT: "12,567,890.89 USDT",
    walletAddress: "1Lbcfr7s67yhgs ****4ZnX71",
    type: "Multi-sig",
    vault: "Vault One",
    vaultType: "Trezor",
    status: "Successful",
  },
  {
    id: 3,
    date: "09-10-2025",
    time: "14:57 PM",
    amount: "$12,567,890.89",
    amountUSDT: "12,567,890.89 USDT",
    walletAddress: "1Lbcfr7s67yhgs ****4ZnX71",
    type: "Multi-sig",
    vault: "Vault One",
    vaultType: "Trezor",
    status: "Successful",
  },
  {
    id: 4,
    date: "09-10-2025",
    time: "14:57 PM",
    amount: "$12,567,890.89",
    amountUSDT: "12,567,890.89 USDT",
    walletAddress: "1Lbcfr7s67yhgs ****4ZnX71",
    type: "Multi-sig",
    vault: "Vault One",
    vaultType: "Trezor",
    status: "Successful",
  },
];

// This simulates data coming from your endpoint
export const statsData: StatData[] = [
  {
    label: "Total Balance",
    valueRow: {
      main: "12,678,876",
      suffix: "USDT",
    },
    footer: "≈ $34,689.89",
  },
  {
    label: "Total Invested",
    value: "$24,689.98",
    footer: "≈0.25980346 BTC",
  },
  {
    label: "All time gain",
    value: "+$2,678.89",
    footer: "+20.67 %",
  },
];

const columns = [
  {
    header: "Date",
    accessor: (row: Transaction) => (
      <>
        <p className="text-xs sm:text-sm font-semibold text-foreground">
          {row.date}
        </p>
        <p className="text-xs text-(--text-1)">{row.time}</p>
      </>
    ),
  },
  {
    header: "Amount",
    accessor: (row: Transaction) => (
      <>
        <p className="text-xs sm:text-sm font-semibold text-foreground">
          {row.amount}
        </p>
        <p className="text-xs text-(--text-1)">{row.amountUSDT}</p>
      </>
    ),
  },
  {
    header: "Wallet Address",
    accessor: (row: Transaction) => (
      <>
        <p className="text-xs sm:text-sm font-semibold text-foreground break-all">
          {row.walletAddress}
        </p>
        <p className="text-xs text-(--text-1)">{row.type}</p>
      </>
    ),
  },
  {
    header: "Vault",
    accessor: (row: Transaction) => (
      <>
        <p className="text-xs sm:text-sm font-semibold text-foreground">
          {row.vault}
        </p>
        <p className="text-xs text-(--text-1)">{row.vaultType}</p>
      </>
    ),
  },
  {
    header: "Status",
    accessor: (row: Transaction) => (
      <div className="flex items-center gap-2">
        <HiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-(--green-1) shrink-0" />
        <span className="text-xs sm:text-sm text-gray-700">{row.status}</span>
      </div>
    ),
  },
];

export const statsUIConfig: StatUIConfig[] = [
  {
    index: 0,
    showButton: true, // button lives in FIRST card
  },
  {
    index: 2,
    footerClass: "text-(--green-1) font-semibold",
  },
];

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalItems = 15;
  const [stable, setStable] = useState<"USDC" | "USDT">("USDC");

  const [isFundTreasuryOpen, setIsFundTreasuryOpen] = useState(false);
  const [fundTreasuryStep, setFundTreasuryStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fund Treasury Form State
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");
  const [destination, setDestination] = useState("");
  const [referenceNote, setReferenceNote] = useState("");

  const exchangeRates = {
    NGN: 1456,
    USD: 1,
  };

  const receivedAmount =
    amount && !isNaN(Number(amount))
      ? (Number(amount) / exchangeRates[currency]).toFixed(2)
      : "0.00";

  const fees =
    amount && !isNaN(Number(amount))
      ? (Number(amount) * 0.0112).toFixed(2)
      : "0";
  const totalAmount =
    amount && !isNaN(Number(amount))
      ? (Number(amount) + Number(fees)).toFixed(2)
      : "0";

  const fundTreasurySteps: StepConfig[] = [
    {
      title: "ENTER AMOUNT & DESTINATION",
      content: (
        <div className="space-y-6">
          <CurrencyInput
            value={amount}
            onChange={setAmount}
            currency={currency}
            onCurrencyChange={setCurrency}
            placeholder="Amount to purchase"
            showmax={false}
            description="You will receive:"
            assetName="USDT"
          />

          <div>
            <label
              hidden
              aria-label="destination"
              className="text-sm font-medium block mb-2"
            ></label>
            <select
              title="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-3 border border-(--grey-1) text-(--text-1) rounded-lg focus:outline-none focus:ring-2 bg-(--grey-4) cursor-pointer"
            >
              <option value="">Select destination</option>
              <option value="USDT Treasury">USDT Treasury</option>
              <option value="USDC Treasury">USDC Treasury</option>
            </select>
          </div>

          <div>
            <label
              hidden
              aria-label="reference-note"
              className="text-sm font-medium text-gray-700 block mb-2"
            ></label>
            <textarea
              value={referenceNote}
              onChange={(e) => setReferenceNote(e.target.value)}
              placeholder="Reference Note"
              className="w-full px-4 py-3 border border-(--grey-1) rounded-lg focus:outline-none focus:ring-2 bg-(--grey-4) text-(--text-1) min-h-32 resize-none"
            />
          </div>

          <div className="bg-background rounded-lg space-y-3 border border-(--grey-1)">
            <div className="bg-(--grey-4) text-foreground py-4 px-4">
              <p className="font-medium text-[14px]">Exchange Rate:</p>
            </div>
            <div className="flex justify-between items-center py-2 px-4 border-b border-(--grey-1)">
              <span className="text-(--text-1) flex items-center gap-2">
                <span className="text-[14px]">💎</span> 1 USDT:
              </span>
              <span className="font-semibold text-foreground">
                {exchangeRates[currency].toLocaleString()} {currency}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 px-4 border-b border-(--grey-1)">
              <span className="text-(--text-1) flex items-center gap-2">
                <span className="text-[14px]">🔵</span> 1 USDC:
              </span>
              <span className="font-semibold text-foreground">
                {exchangeRates[currency].toLocaleString()} {currency}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "SUMMARY",
      content: (
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-(--grey-1)">
            <span className="text-(--text-1) text-[14px]">
              Amount to Purchase:
            </span>
            <span className="font-semibold text-foreground">
              {amount
                ? `${Number(amount).toLocaleString()}.00 ${currency}`
                : "0.00 NGN"}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-(--grey-1)">
            <span className="text-(--text-1) text-[14px]">Destination:</span>
            <span className="font-semibold text-foreground">
              {destination || "N/A"}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-(--grey-1)">
            <span className="text-(--text-1) text-[14px]">Fees:</span>
            <span className="font-semibold text-foreground">
              {fees} {currency}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-(--grey-1)">
            <span className="text-(--text-1) text-[14px]">Exchange Rate:</span>
            <span className="font-semibold text-foreground">
              1 USDT = {exchangeRates[currency].toLocaleString()} {currency}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-(--grey-1)">
            <span className="text-(--text-1) text-[14px]">
              USDT to be Received:
            </span>
            <span className="font-semibold text-foreground">
              {receivedAmount} USDT
            </span>
          </div>
          <div className="flex justify-between py-3 px-3 rounded-lg">
            <span className="text-(--text-1) text-[14px]">
              Total Amount to be paid:
            </span>
            <span className="font-bold text-gray-900">
              {totalAmount} {currency}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "MAKE PAYMENT",
      content: (
        <div className="space-y-6">
          <div className="w-full flex justify-center flex-col items-center">
            <p className="text-gray-600 text-sm mb-2">Amount to be paid:</p>
            <p className="text-3xl font-bold text-foreground">
              {totalAmount} {currency}
            </p>
          </div>

          <div className="space-y-4 p-4 rounded-lg">
            <div className="flex justify-between items-center py-2">
              <span className="text-(--text-1) text-[14px]">
                Account Number:
              </span>
              <span className="font-semibold text-foreground text-[14px] flex items-center gap-2">
                0522528827
                <button className="text-gray-400">📋</button>
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-gray-200 pt-2">
              <span className="text-(--text-1) text-[14px]">Bank Name:</span>
              <span className="font-semibold text-foreground text-[14px]">
                Paystack Titan
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-gray-200 pt-2">
              <span className="text-(--text-1) text-[14px]">Account Name:</span>
              <span className="font-semibold text-foreground text-[14px]">
                Moneywave Treasury
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-gray-200 pt-2">
              <span className="text-(--text-1) text-[14px]">
                Exchange Rate:
              </span>
              <span className="font-semibold text-foreground text-[14px]">
                1 USDT = {exchangeRates[currency].toLocaleString()} {currency}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-gray-200 pt-2">
              <span className="text-gray-600 text-[14px]">
                USDT to be Received:
              </span>
              <span className="font-semibold text-foreground text-[14px]">
                {receivedAmount} USDT
              </span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleFundTreasuryNext = () => {
    if (fundTreasuryStep < fundTreasurySteps.length - 1) {
      setFundTreasuryStep(fundTreasuryStep + 1);
    }
  };

  const handleFundTreasuryPrevious = () => {
    if (fundTreasuryStep > 0) {
      setFundTreasuryStep(fundTreasuryStep - 1);
    }
  };

  const handleFundTreasurySubmit = () => {
    const formData = {
      amount,
      currency,
      destination,
      referenceNote,
      receivedAmount,
      fees,
      totalAmount,
      exchangeRate: exchangeRates[currency],
    };
    console.log("[v0] Fund Treasury Form Submitted:", formData);
    setIsSuccess(true);
  };

  const handleFundTreasury = () => {
    setIsFundTreasuryOpen(true);
    setFundTreasuryStep(0);
    setIsSuccess(false);
  };

  // This simulates data coming from your endpoint
  const statsData: StatData[] = [
    {
      label: "Total Balance",
      valueRow: {
        main: "8,678",
        suffix: stable,
      },
      footer: "≈ $4,689.89",
    },
    {
      label: "Total Invested",
      value: "$4,689.98",
      footer: "≈0.25980346 BTC",
    },
    {
      label: "All time gain",
      value: "+$2,678.89",
      footer: "20.67 %",
    },
  ];

  return (
    <div className="min-h-screen w-full lg:px-6 bg-background">
      {/* Main content */}
      <div className="px-4 sm:px-6 lg:px-6 py-8 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-(--text-1) text-sm mb-1">Welcome,</p>
          <h1 className="text-4xl font-bold text-foreground">Moneywave</h1>
        </div>
        {/* Tabs and Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <StableSwitch value={stable} onChange={setStable} />

          <button className="flex items-center justify-center cursor-pointer gap-2 px-4 sm:px-6 py-2 bg-white text-gray-900 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            Refresh
            <HiOutlineRefresh className="w-4 h-4" />
          </button>
        </div>
        {/* Stats Cards */}
        <div className="w-full overflow-x-auto md:max-w-[80%]">
          <StatsSection
            stats={statsData}
            uiConfig={statsUIConfig}
            buttonLabel="Fund Treasury"
            onButtonClick={() => handleFundTreasury()}
            showPlus={true}
          />
        </div>

        <div className="w-full overflow-x-auto md:max-w-[80%]">
          <Table
            data={mockTransactions}
            columns={columns}
            pagination={{
              currentPage,
              totalItems,
              itemsPerPage,
              onPageChange: setCurrentPage,
            }}
            kybStatus="unverified"
          />
        </div>
        <StepModal
          isOpen={isFundTreasuryOpen}
          onClose={() => setIsFundTreasuryOpen(false)}
          title="Fund your Treasury"
          subtitle="Acquire USDT/USDC with your local currency for operational use"
          steps={fundTreasurySteps}
          currentStep={fundTreasuryStep}
          onNextStep={handleFundTreasuryNext}
          onPreviousStep={handleFundTreasuryPrevious}
          onSubmit={handleFundTreasurySubmit}
          isSuccess={isSuccess}
          successTitle="Treasury fund successful"
          successMessage={`You have successfully funded your USDT Treasury with ${receivedAmount} USDT.`}
          successButtonLabel="Go Back to Treasury"
        />
      </div>
    </div>
  );
}
