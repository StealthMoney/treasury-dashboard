"use client"

import { useState } from "react"
import Link from "next/link"
import { StatsSection } from "../reusables/stats_section"
import { KYBStepWrapper } from "../reusables/kybstepwraper"
import { Table, TableColumn } from "@/app/components/reusables/table"
import DocumentReviewModal from "@/app/components/reusables/modals/review_modal"
import DocumentHistoryModal from "@/app/components/reusables/modals/history_modal"
import ApprovalModal from "@/app/components/reusables/modals/approval_modal"
import RejectionModal from "@/app/components/reusables/modals/rejection_modal"
import DirectorDetailModal from "@/app/components/reusables/modals/director_modal"
import { getFileIconFromName } from "../reusables/file_icons"
import { BusinessDocument, BusinessDirector } from "@/app/types/general"
import {
	useBusinessesDetails,
	useBusinessesDirectors,
	useBusinessesDocuments,
} from "@/app/hooks/use_businesses"
import PageSkeleton from "../reusables/page_skeleton"
import SectionSkeleton from "../reusables/sectionSkeleton"
import {
	updateBusinessDirectors,
	updateBusinessDocuments,
} from "@/app/server/business"

export default function BusinessDetailPage({ id }: { id: string }) {
	const [loading, setLoading] = useState<boolean>(false)
	const [approvalMessage, setApprovalMessage] = useState<{
		type: "success" | "failed"
		title: string
		message: string
	} | null>(null)

	const { data: business, isLoading } = useBusinessesDetails(id)

	const {
		data: directors,
		isLoading: directorsLoading,
		refetch: refetchDirectors,
	} = useBusinessesDirectors(id)

	const {
		data: documents,
		isLoading: documentLoading,
		refetch: refetchDocuments,
	} = useBusinessesDocuments({ "ownerId.equals": id }, !!id)

	// const business = businesses.find((item) => item.id === id)

	const [activeTab, setActiveTab] = useState("overview")

	// Document modal state
	const [reviewModalOpen, setReviewModalOpen] = useState(false)
	const [historyModalOpen, setHistoryModalOpen] = useState(false)
	const [selectedDocument, setSelectedDocument] =
		useState<BusinessDocument | null>(null)

	// Director modal state
	const [directorModalOpen, setDirectorModalOpen] = useState(false)
	const [selectedDirector, setSelectedDirector] =
		useState<BusinessDirector | null>(null)

	// Shared approval / rejection modal state
	const [approvalModalOpen, setApprovalModalOpen] = useState(false)
	const [rejectionModalOpen, setRejectionModalOpen] = useState(false)
	const [rejectionSubject, setRejectionSubject] = useState<
		"document" | "director"
	>("document")

	function toAbsoluteUrl(url: string): string {
		if (!url) return url
		if (url.startsWith("http://") || url.startsWith("https://")) return url
		return `https://${url}`
	}

	const handleReviewDocument = (doc: BusinessDocument) => {
		setSelectedDocument(doc)
		setReviewModalOpen(true)
	}

	const handleViewHistory = (doc: BusinessDocument) => {
		setSelectedDocument(doc)
		setHistoryModalOpen(true)
	}

	const handleApproveDocument = async () => {
		if (!id || !selectedDocument) return

		const payload = {
			status: "VERIFIED",
		}
		setLoading(true)
		try {
			const req = await updateBusinessDocuments(
				JSON.stringify(payload),
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

	const handleRejectDocument = () => {
		setReviewModalOpen(false)
		setRejectionSubject("document")
		setRejectionModalOpen(true)
	}

	// const handleRejectDocument = async (reason: string) => {

	// }

	const handleViewDirector = (director: BusinessDirector) => {
		setSelectedDirector(director)
		setDirectorModalOpen(true)
	}

	// const handleApproveDirector = () => {
	// 	setDirectorModalOpen(false)
	// 	setApprovalModalOpen(true)
	// }

	const handleApproveDirector = async () => {
		if (!id || !selectedDirector) return

		const payload = {
			status: "VERIFIED",
		}
		setLoading(true)
		try {
			const req = await updateBusinessDirectors(
				JSON.stringify(payload),
				id,
				String(selectedDirector.id)
			)

			if (req.success) {
				setSelectedDirector((prev) =>
					prev ? { ...prev, status: "VERIFIED" } : prev
				)
				setApprovalMessage({
					type: "success",
					title: "Director Approved Successfully!",
					message:
						"Your request to approve this business director has been successfully processed!",
				})
			} else {
				setApprovalMessage({
					type: "failed",
					title: "Failed To Approve Director",
					message: req.error,
				})
			}
		} catch (err) {
			console.error(err)
			setApprovalMessage({
				type: "failed",
				title: "Failed To Approve Director",
				message: err instanceof Error ? err.message : "An unknown error occurred",
			})
		} finally {
			setLoading(false)
			setDirectorModalOpen(false)
			setApprovalModalOpen(true)
			await refetchDirectors()
		}
	}

	const handleRejectDirector = () => {
		setDirectorModalOpen(false)
		setRejectionSubject("director")
		setRejectionModalOpen(true)
	}

	const handleRejectionConfirm = async (reason: string) => {
		if (rejectionSubject === "director") {
			if (!id || !selectedDirector) return

			setLoading(true)
			try {
				const req = await updateBusinessDirectors(
					JSON.stringify({ status: "REJECTED", rejectionReason: reason }),
					id,
					String(selectedDirector.id)
				)

				if (req.success) {
					setSelectedDirector((prev) =>
						prev ? { ...prev, status: "REJECTED", rejectionReason: reason } : prev
					)
					setApprovalMessage({
						type: "success",
						title: "Director Rejected",
						message: "The director's status has been updated to rejected.",
					})
				} else {
					setApprovalMessage({
						type: "failed",
						title: "Failed to reject director",
						message: req.error,
					})
				}
			} catch (err) {
				setApprovalMessage({
					type: "failed",
					title: "Failed to reject director",
					message: err instanceof Error ? err.message : "An unknown error occurred",
				})
			} finally {
				setLoading(false)
				setRejectionModalOpen(false)
				setApprovalModalOpen(true)
				await refetchDirectors()
			}
		} else if (rejectionSubject === "document") {
			if (!id || !setSelectedDocument) return

			setLoading(true)
			try {
				const req = await updateBusinessDocuments(
					JSON.stringify({ status: "REJECTED", rejectionReason: reason }),
					String(selectedDocument?.publicId)
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
				setApprovalMessage({
					type: "failed",
					title: "Failed to reject document",
					message: err instanceof Error ? err.message : "An unknown error occurred",
				})
			} finally {
				setLoading(false)
				setRejectionModalOpen(false)
				setApprovalModalOpen(true)
				await refetchDocuments()
			}
		}

		setRejectionModalOpen(false)
	}

	// ── Document columns ───────────────────────────────────────────────────────
	const documentColumns: TableColumn<BusinessDocument>[] = [
		{
			header: "Documents",
			accessor: (row) => (
				<div className="flex items-center gap-3">
					<span className="shrink-0">{getFileIconFromName(row.fileName, true)}</span>
					<div className="flex flex-col">
						<p className="text-foreground max-w-50 truncate font-semibold">
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
						{new Date(row.uploadedAt).toLocaleDateString("en-GB")}
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
					className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
						row.status === "VERIFIED"
							? "bg-green-50 text-(--green-1)"
							: row.status === "REJECTED"
								? "bg-red-50 text-(--red-1)"
								: "bg-orange-50 text-orange-600"
					}`}>
					<span
						className={`h-2 w-2 rounded-full ${
							row.status === "VERIFIED"
								? "bg-(--green-1)"
								: row.status === "REJECTED"
									? "bg-(--red-1)"
									: "bg-orange-500"
						}`}
					/>
					{row.status === "VERIFIED"
						? "Verified"
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
						className="inline-flex items-center gap-2 text-sm font-medium text-(--green-1) transition">
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
						className="inline-flex items-center gap-2 text-sm font-medium text-(--grey-3) transition hover:text-(--text-1)">
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

	// ── Director columns ───────────────────────────────────────────────────────
	const directorColumns: TableColumn<BusinessDirector>[] = [
		{
			header: "Director",
			accessor: (row) => (
				<div className="flex flex-col">
					<p className="text-foreground font-semibold">
						{row.firstName} {row.lastName}
					</p>
					<p className="text-xs tracking-wide text-(--text-1) uppercase">
						{row.role.replace(/_/g, " ")}
					</p>
				</div>
			),
		},
		{
			header: "Ownership",
			accessor: (row) => (
				<p className="text-foreground font-medium">{row.ownershipPercentage}%</p>
			),
		},
		{
			header: "PEP",
			accessor: (row) =>
				row.isPep ? (
					<div className="inline-flex items-center gap-1.5 rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700">
						<svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
						Yes
					</div>
				) : (
					<span className="text-xs text-(--text-1)">No</span>
				),
		},
		{
			header: "Status",
			accessor: (row) => (
				<div
					className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
						row.status === "VERIFIED"
							? "bg-green-50 text-(--green-1)"
							: row.status === "REJECTED"
								? "bg-red-50 text-(--red-1)"
								: "bg-orange-50 text-orange-600"
					}`}>
					<span
						className={`h-2 w-2 rounded-full ${
							row.status === "VERIFIED"
								? "bg-(--green-1)"
								: row.status === "REJECTED"
									? "bg-(--red-1)"
									: "bg-orange-500"
						}`}
					/>
					{row.status === "VERIFIED"
						? "Verified"
						: row.status === "REJECTED"
							? "Rejected"
							: "Pending"}
				</div>
			),
		},
		{
			header: "Action",
			accessor: (row) => (
				<button
					onClick={() => handleViewDirector(row)}
					className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-(--green-1) transition hover:underline">
					<svg
						className="h-4 w-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
						/>
					</svg>
					View
				</button>
			),
		},
	]

	return (
		<div className="bg-background min-h-screen w-full px-6">
			<div className="w-full overflow-x-auto md:max-w-[80%]">
				<div className="mx-auto px-4 py-8 sm:px-6 lg:px-6">
					{/* Back */}
					<Link
						href="/admin/manage-business"
						className="hover:text-foreground mb-8 inline-flex items-center gap-2 font-medium text-(--text-1) transition">
						<svg
							className="h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Go Back to Businesses
					</Link>

					{/* Business Header */}
					{isLoading ? (
						<div className="mb-6 w-full lg:w-2/4">
							<SectionSkeleton />
						</div>
					) : business ? (
						<div className="mb-8 flex items-start justify-between">
							<div>
								<h1 className="text-foreground mb-2 text-2xl font-bold">
									{business?.businessName}
								</h1>
								<p className="text-(--text-1)">
									Business Reg No: {business?.cacNumber}
								</p>
								<div
									className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
										business?.status === "ACTIVE"
											? "bg-green-50 text-(--green-1)"
											: "bg-orange-50 text-orange-600"
									}`}>
									<span
										className={`h-2 w-2 rounded-full ${
											business?.status === "ACTIVE" ? "bg-(--green-1)" : "bg-orange-500"
										}`}
									/>
									{business?.status}
								</div>
							</div>
						</div>
					) : null}

					{/* Tabs */}
					<div className="mb-8 flex gap-8 border-b border-(--grey-1)">
						{[
							{ id: "overview", label: "Overview" },
							{ id: "documents", label: "Documents" },
							{ id: "directors", label: "Directors" },
						].map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`pb-4 font-medium transition ${
									activeTab === tab.id
										? "text-foreground border-b-2 border-(--green-1)"
										: "hover:text-foreground text-(--text-1)"
								}`}>
								{tab.label}
							</button>
						))}
					</div>

					{/* Overview */}
					{activeTab === "overview" &&
						(isLoading ? (
							<div className="bg-background -mt-6">
								<PageSkeleton />
							</div>
						) : (
							<div className="space-y-6">
								{/* <StatsSection stats={business?.financialStats} /> add later */}
								<KYBStepWrapper title="Business Information">
									<div className="space-y-6">
										<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
											<div>
												<p className="mb-1 text-sm text-(--text-1)">Business ID:</p>
												<p className="text-foreground font-medium">{business?.id}</p>
											</div>
											<div className="sm:text-right">
												<p className="mb-1 text-sm text-(--text-1)">Industry:</p>
												<p className="text-foreground font-medium">
													{business?.industry || "N/A"}
												</p>
											</div>
										</div>
										<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
											<div>
												<p className="mb-1 text-sm text-(--text-1)">Address:</p>
												<p className="text-foreground max-w-lg font-medium">
													{business?.addressLine1 || "N/A"}
												</p>
											</div>
										</div>
										<div className="flex flex-col gap-4 border-t border-(--grey-1) pt-6 sm:flex-row sm:items-center sm:justify-between">
											<div>
												<p className="mb-1 text-sm text-(--text-1)">Business Type:</p>
												<p className="text-foreground font-medium">
													{business?.businessType || "N/A"}
												</p>
											</div>
											<div className="sm:text-right">
												<p className="mb-1 text-sm text-(--text-1)">Website:</p>
												{business?.website && business?.website !== "" && (
													<Link
														href={toAbsoluteUrl(business?.website || "")}
														target="_blank"
														className="font-medium text-(--green-1) hover:underline">
														{business?.website || "N/A"}
													</Link>
												)}
											</div>
										</div>
										<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
											<div>
												<p className="mb-1 text-sm text-(--text-1)">Email Address:</p>
												{business?.email && business?.email !== "" && (
													<Link
														href={`mailto:${business.email}`}
														target="_blank"
														className="font-medium text-(--green-1) hover:underline">
														{business?.email || "N/A"}
													</Link>
												)}
											</div>
											<div className="sm:text-right">
												<p className="mb-1 text-sm text-(--text-1)">Phone Number:</p>
												<p className="text-foreground font-medium">
													{business?.phoneNumber || "N/A"}
												</p>
											</div>
										</div>
										<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
											<div>
												<p className="mb-1 text-sm text-(--text-1)">Linkedin:</p>
												{business?.linkedIn && business?.linkedIn !== "" && (
													<Link
														href={toAbsoluteUrl(business?.linkedIn || "")}
														target="_blank"
														className="font-medium text-(--green-1) hover:underline">
														{business?.linkedIn || "N/A"}
													</Link>
												)}
											</div>
											<div className="sm:text-right">
												<p className="mb-1 text-sm text-(--text-1)">Support Email:</p>
												{business?.supportEmail && business?.supportEmail !== "" && (
													<Link
														href={`mailto:${business.supportEmail}`}
														target="_blank"
														className="font-medium text-(--green-1) hover:underline">
														{business?.supprotEmail || "N/A"}
													</Link>
												)}
											</div>
										</div>
									</div>
								</KYBStepWrapper>
							</div>
						))}

					{/* Documents */}
					{activeTab === "documents" &&
						(documentLoading ? (
							<div className="bg-background min-h-screen w-full px-6">
								<div className="w-full overflow-x-auto">
									<PageSkeleton />
								</div>
							</div>
						) : (
							<div className="space-y-6">
								<h2 className="text-foreground text-lg font-semibold">Documents</h2>
								<Table data={documents?.content || []} columns={documentColumns} />
							</div>
						))}

					{/* Directors */}
					{activeTab === "directors" &&
						(directorsLoading ? (
							<div className="bg-background min-h-screen w-full px-6">
								<div className="w-full overflow-x-auto">
									<PageSkeleton />
								</div>
							</div>
						) : (
							<div className="space-y-6">
								<h2 className="text-foreground text-lg font-semibold">Directors</h2>
								<Table data={directors ?? []} columns={directorColumns} />
							</div>
						))}
				</div>

				{/* ── Document modals ── */}
				<DocumentReviewModal
					loading={loading}
					isOpen={reviewModalOpen}
					document={selectedDocument}
					onClose={() => setReviewModalOpen(false)}
					onApprove={handleApproveDocument}
					onReject={handleRejectDocument}
				/>
				<DocumentHistoryModal
					isOpen={historyModalOpen}
					document={selectedDocument}
					onClose={() => setHistoryModalOpen(false)}
				/>

				{/* ── Director modal ── */}
				<DirectorDetailModal
					loading={loading}
					isOpen={directorModalOpen}
					director={selectedDirector}
					onClose={() => setDirectorModalOpen(false)}
					onApprove={handleApproveDirector}
					onReject={handleRejectDirector}
				/>

				{/* ── Shared approval / rejection modals ── */}
				<ApprovalModal
					approvalMessage={approvalMessage}
					isOpen={approvalModalOpen}
					onClose={() => setApprovalModalOpen(false)}
				/>
				<RejectionModal
					loading={loading}
					isOpen={rejectionModalOpen}
					subject={rejectionSubject}
					onClose={() => setRejectionModalOpen(false)}
					onConfirm={handleRejectionConfirm}
				/>
			</div>
		</div>
	)
}
