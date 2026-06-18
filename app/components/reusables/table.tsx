import { ReactNode } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"

export interface TableTab {
	label: string
	key: string
}

export interface TableColumn<T> {
	header: string | ReactNode
	accessor: keyof T | ((row: T) => ReactNode)
	className?: string
}

export interface TablePagination {
	currentPage: number
	totalItems: number
	itemsPerPage: number
	onPageChange: (page: number) => void
}

export interface TableProps<T> {
	data: T[]
	columns: TableColumn<T>[]
	extraHeader?: string | ReactNode
	pagination?: TablePagination
	kybStatus?: "ACTIVE" | "PENDING_REVIEW" | "SUSPENDED" | null
	canPerformAction?: boolean
	tableButtonClick?: () => void
	tabs?: TableTab[]
	activeTab?: string
	onTabChange?: (key: string) => void
	extraHeaderActions?: ReactNode
}

export function Table<T extends { id: string | number }>({
	data = [],
	columns,
	extraHeader,
	pagination,
	kybStatus,
	canPerformAction,
	tableButtonClick,
	tabs,
	activeTab,
	onTabChange,
	extraHeaderActions,
}: TableProps<T>) {
	const isEmpty = data.length === 0
	const pathname = usePathname()

	return (
		<div className="bg-background mb-8 overflow-hidden rounded-lg border border-(--grey-1)">
			{/* Optional extra header */}
			{extraHeader && (
				<div className="flex flex-col gap-3 border-b border-(--grey-1) bg-(--grey-4) px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
					<h3 className="text-foreground text-[14px] font-semibold sm:text-[16px]">
						{extraHeader}
					</h3>

					{extraHeaderActions && (
						<div className="flex flex-wrap justify-end gap-2 sm:justify-end">
							{extraHeaderActions}
						</div>
					)}
				</div>
			)}

			{/* Optional tabs */}
			{tabs && tabs.length > 0 && (
				<div className="flex gap-6 border-b border-(--grey-1) px-4 sm:px-6">
					{tabs.map((tab) => {
						const isActive = activeTab === tab.key
						return (
							<button
								key={tab.key}
								onClick={() => onTabChange?.(tab.key)}
								className={`relative pt-4 pb-3 text-sm font-medium transition-colors ${
									isActive ? "text-foreground" : "hover:text-foreground text-(--text-1)"
								}`}>
								{tab.label}
								{isActive && (
									<span className="bg-foreground absolute bottom-0 left-0 h-[2px] w-full rounded-t-full border-(--foreground)" />
								)}
							</button>
						)
					})}
				</div>
			)}

			{isEmpty ? (
				<div className="flex flex-col items-center justify-center gap-4 px-4 py-16">
					<Image
						src="/images/no_credit.svg"
						alt="No credit"
						width={120}
						height={120}
					/>
					<p className="text-center text-sm text-(--text-1)">
						{kybStatus === "ACTIVE" && pathname === "/credit"
							? "You have no credit history yet!"
							: pathname === "/credit"
								? "Upload your invoices and bank statements to access a line of credit for your business."
								: pathname.includes("admin")
									? "No Data Available"
									: "You cannot generate report till you've secured a credit line"}
					</p>
					{kybStatus === "ACTIVE" && pathname === "/credit" && (
						<button
							disabled={canPerformAction}
							onClick={tableButtonClick}
							className={`bg-foreground text-background mt-2 rounded-lg px-6 py-2.5 text-sm font-medium transition hover:opacity-90 ${!canPerformAction ? "cursor-pointer" : "cursor-not-allowed"}`}>
							Apply for credit
						</button>
					)}
				</div>
			) : (
				<>
					<div className="overflow-x-auto">
						<table className="w-full min-w-full">
							<thead>
								<tr className="border-b border-(--grey-1) bg-gray-50">
									{columns.map((col, index) => (
										<th
											key={index}
											className={`px-4 py-4 text-left text-xs font-normal whitespace-nowrap text-(--text-1) sm:px-6 sm:text-sm ${col.className ?? ""}`}>
											{col.header}
										</th>
									))}
								</tr>
							</thead>

							<tbody>
								{data.map((row, rowIndex) => (
									<tr
										key={rowIndex}
										className={`border-b border-(--grey-1) transition ${
											rowIndex !== data.length - 1 ? "hover:bg-gray-50" : ""
										}`}>
										{columns.map((col, colIndex) => (
											<td
												key={colIndex}
												className={`px-4 py-4 sm:px-6 ${col.className ?? ""}`}>
												{typeof col.accessor === "function"
													? col.accessor(row)
													: (row[col.accessor] as ReactNode)}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Optional Pagination */}
					{pagination && (
						<div className="bg-background flex flex-col gap-4 border-t border-(--grey-1) px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
							<p className="text-xs text-[#64748B] sm:text-sm">
								<span className="text-foreground font-semibold">
									Page {pagination.currentPage}
								</span>{" "}
								of{" "}
								<span className="text-foreground font-semibold">
									{Math.ceil(pagination.totalItems / pagination.itemsPerPage)}
								</span>
							</p>
							<div className="flex gap-2">
								<button
									onClick={() =>
										pagination.onPageChange(Math.max(pagination.currentPage - 1, 1))
									}
									disabled={pagination.currentPage === 1}
									className="rounded-md border border-(--grey-1) px-3 py-2 text-xs font-medium text-(--grey-3) transition hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm">
									Previous
								</button>
								<button
									onClick={() =>
										pagination.onPageChange(
											Math.min(
												pagination.currentPage + 1,
												Math.ceil(pagination.totalItems / pagination.itemsPerPage)
											)
										)
									}
									disabled={
										pagination.currentPage ===
										Math.ceil(pagination.totalItems / pagination.itemsPerPage)
									}
									className="rounded-md border border-(--grey-1) px-3 py-2 text-xs font-medium text-(--grey-3) transition hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm">
									Next
								</button>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	)
}
