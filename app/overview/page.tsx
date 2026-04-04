"use client"

import { useState } from "react"
import { HiOutlineRefresh, HiCheckCircle } from "react-icons/hi"
import StableSwitch from "../components/reusables/stable_switch"
import {
	StatsSection,
	StatUIConfig,
} from "../components/reusables/stats_section"
import { StatData } from "../components/reusables/stats_section"
import { Table } from "../components/reusables/table"
import { CurrencyInput } from "../components/reusables/currencyInput"
import { StepModal, type StepConfig } from "../components/reusables/modal"

interface Transaction {
	id: number
	date: string
	time: string
	amount: string
	amountUSDT: string
	walletAddress: string
	type: string
	vault: string
	vaultType: string
	status: string
}

const mockTransactions: Transaction[] = [
	{
		id: 1,
		date: "09-10-2025",
		time: "14:57 PM",
		amount: "$7,890.89",
		amountUSDT: "7,890.89 USDT",
		walletAddress: "1Lbcfr7s67yhgs ****4ZnX71",
		type: "Multi-sig",
		vault: "Vault One",
		vaultType: "",
		status: "Successful",
	},
	{
		id: 2,
		date: "09-10-2025",
		time: "14:57 PM",
		amount: "$4,490.00",
		amountUSDT: "4,490.00 USDT",
		walletAddress: "1Lbcfr7s67yhgs ****4ZnX71",
		type: "Multi-sig",
		vault: "Vault One",
		vaultType: "",
		status: "Successful",
	},
	{
		id: 3,
		date: "09-10-2025",
		time: "14:57 PM",
		amount: "$2,000.00",
		amountUSDT: "2,000.00 USDT",
		walletAddress: "1Lbcfr7s67yhgs ****4ZnX71",
		type: "Multi-sig",
		vault: "Vault One",
		vaultType: "",
		status: "Successful",
	},
	{
		id: 4,
		date: "09-10-2025",
		time: "14:57 PM",
		amount: "$10,000.00",
		amountUSDT: "10,000.00 USDT",
		walletAddress: "1Lbcfr7s67yhgs ****4ZnX71",
		type: "Multi-sig",
		vault: "Vault One",
		vaultType: "",
		status: "Successful",
	},
]

const columns = [
	{
		header: "Date",
		accessor: (row: Transaction) => (
			<>
				<p className="text-foreground text-xs font-semibold sm:text-sm">
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
				<p className="text-foreground text-xs font-semibold sm:text-sm">
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
				<p className="text-foreground text-xs font-semibold break-all sm:text-sm">
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
				<p className="text-foreground text-xs font-semibold sm:text-sm">
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
				<HiCheckCircle className="h-4 w-4 shrink-0 text-(--green-1) sm:h-5 sm:w-5" />
				<span className="text-xs text-gray-700 sm:text-sm">{row.status}</span>
			</div>
		),
	},
]

export const statsUIConfig: StatUIConfig[] = [
	{
		index: 0,
		showButton: true, // button lives in FIRST card
	},
	{
		index: 2,
		footerClass: "text-(--green-1) font-semibold",
	},
]

export default function Home() {
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 4
	const totalItems = 15
	const [stable, setStable] = useState<"USDC" | "USDT">("USDC")

	const [isFundTreasuryOpen, setIsFundTreasuryOpen] = useState(false)
	const [fundTreasuryStep, setFundTreasuryStep] = useState(0)
	const [isSuccess, setIsSuccess] = useState(false)

	// Fund Treasury Form State
	const [amount, setAmount] = useState("")
	const [currency, setCurrency] = useState<"NGN" | "USD">("NGN")
	const [destination, setDestination] = useState("")
	const [referenceNote, setReferenceNote] = useState("")

	const exchangeRates = {
		NGN: 1456,
		USD: 1,
	}

	const receivedAmount =
		amount && !isNaN(Number(amount))
			? (Number(amount) / exchangeRates[currency]).toFixed(2)
			: "0.00"

	const fees =
		amount && !isNaN(Number(amount)) ? (Number(amount) * 0.0112).toFixed(2) : "0"
	const totalAmount =
		amount && !isNaN(Number(amount))
			? (Number(amount) + Number(fees)).toFixed(2)
			: "0"

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
							className="mb-2 block text-sm font-medium"></label>
						<select
							title="destination"
							value={destination}
							onChange={(e) => setDestination(e.target.value)}
							className="w-full cursor-pointer rounded-lg border border-(--grey-1) bg-(--grey-4) px-4 py-3 text-(--text-1) focus:ring-2 focus:outline-none">
							<option value="">Select destination</option>
							<option value="USDT Treasury">USDT Treasury</option>
							<option value="USDC Treasury">USDC Treasury</option>
						</select>
					</div>

					<div>
						<label
							hidden
							aria-label="reference-note"
							className="mb-2 block text-sm font-medium text-gray-700"></label>
						<textarea
							value={referenceNote}
							onChange={(e) => setReferenceNote(e.target.value)}
							placeholder="Reference Note"
							className="min-h-32 w-full resize-none rounded-lg border border-(--grey-1) bg-(--grey-4) px-4 py-3 text-(--text-1) focus:ring-2 focus:outline-none"
						/>
					</div>

					<div className="bg-background space-y-3 rounded-lg border border-(--grey-1)">
						<div className="text-foreground bg-(--grey-4) px-4 py-4">
							<p className="text-[14px] font-medium">Exchange Rate:</p>
						</div>
						<div className="flex items-center justify-between border-b border-(--grey-1) px-4 py-2">
							<span className="flex items-center gap-2 text-(--text-1)">
								<span className="text-[14px]">💎</span> 1 USDT:
							</span>
							<span className="text-foreground font-semibold">
								{exchangeRates[currency].toLocaleString()} {currency}
							</span>
						</div>
						<div className="flex items-center justify-between border-b border-(--grey-1) px-4 py-2">
							<span className="flex items-center gap-2 text-(--text-1)">
								<span className="text-[14px]">🔵</span> 1 USDC:
							</span>
							<span className="text-foreground font-semibold">
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
					<div className="flex justify-between border-b border-(--grey-1) py-3">
						<span className="text-[14px] text-(--text-1)">Amount to Purchase:</span>
						<span className="text-foreground font-semibold">
							{amount
								? `${Number(amount).toLocaleString()}.00 ${currency}`
								: "0.00 NGN"}
						</span>
					</div>
					<div className="flex justify-between border-b border-(--grey-1) py-3">
						<span className="text-[14px] text-(--text-1)">Destination:</span>
						<span className="text-foreground font-semibold">
							{destination || "N/A"}
						</span>
					</div>
					<div className="flex justify-between border-b border-(--grey-1) py-3">
						<span className="text-[14px] text-(--text-1)">Fees:</span>
						<span className="text-foreground font-semibold">
							{fees} {currency}
						</span>
					</div>
					<div className="flex justify-between border-b border-(--grey-1) py-3">
						<span className="text-[14px] text-(--text-1)">Exchange Rate:</span>
						<span className="text-foreground font-semibold">
							1 USDT = {exchangeRates[currency].toLocaleString()} {currency}
						</span>
					</div>
					<div className="flex justify-between border-b border-(--grey-1) py-3">
						<span className="text-[14px] text-(--text-1)">USDT to be Received:</span>
						<span className="text-foreground font-semibold">
							{receivedAmount} USDT
						</span>
					</div>
					<div className="flex justify-between rounded-lg px-3 py-3">
						<span className="text-[14px] text-(--text-1)">
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
					<div className="flex w-full flex-col items-center justify-center">
						<p className="mb-2 text-sm text-gray-600">Amount to be paid:</p>
						<p className="text-foreground text-3xl font-bold">
							{totalAmount} {currency}
						</p>
					</div>

					<div className="space-y-4 rounded-lg p-4">
						<div className="flex items-center justify-between py-2">
							<span className="text-[14px] text-(--text-1)">Account Number:</span>
							<span className="text-foreground flex items-center gap-2 text-[14px] font-semibold">
								0522528827
								<button className="text-gray-400">📋</button>
							</span>
						</div>
						<div className="flex items-center justify-between border-t border-gray-200 py-2 pt-2">
							<span className="text-[14px] text-(--text-1)">Bank Name:</span>
							<span className="text-foreground text-[14px] font-semibold">
								Paystack Titan
							</span>
						</div>
						<div className="flex items-center justify-between border-t border-gray-200 py-2 pt-2">
							<span className="text-[14px] text-(--text-1)">Account Name:</span>
							<span className="text-foreground text-[14px] font-semibold">
								Basket Wholesale Ltd Treasury
							</span>
						</div>
						<div className="flex items-center justify-between border-t border-gray-200 py-2 pt-2">
							<span className="text-[14px] text-(--text-1)">Exchange Rate:</span>
							<span className="text-foreground text-[14px] font-semibold">
								1 USDT = {exchangeRates[currency].toLocaleString()} {currency}
							</span>
						</div>
						<div className="flex items-center justify-between border-t border-gray-200 py-2 pt-2">
							<span className="text-[14px] text-gray-600">USDT to be Received:</span>
							<span className="text-foreground text-[14px] font-semibold">
								{receivedAmount} USDT
							</span>
						</div>
					</div>
				</div>
			),
		},
	]

	const handleFundTreasuryNext = () => {
		if (fundTreasuryStep < fundTreasurySteps.length - 1) {
			setFundTreasuryStep(fundTreasuryStep + 1)
		}
	}

	const handleFundTreasuryPrevious = () => {
		if (fundTreasuryStep > 0) {
			setFundTreasuryStep(fundTreasuryStep - 1)
		}
	}

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
		}
		console.log("[v0] Fund Treasury Form Submitted:", formData)
		setIsSuccess(true)
	}

	const handleFundTreasury = () => {
		setIsFundTreasuryOpen(true)
		setFundTreasuryStep(0)
		setIsSuccess(false)
	}

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
	]

	return (
		<div className="bg-background min-h-screen w-full lg:px-6">
			{/* Main content */}
			<div className="mx-auto px-4 py-8 sm:px-6 lg:px-6">
				{/* Header */}
				<div className="mb-8">
					<p className="mb-1 text-sm text-(--text-1)">Welcome,</p>
					<h1 className="text-foreground text-4xl font-bold">
						Basket Wholesale Ltd
					</h1>
				</div>
				{/* Tabs and Refresh */}
				<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<StableSwitch value={stable} onChange={setStable} />

					<button className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-50 sm:px-6">
						Refresh
						<HiOutlineRefresh className="h-4 w-4" />
					</button>
				</div>
				{/* Stats Cards */}
				<div className="w-full overflow-x-auto md:max-w-[80%]">
					<StatsSection
						actionDisabled={false}
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
	)
}
