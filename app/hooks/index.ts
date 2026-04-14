import { useMemo } from "react"
import { LoanApplication } from "../types/general"
import { StatData } from "../components/reusables/stats_section"
import { formatDateWithSuffix } from "../functions/helpers/formatted_date"

export const useCreditStats = (creditHistoryData: LoanApplication[]) => {
	return useMemo(() => {
		if (!creditHistoryData || creditHistoryData.length === 0) return []

		const firstLoan = creditHistoryData[0]

		const dueDate = firstLoan.loanDueDate ? new Date(firstLoan.loanDueDate) : null

		const startDate = firstLoan.loanStartDate
			? new Date(firstLoan.loanStartDate)
			: null

		let daysLeft: number | string = "N/A"

		if (dueDate && startDate) {
			const diffInMs = dueDate.getTime() - startDate.getTime()
			daysLeft = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
		}

		return [
			{
				label: "Active Loans",
				value: `₦ ${firstLoan.loanAmount.toLocaleString(undefined, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}`,
				footer: firstLoan.loanStartDate
					? formatDateWithSuffix(firstLoan.loanStartDate)
					: "N/A",
			},
			{
				label: "Due Date",
				value: firstLoan.loanDueDate
					? formatDateWithSuffix(firstLoan.loanDueDate)
					: "N/A",
				footer: typeof daysLeft === "number" ? `${daysLeft} days left` : daysLeft,
			},
			{
				label: "Loan Interest",
				value: `${firstLoan.interest.toLocaleString(undefined, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}`,
				footer: "", // + or - here like +10%
			},
		] as StatData[]
	}, [creditHistoryData])
}
