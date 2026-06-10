"use client"

import { useMemo, useState } from "react"
import { Table, TableColumn } from "@/app/components/reusables/table"
import {
	TextField,
	SelectField,
} from "@/app/components/reusables/general_inputs"
import DocumentReviewModal from "@/app/components/reusables/modals/review_modal"
import DocumentHistoryModal from "@/app/components/reusables/modals/history_modal"
import ApprovalModal from "@/app/components/reusables/modals/approval_modal"
import {
	getFileBgClass,
	getFileIconFromName,
} from "@/app/components/reusables/file_icons"
import { BusinessDocument } from "@/app/types/general"
import { useBusinessesDocuments } from "@/app/hooks/use_businesses"
import PageSkeleton from "@/app/components/reusables/page_skeleton"
import { updateBusinessDocuments } from "@/app/server/business"
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io"
import { FaRegClock } from "react-icons/fa6"
import { StatsSection } from "@/app/components/reusables/stats_section"

export default function ManageDocumentPage() {
	const [currentPage, setCurrentPage] = useState(1)
	const [searchValue, setSearchValue] = useState("")
	const [selectedStatus, setSelectedStatus] = useState("")
	const [loading, setLoading] = useState<boolean>(false)
	const [approvalMessage, setApprovalMessage] = useState<{
		type: "success" | "failed"
		title: string
		message: string
	} | null>(null)

	// Document modal state
	const [reviewModalOpen, setReviewModalOpen] = useState(false)
	const [historyModalOpen, setHistoryModalOpen] = useState(false)
	const [approvalModalOpen, setApprovalModalOpen] = useState(false)
	const [selectedDocument, setSelectedDocument] =
		useState<BusinessDocument | null>(null)

	const params = {
		page: String(currentPage - 1),

		...(selectedStatus && {
			"status.equals":
				selectedStatus === "Approved"
					? "VERIFIED"
					: selectedStatus === "Rejected"
						? "REJECTED"
						: "PENDING",
		}),

		...(searchValue !== "" && {
			"publicId.contains": searchValue,
		}),
	}

	const {
		data: documents,
		isLoading,
		refetch: refetchDocuments,
	} = useBusinessesDocuments(params, true)

	// ── Derived stats ────────────────────────────────────────────────────────
	const allDocuments: BusinessDocument[] = documents?.content ?? []

	const documentStats = useMemo(() => {
		const total = documents?.totalElements ?? 0
		const approved = allDocuments.filter((d) => d.status === "VERIFIED").length
		const pending = allDocuments.filter(
			(d) => d.status !== "VERIFIED" && d.status !== "REJECTED"
		).length
		const rejected = allDocuments.filter((d) => d.status === "REJECTED").length

		return [
			{ label: "Total Documents", value: total },
			{ label: "Total Approved", value: approved },
			{ label: "Total Pending", value: pending },
			{ label: "Total Rejected", value: rejected },
		]
	}, [documents, allDocuments])

	// ── Status filter options ────────────────────────────────────────────────
	const statusOptions = [
		{ label: "All Status", value: "" },
		{ label: "Approved", value: "Approved" },
		{ label: "Pending", value: "Pending" },
		{ label: "Rejected", value: "Rejected" },
	]

	// ── Handlers ─────────────────────────────────────────────────────────────
	const handleReviewDocument = (doc: BusinessDocument) => {
		setSelectedDocument(doc)
		setReviewModalOpen(true)
	}

	const handleViewHistory = (doc: BusinessDocument) => {
		setSelectedDocument(doc)
		setHistoryModalOpen(true)
	}

	const handleApproveDocument = async () => {
		if (!selectedDocument) return

		setLoading(true)
		try {
			const req = await updateBusinessDocuments(
				JSON.stringify({ status: "VERIFIED" }),
				String(selectedDocument.publicId)
			)

			if (req.success) {
				setSelectedDocument((prev) =>
					prev ? { ...prev, status: "VERIFIED" } : prev
				)
				setApprovalMessage({
					type: "success",
					title: "Document Approved Successfully!",
					message:
						"Your request to approve this document has been successfully processed!",
				})
			} else {
				setApprovalMessage({
					type: "failed",
					title: "Failed To Approve Document",
					message: req.error,
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
			setReviewModalOpen(false)
			setApprovalModalOpen(true)
			await refetchDocuments()
		}
	}

	const handleRejectionConfirm = async (reason: string) => {
		if (!selectedDocument) return

		setLoading(true)
		try {
			const req = await updateBusinessDocuments(
				JSON.stringify({ status: "REJECTED", rejectionReason: reason }),
				String(selectedDocument.publicId)
			)

			if (req.success) {
				setSelectedDocument((prev) =>
					prev ? { ...prev, status: "REJECTED", rejectionReason: reason } : prev
				)
				setApprovalMessage({
					type: "success",
					title: "Document Rejected",
					message: "The document status has been updated to rejected.",
				})
			} else {
				setApprovalMessage({
					type: "failed",
					title: "Failed to reject document",
					message: req.error,
				})
			}
		} catch (err) {
			console.error(err)
			setApprovalMessage({
				type: "failed",
				title: "Failed to reject document",
				message: err instanceof Error ? err.message : "An unknown error occurred",
			})
		} finally {
			setLoading(false)
			setReviewModalOpen(false)
			setApprovalModalOpen(true)
			await refetchDocuments()
		}
	}

	const documentColumns: TableColumn<BusinessDocument>[] = [
		{
			header: "Documents",
			accessor: (row) => (
				<div className="flex items-center gap-3">
					<span
						className={`shrink-0 rounded-lg px-2 py-2 ${getFileBgClass(row.fileName)}`}>
						{getFileIconFromName(row.fileName, true)}
					</span>
					<div className="flex flex-col">
						<p className="text-foreground max-w-50 truncate text-[14px] font-semibold">
							{row.fileName}
						</p>
						<p className="text-xs tracking-wide text-(--text-1) uppercase">
							{row.documentType.replace(/_/g, " ")}
						</p>
					</div>
				</div>
			),
		},
		{
			header: "Date",
			accessor: (row) => (
				<div>
					<p className="text-foreground">
						{new Date(row.uploadedAt).toLocaleDateString("en-GB").replace(/\//g, "-")}
					</p>
					<p className="text-xs text-(--text-1)">
						{new Date(row.uploadedAt).toLocaleTimeString("en-GB", {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
				</div>
			),
		},
		{
			header: "Status",
			accessor: (row) => (
				<div
					className={`inline-flex items-center gap-2 rounded-full bg-(--grey-1) px-3 py-1.5 text-xs font-medium text-(--text-1)`}>
					{row.status === "VERIFIED" ? (
						<IoMdCheckmarkCircle size={16} className="text-(--green-1)" />
					) : row.status === "REJECTED" ? (
						<IoMdCloseCircle size={16} className="text-(--red-1)" />
					) : (
						<FaRegClock size={14} className="text-orange-500" />
					)}

					{row.status === "VERIFIED"
						? "Approved"
						: row.status === "REJECTED"
							? "Rejected"
							: "Pending Review"}
				</div>
			),
		},
		{
			header: "Action",
			accessor: (row) => (
				<div className="flex items-center gap-4">
					<button
						onClick={() => handleReviewDocument(row)}
						className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-(--grey-1) px-2 py-2 text-sm text-[16px] font-medium text-(--text-1) transition">
						<svg
							className="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 4v16m8-8H4"
							/>
						</svg>
						Review
					</button>
					<button
						onClick={() => handleViewHistory(row)}
						className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-(--grey-1) px-2 py-2 text-sm text-[16px] font-medium text-(--text-1) transition">
						<svg
							className="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
							/>
						</svg>
						History
					</button>
				</div>
			),
		},
	]

	return (
		<div className="bg-background min-h-screen w-full px-6">
			<div className="w-full overflow-x-auto md:max-w-[80%]">
				<div className="mx-auto px-4 py-8 sm:px-6 lg:px-6">
					{/* Page Header */}
					<div className="mb-8 flex items-center justify-between gap-4">
						<div className="max-w-100">
							<h1 className="text-foreground text-xl font-bold">
								Document Management
							</h1>
							<small className="text-[16px] text-(--text-1)">
								Review and manage all submitted business documents here
							</small>
						</div>

						<div className="flex items-center gap-2">
							<TextField
								id="document-search"
								label="Search"
								placeholder="Search by public id"
								value={searchValue}
								onChange={(value) => {
									setCurrentPage(1)
									setSearchValue(value)
								}}
								compact
								searchIcon
							/>

							<SelectField
								id="document-status"
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
						</div>
					</div>

					<StatsSection stats={documentStats} />

					{isLoading ? (
						<div className="bg-background min-h-screen w-full">
							<div className="w-full overflow-x-auto">
								<PageSkeleton />
							</div>
						</div>
					) : (
						<Table
							data={documents?.content || []}
							columns={documentColumns}
							extraHeader="All Documents"
							pagination={{
								currentPage,
								totalItems: documents?.totalElements || 0,
								itemsPerPage: documents?.pageSize || 10,
								onPageChange: setCurrentPage,
							}}
						/>
					)}
				</div>
			</div>

			<DocumentReviewModal
				loading={loading}
				isOpen={reviewModalOpen}
				document={selectedDocument}
				onClose={() => setReviewModalOpen(false)}
				onApprove={handleApproveDocument}
				onReject={(reason) => handleRejectionConfirm(reason)}
			/>

			<DocumentHistoryModal
				isOpen={historyModalOpen}
				document={selectedDocument}
				onClose={() => setHistoryModalOpen(false)}
			/>

			<ApprovalModal
				approvalMessage={approvalMessage}
				isOpen={approvalModalOpen}
				onClose={() => setApprovalModalOpen(false)}
			/>
		</div>
	)
}
