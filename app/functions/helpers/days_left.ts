export const getDaysLeft = (startDate: string, DueDate: string): string => {
	if (!startDate || !DueDate) return "N/A"
	const diff =
		(new Date(DueDate).getTime() - new Date(startDate).getTime()) /
		(1000 * 60 * 60 * 24)

	const days = Math.ceil(diff)

	if (!Number.isFinite(days)) return "N/A"

	return `${days} ${days === 1 ? "day" : "days"}`
}
