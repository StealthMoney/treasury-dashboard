"use client"

import { StatUIConfig } from "../components/reusables/stats_section"
import { StatsSection } from "../components/reusables/stats_section"
import { Table } from "../components/reusables/table"
import { useEffect, useState } from "react"
import { StepConfig } from "../components/reusables/modal"
import { StepModal } from "../components/reusables/modal"
import { CurrencyInput } from "../components/reusables/currencyInput"
import Success_table from "../components/reusables/success_table"
import {
	FilePickerField,
	MultiFileInvoicePickerField,
	SelectField,
} from "../components/reusables/general_inputs"
import Message_table from "../components/reusables/message_table"
import OutstandingCredits from "../components/reusables/outstabding_credits"
import KybBanner from "../components/reusables/kybinfo_banner"
import { KYBScreens } from "../overview/kybprocess"
import { useProfile } from "../contexts/user_provider"
import { fileToBase64 } from "../functions/helpers/base64"
import { repayCreditFinish, repayCreditInitiate } from "../server/credits"
import { requestNewCredit } from "../server/request_new_credit"
import { FeedbackModal } from "../components/reusables/feedback_modal"
import {
	InitiateLoanRepaymentDetails,
	LoanApplication,
	LoanApplicationUI,
	LoanStatus,
	LoanType,
	PaginatedLoanApplicationResponse,
	RepaymentRecord,
} from "../types/general"
import { useCreditStats } from "../hooks"
import { buildLoanUI } from "../functions/helpers/statusmapper"
import { useCreditHistory, useCreditTypes } from "../hooks/use_credit_history"
import PageSkeleton from "../components/reusables/page_skeleton"
import { formatDateWithSuffix } from "../functions/helpers/formatted_date"
import { getDaysLeft } from "../functions/helpers/days_left"
import { CopyableText } from "../components/reusables/copyable_text"
import { getDueDate } from "../functions/helpers/get_due_date"
import Link from "next/link"
import { useClientHeaders } from "../hooks/use_client_headers"
import { getDeviceInfo } from "../functions/helpers/get_device_info"
import { getUserIp } from "../server/get_server_ip"

interface ActiveLoan {
	id: string
	borrowed: string
	borrowedUSDT: string
	collateral: string
	ltv: string
	apr: string
	nextDue: string
	nextDueTime: string
	status: string
}

interface CollateralAsset {
	id: number
	asset: string
	totalLocked: string
	value: string
	usedForLoans: string
	freeCollateral: string
}

function StatusBadge({ status }: { status: LoanStatus }) {
	const isActive =
		status.toLowerCase() === "approved" ||
		status.toLocaleLowerCase() === "disbursed" ||
		status.toLowerCase() === "repaid"

	const isPending =
		status.toLocaleLowerCase() === "review" ||
		status.toLowerCase() === "overdue" ||
		status.toLowerCase() === "reviewing_repayment"

	const isFailed = status.toLowerCase() === "rejected"
	return (
		<span
			className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
				isActive
					? "border border-[#D6EBDB] bg-[#EAF5ED] text-[#05AD5D]"
					: isPending
						? "bg-yellow-100 text-yellow-600"
						: isFailed
							? "text-background bg-red-500"
							: ""
			}`}>
			{status?.split("_")?.join(" ")}
		</span>
	)
}

// columns
const creditHistoryColumns = [
	{
		header: "Credit ID",
		accessor: (row: LoanApplication) => (
			<>
				<CopyableText text={row.reference} />
				<p className="text-xs text-gray-500">
					{row.loanStartDate ? formatDateWithSuffix(row.loanStartDate) : ""}
				</p>
			</>
		),
	},
	{
		header: "Amount Borrowed",
		accessor: (row: LoanApplication) => (
			<>
				<p className="text-xs font-semibold text-gray-900 sm:text-sm">
					{Number(row.loanAmount).toLocaleString("en-US", {
						maximumFractionDigits: 2,
					})}
				</p>
				<p className="text-xs text-gray-500">{row.currency}</p>
			</>
		),
	},
	{
		header: "Interest",
		accessor: (row: LoanApplication) => (
			<>
				<p className="text-xs font-semibold text-gray-900 sm:text-sm">
					{Number(row.interest).toLocaleString("en-Us", {
						maximumFractionDigits: 2,
					})}
				</p>
				<p className="text-xs text-gray-500">{row.currency}</p>
			</>
		),
	},
	{
		header: "Due Date",
		accessor: (row: LoanApplication) => (
			<>
				<p className="text-xs font-semibold text-gray-900 sm:text-sm">
					{row.loanDueDate ? formatDateWithSuffix(row.loanDueDate) : ""}
				</p>
				<p className="text-xs text-gray-500">
					{row.loanStatus === "REPAID" ? "" : getDaysLeft(row.loanDueDate)}
				</p>
			</>
		),
	},
	{
		header: "Status",
		accessor: (row: LoanApplication) => <StatusBadge status={row.loanStatus} />,
	},
	// {
	//   header: "",
	//   accessor: (_row: CreditHistory) => (
	//     <button className="text-gray-400 hover:text-gray-600 px-1">
	//       &#8942; {/* vertical ellipsis */}
	//     </button>
	//   ),
	// },
]

export const activeLoansColumns = [
	{
		header: "Loan ID",
		accessor: (loan: ActiveLoan) => (
			<p className="text-xs font-semibold text-gray-900 sm:text-sm">{loan.id}</p>
		),
	},
	{
		header: "Borrowed",
		accessor: (loan: ActiveLoan) => (
			<>
				<p className="text-xs font-semibold text-gray-900 sm:text-sm">
					{loan.borrowed}
				</p>
				<p className="text-xs text-gray-500">{loan.borrowedUSDT}</p>
			</>
		),
	},
	{
		header: "Collateral",
		accessor: (loan: ActiveLoan) => (
			<p className="text-xs font-semibold text-gray-900 sm:text-sm">
				{loan.collateral}
			</p>
		),
	},
	{
		header: "LTV",
		accessor: (loan: ActiveLoan) => (
			<p className="text-xs font-semibold text-gray-900 sm:text-sm">{loan.ltv}</p>
		),
	},
	{
		header: "APR",
		accessor: (loan: ActiveLoan) => (
			<p className="text-xs font-semibold text-gray-900 sm:text-sm">{loan.apr}</p>
		),
	},
	{
		header: "Next Due",
		accessor: (loan: ActiveLoan) => (
			<>
				<p className="text-xs font-semibold text-gray-900 sm:text-sm">
					{loan.nextDue}
				</p>
				<p className="text-xs text-gray-500">{loan.nextDueTime}</p>
			</>
		),
	},
	{
		header: "Status",
		accessor: (loan: ActiveLoan) => (
			<p className="text-xs font-semibold text-gray-900 sm:text-sm">
				{loan.status}
			</p>
		),
	},
]

export const collateralAssetsColumns = [
	{
		header: "Asset",
		accessor: (asset: CollateralAsset) => (
			<p className="text-xs font-semibold text-gray-900 sm:text-sm">
				{asset.asset}
			</p>
		),
	},
	{
		header: "Total Locked",
		accessor: (asset: CollateralAsset) => (
			<p className="text-xs font-semibold text-gray-900 sm:text-sm">
				{asset.totalLocked}
			</p>
		),
	},
	{
		header: "Value",
		accessor: (asset: CollateralAsset) => (
			<p className="text-xs font-semibold text-gray-900 sm:text-sm">
				{asset.value}
			</p>
		),
	},
	{
		header: "Used for Loans",
		accessor: (asset: CollateralAsset) => (
			<p className="text-xs font-semibold text-gray-900 sm:text-sm">
				{asset.usedForLoans}
			</p>
		),
	},
	{
		header: "Free Collateral",
		accessor: (asset: CollateralAsset) => (
			<p className="text-xs font-semibold text-green-600 sm:text-sm">
				{asset.freeCollateral}
			</p>
		),
	},
]

export default function CreditsPage() {
	const { user, setIsKyb } = useProfile()

	const [isBorrowOpen, setIsBorrowOpen] = useState(false)
	const [borrowStep, setBorrowStep] = useState(0)
	const [isSuccess, setIsSuccess] = useState(false)
	const [canPerformActions, setCanperformActions] = useState(false)
	const [borrowFundError, setBorrowFundError] = useState(false)
	const [borrowFundErrorMessage, setBorrowFundErrorMessage] = useState("")
	const [loading, setLoading] = useState(false)
	const [interestRate, setInterestRate] = useState<number | null>(null)
	const [deviceInfo, setDeviceInfo] = useState<string>("")
	const [ip, setIp] = useState<string | null>(null)

	// Repay Modal State
	const [isRepayOpen, setIsRepayOpen] = useState(false)
	const [repayStep, setRepayStep] = useState(0)
	const [repaySuccess, setRepaySuccess] = useState(false)
	const [repayAmount, setRepayAmount] = useState("")
	const [repayCurrency, setRepayCurrency] = useState<"USD" | "NGN">("NGN")
	const [repayLoading, setRepayLoading] = useState(false)
	const [repayError, setRepayError] = useState("")
	const [repaySuccessResponse, setRepaySuccessResponse] =
		useState<InitiateLoanRepaymentDetails | null>(null)
	const [finalRepayResponse, setFinalRepayResponse] =
		useState<RepaymentRecord | null>(null)

	// Extend Credit Date Modal State
	const [isExtendOpen, setIsExtendOpen] = useState(false)
	const [extendStep, setExtendStep] = useState(0)
	const [extendSuccess, setExtendSuccess] = useState(false)
	const [selectedExtension, setSelectedExtension] = useState<"14" | "30" | "60">(
		"14"
	)

	const [borrowAmount, setBorrowAmount] = useState("")
	const [borrowCurrency, setBorrowCurrency] = useState<"USD" | "NGN">("NGN")

	const [invoiceFile, setInvoiceFile] = useState<File[]>([])
	const [accept, setAccept] = useState(false)
	const [bankStatementFile, setBankStatementFile] = useState<File | null>(null)
	const [loanTypeId, setLoanTypeId] = useState<number | null>(null)
	const [loadDurationInDays, setLoanDurationInDays] = useState<
		{
			label: string
			value: string
		}[]
	>([])
	const [creditHistoryData, setCreditHistoryData] =
		useState<PaginatedLoanApplicationResponse | null>(null)

	const creditStatsData = useCreditStats(
		creditHistoryData ? creditHistoryData.content : []
	)

	const [errors, setErrors] = useState<{
		invoice?: string
		bankStatement?: string
		duration?: string
		borrowAmount?: string
		acceptTerms?: string
		deviceInfo?: string
	}>({})

	const [loanDuration, setLoanDuration] = useState("")

	const [isKybVerified, setIsKybVerified] = useState(false)
	const [showKybScreens, setShowKybScreens] = useState(false)
	const [kybStatus, setKybStatus] = useState<
		"ACTIVE" | "PENDING_REVIEW" | "SUSPENDED" | null
	>(null)

	const [currentPage, setCurrentPage] = useState(0)
	const pageSize = creditHistoryData?.size ?? 10

	const {
		data,
		refetch,
		isLoading: creditHistoryLoading,
	} = useCreditHistory({
		page: String(currentPage),
	})
	const { data: creditTypes, isLoading: creditTypesLoading } = useCreditTypes()

	const pageFetchLoading = creditHistoryLoading || creditTypesLoading

	const { header, image, statusItems, message } = buildLoanUI(
		creditHistoryData?.content as LoanApplicationUI[]
	)

	const loanStatus = creditHistoryData?.content?.[0]?.loanStatus

	const titleMap: Record<string, string> = {
		REVIEW: "Your loan is being reviewed",
		REPAID: "Your previous loan is fully settled, you can request another",
		REJECTED: "Your previous loan request was rejected",
	}

	const title = loanStatus ? titleMap[loanStatus] : ""

	const creditStatsUIConfig: StatUIConfig[] = [
		// Example: no button here, but you could add later
		{ index: 2, footerClass: "text-(--green-1) font-semibold" },
		{
			index: 0,
			showButton:
				loanStatus === "REVIEW" ||
				loanStatus === "REPAID" ||
				loanStatus === "REJECTED" ||
				loanStatus === "REVIEWING_REPAYMENT" ||
				loanStatus === "APPROVED"
					? false
					: true,
		},
	]

	const validateStep1 = () => {
		const newErrors: typeof errors = {}

		if (!invoiceFile) {
			newErrors.invoice = "Invoice is required"
		} else if (invoiceFile.length < 3) {
			newErrors.invoice = "Please add at up to 3 invoices in your selection"
		}

		if (!bankStatementFile) {
			newErrors.bankStatement = "Bank statement is required"
		}

		if (!loanDuration) {
			newErrors.duration = "Loan duration is required"
		}

		setErrors(newErrors)

		return Object.keys(newErrors).length === 0
	}

	const validateStep2 = () => {
		const newErrors: typeof errors = {}

		const amount = Number(borrowAmount)

		if (!borrowAmount || borrowAmount.trim() === "") {
			newErrors.borrowAmount = "Enter an amount to borrow"
		} else if (isNaN(amount) || amount <= 0) {
			newErrors.borrowAmount = "Amount must be greater than 0"
		}

		setErrors(newErrors)

		return Object.keys(newErrors).length === 0
	}
	const validateStep3 = () => {
		const newErrors: typeof errors = {}

		if (!accept) {
			newErrors.acceptTerms = "You must accept our lending terms to proceed"
		}

		if (deviceInfo === "") {
			newErrors.deviceInfo = "Couldn't get info, kindly refresh and try again"
		}

		setErrors(newErrors)

		return Object.keys(newErrors).length === 0
	}

	const onBorrowChange = (val: string) => {
		setBorrowAmount(val)
		validateStep2()
	}

	useEffect(() => {
		setErrors((prev) => ({
			...prev,
			bankStatement: "",
			invoice: "",
			duration: "",
		}))
	}, [])

	const handlBorrowFund = () => {
		if (
			loanStatus !== "REPAID" &&
			(loanStatus === "REVIEW" ||
				loanStatus === "APPROVED" ||
				loanStatus === "REVIEWING_REPAYMENT" ||
				loanStatus === "DISBURSED")
		) {
			setIsBorrowOpen(true)
			setIsSuccess(true)
		} else {
			setIsBorrowOpen(true)
			setBorrowStep(0)
			setIsSuccess(false)
		}
	}

	const handleRepayClick = () => {
		setIsRepayOpen(true)
		setRepayStep(0)
		setRepaySuccess(false)
	}

	const handleRepayNext = async () => {
		if (repayStep === 0) {
			setRepayLoading(true)
			const payload = {
				loanReference: creditHistoryData?.content[0].reference,
			}

			try {
				const repay = await repayCreditInitiate(JSON.stringify(payload))
				if (repay.success) {
					setRepayLoading(false)
					setRepayStep(repayStep + 1)
					setRepayError("")
					setRepaySuccessResponse(repay.data)
				} else {
					setRepayError(repay.error)
					return
				}
			} catch (err) {
				console.error(err)
				setRepayError(
					err instanceof Error ? err.message.toString() : "something went wrong"
				)
			} finally {
				setRepayError("")
				setRepayLoading(false)
			}
		}
		if (repayStep < repaySteps.length - 1) {
			setRepayStep(repayStep + 1)
		}
	}

	const handleRepayPrevious = () => {
		if (repayStep > 0) {
			setRepayStep(repayStep - 1)
		}
	}

	const handleRepaySubmit = async () => {
		const payload = {
			referenceNumber: repaySuccessResponse?.repaymentReference,
		}

		setRepayLoading(true)

		try {
			const finalRepay = await repayCreditFinish(JSON.stringify(payload))
			if (!finalRepay.success) {
				setRepayError(finalRepay.error)
				return
			} else {
				setRepayLoading(false)
				setFinalRepayResponse(finalRepay.data)
				setRepaySuccess(true)
				refetch()
			}
		} catch (err) {
			console.error(err)
			setRepayError(
				err instanceof Error ? err.message.toString() : "something went wrong"
			)
		} finally {
			setRepayError("")
			setRepayLoading(false)
		}
	}

	const handleExtendClick = () => {
		setIsExtendOpen(true)
		setExtendStep(0)
		setExtendSuccess(false)
	}

	const handleExtendNext = () => {
		if (extendStep < extendSteps.length - 1) {
			setExtendStep(extendStep + 1)
		}
	}

	const handleExtendPrevious = () => {
		if (extendStep > 0) {
			setExtendStep(extendStep - 1)
		}
	}

	const handleExtendSubmit = () => {
		const formData = {
			extensionPeriod: selectedExtension,
		}
		console.log("Extend Credit Date Submitted:", formData)
		setExtendSuccess(true)
	}

	const handleUpgradeAccount = () => {
		setShowKybScreens(true)
	}

	const handleKybClose = () => {
		setShowKybScreens(false)
	}

	const handleKybComplete = () => {
		setIsKybVerified(user?.kybStatus === "ACTIVE" || false)
		setShowKybScreens(false)
		setKybStatus("PENDING_REVIEW")
		window.location.reload()
	}

	useEffect(() => {
		const loadDeviceData = async () => {
			const info = getDeviceInfo()
			const res = await getUserIp()

			if (info && info !== "" && res.success) {
				setErrors((prev) => ({ ...prev, deviceInfo: undefined }))
				setDeviceInfo(info)
				setIp(res.data)
			}
		}

		loadDeviceData()
	}, [])

	useEffect(() => {
		setIsKybVerified(user?.kybStatus === "ACTIVE" || false)
		setCanperformActions(
			(user?.kybStatus === "ACTIVE" && user.businessAdmin) || false
		)
		setKybStatus(user?.kybStatus || null)
	}, [user])

	useEffect(() => {
		setLoanDurationInDays(
			(creditTypes || []).map((item: LoanType) => ({
				label: `${item.durationInDays} days ${(item.interestRate * 100).toFixed(0)}%`,
				value: String(item.durationInDays),
			}))
		)
	}, [creditTypes])

	useEffect(() => {
		if (loanDuration === "" || !creditTypes) return

		const found = creditTypes.find(
			(item: LoanType) => item.durationInDays.toString() === loanDuration
		)

		if (found) {
			setLoanTypeId(found.id)
			setInterestRate(found.interestRate)
		}
	}, [loanDuration, creditTypes])

	useEffect(() => {
		if (data) {
			setCreditHistoryData(data)
		}
	}, [data])

	useEffect(() => {
		if (creditHistoryData?.content && creditHistoryData?.content?.length > 0) {
			const value = (
				Number(creditHistoryData?.content[0].loanAmount) +
				Number(creditHistoryData?.content[0]?.interest)
			).toString()
			setRepayAmount(value)
		}
	}, [creditHistoryData])

	useEffect(() => {
		setIsKyb(showKybScreens)
	}, [showKybScreens, setIsKyb])

	const handleModalClose = () => {
		setBorrowFundError(false)
		setBorrowFundErrorMessage("")
	}

	// Extension fee mapping
	const extensionFees: Record<
		"14" | "30" | "60",
		{ fee: string; newDueDate: string; newTotal: string }
	> = {
		"14": {
			fee: "300,000.00 NGN",
			newDueDate: "27 Jun 2026",
			newTotal: "100,100,000.00 NGN",
		},
		"30": {
			fee: "700,000.00 NGN",
			newDueDate: "27 Jun 2026",
			newTotal: "100,500,000.00 NGN",
		},
		"60": {
			fee: "1,000,000.00 NGN",
			newDueDate: "01 July 2026",
			newTotal: "6,500,000.00 NGN",
		},
	}

	const extendSteps: StepConfig[] = [
		{
			title: "CHOOSE EXTENSION DATE",
			content: (
				<div className="space-y-6">
					<OutstandingCredits />

					<div className="mt-8 space-y-0">
						<div className="text-foreground mb-6 flex items-center justify-center gap-3 text-[16px] font-semibold">
							<div className="hidden w-1/4 border-b-2 border-b-(--grey-4) lg:block"></div>
							<span className="text-(--text-1)">EXTEND REPAYMENT BY:</span>
							<div className="hidden w-1/4 border-b-2 border-b-(--grey-4) lg:block"></div>
						</div>

						{/* 14 days option */}
						<div
							onClick={() => setSelectedExtension("14")}
							className="flex cursor-pointer items-start justify-between border-b border-(--grey-1) px-0 py-5">
							<div className="flex-1 pr-4">
								<p className="text-foreground text-[16px] font-bold">
									14 days → ₦300,000
								</p>
								<p className="mt-1 text-[14px] text-(--text-1)">
									New due date:{" "}
									<span className="text-foreground font-semibold">27 Jun 2026.</span> An
									additional fee of{" "}
									<span className="text-foreground font-semibold">₦300,000</span> will
									apply.
								</p>
							</div>
							<div
								className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2"
								style={{
									borderColor: selectedExtension === "14" ? "#1F2937" : "#D1D5DB",
									backgroundColor:
										selectedExtension === "14" ? "#1F2937" : "transparent",
								}}>
								{selectedExtension === "14" && (
									<svg
										className="h-4 w-4 text-white"
										fill="currentColor"
										viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								)}
							</div>
						</div>

						{/* 30 days option */}
						<div
							onClick={() => setSelectedExtension("30")}
							className="flex cursor-pointer items-start justify-between border-b border-(--grey-1) px-0 py-5">
							<div className="flex-1 pr-4">
								<p className="text-foreground text-[16px] font-bold">
									30 days → ₦700,000
								</p>
								<p className="mt-1 text-[14px] text-(--text-1)">
									New due date:{" "}
									<span className="text-foreground font-semibold">27 Jun 2026.</span> An
									additional fee of{" "}
									<span className="text-foreground font-semibold">₦700,000</span> will
									apply.
								</p>
							</div>
							<div
								className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2"
								style={{
									borderColor: selectedExtension === "30" ? "#1F2937" : "#D1D5DB",
									backgroundColor:
										selectedExtension === "30" ? "#1F2937" : "transparent",
								}}>
								{selectedExtension === "30" && (
									<svg
										className="h-4 w-4 text-white"
										fill="currentColor"
										viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								)}
							</div>
						</div>

						{/* 60 days option */}
						<div
							onClick={() => setSelectedExtension("60")}
							className="flex cursor-pointer items-start justify-between border-b border-(--grey-1) px-0 py-5">
							<div className="flex-1 pr-4">
								<p className="text-foreground text-[16px] font-bold">
									60 days → ₦1,000,000
								</p>
								<p className="mt-1 text-[14px] text-(--text-1)">
									New due date:{" "}
									<span className="text-foreground font-semibold">27 Jun 2026.</span> An
									additional fee of{" "}
									<span className="text-foreground font-semibold">₦1,000,000</span> will
									apply.
								</p>
							</div>
							<div
								className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2"
								style={{
									borderColor: selectedExtension === "60" ? "#1F2937" : "#D1D5DB",
									backgroundColor:
										selectedExtension === "60" ? "#1F2937" : "transparent",
								}}>
								{selectedExtension === "60" && (
									<svg
										className="h-4 w-4 text-white"
										fill="currentColor"
										viewBox="0 0 20 20">
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								)}
							</div>
						</div>
					</div>
				</div>
			),
		},
		{
			title: "SUMMARY",
			content: (
				<div className="space-y-12">
					<div className="flex justify-between border-b border-(--grey-1)">
						<span className="text-[14px] text-(--text-1)">Credit Amount:</span>
						<span className="text-foreground text-[14px] font-semibold">
							5,000,000.00 NGN
						</span>
					</div>
					<div className="flex justify-between border-b border-(--grey-1)">
						<span className="text-[14px] text-(--text-1)">Extension Period:</span>
						<span className="text-foreground text-[14px] font-semibold">
							{selectedExtension} days
						</span>
					</div>
					<div className="flex justify-between border-b border-(--grey-1)">
						<span className="text-[14px] text-(--text-1)">Extension Fee:</span>
						<span className="text-foreground text-[14px] font-semibold">
							{extensionFees[selectedExtension].fee}
						</span>
					</div>
					<div className="flex justify-between border-b border-(--grey-1)">
						<span className="text-[14px] text-(--text-1)">New Due Date:</span>
						<span className="text-foreground text-[14px] font-semibold">
							{extensionFees[selectedExtension].newDueDate}
						</span>
					</div>
					<div className="flex justify-between border-b border-(--grey-1)">
						<span className="text-[14px] text-(--text-1)">New Total:</span>
						<span className="text-foreground text-[14px] font-semibold">
							{extensionFees[selectedExtension].newTotal}
						</span>
					</div>

					<Message_table
						header="Please Note:"
						columns={["Extension fees will be added to your total repayment"]}
						showAsList={false}
					/>
				</div>
			),
		},
	]

	const repaySteps: StepConfig[] = [
		{
			title: "REPAY CREDIT",
			content: (
				<div className="space-y-6">
					<OutstandingCredits
						total={(
							Number(creditHistoryData?.content[0]?.loanAmount ?? 0) +
							Number(creditHistoryData?.content[0]?.interest ?? 0)
						).toLocaleString("en-US", {
							maximumFractionDigits: 2,
						})}
						principal={Number(
							creditHistoryData?.content[0]?.loanAmount ?? 0
						).toLocaleString("en-US", {
							maximumFractionDigits: 2,
						})}
						interest={Number(
							creditHistoryData?.content[0]?.interest ?? 0
						).toLocaleString("en-US", {
							maximumFractionDigits: 2,
						})}
						dueDate={formatDateWithSuffix(
							creditHistoryData?.content[0]?.loanDueDate?.toString() || ""
						)}
						daysLeft={getDaysLeft(creditHistoryData?.content[0]?.loanDueDate || "")}
					/>

					<div className="space-y-2">
						<label className="text-foreground text-[14px] font-medium">
							Enter Amount ({repayCurrency === "NGN" ? "₦" : "$"})
						</label>
						<CurrencyInput
							value={repayAmount}
							onChange={setRepayAmount}
							onCurrencyChange={setRepayCurrency}
							placeholder="Amount to repay"
							description="Minimum amount to be paid:"
							balance={Number(repayAmount)}
							showmax={false}
							currency={repayCurrency}
							// minamount={50000000}
							label=""
							disabled={true}
						/>
					</div>

					<Message_table
						header="Payment method:"
						columns={["Bank Transfer", "Payments are securely processed"]}
						showAsList={true}
					/>
				</div>
			),
		},
		{
			title: "MAKE PAYMENT",
			content: (
				<div className="space-y-12">
					<div className="pb-4 text-center">
						<p className="text-[14px] text-(--text-1)">
							Transfer{" "}
							<span className="text-foreground font-semibold">
								{repayCurrency === "NGN" ? "₦" : "$"}
								{Number(repaySuccessResponse?.amountDue || 0).toLocaleString("en-NG", {
									minimumFractionDigits: 0,
								})}
							</span>{" "}
							to{" "}
							<span className="text-foreground font-semibold">
								{repaySuccessResponse?.accountName}
							</span>
						</p>
					</div>

					<Success_table
						header="Bank Details:"
						messages={{
							col1: "Bank Name",
							message1: { text: String(repaySuccessResponse?.bankName) },

							col2: "Account Number",
							message2: {
								text: repaySuccessResponse?.accountNumber || "",
								copy: repaySuccessResponse?.accountNumber || "",
							},

							col3: "Amount",
							message3: {
								text: `${repayCurrency === "NGN" ? "₦" : "$"} ${Number(
									repaySuccessResponse?.amountDue || 0
								).toLocaleString("en-NG", {
									maximumFractionDigits: 2,
								})}`,
								copy: String(repaySuccessResponse?.amountDue || 0),
							},
						}}
					/>

					<div className="rounded-2xl bg-(--grey-4) p-8 text-center">
						<p className="mb-2 text-[12px] text-(--text-1)">
							When making your bank transfer, kindly use this as narration:
						</p>
						<p className="text-foreground text-[14px] font-semibold">
							{repaySuccessResponse?.narration}
						</p>
					</div>
				</div>
			),
		},
	]

	const borrowSteps: StepConfig[] = [
		{
			title: "UPLOAD DOCUMENTS",
			content: (
				<div className="space-y-6">
					<MultiFileInvoicePickerField
						label="Invoice"
						hint="Upload your 3 most recent invoices"
						files={invoiceFile}
						onFilesChange={(files) => {
							setInvoiceFile(files)
							setErrors((prev) => ({ ...prev, invoice: undefined }))
						}}
						error={errors.invoice}
					/>

					<FilePickerField
						label={
							<span className="text-foreground">
								Corporate Bank Statement (
								<span className="text-(--text-1)">Last 12 months</span>)
							</span>
						}
						file={bankStatementFile}
						onFileChange={(file) => {
							setBankStatementFile(file)
							setErrors((prev) => ({ ...prev, bankStatement: undefined }))
						}}
						onFileRemove={() => setBankStatementFile(null)}
						error={errors.bankStatement}
					/>

					<SelectField
						label={<span className="text-foreground">Loan Duration</span>}
						id="loan"
						value={loanDuration}
						onChange={(value) => {
							setLoanDuration(value)
							setErrors((prev) => ({ ...prev, duration: undefined }))
						}}
						options={loadDurationInDays}
						placeholder="Select duration"
						error={errors.duration}
					/>

					<Message_table
						header="Note:"
						columns={["Your data is secure", "Used only for credit assessment"]}
						showAsList={true}
					/>
				</div>
			),
		},
		{
			title: "ENTER AMOUNT",
			content: (
				<div className="space-y-6">
					<CurrencyInput
						value={borrowAmount}
						onChange={(value) => onBorrowChange(value)}
						onCurrencyChange={setBorrowCurrency}
						placeholder="Amount to borrow"
						showmax={false}
						currency={borrowCurrency}
						message={"You can only borrow up to one million naira (₦1,000,000)"}
						label={`Enter Loan Amount (${borrowCurrency === "NGN" ? "₦" : "$"})`}
						error={errors.borrowAmount}
					/>
				</div>
			),
		},
		{
			title: "SUMMARY",
			content: (
				<div className="space-y-4">
					<div className="flex justify-between border-b border-(--grey-1) py-3">
						<span className="text-[14px] text-(--text-1)">Credit Amount:</span>
						<span className="text-foreground text-[14px] font-semibold">
							{Number(borrowAmount).toLocaleString("en-US", {
								maximumFractionDigits: 2,
							})}{" "}
							{borrowCurrency}
						</span>
					</div>

					<div className="flex justify-between border-b border-(--grey-1) py-3">
						<span className="text-[14px] text-(--text-1)">Duration:</span>
						<span className="text-foreground text-[14px] font-semibold">
							{loanDuration} Days
						</span>
					</div>

					<div className="flex justify-between border-b border-(--grey-1) py-3">
						<span className="text-[14px] text-(--text-1)">Due Date:</span>
						<span className="text-foreground text-[14px] font-semibold">
							{getDueDate(loanDuration)}
						</span>
					</div>

					<div className="flex justify-between border-b border-(--grey-1) py-3">
						<span className="text-[14px] text-(--text-1)">Interests:</span>
						<span className="text-foreground text-[14px] font-semibold">
							{((interestRate ?? 0) * (Number(borrowAmount) ?? 0)).toLocaleString(
								"en-US",
								{ maximumFractionDigits: 2 }
							)}{" "}
							NGN
						</span>
					</div>

					<div className="flex flex-col gap-y-2">
						<label className="flex cursor-pointer items-start gap-2 py-2">
							<input
								type="checkbox"
								checked={accept}
								onChange={(e) => {
									setAccept(e.target.checked)
									setErrors((prev) => ({
										...prev,
										acceptTerms: !e.target.checked
											? "You must accept our lending terms to proceed"
											: undefined,
									}))
								}}
								className="h-4 w-4 rounded border-(--grey-1) accent-(--grey-1)"
							/>

							<span className="text-[14px] text-(--text-1)">
								I accept the{" "}
								<Link
									href="https://stealthtreasury.com/lending_agreement"
									target="_blank"
									className="text-foreground font-bold italic underline underline-offset-2">
									(terms of lending service)
								</Link>
							</span>
						</label>
						{errors.acceptTerms && errors.acceptTerms !== "" && (
							<p className="-mt-4 text-sm text-(--red-1)">{errors.acceptTerms}</p>
						)}
					</div>
				</div>
			),
		},
	]

	const handleBorrowNext = async () => {
		// only validate on step 0
		if (borrowStep === 0) {
			const isValid = validateStep1()
			if (!isValid) return
		}

		if (borrowStep === 1) {
			const isValid = validateStep2()
			if (!isValid) return
		}

		if (borrowStep === 2) {
			const isValid = validateStep3()
			if (!isValid) return
		}

		if (borrowStep < borrowSteps.length - 1) {
			setBorrowStep(borrowStep + 1)
		}
	}

	const handleBorrowPrevious = () => {
		if (borrowStep > 0) {
			setBorrowStep(borrowStep - 1)
		}
	}

	const headers = useClientHeaders()
	const handleBorrowSubmit = async () => {
		const isValid = validateStep3()

		if (!isValid) return

		setLoading(true)

		let invoices: { content: string; contentType: string; fileName: string }[] =
			[]
		let bankBase64 = ""

		if (invoiceFile.length > 0) {
			invoices = await Promise.all(
				invoiceFile.map(async (item) => {
					const content = await fileToBase64(item)

					return {
						content,
						contentType: item.type,
						fileName: item.name,
					}
				})
			)
		}

		if (bankStatementFile) {
			bankBase64 = await fileToBase64(bankStatementFile)
		}

		const payload = {
			termsAcceptance: {
				accepted: accept,
				agreementVersion: "1",
				ipAddress: ip,
				deviceInfo,
			},

			loanTypeId: Number(loanTypeId),

			invoices,

			bankStatement: {
				content: bankBase64 || "",
				contentType: bankStatementFile?.type || "",
				fileName: bankStatementFile?.name || "",
			},

			loanAmount: Number(borrowAmount),
			loanCurrency: borrowCurrency,
			loanDurationInDays: Number(loanDuration),
		}

		try {
			const stringifiedPayload = JSON.stringify(payload)

			const creditReq = await requestNewCredit(headers, stringifiedPayload)

			if (creditReq.success) {
				setBorrowFundError(false)
				setIsSuccess(true)
				refetch()
				return
			} else {
				setBorrowFundError(true)
				setBorrowFundErrorMessage(
					creditReq.error || "Could not process your request"
				)
				return
			}
		} catch (err) {
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const shouldShowModal = borrowFundError

	const tableData = creditHistoryData?.content.map((item, index) => ({
		...item,
		id: index,
	}))

	if (showKybScreens) {
		return <KYBScreens onClose={handleKybClose} onComplete={handleKybComplete} />
	}

	return pageFetchLoading ? (
		<div className="bg-background min-h-screen w-full px-6">
			<div className="w-full overflow-x-auto md:max-w-[80%]">
				<PageSkeleton />
			</div>
		</div>
	) : (
		<>
			<div className="bg-background min-h-screen w-full px-6">
				<div className="w-full overflow-x-auto md:max-w-[80%]">
					{/* Main content */}
					<div className="mx-auto px-4 py-8 sm:px-6 lg:px-6">
						{/* Header */}
						<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
							<div>
								<h1 className="text-foreground text-[20px] font-bold">
									Credit Overview
								</h1>
								<p className="mt-1 text-[16px] text-(--text-1)">
									Manage your credit here
								</p>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-col gap-3 sm:flex-row">
								{!true && (
									<button
										disabled={!canPerformActions}
										onClick={handleExtendClick}
										className="bg-background text-foreground cursor-pointer rounded-lg border border-(--grey-1) px-4 py-2 text-sm font-medium transition sm:px-6">
										Extend Credit Date
									</button>
								)}
								<button
									title={title}
									disabled={!canPerformActions || loanStatus === "OVERDUE"}
									onClick={handlBorrowFund}
									className={`bg-foreground text-background rounded-lg px-4 py-2 text-sm font-semibold transition sm:px-6 ${canPerformActions ? "cursor-pointer" : "cursor-not-allowed"}`}>
									Get Credit Line
								</button>
							</div>
						</div>

						{!isKybVerified && (
							<KybBanner kybStatus={kybStatus} onAction={handleUpgradeAccount} />
						)}
						{/* Stats Cards */}
						{creditHistoryData?.content && creditHistoryData?.content?.length > 0 && (
							<StatsSection
								actionDisabled={!canPerformActions}
								stats={creditStatsData}
								uiConfig={creditStatsUIConfig}
								buttonLabel="Repay Credit"
								onButtonClick={handleRepayClick}
							/>
						)}
						{/* Active Loans Table */}
						<Table
							data={tableData || []}
							columns={creditHistoryColumns}
							extraHeader="Credit History"
							kybStatus={kybStatus}
							tableButtonClick={handlBorrowFund}
							canPerformAction={!canPerformActions}
							pagination={{
								currentPage: currentPage + 1,
								totalItems:
									(creditHistoryData?.totalPages ?? 1) * (creditHistoryData?.size ?? 10),
								itemsPerPage: creditHistoryData?.size ?? 10,
								onPageChange: (page) => {
									setCurrentPage(page - 1)
								},
							}}
						/>
					</div>

					<StepModal
						isOpen={isBorrowOpen}
						onClose={() => setIsBorrowOpen(false)}
						title="Secure a line of credit"
						subtitle="Apply for a loan and get access to credit."
						steps={borrowSteps}
						currentStep={borrowStep}
						onNextStep={handleBorrowNext}
						onPreviousStep={handleBorrowPrevious}
						onSubmit={handleBorrowSubmit}
						isSuccess={isSuccess}
						amount={borrowAmount}
						loading={loading}
						imagePath={image}
						successTitle={header}
						successMessage={message}
						successtable={
							<Message_table
								useStatus={true}
								statusItems={statusItems}
								showAsList={true}
							/>
						}
						successButtonLabel="Go to Credit Overview"
					/>

					<StepModal
						isOpen={isRepayOpen}
						onClose={() => setIsRepayOpen(false)}
						title="Repay Credit"
						subtitle="Repay your outstanding credit"
						steps={repaySteps}
						currentStep={repayStep}
						onNextStep={handleRepayNext}
						onPreviousStep={handleRepayPrevious}
						onSubmit={handleRepaySubmit}
						screenMode={isRepayOpen ? "repay" : null}
						loading={repayLoading}
						isSuccess={repaySuccess}
						amount={repaySuccessResponse?.amountDue?.toLocaleString("en-US", {
							maximumFractionDigits: 2,
						})}
						isError={repayError}
						repaySuccess={repaySuccess}
						successTitle="Repayment sent"
						successMessage=""
						successButtonLabel="View Credit Details"
						successtable={
							<Success_table
								header="Meta:"
								messages={{
									col1: "Transaction ID:",
									message1: finalRepayResponse?.repaymentReference || "",
									col2: "Date:",
									message2: finalRepayResponse?.repaymentDate
										? formatDateWithSuffix(finalRepayResponse?.repaymentDate)
										: "N/A",
									col3: "Method:",
									message3: "Bank Transfer",
									col4: " Amount Paid:",
									message4: (
										Number(creditHistoryData?.content[0]?.loanAmount) +
										Number(creditHistoryData?.content[0]?.interest)
									).toLocaleString("en-US", { maximumFractionDigits: 2 }),
								}}
							/>
						}
					/>

					<StepModal
						isOpen={isExtendOpen}
						onClose={() => setIsExtendOpen(false)}
						title="Extend credit date"
						subtitle="Extend your repayment date for a small fee"
						steps={extendSteps}
						currentStep={extendStep}
						onNextStep={handleExtendNext}
						onPreviousStep={handleExtendPrevious}
						onSubmit={handleExtendSubmit}
						isSuccess={extendSuccess}
						successTitle="Extension successful"
						successMessage="Your credit date extension was successful"
						successButtonLabel="View Credit Details"
						successtable={
							<Success_table
								header="New credit date:"
								messages={{
									col1: "Extension Period:",
									message1: `${selectedExtension} days`,
									col2: "New Due Date:",
									message2: extensionFees[selectedExtension].newDueDate,
									col3: "Extension Fee:",
									message3: extensionFees[selectedExtension].fee,
									col4: "New Total:",
									message4: extensionFees[selectedExtension].newTotal,
								}}
							/>
						}
					/>
				</div>
			</div>

			<FeedbackModal
				isOpen={shouldShowModal}
				onClose={() => {}}
				title="Something went wrong"
				description={borrowFundError ? borrowFundErrorMessage : ""}
				buttonCount={1}
				buttons={[
					{
						label: "Close",
						variant: "primary",
						onClick: handleModalClose,
					},
				]}
			/>
		</>
	)
}
