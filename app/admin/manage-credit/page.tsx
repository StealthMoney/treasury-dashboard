"use client"

import { useEffect, useState } from "react"
import { StatsSection } from "@/app/components/reusables/stats_section"
import { Table } from "@/app/components/reusables/table"
import CreditRequestModal from "@/app/components/reusables/modals/credit_request_modal"
import ApprovalModal from "@/app/components/reusables/modals/approval_modal"
import { CreditRequest } from "@/app/components/reusables/modals/credit_request_modal"
import {
	SelectField,
	TextField,
} from "@/app/components/reusables/general_inputs"
import {
	useCreditAdmin,
	useCreditAdminStats,
} from "@/app/hooks/use_credit_history"
import {
	PaginatedLoanApplicationResponse,
	LoanApplication,
} from "@/app/types/general"
import { getCreditHistoryAdmin, updatecreditStatus } from "@/app/server/credits"
import PageSkeleton from "@/app/components/reusables/page_skeleton"
import { CSVLink } from "react-csv"
import { useBusinessesDocuments } from "@/app/hooks/use_businesses"
import { RiArrowDropDownLine } from "react-icons/ri"
import { formatNaira } from "@/app/functions/helpers/formatNaira"
import { StatusBadge } from "@/app/components/reusables/status_badge"
import { showToast } from "@/app/functions/helpers/notify_user"

const CREDIT_TABS = [
	{ label: "Credit loan request", key: "request" },
	{ label: "Credit loan history", key: "history" },
]

export default function ManageCreditPage() {
	const [selectedRequest, setSelectedRequest] = useState<CreditRequest | null>(
		null
	)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false)
	const [approvalMessage, setApprovalMessage] = useState<{
		type: "success" | "failed"
		title: string
		message: string
	} | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(0)
	const [searchTerm, setSearchTerm] = useState<string | null>(null)
	const [statusFilter, setStatusFilter] = useState("")
	const [activeTab, setActiveTab] = useState("request")
	const [creditHistoryData, setCreditHistoryData] =
		useState<PaginatedLoanApplicationResponse | null>(null)

	const tabFilter =
		activeTab === "request"
			? { "creditLineStatus.equals": "REVIEW" }
			: {
					"creditLineStatus.notEquals": "REVIEW",
					...(statusFilter ? { "creditLineStatus.equals": statusFilter } : {}),
				}

	const {
		data,
		refetch,
		isLoading: creditHistoryLoading,
	} = useCreditAdmin({
		page: String(currentPage),
		...(searchTerm ? { "reference.contains": searchTerm } : {}),
		...tabFilter,
	})

	const { data: documents, refetch: documentRefetch } = useBusinessesDocuments(
		selectedRequest?.loanId
			? { "ownerId.equals": String(selectedRequest.loanId) }
			: {},
		!!selectedRequest?.loanId
	)

	const { data: stats, isLoading: statsLoading } = useCreditAdminStats()

	const statsData = [
		{
			label: "Total Disbursed",
			value: formatNaira(stats?.totalDisbursed),
		},
		{
			label: "Total Repaid",
			value: formatNaira(stats?.totalRepaid),
		},
		{
			label: "Outstanding Balance",
			value: formatNaira(stats?.outstandingBalance),
		},
		{
			label: "Overdue Loans",
			valueRow: {
				main: formatNaira(stats?.overdueLoans),
			},
		},
	]

	const tableData: (LoanApplication & { id: number })[] =
		data?.content.map((item: LoanApplication, index: number) => ({
			id: index + 1,
			...item,
		})) ?? []

	const [isExporting, setIsExporting] = useState(false)

	const exportCreditCSV = async () => {
		try {
			setIsExporting(true)

			let page = 0
			let totalPages = 1

			const allLoans: LoanApplication[] = []

			while (page < totalPages) {
				const query = new URLSearchParams({
					page: String(page),
				})

				if (searchTerm) {
					query.append("reference.contains", searchTerm)
				}

				if (activeTab === "request") {
					query.append("creditLineStatus.equals", "REVIEW")
				} else {
					query.append("creditLineStatus.notEquals", "REVIEW")

					if (statusFilter) {
						query.append("creditLineStatus.equals", statusFilter)
					}
				}

				const response = await getCreditHistoryAdmin(query.toString())

				if (!response.success) {
					showToast(response.error, "error", "dafs")
					return
				}

				totalPages = response.data.totalPages

				allLoans.push(...response.data.content)

				page++
			}

			let headers: string[]
			let rows: (string | number)[][]

			if (activeTab === "request") {
				headers = ["Date", "Business", "Loan Amount", "Duration", "Status"]

				rows = allLoans.map((row) => [
					formatDate(row.createdAt),
					row.businessName,
					`${row.currency} ${row.loanAmount.toLocaleString()}`,
					`${row.durationInDays} days`,
					row.loanStatus,
				])
			} else {
				headers = [
					"Business Name",
					"Loan Amount",
					"Interest",
					"Duration",
					"Start Date",
					"Due Date",
					"Status",
				]

				rows = allLoans.map((row) => [
					row.businessName,
					`${row.currency} ${row.loanAmount.toLocaleString()}`,
					`${row.currency} ${Number(row.interest).toLocaleString()}`,
					`${row.durationInDays} days`,
					formatDate(row.loanStartDate),
					formatDate(row.loanDueDate),
					row.loanStatus,
				])
			}

			const csv = [headers, ...rows]
				.map((row) =>
					row
						.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
						.join(",")
				)
				.join("\n")

			const blob = new Blob([csv], {
				type: "text/csv;charset=utf-8;",
			})

			const url = URL.createObjectURL(blob)

			const link = document.createElement("a")
			link.href = url
			link.download =
				activeTab === "request"
					? "credit-loan-requests.csv"
					: "credit-loan-history.csv"

			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)

			URL.revokeObjectURL(url)
		} catch (error) {
			console.error("Export failed:", error)
			const newError =
				error instanceof Error ? error.message : "An unknown error occurred"
			showToast(newError, "error", "fddd")
		} finally {
			setIsExporting(false)
		}
	}

	useEffect(() => {
		setCreditHistoryData(data)
	}, [data])

	// Reset page and status filter when switching tabs
	const handleTabChange = (key: string) => {
		setActiveTab(key)
		setCurrentPage(0)
		setStatusFilter("")
	}

	// Status filter options — only relevant for the history tab
	const statusOptions = [
		{ label: "All", value: "" },
		{ label: "Approved", value: "APPROVED" },
		{ label: "Disbursed", value: "DISBURSED" },
		{ label: "Rejected", value: "REJECTED" },
		{ label: "Repaid", value: "REPAID" },
		{ label: "Overdue", value: "OVERDUE" },
		{ label: "Reviewing Repayment", value: "REVIEWING_REPAYMENT" },
	]

	const formatDate = (dateStr: string | null) => {
		if (!dateStr) return "—"
		return new Date(dateStr).toLocaleDateString("en-NG", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		})
	}

	const statusStyle: Record<string, string> = {
		REVIEW: "bg-yellow-100 text-yellow-700",
		APPROVED: "bg-green-100 text-green-700",
		DISBURSED: "bg-blue-100 text-blue-700",
		REPAID: "bg-purple-100 text-purple-700",
		REJECTED: "bg-red-100 text-red-700",
	}

	const toModalRequest = (item: LoanApplication): CreditRequest => ({
		id: item.reference,
		amount: item.loanAmount,
		loanAmount: item.loanAmount,
		loanStatus: item.loanStatus.toLowerCase() as CreditRequest["loanStatus"],
		requestDate: item.loanStartDate ?? "",
		startDate: item.loanStartDate ?? "",
		loanStartDate: item.loanStartDate,
		endDate: item.loanDueDate ?? "",
		loanDueDate: item.loanDueDate,
		loanDuration: Math.round(item.durationInDays / 30),
		businessType: "",
		email: "",
		phone: "",
		currency: item.currency,
		interest: Number(item.interest),
		reference: item.reference,
		loanTypeId: item.loanTypeId,
		loanId: item.loanId,
		businessName: item.businessName,
		createdAt: item.createdAt,
		durationInDays: item.durationInDays,
	})

	const handleRowClick = (item: LoanApplication) => {
		setSelectedRequest(toModalRequest(item))
		setIsModalOpen(true)
	}

	// Status progression map for approve
	const nextApproveStatus: Record<string, string> = {
		pending: "REVIEW",
		review: "APPROVED",
		approved: "DISBURSED",
		disbursed: "REVIEWING_REPAYMENT",
		reviewing_repayment: "REPAID",
	}

	const handleApprove = async () => {
		const currentStatus = selectedRequest?.loanStatus?.toLowerCase() ?? ""
		const payload = {
			status: nextApproveStatus[currentStatus] ?? "APPROVED",
		}
		setIsLoading(true)
		try {
			const req = await updatecreditStatus(
				JSON.stringify(payload),
				selectedRequest?.reference
			)

			if (req.success) {
				setApprovalMessage({
					type: "success",
					title: "Credit Request Approved Successfully!",
					message:
						"Your credit change of status request has been successfully processed!",
				})
			} else {
				setApprovalMessage({
					type: "failed",
					title: "Failed to update credit status",
					message: req.error,
				})
			}

			setIsModalOpen(false)
		} catch (err) {
			console.error(err)
			setApprovalMessage({
				type: "failed",
				title: "Failed to update credit status",
				message: err instanceof Error ? err.message : "An unknown error occurred",
			})
		} finally {
			setIsLoading(false)
			setIsApprovalModalOpen(true)
			await refetch()
		}
	}

	const handleReject = async (reason: string) => {
		const payload = {
			status: "REJECTED",
			rejectionReason: reason,
		}

		try {
			const req = await updatecreditStatus(
				JSON.stringify(payload),
				selectedRequest?.reference
			)

			if (req.success) {
				setApprovalMessage({
					type: "success",
					title: "Credit Status Update Successful",
					message:
						"Your credit change of status request has been processed successfully!",
				})
			} else {
				setApprovalMessage({
					type: "failed",
					title: "Failed to update credit status",
					message: req.error,
				})
			}

			setIsModalOpen(false)
		} catch (err) {
			console.error(err)
			setApprovalMessage({
				type: "failed",
				title: "Failed to update credit status",
				message: err instanceof Error ? err.message : "An unknown error occurred",
			})
		} finally {
			setIsApprovalModalOpen(true)
			await refetch()
		}
	}

	const handleApprovalModalClose = () => {
		setIsApprovalModalOpen(false)
		setApprovalMessage(null)
		setSelectedRequest(null)
	}

	return (
		<div className="bg-background min-h-screen w-full px-6">
			<div className="w-full overflow-x-auto md:max-w-[80%]">
				<div className="mx-auto">
					<div className="mb-8 flex items-center justify-between gap-4">
						<div>
							<h1 className="text-foreground text-xl font-bold">Credit Line</h1>
						</div>

						<div className="flex items-center gap-2">
							<TextField
								label=""
								id="search"
								placeholder="Search by reference"
								value={searchTerm || ""}
								onChange={setSearchTerm}
								compact
								searchIcon
							/>
							{/* Status filter only shown on history tab */}
							{activeTab === "history" && (
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
							)}
							{tableData.length > 0 && (
								<button
									onClick={exportCreditCSV}
									className="inline-flex h-8.5 cursor-pointer items-center gap-1.5 rounded-lg bg-black px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white transition hover:bg-neutral-800">
									{isExporting ? "Exporting" : "Export"} CSV
									<RiArrowDropDownLine size={20} />
								</button>
							)}
						</div>
					</div>

					{statsLoading ? null : <StatsSection stats={statsData} />}

					{creditHistoryLoading || statsLoading ? (
						<div className="bg-background min-h-screen w-full px-6">
							<div className="w-full overflow-x-auto">
								<PageSkeleton />
							</div>
						</div>
					) : (
						<Table
							extraHeader="Recent activities"
							data={tableData || []}
							tabs={CREDIT_TABS}
							activeTab={activeTab}
							onTabChange={handleTabChange}
							columns={
								activeTab === "request"
									? [
											{
												header: "Date",
												accessor: (row) => (
													<span className="text-foreground text-sm">
														{formatDate(row.createdAt)}
													</span>
												),
											},
											{
												header: "Business",
												accessor: (row) => (
													<span className="text-foreground font-medium">
														{row.businessName}
													</span>
												),
											},
											{
												header: "Loan Amount",
												accessor: (row) => (
													<span className="text-foreground font-medium">
														{row.currency} {row.loanAmount.toLocaleString()}
													</span>
												),
											},
											{
												header: "Duration",
												accessor: (row) => (
													<span className="text-foreground text-sm">
														{row.durationInDays} days
													</span>
												),
											},
											{
												header: "Status",
												accessor: (row) => <StatusBadge status={row.loanStatus} />,
											},
											{
												header: "Action",
												accessor: (row) => (
													<button
														onClick={() => handleRowClick(row)}
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
									: [
											{
												header: "Business Name",
												accessor: (row) => (
													<span className="text-foreground font-medium">
														{row.businessName}
													</span>
												),
											},
											{
												header: "Loan Amount",
												accessor: (row) => (
													<span className="text-foreground font-medium">
														{row.currency} {row.loanAmount.toLocaleString()}
													</span>
												),
											},
											{
												header: "Interest",
												accessor: (row) => (
													<span className="text-foreground text-sm">
														{row.currency} {row.interest.toLocaleString()}
													</span>
												),
											},
											{
												header: "Duration",
												accessor: (row) => (
													<span className="text-foreground text-sm">
														{row.durationInDays} days
													</span>
												),
											},
											{
												header: "Start Date",
												accessor: (row) => (
													<span className="text-foreground text-sm">
														{formatDate(row.loanStartDate)}
													</span>
												),
											},
											{
												header: "Due Date",
												accessor: (row) => (
													<span className="text-foreground text-sm">
														{formatDate(row.loanDueDate)}
													</span>
												),
											},
											{
												header: "Status",
												accessor: (row) => (
													<div className="min-w-40">
														<StatusBadge status={row.loanStatus} />
													</div>
												),
											},
											{
												header: "Action",
												accessor: (row) => (
													<button
														onClick={() => handleRowClick(row)}
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
							}
							pagination={{
								currentPage: currentPage + 1,
								totalItems: (data?.totalPages ?? 1) * (data?.size ?? 10),
								itemsPerPage: data?.size ?? 10,
								onPageChange: (page) => setCurrentPage(page - 1),
							}}
						/>
					)}
				</div>

				<CreditRequestModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					data={
						selectedRequest
							? {
									...selectedRequest,
									documents: documents?.content ?? [],
								}
							: null
					}
					onApprove={handleApprove}
					onReject={handleReject}
					onRefetch={() => documentRefetch()}
					isLoading={isLoading}
				/>

				{approvalMessage && (
					<ApprovalModal
						approvalMessage={approvalMessage}
						isOpen={isApprovalModalOpen}
						onClose={handleApprovalModalClose}
						{...approvalMessage}
					/>
				)}
			</div>
		</div>
	)
}
