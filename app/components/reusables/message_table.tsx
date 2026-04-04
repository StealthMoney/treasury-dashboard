import { AiOutlineCheck } from "react-icons/ai"
import { StatusItem } from "@/app/types/general"

interface Table {
	header?: string
	columns?: string[]
	useStatus?: boolean
	statusItems?: StatusItem[]
	showAsList: boolean
}

export default function Message_table({
	header = "Approval Status:",
	columns = ["Required Approval", "Approved so far", "Estimated completion"],
	useStatus = false,
	statusItems = [],
	showAsList = true,
}: Table) {
	return (
		<div className="bg-background overflow-hidden rounded-lg border border-(--grey-1)">
			<div className="bg-(--grey-4) p-4">
				<p className="text-foreground text-[14px] font-semibold">{header}</p>
			</div>

			<div className="px-4 py-3">
				{!useStatus && (
					<ul className="list-disc space-y-3 pl-5 text-[14px] text-(--text-1) marker:text-(--text-1)">
						{columns.map((col, index) =>
							showAsList ? <li key={index}>{col}</li> : col
						)}
					</ul>
				)}

				{useStatus && (
					<div className="space-y-3">
						{statusItems.map((item, index) => {
							const isCompleted = item.status === "completed"
							const isCurrent = item.status === "current"
							const isFailed = item.status === "failed"

							return (
								<div key={index} className="flex items-center gap-3">
									{/* indicator */}
									<div
										className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${
											isCompleted
												? "border-green-500 bg-green-500"
												: isCurrent
													? "border border-dashed border-(--text-1)"
													: isFailed
														? "border-red-500 bg-red-500"
														: "border border-(--grey-1)"
										} `}>
										{isCompleted && <AiOutlineCheck className="h-3 w-3 text-white" />}
										{isFailed && (
											<span className="text-[10px] leading-none font-bold text-white">
												✕
											</span>
										)}
									</div>

									{/* text */}
									<p
										className={`text-[14px] ${
											isCompleted ? "text-(--text-1) line-through" : ""
										} ${isFailed ? "text-red-500" : ""}`}>
										{item.text}
										{item.suffix && (
											<span className="ml-1 font-semibold">{item.suffix}</span>
										)}
									</p>
								</div>
							)
						})}
					</div>
				)}
			</div>
		</div>
	)
}
