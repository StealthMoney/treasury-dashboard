import { LoanApplicationUI, StatusItem } from "@/app/types/general"

type LoanStatus = "REVIEW" | "APPROVED" | "REJECTED" | "DISBURSED"

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
	}

	const imageMap: Record<LoanStatus, string> = {
		REVIEW: "/images/pending.svg",
		APPROVED: "/images/success.svg",
		REJECTED: "/images/failed.svg",
		DISBURSED: "/images/success.svg",
	}

	const steps = [
		{ text: "Step 1: Submitted" },
		{ text: "Step 2: Review" },
		{ text: "Step 3: Approval" },
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

			default:
				currentStep = 0
		}
	}

	const messageMap: Record<LoanStatus, string> = {
		REVIEW: `Your request for ${Number(loan.loanAmount).toLocaleString("en-NG", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		})} ${loan.currency} is being reviewed.\nThis usually takes 24-48 hours.`,

		APPROVED: `Your loan request for $${Number(loan.loanAmount).toLocaleString(
			"en-NG",
			{
				minimumFractionDigits: 0,
				maximumFractionDigits: 2,
			}
		)} ${loan.currency} has been approved.\nFunds will be processed soon.`,

		REJECTED: `Unfortunately, your loan request for $${Number(
			loan.loanAmount
		).toLocaleString("en-NG", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		})} ${loan.currency} was not approved.`,

		DISBURSED: `Your loan of $${Number(loan.loanAmount).toLocaleString("en-NG", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})} ${loan.currency} has been successfully disbursed.\nKindly repay by `,
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
		],
	}

	return {
		header: headerMap[status],
		image: imageMap[status],
		message: messageMap[status],
		statusItems: statusItemsMap[status],
	}
}
