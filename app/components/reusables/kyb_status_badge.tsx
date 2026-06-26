import { FaRegClock } from "react-icons/fa6"
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io"

export default function getKYBStatusBadge(status: string) {
	const baseClass =
		"inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"

	if (status === "Completed") {
		return (
			<div className={`${baseClass} bg-(--grey-1) text-(--text-1)`}>
				<IoMdCheckmarkCircle size={16} className="text-(--green-1)" />
				{status}
			</div>
		)
	}

	if (status === "Pending") {
		return (
			<div className={`${baseClass} bg-(--grey-1) text-(--text-1)`}>
				<FaRegClock size={14} className="text-orange-500" />
				{status}
			</div>
		)
	}

	if (status === "Rejected") {
		return (
			<div className={`${baseClass} bg-(--grey-1) text-(--text-1)`}>
				<IoMdCloseCircle size={16} className="text-(--red-1)" />
				{status}
			</div>
		)
	}

	return (
		<div className={`${baseClass} bg-gray-50 text-(--text-1)`}>
			<span className="h-2 w-2 rounded-full bg-(--text-1)" />
			{status}
		</div>
	)
}
