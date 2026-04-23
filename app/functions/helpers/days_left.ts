export const getDaysLeft = (dueDate: string): string => {
	if (!dueDate) return "N/A"

	const now = new Date().getTime()
	const due = new Date(dueDate).getTime()

	const diff = (due - now) / (1000 * 60 * 60 * 24)
	const days = Math.ceil(diff)

	if (!Number.isFinite(days)) return "N/A"

	if (days < 0) return "Overdue"

	return `${days} ${days === 1 ? "day" : "days"} left`
}
