import { ActivityLog } from "@/app/types/general"

export function resolveActivityIconType(
	title: string
): ActivityLog["iconType"] | undefined {
	const normalized = title.toLowerCase()

	if (normalized.includes("reject")) return "rejected"

	if (normalized.includes("repaid")) return "repaid"

	if (
		normalized.includes("upload") ||
		normalized.includes("update") ||
		normalized.includes("updated")
	)
		return "uploaded"

	if (
		normalized.includes("approv") ||
		normalized.includes("confirmed") ||
		normalized.includes("verified")
	)
		return "approved"

	return undefined
}
