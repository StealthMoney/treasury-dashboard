export default function getAccountStatusTag(status: string) {
	if (status.toLowerCase() === "active") {
		return (
			<div className="inline-block rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-(--green-1)">
				{status}
			</div>
		)
	}

	if (
		status.toLocaleUpperCase() === "suspended" ||
		status.toLocaleLowerCase() === "pending_review" ||
		status.toLocaleLowerCase() === "pending review"
	) {
		return (
			<div className="inline-block rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-600">
				{status}
			</div>
		)
	}

	return (
		<div className="inline-block rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-(--text-1)">
			{status}
		</div>
	)
}
