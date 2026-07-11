"use client"
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io"
import { FaRegClock } from "react-icons/fa"
import { AiOutlineDeliveredProcedure } from "react-icons/ai"
import { TbCalendarDue } from "react-icons/tb"

export function StatusBadge({ status }: { status: string }) {
	const label =
		status.toUpperCase() === "APPROVED"
			? "Approved"
			: status.toUpperCase() === "REJECTED"
				? "Rejected"
				: status.toUpperCase() === "DISBURSED"
					? "Disbursed"
					: status.toUpperCase() === "REVIEWING_REPAYMENT"
						? "Reviewing Repayment"
						: status.toUpperCase() === "REPAID"
							? "Repaid"
							: status.toUpperCase() === "PENDING"
								? "Pending"
								: status.toUpperCase() === "VERIFIED"
									? "Verified"
									: status.toUpperCase() === "OVERDUE"
										? "Overdue"
										: status

	return (
		<div className="inline-flex items-center gap-2 rounded-full bg-(--grey-1) px-3 py-1.5 text-xs font-medium text-(--text-1)">
			{status.toUpperCase() === "APPROVED" ||
			status.toUpperCase() === "REPAID" ||
			status.toUpperCase() === "POSTED" ||
			status.toUpperCase() === "VERIFIED" ? (
				<IoMdCheckmarkCircle size={16} className="text-(--green-1)" />
			) : status.toUpperCase() === "REJECTED" ||
			  status.toUpperCase() === "REVERSED" ? (
				<IoMdCloseCircle size={16} className="text-(--red-1)" />
			) : status.toUpperCase() === "REVIEW" ||
			  status.toUpperCase() === "REVIEWING_REPAYMENT" ||
			  status.toUpperCase() === "PENDING" ? (
				<FaRegClock size={14} className="text-orange-500" />
			) : status.toUpperCase() === "DISBURSED" ? (
				<AiOutlineDeliveredProcedure size={14} className="text-blue-700" />
			) : status.toUpperCase() === "OVERDUE" ? (
				<TbCalendarDue size={14} className="text-blue-700" />
			) : (
				<span className="h-2 w-2 rounded-full bg-gray-600" />
			)}

			<span>{label}</span>
		</div>
	)
}
