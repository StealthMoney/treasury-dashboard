import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io"
import { FaRegClock } from "react-icons/fa"
import { AiOutlineDeliveredProcedure } from "react-icons/ai"

export function StatusBadge({ status }: { status: string }) {
	const label =
		status === "APPROVED"
			? "Approved"
			: status === "REJECTED"
				? "Rejected"
				: status === "DISBURSED"
					? "Disbursed"
					: status === "REPAID"
						? "Repaid"
						: "Review"

	return (
		<div className="inline-flex items-center gap-2 rounded-full bg-(--grey-1) px-3 py-1.5 text-xs font-medium text-(--text-1)">
			{status === "APPROVED" || status === "REPAID" ? (
				<IoMdCheckmarkCircle size={16} className="text-(--green-1)" />
			) : status === "REJECTED" ? (
				<IoMdCloseCircle size={16} className="text-(--red-1)" />
			) : status === "REVIEW" ? (
				<FaRegClock size={14} className="text-orange-500" />
			) : status === "DISBURSED" ? (
				<AiOutlineDeliveredProcedure size={14} className="text-blue-700" />
			) : (
				<span className="h-2 w-2 rounded-full bg-orange-500" />
			)}

			<span>{label}</span>
		</div>
	)
}
