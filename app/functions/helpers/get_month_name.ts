// Helper function to get month name
export function getMonthName(month: number): string {
	const months = [
		"",
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	]
	return months[month] || ""
}
