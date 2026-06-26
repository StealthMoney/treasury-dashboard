export function formatDateWithSuffix(dateStr: string) {
	const date = new Date(dateStr)
	const day = date.getDate()
	const month = date.toLocaleString("en-GB", { month: "long" })
	const year = date.getFullYear()

	const suffix =
		day % 10 === 1 && day !== 11
			? "st"
			: day % 10 === 2 && day !== 12
				? "nd"
				: day % 10 === 3 && day !== 13
					? "rd"
					: "th"

	return `${day}${suffix} ${month}, ${year}`
}

export const formatTimeFromISO = (isoDate: string) => {
	return new Date(isoDate).toLocaleTimeString("en-NG", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	})
}
