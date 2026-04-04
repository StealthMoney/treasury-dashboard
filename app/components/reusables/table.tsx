import { ReactNode } from "react"
import Image from "next/image"

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
	kybStatus: "unverified" | "inreview" | "failed" | "verified"
	tableButtonClick?: () => void
}

export function Table<T extends { id: string | number }>({
	data,
	columns,
	extraHeader,
	pagination,
	kybStatus,
	tableButtonClick,
}: TableProps<T>) {
	const isEmpty = data.length === 0

	return (
		<div className="bg-background mb-8 overflow-hidden rounded-lg border border-(--grey-1)">
			{/* Optional extra header */}
			{extraHeader && (
				<div className="border-b border-(--grey-1) bg-(--grey-4) px-4 py-4 sm:px-6">
					<h3 className="text-foreground text-[14px] font-semibold sm:text-[16px]">
						{extraHeader}
					</h3>
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
						{kybStatus === "verified"
							? "You have no credit history yet!"
							: "Upload your invoices and bank statements to access a line of credit for your business."}
					</p>
					{kybStatus === "verified" && (
						<button
							onClick={tableButtonClick}
							className="bg-foreground text-background mt-2 cursor-pointer rounded-lg px-6 py-2.5 text-sm font-medium transition hover:opacity-90">
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
								Showing{" "}
								<span className="text-foreground font-semibold">
									{Math.min(pagination.itemsPerPage, data.length)}
								</span>{" "}
								of{" "}
								<span className="text-foreground font-semibold">
									{pagination.totalItems}
								</span>{" "}
								items
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
