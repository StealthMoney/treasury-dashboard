"use client"

import { useEffect, useState } from "react"
import { formatDateWithSuffix } from "@/app/functions/helpers/formatted_date"
import { Modal } from "./modal"
import { FaFilePdf, FaImage, FaFileWord, FaFile } from "react-icons/fa6"

export interface Document {
	id: string
	name: string
	type: "invoice" | "other"
	url: string
}

export interface CreditRequest {
	id: string | number
	organizationName: string
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
	durationInDays: number
	loanAmount: number
	currency: string
	loanStartDate: string
	loanDueDate: string
	reference: string
	interest: number
	documents?: Document[]
}

interface CreditRequestModalProps {
	isOpen: boolean
	onClose: () => void
	data: CreditRequest | null
	onApprove: () => void
	onReject: (reason: string) => void
	isLoading?: boolean
}

const getFileIconFromName = (name: string, colored: boolean) => {
	const lower = name.toLowerCase()
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
		<div className="flex items-center justify-between border-b border-(--grey-1) py-3 last:border-none">
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
	isLoading = false,
}: CreditRequestModalProps) {
	const [isRejecting, setIsRejecting] = useState(false)
	const [rejectionReason, setRejectionReason] = useState("")
	const [isLocalLoading, setIsLocalLoading] = useState(false)

	// Reset all modal state when modal closes or data changes
	useEffect(() => {
		if (!isOpen) {
			// Reset all states when modal closes
			setIsRejecting(false)
			setRejectionReason("")
			setIsLocalLoading(false)
		}
	}, [isOpen])

	// Reset rejection state when data changes (new request selected)
	useEffect(() => {
		if (isOpen && data) {
			setIsRejecting(false)
			setRejectionReason("")
			setIsLocalLoading(false)
		}
	}, [data, isOpen])

	if (!isOpen || !data) return null

	const status = statusConfig[data.loanStatus] ?? fallbackStatus
	const canActOn = data.loanStatus === "pending" || data.loanStatus === "review"

	const handleDocumentPreview = (doc: Document) => {
		window.open(doc.url, "_blank")
	}

	const handleDocumentDownload = (doc: Document) => {
		const link = document.createElement("a")
		link.href = doc.url
		link.download = doc.name
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	const handleClose = () => {
		// Reset states before closing
		setIsRejecting(false)
		setRejectionReason("")
		setIsLocalLoading(false)
		onClose()
	}

	const handleConfirmReject = async () => {
		if (rejectionReason.trim().length === 0) return

		setIsLocalLoading(true)
		try {
			await onReject(rejectionReason)
			// Success - modal will close via onClose from parent
		} catch (error) {
			console.error("Rejection failed:", error)
		} finally {
			setIsLocalLoading(false)
		}
	}

	// Use combined loading state
	const isLoadingState = isLoading || isLocalLoading

	// ── Rejection reason view ──────────────────────────────────────────────
	if (isRejecting) {
		return (
			<Modal
				isOpen={isOpen}
				onClose={handleClose}
				title="Reject Request"
				showOverlay={true}
				variant="slide">
				<div className="flex flex-col gap-5">
					{/* Context reminder */}
					<div className="rounded-xl border border-(--grey-1) bg-(--grey-4) p-4">
						<p className="mb-1 text-xs text-(--text-1)">Rejecting loan for</p>
						<p className="text-foreground text-sm font-semibold">
							{data.organizationName}
						</p>
						<p className="mt-0.5 font-mono text-xs text-(--text-1)">
							{data.reference}
						</p>
					</div>

					{/* Reason input */}
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

					{/* Actions */}
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

	// ── Normal details view ────────────────────────────────────────────────
	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title={data.organizationName}
			showOverlay={true}
			variant="slide">
			<div className="flex flex-col gap-5">
				{/* Amount + Status Hero */}
				<div className="flex items-center justify-between gap-4 rounded-xl border border-(--grey-1) bg-(--grey-4) p-4">
					<div>
						<p className="mb-1 text-xs text-(--text-1)">Credit Amount</p>
						<p className="text-foreground text-2xl font-bold tracking-tight">
							{data.currency} {data.amount.toLocaleString()}
						</p>
						<p className="mt-1 text-xs text-(--text-1)">
							Interest: {data.currency} {data?.interest?.toLocaleString() || "N/A"}
						</p>
					</div>
					<div className="flex flex-col items-end gap-2">
						<span
							className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
							<span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
							{status.label}
						</span>
						{data.requestDate && (
							<p className="text-xs text-(--text-1)">
								Requested {formatDateWithSuffix(data.requestDate)}
							</p>
						)}
					</div>
				</div>

				{/* Loan Details */}
				<div className="overflow-hidden rounded-xl border border-(--grey-1)">
					<div className="border-b border-(--grey-1) bg-(--grey-4) px-4 py-2">
						<p className="text-xs font-semibold tracking-wider text-(--text-1) uppercase">
							Loan Details
						</p>
					</div>
					<div className="divide-y divide-(--grey-1) px-4">
						<DetailRow
							label="Reference"
							value={<span className="font-mono text-xs">{data.reference}</span>}
						/>
						{data.loanTypeId && (
							<DetailRow label="Loan Type ID" value={data.loanTypeId} />
						)}
						<DetailRow
							label="Duration"
							value={
								data.durationInDays
									? `${data.durationInDays} days`
									: `${data.loanDuration} months`
							}
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
					<div className="overflow-hidden rounded-xl border border-(--grey-1)">
						<div className="flex items-center justify-between border-b border-(--grey-1) bg-(--grey-4) px-4 py-2">
							<p className="text-xs font-semibold tracking-wider text-(--text-1) uppercase">
								Supporting Documents
							</p>
							<span className="rounded-full bg-(--grey-1) px-2 py-0.5 text-xs text-(--text-1)">
								{data.documents.length}
							</span>
						</div>
						<div className="flex flex-col gap-2 p-3">
							{data.documents.map((doc) => (
								<div
									key={doc.id}
									className="group flex items-center gap-3 rounded-lg border border-(--grey-1) p-3 transition-all hover:border-(--grey-3) hover:bg-(--grey-4)">
									<div
										className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${getFileIconBg(doc.name)}`}>
										{getFileIconFromName(doc.name, true)}
									</div>
									<div className="min-w-0 flex-1">
										<p className="text-foreground truncate text-sm leading-tight font-medium">
											{doc.name}
										</p>
										<p className="mt-0.5 text-xs text-(--text-1) capitalize">
											{doc.type}
										</p>
									</div>
									<div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
										<button
											onClick={() => handleDocumentPreview(doc)}
											className="hover:text-foreground rounded-lg p-2 text-(--text-1) transition-all hover:bg-(--grey-1)"
											title="Open in new tab">
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
										</button>
										<button
											onClick={() => handleDocumentDownload(doc)}
											className="hover:text-foreground rounded-lg p-2 text-(--text-1) transition-all hover:bg-(--grey-1)"
											title="Download">
											<svg
												className="h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
												/>
											</svg>
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Action Buttons */}
				{canActOn && (
					<div className="flex gap-3 pt-1">
						<button
							onClick={() => setIsRejecting(true)}
							disabled={isLoadingState}
							className="flex-1 rounded-xl border border-(--grey-1) px-4 py-3 text-sm font-semibold text-(--red-1) transition-all hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
							Reject
						</button>
						<button
							onClick={onApprove}
							disabled={isLoadingState}
							className="flex-1 rounded-xl bg-(--green-1) px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50">
							{isLoadingState ? "Processing…" : "Approve"}
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
