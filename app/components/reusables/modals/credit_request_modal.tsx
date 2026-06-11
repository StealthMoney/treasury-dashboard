"use client"

import { useEffect, useState } from "react"
import { formatDateWithSuffix } from "@/app/functions/helpers/formatted_date"
import { Modal } from "./modal"
import {
	FaFilePdf,
	FaImage,
	FaFileWord,
	FaFile,
	FaRegEye,
} from "react-icons/fa6"
import { BusinessDocument } from "@/app/types/general"
import { updateBusinessDocuments } from "@/app/server/business"
import { ISODateString } from "next-auth"
import { getBaseUrl } from "@/app/functions/helpers/get_base_url"

export interface CreditRequest {
	id: string | number
	amount: number
	loanStatus:
		| "pending"
		| "review"
		| "approved"
		| "disbursed"
		| "rejected"
		| "repaid"
	requestDate: string
	startDate: string
	endDate: string
	loanDuration: number
	businessType: string
	email: string
	phone: string
	loanTypeId: number
	loanId: number
	durationInDays: number
	loanAmount: number
	currency: string
	loanStartDate: string
	loanDueDate: string
	reference: string
	interest: number
	createdAt: ISODateString
	businessName: string
	documents?: BusinessDocument[]
}

interface CreditRequestModalProps {
	isOpen: boolean
	onClose: () => void
	data: CreditRequest | null
	onApprove: () => void
	onReject: (reason: string) => void
	onRefetch: () => Promise<unknown>
	isLoading?: boolean
}

const getFileIconFromName = (fileName: string, colored: boolean) => {
	const lower = fileName.toLowerCase()
	const isPdf = lower.endsWith(".pdf")
	const isImage = /\.(jpg|jpeg|png|gif|webp)$/.test(lower)
	const isDoc = /\.(doc|docx)$/.test(lower)
	if (isPdf)
		return (
			<FaFilePdf
				className={`h-5 w-5 ${colored ? "text-(--red-1)" : "text-(--text-1)"}`}
			/>
		)
	if (isImage)
		return (
			<FaImage
				className={`h-5 w-5 ${colored ? "text-blue-500" : "text-(--text-1)"}`}
			/>
		)
	if (isDoc)
		return (
			<FaFileWord
				className={`h-5 w-5 ${colored ? "text-blue-700" : "text-(--text-1)"}`}
			/>
		)
	return <FaFile className="h-5 w-5 text-(--text-1)" />
}

const getFileIconBg = (name: string) => {
	const lower = name.toLowerCase()
	if (lower.endsWith(".pdf")) return "bg-red-50"
	if (/\.(jpg|jpeg|png|gif|webp)$/.test(lower)) return "bg-blue-50"
	if (/\.(doc|docx)$/.test(lower)) return "bg-blue-50"
	return "bg-(--grey-4)"
}

const statusConfig: Record<
	string,
	{ label: string; className: string; dot: string }
> = {
	pending: {
		label: "Pending",
		className: "bg-amber-50 text-amber-600 border border-amber-200",
		dot: "bg-amber-400",
	},
	review: {
		label: "Under Review",
		className: "bg-amber-50 text-amber-600 border border-amber-200",
		dot: "bg-amber-400",
	},
	approved: {
		label: "Approved",
		className: "bg-emerald-50 text-emerald-600 border border-emerald-200",
		dot: "bg-emerald-400",
	},
	disbursed: {
		label: "Disbursed",
		className: "bg-blue-50 text-blue-600 border border-blue-200",
		dot: "bg-blue-400",
	},
	repaid: {
		label: "Repaid",
		className: "bg-purple-50 text-purple-600 border border-purple-200",
		dot: "bg-purple-400",
	},
	rejected: {
		label: "Rejected",
		className: "bg-red-50 text-red-600 border border-red-200",
		dot: "bg-red-400",
	},
}

const fallbackStatus = {
	label: "Unknown",
	className: "bg-gray-50 text-gray-600 border border-gray-200",
	dot: "bg-gray-400",
}

function DetailRow({
	label,
	value,
}: {
	label: string
	value: React.ReactNode
}) {
	return (
		<div className="mb-6 flex items-center justify-between border-b border-(--grey-1) py-4">
			<span className="text-sm text-(--text-1)">{label}</span>
			<span className="text-foreground text-right text-sm font-medium">
				{value}
			</span>
		</div>
	)
}

export default function CreditRequestModal({
	isOpen,
	onClose,
	data,
	onApprove,
	onReject,
	onRefetch,
	isLoading = false,
}: CreditRequestModalProps) {
	const [isRejecting, setIsRejecting] = useState(false)
	const [rejectionReason, setRejectionReason] = useState("")
	const [isLocalLoading, setIsLocalLoading] = useState(false)
	const [isConfirming, setIsConfirming] = useState(false)
	const [confirmAction, setConfirmAction] = useState<
		"approve" | "reject" | null
	>(null)

	// Document-level state
	const [docAction, setDocAction] = useState<"approve" | "reject" | null>(null)
	const [selectedDocument, setSelectedDocument] =
		useState<BusinessDocument | null>(null)
	const [docRejectionReason, setDocRejectionReason] = useState("")
	const [isDocLoading, setIsDocLoading] = useState(false)

	const resetAllState = () => {
		setIsRejecting(false)
		setRejectionReason("")
		setIsLocalLoading(false)
		setIsConfirming(false)
		setConfirmAction(null)
		setDocAction(null)
		setSelectedDocument(null)
		setDocRejectionReason("")
		setIsDocLoading(false)
	}

	useEffect(() => {
		if (!isOpen) resetAllState()
	}, [isOpen])

	useEffect(() => {
		if (isOpen && data) resetAllState()
	}, [data, isOpen])

	if (!isOpen || !data) return null

	const status = statusConfig[data.loanStatus] ?? fallbackStatus
	const canActOn = data.loanStatus === "pending" || data.loanStatus === "review"
	const isLoadingState = isLoading || isLocalLoading

	const handleClose = () => {
		resetAllState()
		onClose()
	}

	const handleViewDocument = (doc: BusinessDocument) => {
		window.open(
			`${getBaseUrl()}/api/admin/business/documents/${doc.publicId}`,
			"_blank"
		)
	}

	const handleConfirmReject = async () => {
		if (rejectionReason.trim().length === 0) return
		setIsLocalLoading(true)
		try {
			await onReject(rejectionReason)
		} catch (error) {
			console.error("Rejection failed:", error)
		} finally {
			setIsLocalLoading(false)
		}
	}

	const handleDocumentApprove = async () => {
		if (!selectedDocument) return
		setIsDocLoading(true)
		try {
			await updateBusinessDocuments(
				JSON.stringify({ status: "VERIFIED" }),
				String(selectedDocument.publicId)
			)
		} catch (error) {
			console.error("Document approval failed:", error)
		} finally {
			setIsDocLoading(false)
			setDocAction(null)
			setSelectedDocument(null)
			await onRefetch()
		}
	}

	const handleDocumentReject = async () => {
		if (!selectedDocument || docRejectionReason.trim().length === 0) return
		setIsDocLoading(true)
		try {
			await updateBusinessDocuments(
				JSON.stringify({ status: "REJECTED", rejectionReason: docRejectionReason }),
				String(selectedDocument.publicId)
			)
		} catch (error) {
			console.error("Document rejection failed:", error)
		} finally {
			setIsDocLoading(false)
			setDocAction(null)
			setSelectedDocument(null)
			setDocRejectionReason("")
			await onRefetch()
		}
	}

	// ── Document rejection reason view ─────────────────────────────────────
	if (docAction === "reject" && selectedDocument) {
		return (
			<Modal
				isOpen={isOpen}
				onClose={handleClose}
				title="Reject Document"
				showOverlay={true}
				variant="slide">
				<div className="flex flex-col gap-5">
					<div className="rounded-xl border border-(--grey-1) bg-(--grey-4) p-4">
						<p className="mb-1 text-xs text-(--text-1)">Rejecting document</p>
						<p className="text-foreground text-sm font-semibold">
							{selectedDocument.otherDocumentDescription ||
								selectedDocument.documentType.replace(/_/g, " ").toLowerCase()}
						</p>
						<p className="mt-0.5 font-mono text-xs text-(--text-1)">
							{selectedDocument.fileName}
						</p>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-foreground text-sm font-semibold">
							Rejection Reason
							<span className="ml-0.5 text-(--red-1)">*</span>
						</label>
						<textarea
							value={docRejectionReason}
							onChange={(e) => setDocRejectionReason(e.target.value)}
							disabled={isDocLoading}
							placeholder="Provide a clear reason for rejecting this document…"
							rows={5}
							className="text-foreground w-full resize-none rounded-xl border border-(--grey-1) bg-(--grey-4) px-4 py-3 text-sm transition-colors placeholder:text-(--text-1) focus:border-(--grey-3) focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						/>
						<p className="text-xs text-(--text-1)">
							{docRejectionReason.length} / 500 characters
						</p>
					</div>

					<div className="flex gap-3 pt-1">
						<button
							onClick={() => {
								setDocAction(null)
								setDocRejectionReason("")
							}}
							disabled={isDocLoading}
							className="text-foreground flex-1 rounded-xl border border-(--grey-1) px-4 py-3 text-sm font-semibold transition-all hover:bg-(--grey-4) disabled:cursor-not-allowed disabled:opacity-50">
							Back
						</button>
						<button
							type="button"
							onClick={handleDocumentReject}
							disabled={isDocLoading || docRejectionReason.trim().length === 0}
							className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50">
							{isDocLoading ? "Processing…" : "Confirm Rejection"}
						</button>
					</div>
				</div>
			</Modal>
		)
	}

	// ── Document approve confirmation view ─────────────────────────────────
	if (docAction === "approve" && selectedDocument) {
		return (
			<Modal
				isOpen={isOpen}
				onClose={handleClose}
				title=""
				showOverlay={true}
				variant="slide">
				<div className="flex flex-col gap-6">
					<div className="flex flex-col items-center gap-3 pt-2 text-center">
						<div className="flex h-24 w-24 items-center justify-center rounded-full border border-(--grey-1) bg-(--grey-4)">
							<div className="bg-foreground flex h-12 w-12 items-center justify-center rounded-full">
								<span className="text-background text-xl font-bold">?</span>
							</div>
						</div>
						<div>
							<h2 className="text-foreground text-base font-bold">Verify Document</h2>
							<p className="mt-1 text-sm text-(--text-1)">
								You are about to verify the following document:
							</p>
						</div>
					</div>

					<div className="rounded-xl border border-(--grey-1) bg-(--grey-4) p-4">
						<div className="flex items-center gap-3">
							<div
								className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${getFileIconBg(selectedDocument.fileName)}`}>
								{getFileIconFromName(selectedDocument.fileName, true)}
							</div>
							<div className="min-w-0 flex-1">
								<p className="text-foreground truncate text-sm font-semibold">
									{selectedDocument.otherDocumentDescription ||
										selectedDocument.documentType.replace(/_/g, " ").toLowerCase()}
								</p>
								<p className="mt-0.5 truncate font-mono text-xs text-(--text-1)">
									{selectedDocument.fileName}
								</p>
							</div>
						</div>
					</div>

					<div className="flex gap-3 pt-1">
						<button
							onClick={() => {
								setDocAction(null)
								setSelectedDocument(null)
							}}
							disabled={isDocLoading}
							className="text-foreground flex-1 rounded-xl border border-(--grey-1) px-4 py-3 text-sm font-semibold transition-all hover:bg-(--grey-4) disabled:cursor-not-allowed disabled:opacity-50">
							Cancel
						</button>
						<button
							onClick={handleDocumentApprove}
							disabled={isDocLoading}
							className="flex-1 rounded-xl bg-(--green-1) px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50">
							{isDocLoading ? "Processing…" : "Yes, Verify"}
						</button>
					</div>
				</div>
			</Modal>
		)
	}

	// ── Loan rejection reason view ─────────────────────────────────────────
	if (isRejecting) {
		return (
			<Modal
				isOpen={isOpen}
				onClose={handleClose}
				title="Reject Request"
				showOverlay={true}
				variant="slide">
				<div className="flex flex-col gap-5">
					<div className="rounded-xl border border-(--grey-1) bg-(--grey-4) p-4">
						<p className="mb-1 text-xs text-(--text-1)">Rejecting loan for</p>
						<p className="text-foreground text-sm font-semibold">
							{data.businessName}
						</p>
						<p className="mt-0.5 font-mono text-xs text-(--text-1)">
							{data.reference}
						</p>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-foreground text-sm font-semibold">
							Rejection Reason
							<span className="ml-0.5 text-(--red-1)">*</span>
						</label>
						<textarea
							value={rejectionReason}
							onChange={(e) => setRejectionReason(e.target.value)}
							disabled={isLoadingState}
							placeholder="Provide a clear reason for rejecting this credit request…"
							rows={5}
							className="text-foreground w-full resize-none rounded-xl border border-(--grey-1) bg-(--grey-4) px-4 py-3 text-sm transition-colors placeholder:text-(--text-1) focus:border-(--grey-3) focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						/>
						<p className="text-xs text-(--text-1)">
							{rejectionReason.length} / 500 characters
						</p>
					</div>

					<div className="flex gap-3 pt-1">
						<button
							onClick={() => {
								setIsRejecting(false)
								setRejectionReason("")
							}}
							disabled={isLoadingState}
							className="text-foreground flex-1 rounded-xl border border-(--grey-1) px-4 py-3 text-sm font-semibold transition-all hover:bg-(--grey-4) disabled:cursor-not-allowed disabled:opacity-50">
							Back
						</button>
						<button
							type="button"
							onClick={handleConfirmReject}
							disabled={isLoadingState || rejectionReason.trim().length === 0}
							className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50">
							{isLoadingState ? "Processing…" : "Confirm Rejection"}
						</button>
					</div>
				</div>
			</Modal>
		)
	}

	// ── Loan confirmation view ─────────────────────────────────────────────
	if (isConfirming && confirmAction) {
		const isApproving = confirmAction === "approve"
		return (
			<Modal
				isOpen={isOpen}
				onClose={handleClose}
				title=""
				showOverlay={true}
				variant="slide">
				<div className="flex flex-col gap-6">
					<div className="flex flex-col items-center gap-3 pt-2 text-center">
						<div className="flex h-24 w-24 items-center justify-center rounded-full border border-(--grey-1) bg-(--grey-4)">
							<div className="bg-foreground flex h-12 w-12 items-center justify-center rounded-full">
								<span className="text-background text-xl font-bold">?</span>
							</div>
						</div>
						<div>
							<h2 className="text-foreground text-base font-bold">
								{isApproving ? "Confirm Loan Request" : "Reject Loan Request"}
							</h2>
							<p className="mt-1 text-sm text-(--text-1)">
								You are about to {isApproving ? "approve" : "reject"} a loan with the
								following details:
							</p>
						</div>
					</div>

					<div className="overflow-hidden rounded-xl">
						<div className="divide-y divide-(--grey-1) px-4">
							<DetailRow
								label="Business"
								value={<span className="font-mono text-xs">{data.businessName}</span>}
							/>
							<DetailRow
								label="Reference"
								value={<span className="font-mono text-xs">{data.reference}</span>}
							/>
							<DetailRow
								label="Amount"
								value={
									<span className="font-mono text-xs">
										{data.currency} {data.loanAmount.toLocaleString()}
									</span>
								}
							/>
							<DetailRow
								label="Duration"
								value={
									data.durationInDays
										? `${data.durationInDays} days`
										: `${data.loanDuration} months`
								}
							/>
							<DetailRow
								label="Interest"
								value={
									<span className="font-mono text-xs">
										{data.currency} {data.interest.toLocaleString()}
									</span>
								}
							/>
							<DetailRow label="Start Date" value={data.startDate || "—"} />
							<DetailRow label="End Date" value={data.endDate || "—"} />
						</div>
					</div>

					<div className="flex gap-3 pt-1">
						<button
							onClick={() => {
								setIsConfirming(false)
								if (!isApproving) setIsRejecting(true)
							}}
							disabled={isLoadingState}
							className="flex-1 rounded-xl border border-(--grey-1) px-4 py-3 text-sm font-semibold text-(--red-1) transition-all hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
							No, Reject
						</button>
						<button
							onClick={() => {
								setIsConfirming(false)
								if (isApproving) onApprove()
								else setIsRejecting(true)
							}}
							disabled={isLoadingState}
							className="flex-1 rounded-xl bg-(--green-1) px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50">
							{isLoadingState ? "Processing…" : "Yes, Approve"}
						</button>
					</div>
				</div>
			</Modal>
		)
	}

	// ── Normal details view ────────────────────────────────────────────────
	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title={data.businessName}
			showOverlay={true}
			variant="slide">
			<div className="flex flex-col gap-5">
				{/* Loan Details */}
				<div className="overflow-hidden rounded-xl">
					<div className="divide-y divide-(--grey-1) px-4">
						<DetailRow
							label="Business"
							value={<span className="font-mono text-xs">{data.businessName}</span>}
						/>
						<DetailRow
							label="Reference"
							value={<span className="font-mono text-xs">{data.reference}</span>}
						/>
						{data.loanTypeId && (
							<DetailRow label="Loan Type ID" value={data.loanTypeId} />
						)}
						<DetailRow
							label="Amount"
							value={<span className="font-mono text-xs">{data.loanAmount}</span>}
						/>
						<DetailRow
							label="Loan Duration"
							value={
								data.durationInDays
									? `${data.durationInDays} days`
									: `${data.loanDuration} months`
							}
						/>
						<DetailRow
							label="Loan Interest"
							value={<span className="font-mono text-xs">{data.interest}</span>}
						/>
						<DetailRow label="Start Date" value={data.startDate || "—"} />
						<DetailRow label="End Date" value={data.endDate || "—"} />
						{data.businessType && (
							<DetailRow label="Business Type" value={data.businessType} />
						)}
					</div>
				</div>

				{/* Contact */}
				{(data.email || data.phone) && (
					<div className="overflow-hidden rounded-xl border border-(--grey-1)">
						<div className="border-b border-(--grey-1) bg-(--grey-4) px-4 py-2">
							<p className="text-xs font-semibold tracking-wider text-(--text-1) uppercase">
								Contact
							</p>
						</div>
						<div className="divide-y divide-(--grey-1) px-4">
							{data.email && <DetailRow label="Email" value={data.email} />}
							{data.phone && <DetailRow label="Phone" value={data.phone} />}
						</div>
					</div>
				)}

				{/* Documents */}
				{data.documents && data.documents.length > 0 && (
					<div className="overflow-hidden rounded-xl">
						<div className="flex items-center gap-3 px-4 py-3">
							<div className="h-px flex-1 bg-(--grey-1)" />
							<p className="shrink-0 text-xs font-semibold tracking-wider text-(--text-1) uppercase">
								Supporting Documents
							</p>
							<div className="h-px flex-1 bg-(--grey-1)" />
						</div>
						<div className="flex flex-col gap-2">
							{data.documents.map((doc) => {
								const isVerified = doc.status === "VERIFIED"
								const isRejected = doc.status === "REJECTED"
								const isActioned = isVerified || isRejected

								const docStatusStyle: Record<string, string> = {
									VERIFIED: "bg-emerald-50 text-emerald-600 border border-emerald-200",
									REJECTED: "bg-red-50 text-(--red-1) border border-red-200",
									PENDING: "bg-amber-50 text-amber-600 border border-amber-200",
									SUBMITTED: "bg-blue-50 text-blue-600 border border-blue-200",
								}

								const docStatusDot: Record<string, string> = {
									VERIFIED: "bg-emerald-400",
									REJECTED: "bg-red-400",
									PENDING: "bg-amber-400",
									SUBMITTED: "bg-blue-400",
								}

								const docStatusLabel: Record<string, string> = {
									VERIFIED: "Verified",
									REJECTED: "Rejected",
									PENDING: "Pending",
									SUBMITTED: "Submitted",
								}

								const statusKey = doc.status ?? "PENDING"

								return (
									<div
										key={doc.publicId}
										className="flex flex-col gap-2 rounded-lg border border-(--grey-1) p-3 transition-all hover:bg-(--grey-4)">
										{/* Top row: icon + name + status badge */}
										<div className="flex items-center gap-3">
											<div
												className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${getFileIconBg(doc.fileName)}`}>
												{getFileIconFromName(doc.fileName, true)}
											</div>
											<p className="text-foreground min-w-0 flex-1 truncate text-sm leading-tight font-medium">
												{doc.otherDocumentDescription ||
													doc.documentType.replace(/_/g, " ").toLowerCase()}
											</p>
											<span
												className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${docStatusStyle[statusKey] ?? "border border-gray-200 bg-gray-50 text-gray-600"}`}>
												<span
													className={`h-1.5 w-1.5 rounded-full ${docStatusDot[statusKey] ?? "bg-gray-400"}`}
												/>
												{docStatusLabel[statusKey] ?? statusKey}
											</span>
										</div>

										{/* Bottom row: action buttons */}
										<div className="flex items-center gap-2 pl-12">
											<button
												onClick={() => handleViewDocument(doc)}
												className="hover:text-foreground flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-(--grey-1) bg-(--grey-4) px-3 py-1.5 text-xs font-medium text-(--text-1) transition-all hover:border-(--grey-3)">
												<FaRegEye className="h-3.5 w-3.5 shrink-0" />
												View
											</button>
											<button
												disabled={isActioned}
												onClick={() => {
													if (isActioned || !canActOn) return
													setSelectedDocument(doc)
													setDocAction("approve")
												}}
												className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
													isActioned || !canActOn
														? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
														: "cursor-pointer border-emerald-200 bg-emerald-50 text-emerald-600 hover:brightness-95"
												}`}>
												Verify
											</button>
											<button
												disabled={isActioned || !canActOn}
												onClick={() => {
													if (isActioned || !canActOn) return
													setSelectedDocument(doc)
													setDocAction("reject")
												}}
												className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
													isActioned || !canActOn
														? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
														: "cursor-pointer border-red-200 bg-red-50 text-(--red-1) hover:brightness-95"
												}`}>
												Reject
											</button>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				)}

				{/* Loan Action Buttons */}
				{canActOn && (
					<div className="flex gap-3 pt-1">
						<button
							onClick={() => {
								setConfirmAction("reject")
								setIsConfirming(true)
							}}
							disabled={isLoadingState}
							className="flex-1 rounded-xl border border-(--grey-1) px-4 py-3 text-sm font-semibold text-(--red-1) transition-all hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
							Reject
						</button>
						<button
							onClick={() => {
								setConfirmAction("approve")
								setIsConfirming(true)
							}}
							disabled={isLoadingState}
							className="flex-1 rounded-xl bg-(--green-1) px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50">
							Approve
						</button>
					</div>
				)}

				{data.loanStatus === "approved" && (
					<div className="pt-1">
						<button
							onClick={onApprove}
							disabled={isLoadingState}
							className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50">
							{isLoadingState ? "Processing…" : "Mark as Disbursed"}
						</button>
					</div>
				)}

				{data.loanStatus === "disbursed" && (
					<div className="pt-1">
						<button
							onClick={onApprove}
							disabled={isLoadingState}
							className="w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50">
							{isLoadingState ? "Processing…" : "Mark as Repaid"}
						</button>
					</div>
				)}
			</div>
		</Modal>
	)
}
