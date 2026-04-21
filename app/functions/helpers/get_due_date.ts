export const getDueDate = (loanDuration: string): string => {
	if (!loanDuration) return "N/A"

	const daysToAdd = parseInt(loanDuration, 10)
	if (isNaN(daysToAdd)) return "N/A"

	const today = new Date()
	today.setHours(0, 0, 0, 0)

	const dueDate = new Date(today)
	dueDate.setDate(today.getDate() + daysToAdd)

	const day = dueDate.getDate()
	const year = dueDate.getFullYear()

	const month = dueDate.toLocaleString("en-GB", {
		month: "long",
	})

	const getOrdinal = (n: number) => {
		if (n > 3 && n < 21) return "th"
		switch (n % 10) {
			case 1:
				return "st"
			case 2:
				return "nd"
			case 3:
				return "rd"
			default:
				return "th"
		}
	}

	return `${day}${getOrdinal(day)} ${month}, ${year}`
}
