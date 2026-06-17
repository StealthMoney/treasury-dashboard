"use client"

import { useRef, useState } from "react"
import { StatsSection } from "@/app/components/reusables/stats_section"
import { Table } from "@/app/components/reusables/table"
import { SelectField } from "@/app/components/reusables/general_inputs"
import { Modal } from "@/app/components/reusables/modals/modal"
import { RiArrowDropDownLine } from "react-icons/ri"
import { HiCalendar } from "react-icons/hi"
import { Transaction2 } from "@/app/types/general"
import { formatDateWithSuffix } from "@/app/functions/helpers/formatted_date"
import { formatNaira } from "@/app/functions/helpers/formatNaira"
import { StatusBadge } from "@/app/components/reusables/status_badge"
import TransactionDetailContent from "@/app/components/reusables/modals/transaction_modal"
import { useTransactions } from "@/app/hooks/use_transactions"
import PageSkeleton from "@/app/components/reusables/page_skeleton"

function formatDateForInput(dateStr: string): string {
	const d = new Date(dateStr)
	const year = d.getFullYear()
	const month = String(d.getMonth() + 1).padStart(2, "0")
	const day = String(d.getDate()).padStart(2, "0")
	return `${year}-${month}-${day}`
}

function DatePickerButton({
	value,
	onChange,
}: {
	value: string
	onChange: (v: string) => void
}) {
	const inputRef = useRef<HTMLInputElement>(null)

	return (
		<div className="relative inline-flex">
			<button
				type="button"
				onClick={() =>
					inputRef.current?.showPicker?.() ?? inputRef.current?.click()
				}
				className="bg-background inline-flex h-8.5 items-center gap-1 rounded-lg border border-(--grey-1) px-3 text-xs whitespace-nowrap text-(--text-1) transition hover:border-gray-400">
				<span>{value ? formatDateWithSuffix(value) : "Date"}</span>
				<HiCalendar className="text-foreground h-4 w-4 shrink-0" />
			</button>
			<input
				title="date"
				ref={inputRef}
				type="date"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="pointer-events-none absolute inset-0 h-0 w-0 opacity-0"
				tabIndex={-1}
			/>
		</div>
	)
}

export default function ManageTransactionsPage() {
	const [currentPage, setCurrentPage] = useState(0)
	const [searchTerm, setSearchTerm] = useState("")
	const [dateFilter, setDateFilter] = useState("")
	const [typeFilter, setTypeFilter] = useState("")
	const [statusFilter, setStatusFilter] = useState("")
	const [selectedTx, setSelectedTx] = useState<Transaction2 | null>(null)
	const [isDetailOpen, setIsDetailOpen] = useState(false)

	const params = {
		page: String(currentPage),
		...(typeFilter && {
			transactionType: typeFilter,
		}),
		...(searchTerm.trim() && {
			businessName: searchTerm.trim(),
		}),
		...(dateFilter && {
			dateFrom: `${dateFilter}T00:00:00Z`,
		}),
		...(statusFilter && {
			status: statusFilter,
		}),
	}

	const {
		data,
		isLoading,
		refetch: transactionRefetch,
	} = useTransactions(params)
	console.log(data, "is data")
	const pageData = data

	const stats = pageData?.stats ?? {
		totalVolumeNgn: 0,
		outstandingBalance: 0,
		repayments: 0,
		overdueAmount: 0,
	}

	const transactions = pageData?.transactions ?? {
		content: [],
		pageNo: 0,
		pageSize: 10,
		totalElements: 0,
		totalPages: 0,
		last: true,
	}

	const statsData = [
		{
			label: "Total Volume (NGN)",
			value: formatNaira(stats.totalVolumeNgn),
		},
		{
			label: "Outstanding Balance",
			value: formatNaira(stats.outstandingBalance),
		},
		{
			label: "Total Repayments",
			value: formatNaira(stats.repayments),
		},
		{
			label: "Overdue Amount",
			value: formatNaira(stats.overdueAmount),
		},
	]

	const filteredContent = transactions.content.filter((tx: Transaction2) => {
		const matchesSearch =
			!searchTerm ||
			tx.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
			tx.business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			tx.initiatedBy.toLowerCase().includes(searchTerm.toLowerCase())

		const matchesDate = !dateFilter || formatDateForInput(tx.date) === dateFilter

		const matchesType = !typeFilter || tx.transactionType === typeFilter

		const matchesStatus = !statusFilter || tx.status === statusFilter

		return matchesSearch && matchesDate && matchesType && matchesStatus
	})

	const tableData =
		filteredContent.map((tx: Transaction2, i: number) => ({
			id: i + 1,
			...tx,
		})) || []

	function exportCSV() {
		const headers = [
			"Transaction ID",
			"Date",
			"Business",
			"RC Number",
			"Amount (NGN)",
			"Initiated By",
			"Status",
			"Transaction Type",
			"Bank",
			"Account Name",
			"Account Number",
			"Notes",
		]
		const rows = filteredContent.map((tx: Transaction2) => [
			tx.transactionId,
			formatDateWithSuffix(tx.date),
			tx.business.name,
			tx.business.rcNumber,
			tx.amount,
			tx.initiatedBy,
			tx.status,
			tx.transactionType,
			tx.bankAccount.bankName,
			tx.bankAccount.accountName,
			tx.bankAccount.accountNumber,
			tx.notes,
		])
		const csv = [headers, ...rows]
			.map((row) =>
				row.map((v: Transaction2) => `"${String(v).replace(/"/g, '""')}"`).join(",")
			)
			.join("\n")
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = "transactions.csv"
		a.click()
		URL.revokeObjectURL(url)
	}

	const typeOptions = [
		{ label: "All Types", value: "" },
		{ label: "Disbursed", value: "DISBURSED" },
		{ label: "Repayment", value: "REPAYMENT" },
	]

	const statusOptions = [
		{ label: "All Statuses", value: "" },
		{ label: "Review", value: "REVIEW" },
		{ label: "Approved", value: "APPROVED" },
		{ label: "Disbursed", value: "DISBURSED" },
		{ label: "Repaid", value: "REPAID" },
		{ label: "Rejected", value: "REJECTED" },
	]

	const columns = [
		{
			header: "Transaction ID",
			accessor: (row: Transaction2 & { id: number }) => (
				<span className="text-foreground max-w-32.5 truncate font-mono text-sm">
					{row.transactionId.split("-")[0]}…
				</span>
			),
		},
		{
			header: "Date",
			accessor: (row: Transaction2 & { id: number }) => (
				<span className="text-foreground text-sm whitespace-nowrap">
					{formatDateWithSuffix(row.date)}
				</span>
			),
		},
		{
			header: "Business",
			accessor: (row: Transaction2 & { id: number }) => (
				<div>
					<p className="text-foreground text-sm font-medium">{row.business.name}</p>
					<p className="text-xs text-(--text-1)">{row.business.rcNumber}</p>
				</div>
			),
		},
		{
			header: "Amount",
			accessor: (row: Transaction2 & { id: number }) => (
				<span className="text-foreground text-sm font-semibold whitespace-nowrap">
					{formatNaira(row.amount)}
				</span>
			),
		},
		{
			header: "Initiated By",
			accessor: (row: Transaction2 & { id: number }) => (
				<span className="text-foreground text-sm">{row.initiatedBy}</span>
			),
		},
		{
			header: "Status",
			accessor: (row: Transaction2 & { id: number }) => (
				<StatusBadge status={row.status} />
			),
		},
		{
			header: "Action",
			accessor: (row: Transaction2 & { id: number }) => (
				<button
					onClick={() => {
						setSelectedTx(row)
						setIsDetailOpen(true)
					}}
					className="rounded-lg p-2 text-(--text-1) transition hover:bg-(--grey-4)"
					title="View details">
					<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
						<circle cx="12" cy="5" r="2" />
						<circle cx="12" cy="12" r="2" />
						<circle cx="12" cy="19" r="2" />
					</svg>
				</button>
			),
		},
	]

	return (
		<div className="bg-background min-h-screen w-full px-6">
			<div className="w-full overflow-x-auto md:max-w-[80%]">
				<div className="mx-auto">
					<div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row">
						<h1 className="text-foreground inline-flex text-xl font-bold">
							Transactions
						</h1>

						<div className="inline-flex flex-wrap items-center justify-end gap-2 lg:flex-nowrap">
							<div className="relative w-full sm:w-auto">
								<span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-(--text-1)">
									<svg
										className="h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								</span>
								<input
									type="text"
									placeholder="Search transactions"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="bg-background h-8.5 w-full rounded-lg border border-(--grey-1) pr-3 pl-9 text-xs text-(--text-1) transition outline-none placeholder:text-(--grey-3) focus:border-gray-400 sm:w-50"
								/>
							</div>

							<DatePickerButton value={dateFilter} onChange={setDateFilter} />

							<div className="w-full sm:w-auto">
								<SelectField
									label=""
									id="type-filter"
									value={typeFilter}
									onChange={(val) => {
										setTypeFilter(val)
										setCurrentPage(0)
									}}
									placeholder="All Types"
									options={typeOptions}
									compact
								/>
							</div>

							<div className="w-full sm:w-auto">
								<SelectField
									label=""
									id="status-filter"
									value={statusFilter}
									onChange={(val) => {
										setStatusFilter(val)
										setCurrentPage(0)
									}}
									placeholder="All Statuses"
									options={statusOptions}
									compact
								/>
							</div>

							<button
								onClick={exportCSV}
								className="inline-flex h-8.5 items-center gap-1.5 rounded-lg bg-black px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white transition hover:bg-neutral-800">
								Export CSV
								<RiArrowDropDownLine size={20} />
							</button>
						</div>
					</div>

					{isLoading ? (
						<div className="bg-background min-h-screen w-full px-6">
							<div className="w-full overflow-x-auto md:max-w-[80%]">
								<PageSkeleton />
							</div>
						</div>
					) : (
						<>
							{stats && <StatsSection stats={statsData} />}
							<Table
								extraHeader="Transactions"
								data={tableData}
								columns={columns}
								pagination={{
									currentPage: currentPage + 1,
									totalItems: transactions.totalPages * transactions.pageSize,
									itemsPerPage: transactions.pageSize,
									onPageChange: (page) => setCurrentPage(page - 1),
								}}
							/>
						</>
					)}
				</div>
			</div>

			{/* Side Detail Modal */}
			<Modal
				isOpen={isDetailOpen}
				title="Transaction Details"
				onClose={() => {
					setIsDetailOpen(false)
					setSelectedTx(null)
				}}
				variant="slide">
				{selectedTx && (
					<TransactionDetailContent
						transaction={selectedTx}
						onClose={() => {
							setIsDetailOpen(false)
							setSelectedTx(null)
						}}
					/>
				)}
			</Modal>
		</div>
	)
}
