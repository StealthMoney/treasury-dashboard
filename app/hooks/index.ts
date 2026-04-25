import { useMemo } from "react"
import { LoanApplication } from "../types/general"
import { StatData } from "../components/reusables/stats_section"
import { formatDateWithSuffix } from "../functions/helpers/formatted_date"
import { getDaysLeft } from "../functions/helpers/days_left"

export const useCreditStats = (creditHistoryData: LoanApplication[]) => {
	const getLoanLabel = (status: string) => {
		switch (status) {
			case "DISBURSED":
				return "Active Loan"
			case "APPROVED":
				return "Approved Loan"
			case "REJECTED":
				return "Rejected Loan"
			case "OVERDUE":
				return "Overdue Loan"
			case "REPAID":
				return "Repaid Loan"
			case "REVIEW":
				return "Reviewing Loan"
			default:
				return "Loan"
		}
	}
	return useMemo(() => {
		if (!creditHistoryData || creditHistoryData.length === 0) return []

		const firstLoan = creditHistoryData[0]

		const dueDate = firstLoan.loanDueDate ? firstLoan.loanDueDate : null

		const startDate = firstLoan.loanStartDate
			? new Date(firstLoan.loanStartDate)
			: null

		let daysLeft: number | string = "N/A"

		if (dueDate) {
			daysLeft = getDaysLeft(dueDate)
		}

		return [
			{
				label: getLoanLabel(firstLoan.loanStatus),
				value: `₦ ${(firstLoan.loanAmount + firstLoan.interest).toLocaleString(
					"en-US",
					{
						maximumFractionDigits: 2,
					}
				)}`,
				footer: firstLoan.loanStartDate
					? formatDateWithSuffix(firstLoan.loanStartDate)
					: "N/A",
			},
			{
				label: "Due Date",
				value: firstLoan.loanDueDate
					? formatDateWithSuffix(firstLoan.loanDueDate)
					: "N/A",
				footer:
					firstLoan.loanStatus === "REPAID"
						? ""
						: typeof daysLeft === "number"
							? `${daysLeft} days left`
							: daysLeft,
			},
			{
				label: "Loan Interest",
				value: `₦ ${firstLoan.interest.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				footer: "", // + or - here like +10%
			},
		] as StatData[]
	}, [creditHistoryData])
}
