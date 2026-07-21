"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Table, TableColumn } from "@/app/components/reusables/table"
import {
	TextField,
	SelectField,
} from "@/app/components/reusables/general_inputs"
import { Modal } from "@/app/components/reusables/modals/modal"
import {
	Business,
	BusinessDocument,
	DisplayBusiness,
} from "@/app/types/general"
import {
	useBusinesses,
	useBusinessesDocuments,
	useBusinessesStatsMain,
} from "@/app/hooks/use_businesses"
import PageSkeleton from "@/app/components/reusables/page_skeleton"
import ApprovalModal from "@/app/components/reusables/modals/approval_modal"
import { getBusinesses, updateBusinessStatus } from "@/app/server/business"
import { formatDateWithSuffix } from "@/app/functions/helpers/formatted_date"
import { StatsSection } from "@/app/components/reusables/stats_section"
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io"
import { FaRegClock } from "react-icons/fa6"
import getKYBStatusBadge from "@/app/components/reusables/kyb_status_badge"
import getAccountStatusTag from "@/app/components/reusables/status_tag"
import { showToast } from "@/app/functions/helpers/notify_user"

const transformBusinessForDisplay = (business: Business): DisplayBusiness => ({
	id: business.id.toString(),
	name: business.businessName,
	rc: business.cacNumber,
	dateJoined: business.createdAt,
	time: new Date(business.createdAt).toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	}),
	joinedVia: "Desktop",
	browser: "Chrome OS",
	kybStatus: (business.status === "ACTIVE"
		? "Completed"
		: business.status === "REJECTED"
			? "Rejected"
			: business.status === "SUSPENDED"
				? "Suspended"
				: "Pending") as DisplayBusiness["kybStatus"],
	status: (business.status === "ACTIVE"
		? "Active"
		: "Inactive") as DisplayBusiness["status"],
	industry: business.industry,
	address: `${business.addressLine1}, ${business.city}, ${business.state}`,
	contactPerson: "",
	contactRole: "",
	email: business.email,
	phone: business.phoneNumber,
	financialStats: [],
	documents: [],
	creditLineLimit: business.creditLineLimit,
	creditLineLimitCurrency: business.creditLineLimitCurrency,
})

export default function BusinessListPage() {
	const [currentPage, setCurrentPage] = useState(1)
	const [searchValue, setSearchValue] = useState("")
	const [selectedStatus, setSelectedStatus] = useState("")
	const [selectedBusiness, setSelectedBusiness] =
		useState<DisplayBusiness | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [businesses, setBusinesses] = useState<DisplayBusiness[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [approvalMessage, setApprovalMessage] = useState<{
		type: "success" | "failed"
		title: string
		message: string
	} | null>(null)

	const [approvalModalOpen, setApprovalModalOpen] = useState(false)
	const [isExporting, setIsExporting] = useState(false)

	// ── Rejection flow state ──
	const [modalStep, setModalStep] = useState<"details" | "reject">("details")
	const [rejectAction, setRejectAction] = useState<
		"SUSPENDED" | "REJECTED" | ""
	>("")
	const [rejectionReason, setRejectionReason] = useState("")
	const [rejectTouched, setRejectTouched] = useState(false)

	const { data: documents } = useBusinessesDocuments(
		selectedBusiness?.id ? { "ownerId.equals": selectedBusiness.id } : {},
		!!selectedBusiness?.id
	)

	const areAllDocumentsVerified = () => {
		if (!documents?.content?.length) return false

		return documents.content.every(
			(document: BusinessDocument) => document.status?.toLowerCase() === "verified"
		)
	}

	const params = {
		page: String(currentPage - 1),

		...(selectedStatus && {
			"status.equals":
				selectedStatus === "Completed"
					? "ACTIVE"
					: selectedStatus === "Rejected"
						? "REJECTED"
						: "PENDING_REVIEW",
		}),

		...(searchValue !== "" && {
			"businessName.contains": searchValue,
		}),
	}

	const exportBusinessesCSV = async () => {
		try {
			setIsExporting(true)

			let page = 0
			let totalPages = 1

			const allBusinesses: DisplayBusiness[] = []

			while (page < totalPages) {
				const searchParams = new URLSearchParams({
					page: String(page),
				})

				if (selectedStatus) {
					searchParams.append(
						"status.equals",
						selectedStatus === "Completed"
							? "ACTIVE"
							: selectedStatus === "Rejected"
								? "REJECTED"
								: "PENDING_REVIEW"
					)
				}

				if (searchValue) {
					searchParams.append("businessName.contains", searchValue)
				}

				const response = await getBusinesses(searchParams.toString())

				if (!response.success) {
					showToast(response.error, "error", "1")
					return
				}

				const data = response.data

				totalPages = data.totalPages

				allBusinesses.push(...data.content.map(transformBusinessForDisplay))

				page++
			}

			const headers = [
				"ID",
				"Business Name",
				"RC Number",
				"Date Joined",
				"Time",
				"Joined Via",
				"Browser",
				"KYB Status",
				"Status",
				"Industry",
				"Address",
				"Contact Person",
				"Contact Role",
				"Email",
				"Phone",
			]

			const rows = allBusinesses.map((business) => [
				business.id,
				business.name,
				business.rc,
				formatDateWithSuffix(business.dateJoined),
				business.time,
				business.joinedVia,
				business.browser,
				business.kybStatus,
				business.status,
				business.industry,
				business.address,
				business.contactPerson,
				business.contactRole,
				business.email,
				business.phone,
			])

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
			link.download = "businesses.csv"
			link.click()

			URL.revokeObjectURL(url)
		} catch (error) {
			console.error(error)
			const newError =
				error instanceof Error ? error.message : "An unknown error occurred"
			showToast(newError, "error", "fd1")
		} finally {
			setIsExporting(false)
		}
	}

	const {
		data: rawBusinesses,
		isLoading,
		refetch: refetchBusiness,
	} = useBusinesses(params)

	const { data: businessStatsRaw, isLoading: isLoadingBusinessStats } =
		useBusinessesStatsMain()

	useEffect(() => {
		const data = rawBusinesses?.content?.map(transformBusinessForDisplay) || []

		setBusinesses(data)
	}, [rawBusinesses])

	const statusOptions = [
		{ label: "All Status", value: "" },
		{ label: "Completed", value: "Completed" },
		{ label: "Pending", value: "Pending" },
		{ label: "Rejected", value: "Rejected" },
	]

	const handleOpenModal = (business: DisplayBusiness) => {
		setSelectedBusiness(business)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		// Reset rejection flow state on close
		setModalStep("details")
		setRejectAction("")
		setRejectionReason("")
		setRejectTouched(false)
		setTimeout(() => setSelectedBusiness(null), 300)
	}

	const handleApproveBusiness = async () => {
		if (!selectedBusiness) return

		const payload = {
			status: "ACTIVE",
		}

		setLoading(true)
		try {
			const res = await updateBusinessStatus(
				selectedBusiness.id,
				JSON.stringify(payload)
			)
			if (res.success) {
				setApprovalMessage({
					type: "success",
					title: "Business Activation Successful!",
					message: "Your request to activate this business has been successful!",
				})
			} else {
				setApprovalMessage({
					type: "failed",
					title: "Business Activation Failed!",
					message: res.error,
				})
			}
		} catch (err) {
			console.error(err)
			setApprovalMessage({
				type: "failed",
				title: "Failed To Approve Document",
				message: err instanceof Error ? err.message : "An unknown error occurred",
			})
		} finally {
			setLoading(false)
			handleCloseModal()
			setApprovalModalOpen(true)
			await refetchBusiness()
		}
	}

	const handleRejectBusiness = async () => {
		if (!selectedBusiness) return

		setRejectTouched(true)
		if (!rejectAction || !rejectionReason.trim()) return

		const payload: Record<string, string> = {
			status: rejectAction,
			rejectionReason: rejectionReason.trim(),
		}

		setLoading(true)
		try {
			const res = await updateBusinessStatus(
				selectedBusiness.id,
				JSON.stringify(payload)
			)
			if (res.success) {
				setApprovalMessage({
					type: "success",
					title:
						rejectAction === "SUSPENDED"
							? "Business Suspended!"
							: "Business Rejected!",
					message:
						rejectAction === "SUSPENDED"
							? "The business has been successfully suspended."
							: "The business has been successfully rejected.",
				})
			} else {
				setApprovalMessage({
					type: "failed",
					title:
						rejectAction === "SUSPENDED" ? "Suspension Failed!" : "Rejection Failed!",
					message: res.error,
				})
			}
		} catch (err) {
			console.error(err)
			setApprovalMessage({
				type: "failed",
				title: "Action Failed",
				message: err instanceof Error ? err.message : "An unknown error occurred",
			})
		} finally {
			setLoading(false)
			handleCloseModal()
			setApprovalModalOpen(true)
			await refetchBusiness()
		}
	}

	const columns: TableColumn<DisplayBusiness>[] = [
		{
			header: "Business",
			accessor: (row) => (
				<div className="flex flex-col">
					<p className="text-foreground font-semibold">{row.name}</p>
					<p className="text-xs text-(--text-1)">{row.rc}</p>
				</div>
			),
		},
		{
			header: "Date Joined",
			accessor: (row) => (
				<div>
					<p>{formatDateWithSuffix(row.dateJoined)}</p>
					<p className="text-xs text-(--text-1)">{row.time}</p>
				</div>
			),
		},
		{
			header: "KYB",
			accessor: (row) => getKYBStatusBadge(row.kybStatus),
		},
		{
			header: "Status",
			accessor: (row) => getAccountStatusTag(row.status),
		},
		{
			header: "Action",
			accessor: (row) => (
				<button
					onClick={() => handleOpenModal(row)}
					title="More options"
					className="hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg text-(--text-1) transition hover:bg-(--grey-4)">
					<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
						<circle cx="5" cy="12" r="2" />
						<circle cx="12" cy="12" r="2" />
						<circle cx="19" cy="12" r="2" />
					</svg>
				</button>
			),
		},
	]

	const businessStats = [
		{
			label: "Total Businesses",
			value: businessStatsRaw?.totalBusinesses ?? 0,
		},
		{
			label: "Active Businesses",
			value: businessStatsRaw?.activeBusinesses ?? 0,
		},
		{
			label: "Inactive Businesses",
			value: businessStatsRaw?.inactiveBusinesses ?? 0,
		},
	]

	const rejectActionOptions = [
		{ label: "Select action", value: "" },
		{ label: "Suspend Business", value: "SUSPENDED" },
		{ label: "Reject Business", value: "REJECTED" },
	]

	const hasActionError = rejectTouched && !rejectAction
	const hasReasonError = rejectTouched && !rejectionReason.trim()

	return (
		<div className="bg-background min-h-screen w-full px-6">
			<div className="w-full overflow-x-auto md:max-w-[80%]">
				<div className="mx-auto px-4 py-8 sm:px-6 lg:px-6">
					<div className="mb-8 flex flex-col items-center justify-between gap-4 lg:flex-row">
						<div className="max-w-100">
							<h1 className="text-foreground text-xl font-bold">Business List</h1>
							<small className="text-[16px] text-(--text-1)">
								Manage and review all businesses and keep track of their activities here
							</small>
						</div>

						<div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:flex-nowrap lg:justify-end">
							<TextField
								id="business-search"
								label="Search"
								placeholder="Search by business name"
								value={searchValue}
								onChange={(value) => {
									setCurrentPage(1)
									setSearchValue(value)
								}}
								compact
								searchIcon
							/>

							<SelectField
								id="business-status"
								label="Status"
								value={selectedStatus}
								onChange={(value) => {
									setCurrentPage(1)
									setSelectedStatus(value)
								}}
								options={statusOptions}
								placeholder="All Status"
								compact
							/>

							<button
								onClick={exportBusinessesCSV}
								className="bg-foreground text-background flex w-full cursor-pointer items-center justify-center gap-2 truncate rounded-lg px-4 py-2 text-sm font-medium transition hover:opacity-90 sm:w-auto">
								<span>{isExporting ? "Exporting" : "Export"} CSV</span>
								<svg
									className="h-4 w-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
						</div>
					</div>

					{!isLoadingBusinessStats && businessStatsRaw && (
						<StatsSection stats={businessStats} />
					)}

					{isLoading ? (
						<div className="bg-background min-h-screen w-full">
							<div className="w-full overflow-x-auto">
								<PageSkeleton />
							</div>
						</div>
					) : (
						<Table
							data={businesses}
							columns={columns}
							extraHeader="Registered Businesses"
							pagination={{
								currentPage,
								totalItems: rawBusinesses?.totalElements || 0,
								itemsPerPage: rawBusinesses?.size || 15,
								onPageChange: setCurrentPage,
							}}
						/>
					)}
				</div>
			</div>

			<ApprovalModal
				approvalMessage={approvalMessage}
				isOpen={approvalModalOpen}
				onClose={() => setApprovalModalOpen(false)}
			/>

			<Modal
				isOpen={isModalOpen}
				title={modalStep === "details" ? "Business Details" : "Reject Business"}
				onClose={handleCloseModal}
				variant="slide">
				{selectedBusiness && (
					<div className="flex h-full flex-col">
						{/* ── DETAILS── */}
						{modalStep === "details" && (
							<>
								<div className="flex flex-1 flex-col gap-5">
									<div className="flex justify-between gap-1 border-b border-(--grey-1) pb-5">
										<p className="text-sm font-medium tracking-wide text-(--text-1)">
											Business
										</p>

										<div className="flex flex-col">
											<p className="text-foreground text-base font-semibold">
												{selectedBusiness.name}
											</p>
										</div>
									</div>

									<div className="flex items-center justify-between border-b border-(--grey-1) py-3">
										<p className="text-sm text-(--text-1)">Industry</p>

										<p className="text-foreground text-sm font-medium">
											{selectedBusiness.industry}
										</p>
									</div>

									<div className="flex items-center justify-between border-b border-(--grey-1) py-3">
										<p className="text-sm text-(--text-1)">Date Joined</p>

										<div className="text-right">
											<p className="text-foreground text-sm font-medium">
												{formatDateWithSuffix(selectedBusiness.dateJoined)}
											</p>

											<p className="text-xs text-(--text-1)">{selectedBusiness.time}</p>
										</div>
									</div>

									<div className="flex items-center justify-between border-b border-(--grey-1) py-3">
										<p className="text-sm text-(--text-1)">KYB Status</p>

										{getKYBStatusBadge(selectedBusiness.kybStatus)}
									</div>

									<div className="flex items-center justify-between border-b border-(--grey-1) py-3">
										<p className="text-sm text-(--text-1)">Account Status</p>

										{getAccountStatusTag(selectedBusiness.status)}
									</div>

									<div className="flex items-center justify-between border-b border-(--grey-1) py-3">
										<p className="text-sm text-(--text-1)">Contact Email</p>

										<p className="text-foreground max-w-50 text-sm font-medium">
											{selectedBusiness.email}
										</p>
									</div>

									<div className="flex items-center justify-between border-b border-(--grey-1) py-3">
										<p className="text-sm text-(--text-1)">Phone Number</p>

										<p className="text-foreground text-sm font-medium">
											{selectedBusiness.phone}
										</p>
									</div>

									<div className="flex items-center justify-between border-b border-(--grey-1) py-3">
										<p className="text-sm text-(--text-1)">Address</p>

										<p className="text-foreground max-w-50 text-right text-sm font-medium">
											{selectedBusiness.address}
										</p>
									</div>

									<Link
										href={`/admin/manage-business/${selectedBusiness.id}`}
										className="mt-1 flex items-center gap-2 text-sm font-medium text-(--green-1) hover:underline"
										onClick={handleCloseModal}>
										<svg
											className="h-4 w-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
											/>
										</svg>
										View Full Details
									</Link>
								</div>

								{selectedBusiness.kybStatus !== "Completed" && (
									<div className="-mx-6 my-6 mt-6 flex flex-col justify-between gap-y-3 border-t border-(--grey-1) px-6 pt-6 pb-8 md:flex-row">
										<button
											title="Reject or suspend business"
											onClick={() => setModalStep("reject")}
											className={`w-full rounded-md bg-(--red-1) py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.99] md:w-50`}>
											Reject Business
										</button>

										<button
											title={
												!areAllDocumentsVerified()
													? "Some documents are yet to be verified or has been rejected"
													: "Approve business"
											}
											disabled={!areAllDocumentsVerified()}
											onClick={handleApproveBusiness}
											className={`w-full rounded-md md:w-50 ${areAllDocumentsVerified() ? "cursor-pointer bg-(--green-1)" : "cursor-not-allowed bg-(--green-1)/60"} py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.99]`}>
											{loading ? "Approving Business..." : "Approve Business"}
										</button>
									</div>
								)}
							</>
						)}

						{/* ── REJECT ── */}
						{modalStep === "reject" && (
							<div className="flex flex-col gap-4">
								<div className="bg-background flex items-center justify-between rounded-xl border border-(--grey-1) px-4 py-3.5">
									<div className="flex flex-col">
										<p className="text-foreground text-sm font-semibold">
											{selectedBusiness.name}
										</p>
										<p className="text-xs font-medium text-(--text-1)">
											{selectedBusiness.rc}
										</p>
									</div>

									<div className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-(--grey-1) px-1 text-xs font-medium text-(--text-1)">
										{getKYBStatusBadge(selectedBusiness.kybStatus)}
									</div>
								</div>

								<div className="min-h-50 space-y-3">
									{/* Action dropdown */}
									<div className="flex flex-col gap-1.5">
										<label className="text-sm font-medium text-(--text-1)">
											Action <span className="text-(--red-1)">*</span>
										</label>
										<select
											value={rejectAction}
											onChange={(e) => {
												setRejectAction(e.target.value as "SUSPENDED" | "REJECTED" | "")
												if (rejectTouched) setRejectTouched(false)
											}}
											disabled={loading}
											className={`text-foreground w-full rounded-xl border ${hasActionError ? "border-(--red-1)" : "border-(--grey-1)"} bg-(--grey-4) px-4 py-3.5 text-sm transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-60`}>
											{rejectActionOptions.map((opt) => (
												<option key={opt.value} value={opt.value}>
													{opt.label}
												</option>
											))}
										</select>
										{hasActionError && (
											<p className="text-xs text-(--red-1)">Please select an action.</p>
										)}
									</div>

									{(rejectAction === "REJECTED" || rejectAction === "SUSPENDED") && (
										<div className="flex flex-col gap-1.5">
											<label className="text-sm font-medium text-(--text-1)">
												Reason for{" "}
												{rejectAction === "REJECTED" ? "Rejection" : "Suspension"}{" "}
												<span className="text-(--red-1)">*</span>
											</label>
											<textarea
												value={rejectionReason}
												onChange={(e) => {
													setRejectionReason(e.target.value)
													if (rejectTouched && e.target.value.trim()) setRejectTouched(false)
												}}
												placeholder="Enter reason..."
												rows={5}
												disabled={loading}
												className={`text-foreground w-full resize-none rounded-xl border ${hasReasonError ? "border-(--red-1)" : "border-(--grey-1)"} bg-(--grey-4) px-4 py-3.5 text-sm transition placeholder:text-(--text-1) focus:outline-none disabled:cursor-not-allowed disabled:opacity-60`}
											/>
											{hasReasonError && (
												<p className="text-xs text-(--red-1)">Please enter a reason.</p>
											)}
										</div>
									)}
								</div>

								<div className="flex gap-3 pt-1">
									<button
										onClick={() => {
											if (loading) return
											setModalStep("details")
											setRejectAction("")
											setRejectionReason("")
											setRejectTouched(false)
										}}
										disabled={loading}
										className="text-foreground flex-1 cursor-pointer rounded-xl border border-(--grey-1) px-4 py-3.5 text-sm font-semibold transition hover:bg-(--grey-4) disabled:cursor-not-allowed disabled:opacity-50">
										Go Back
									</button>

									<button
										onClick={handleRejectBusiness}
										disabled={loading}
										className="bg-foreground text-background flex-1 cursor-pointer rounded-xl px-4 py-3.5 text-sm font-semibold transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50">
										{loading
											? rejectAction === "SUSPENDED"
												? "Suspending..."
												: "Rejecting..."
											: rejectAction === "SUSPENDED"
												? "Confirm Suspension"
												: "Confirm Rejection"}
									</button>
								</div>
							</div>
						)}
					</div>
				)}
			</Modal>
		</div>
	)
}
