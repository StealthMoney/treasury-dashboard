import { LoanApplicationUI, StatusItem } from "@/app/types/general"
import { formatDateWithSuffix } from "./formatted_date"

type LoanStatus = "REVIEW" | "APPROVED" | "REJECTED" | "DISBURSED" | "REPAID"

export const buildLoanUI = (
	creditHistoryData: LoanApplicationUI[],
	isSubmitting?: boolean
) => {
	const loan = creditHistoryData?.[0]

	if (!loan) {
		return {
			header: "",
			image: "/images/success.svg",
			statusItems: [],
		}
	}

	const status: LoanStatus = loan.loanStatus

	const headerMap: Record<LoanStatus, string> = {
		REVIEW: "Your loan is being reviewed",
		APPROVED: "Loan Approved",
		REJECTED: "Loan Failed",
		DISBURSED: "Credit Disbursed",
		REPAID: "Credit Repaid",
	}

	const imageMap: Record<LoanStatus, string> = {
		REVIEW: "/images/pending.svg",
		APPROVED: "/images/success.svg",
		REJECTED: "/images/failed.svg",
		DISBURSED: "/images/success.svg",
		REPAID: "/images/success.svg",
	}

	const steps = [
		{ text: "Step 1: Submitted" },
		{ text: "Step 2: Review" },
		{ text: "Step 3: Approval" },
		{ text: "Step 4: Repaid" },
	]

	let currentStep = 0

	if (isSubmitting) {
		currentStep = 0
	} else {
		switch (status) {
			case "REVIEW":
				currentStep = 1
				break

			case "APPROVED":
				currentStep = 2
				break

			case "REJECTED":
				currentStep = 2
				steps[2].text = "Step 3: Failed"
				break

			case "DISBURSED":
				currentStep = 2
				steps[2].text = "Step 3: Approved"
				break
			case "REPAID":
				currentStep = 3
				steps[2].text = "Step 4: Repaid"
				break

			default:
				currentStep = 0
		}
	}

	const messageMap: Record<LoanStatus, string> = {
		REVIEW: `Your request for ${Number(loan.loanAmount).toLocaleString("en-US", {
			maximumFractionDigits: 2,
		})} ${loan.currency} is being reviewed.\nThis usually takes 24-48 hours.`,

		APPROVED: `Your loan request for $${Number(loan.loanAmount).toLocaleString(
			"en-US",
			{
				maximumFractionDigits: 2,
			}
		)} ${loan.currency} has been approved.\nFunds will be processed soon.`,

		REJECTED: `Unfortunately, your loan request for $${Number(
			loan.loanAmount
		).toLocaleString("en-NG", {
			maximumFractionDigits: 2,
		})} ${loan.currency} was not approved.`,

		DISBURSED: `Your loan of ${Number(loan.loanAmount).toLocaleString("en-NG", {
			maximumFractionDigits: 2,
		})} ${loan.currency} has been successfully disbursed. Kindly repay by ${formatDateWithSuffix(loan.loanDueDate)}`,
		REPAID: `Your loan of ${Number(loan.loanAmount).toLocaleString("en-NG", {
			maximumFractionDigits: 2,
		})} ${loan.currency} has been sucessfully repaid.`,
	}

	const statusItemsMap: Record<LoanStatus, StatusItem[]> = {
		REVIEW: [
			{ text: "Step 1: Submitted", status: "completed" },
			{ text: "Step 2: Review", status: "current", suffix: "(In review)" },
			{ text: "Step 3: Approval", status: "pending" },
		],
		APPROVED: [
			{ text: "Step 1: Submitted", status: "completed" },
			{ text: "Step 2: Review", status: "completed" },
			{ text: "Step 3: Approval", status: "current", suffix: "(Approved)" },
		],
		REJECTED: [
			{ text: "Step 1: Submitted", status: "completed" },
			{ text: "Step 2: Review", status: "completed" },
			{ text: "Step 3: Failed", status: "failed" },
		],
		DISBURSED: [
			{ text: "Step 1: Submitted", status: "completed" },
			{ text: "Step 2: Review", status: "completed" },
			{ text: "Step 3: Approval", status: "completed" },
			{ text: "Step 4: Disbursed", status: "completed" },
			{ text: "Step 5: Repayment", status: "current", suffix: "(Not Paid)" },
		],
		REPAID: [
			{ text: "Step 1: Submitted", status: "completed" },
			{ text: "Step 2: Review", status: "completed" },
			{ text: "Step 3: Approval", status: "completed" },
			{ text: "Step 4: Disbursed", status: "completed" },
			{ text: "Step 4: Repaid", status: "completed" },
		],
	}

	return {
		header: headerMap[status],
		image: imageMap[status],
		message: messageMap[status],
		statusItems: statusItemsMap[status],
	}
}
