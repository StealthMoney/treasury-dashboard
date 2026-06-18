import { ActivityLog } from "@/app/types/general"
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io"

export function ActivityIcon({ type }: { type?: ActivityLog["iconType"] }) {
	if (type === "approved" || type === "repaid") {
		return (
			<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--grey-1)">
				<IoMdCheckmarkCircle size={22} className="text-(--green-1)" />
			</span>
		)
	}

	if (type === "rejected") {
		return (
			<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
				<IoMdCloseCircle size={22} className="text-(--red-1)" />
			</span>
		)
	}

	if (type === "uploaded") {
		return (
			<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
				<svg
					className="h-5 w-5 text-blue-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
					/>
				</svg>
			</span>
		)
	}

	return (
		<span className="flex h-10 w-10 items-center justify-center rounded-full bg-(--grey-1)">
			<div className="h-2.5 w-2.5 rounded-full bg-(--text-1) opacity-40" />
		</span>
	)
}
