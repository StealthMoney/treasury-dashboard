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
					: status === "REVIEWING_REPAYMENT"
						? "Reviewing Repayment"
						: status === "REPAID"
							? "Repaid"
							: status

	return (
		<div className="inline-flex items-center gap-2 rounded-full bg-(--grey-1) px-3 py-1.5 text-xs font-medium text-(--text-1)">
			{status === "APPROVED" || status === "REPAID" || status === "POSTED" ? (
				<IoMdCheckmarkCircle size={16} className="text-(--green-1)" />
			) : status === "REJECTED" || status === "REVERSED" ? (
				<IoMdCloseCircle size={16} className="text-(--red-1)" />
			) : status === "REVIEW" || status === "REVIEWING_REPAYMENT" ? (
				<FaRegClock size={14} className="text-orange-500" />
			) : status === "DISBURSED" ? (
				<AiOutlineDeliveredProcedure size={14} className="text-blue-700" />
			) : (
				<span className="h-2 w-2 rounded-full bg-gray-600" />
			)}

			<span>{label}</span>
		</div>
	)
}
