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
import { useCreditAdmin } from "@/app/hooks/use_credit_history"
import {
	PaginatedLoanApplicationResponse,
	LoanApplication,
} from "@/app/types/general"
import { updatecreditStatus } from "@/app/server/credits"
import PageSkeleton from "@/app/components/reusables/page_skeleton"
import { CSVLink } from "react-csv"
import { useBusinessesDocuments } from "@/app/hooks/use_businesses"

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
	const [creditHistoryData, setCreditHistoryData] =
		useState<PaginatedLoanApplicationResponse | null>(null)

	const {
		data,
		refetch,
		isLoading: creditHistoryLoading,
	} = useCreditAdmin({
		page: String(currentPage),
		...(searchTerm ? { "reference.contains": searchTerm } : {}),
		...(statusFilter ? { "creditLineStatus.equals": statusFilter } : {}),
	})

	const { data: documents, refetch: documentRefetch } = useBusinessesDocuments(
		selectedRequest?.loanId
			? { "ownerId.equals": String(selectedRequest.loanId) }
			: {},
		!!selectedRequest?.loanId
	)

	const tableData =
		creditHistoryData?.content.map((item, index) => ({
			id: index + 1,
			...item,
		})) || []

	useEffect(() => {
		setCreditHistoryData(data)
	}, [data])

	const items: LoanApplication[] = creditHistoryData?.content ?? []

	// Stats derived from the current page
	const totalRequests = creditHistoryData?.totalElements ?? items.length
	const pendingRequests = items.filter((r) => r.loanStatus === "REVIEW").length
	const disbursedRequests = items.filter(
		(r) => r.loanStatus === "DISBURSED"
	).length
	const totalCreditAmount = items.reduce((sum, r) => sum + r.loanAmount, 0)

	const statsData = [
		{ label: "Total Credit Requests", value: totalRequests },
		{ label: "Under Review", value: pendingRequests },
		{ label: "Disbursed Credits", value: disbursedRequests },
		{
			label: "Total Credit Amount",
			valueRow: { main: `${(totalCreditAmount / 1_000_000).toFixed(1)}M` },
		},
	]

	const statusOptions = [
		{ label: "All", value: "" },
		{ label: "Review", value: "REVIEW" },
		{ label: "Approved", value: "APPROVED" },
		{ label: "Disbursed", value: "DISBURSED" },
		{ label: "Rejected", value: "REJECTED" },
		{ label: "Repaid", value: "REPAID" },
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
		organizationName: item.reference,
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
		disbursed: "REPAID",
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
			refetch()
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
			refetch()
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
							<SelectField
								label=""
								id="status-filter"
								value={statusFilter}
								onChange={setStatusFilter}
								placeholder="All Statuses"
								options={statusOptions}
								compact
							/>
							{tableData.length > 0 && (
								<CSVLink
									data={tableData.map((row) => ({
										Reference: row.reference,
										"Loan Amount": row.loanAmount,
										Currency: row.currency,
										Interest: row.interest,
										"Duration (days)": row.durationInDays,
										"Start Date": formatDate(row.loanStartDate),
										"Due Date": formatDate(row.loanDueDate),
										Status: row.loanStatus,
									}))}
									filename="credit-requests.csv"
									className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3 py-1 text-xs font-semibold whitespace-nowrap text-white transition hover:bg-neutral-800">
									<svg
										className="h-3.5 w-3.5"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
										/>
									</svg>
									Export CSV
								</CSVLink>
							)}
						</div>
					</div>

					{creditHistoryLoading ? (
						<div className="bg-background min-h-screen w-full px-6">
							<div className="w-full overflow-x-auto">
								<PageSkeleton />
							</div>
						</div>
					) : (
						<Table
							data={tableData || []}
							columns={[
								{
									header: "Reference",
									accessor: (row) => (
										<span className="text-foreground font-mono text-xs font-semibold">
											{row.reference.split("-")[0]}…
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
										<span
											className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
												statusStyle[row.loanStatus] ?? "bg-gray-100 text-gray-700"
											}`}>
											{row.loanStatus.charAt(0) + row.loanStatus.slice(1).toLowerCase()}
										</span>
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
							]}
							pagination={{
								currentPage: currentPage + 1,
								totalItems:
									(creditHistoryData?.totalPages ?? 1) * (creditHistoryData?.size ?? 10),
								itemsPerPage: creditHistoryData?.size ?? 10,
								onPageChange: (page) => {
									setCurrentPage(page - 1)
								},
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
