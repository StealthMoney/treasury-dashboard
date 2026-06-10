"use client"

import { Modal } from "./modal"
import { getFileIconFromName } from "../file_icons"
import { BusinessDocument } from "@/app/types/general"
import { ChangeEvent, useEffect, useRef, useState, useCallback } from "react"
import PdfPreview from "../pdfViewer"
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io"
import { TextField } from "../general_inputs"
import { FaRegClock } from "react-icons/fa6"

interface DocumentReviewModalProps {
	loading: boolean
	isOpen: boolean
	document: BusinessDocument | null
	onClose: () => void
	onApprove: () => void
	onReject: (reason: string) => void
}

type Step = "review" | "reject"

const DocumentHeader = ({ document }: { document: BusinessDocument }) => (
	<div className="bg-background flex items-center justify-between rounded-xl border border-(--grey-1) px-4 py-3.5">
		<div className="flex items-center gap-3">
			<span className="shrink-0">
				{getFileIconFromName(document.fileName, true)}
			</span>
			<div>
				<p className="text-foreground max-w-35 truncate text-sm font-semibold lg:max-w-50">
					{document.fileName}
				</p>
				<p className="text-xs font-medium text-(--text-1)">
					{document.documentIdentificationNumber
						? `RC: ${document.documentIdentificationNumber}`
						: document.documentType.replace(/_/g, " ")}
				</p>
			</div>
		</div>

		<div
			className={`inline-flex shrink-0 items-center gap-1.5 rounded-full bg-(--grey-1) px-3 py-1.5 text-xs font-medium text-(--text-1)`}>
			{document.status === "VERIFIED" ? (
				<IoMdCheckmarkCircle size={14} className="text-(--green-1)" />
			) : document.status === "REJECTED" ? (
				<IoMdCloseCircle size={14} className="text-(--red-1)" />
			) : (
				<FaRegClock size={14} className="text-orange-500" />
			)}
			<span>
				{document.status === "VERIFIED"
					? "Approved"
					: document.status === "REJECTED"
						? "Rejected"
						: "Pending Review"}
			</span>
		</div>
	</div>
)

export default function DocumentReviewModal({
	loading,
	isOpen,
	document,
	onClose,
	onApprove,
	onReject,
}: DocumentReviewModalProps) {
	const [step, setStep] = useState<Step>("review")
	const [rejectionReason, setRejectionReason] = useState("")
	const [additionalNote, setAdditionalNote] = useState("")
	const [touched, setTouched] = useState(false)

	const pendingActionRef = useRef<"approve" | "reject" | null>(null)
	const prevLoadingRef = useRef(loading)

	const handleClose = useCallback(() => {
		setStep("review")
		setRejectionReason("")
		setAdditionalNote("")
		setTouched(false)
		pendingActionRef.current = null
		setTimeout(() => {
			onClose()
		}, 1000)
	}, [onClose])

	useEffect(() => {
		const wasLoading = prevLoadingRef.current
		prevLoadingRef.current = loading

		if (wasLoading && !loading && pendingActionRef.current !== null) {
			pendingActionRef.current = null
			setTimeout(() => {
				onClose()
			}, 1000)
		}
	}, [loading, onClose])

	const handleApprove = useCallback(() => {
		pendingActionRef.current = "approve"
		onApprove()
	}, [onApprove])

	const handleConfirmRejection = useCallback(() => {
		setTouched(true)
		if (!rejectionReason.trim()) return

		const finalReason = additionalNote.trim()
			? `${rejectionReason}: ${additionalNote.trim()}`
			: rejectionReason

		pendingActionRef.current = "reject"
		onReject(finalReason)
	}, [rejectionReason, additionalNote, onReject])

	const hasError = touched && !rejectionReason.trim()
	const isSettled =
		document?.status === "VERIFIED" || document?.status === "REJECTED"

	const uploadDate = (() => {
		const raw = (document as any)?.createdAt ?? document?.uploadedAt
		if (!raw) return "N/A"
		return new Date(raw).toLocaleDateString("en-GB", {
			day: "numeric",
			month: "long",
			year: "numeric",
		})
	})()

	const uploadedBy = (document as any)?.uploadedBy ?? "N/A"

	return (
		<Modal
			isOpen={isOpen && !!document}
			onClose={handleClose}
			title={step === "review" ? "Document Review" : "Confirm Rejection"}
			showOverlay={true}
			variant="slide">
			{document && (
				<>
					{/* ── REVIEW STEP ── */}
					{step === "review" && (
						<div className="flex flex-col gap-4">
							<DocumentHeader document={document} />

							{/* Document Preview Card */}
							<div className="bg-background overflow-hidden rounded-xl border border-(--grey-1)">
								<div className="relative bg-white">
									{/* Action Icons */}
									<div className="absolute top-3 right-3 z-10 flex gap-2">
										<button
											onClick={async () => {
												if (!document) return
												const fileUrl = `https://api.staging.stealthtreasury.com/v1/api/documents/${document.publicId}`
												try {
													const res = await fetch(fileUrl)
													const blob = await res.blob()
													const blobUrl = URL.createObjectURL(blob)
													const a = window.document.createElement("a")
													a.href = blobUrl
													a.download = document.fileName
													a.click()
													URL.revokeObjectURL(blobUrl)
												} catch (err) {
													console.error("Download failed", err)
												}
											}}
											title="Download"
											className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-(--grey-1) bg-white transition hover:bg-(--grey-4)">
											<svg
												className="h-4 w-4 text-(--text-1)"
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

										<a
											href={`https://api.staging.stealthtreasury.com/v1/api/documents/${document.fileName}`}
											target="_blank"
											rel="noopener noreferrer"
											title="Open in new tab"
											className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-(--grey-1) bg-white transition hover:bg-(--grey-4)">
											<svg
												className="h-4 w-4 text-(--text-1)"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
												/>
											</svg>
										</a>
									</div>

									{/* Preview */}
									<div className="flex min-h-95 items-center justify-center p-4">
										{document.contentType?.startsWith("image/") ? (
											<img
												src={`https://api.staging.stealthtreasury.com/v1/api/documents/${document.publicId}`}
												alt={document.fileName}
												className="max-h-[380px] w-full object-contain"
											/>
										) : document.contentType === "application/pdf" ? (
											<div className="h-3/4 w-full">
												<PdfPreview
													fileUrl={`https://api.staging.stealthtreasury.com/v1/api/documents/${document.publicId}`}
												/>
											</div>
										) : (
											<div className="px-6 text-center">
												<p className="text-sm text-(--text-1)">Preview not available</p>
												<p className="mt-1 text-xs text-(--text-1)">{document.fileName}</p>
											</div>
										)}
									</div>
								</div>

								{/* Meta Information */}
								<div className="divide-y divide-(--grey-1) border-t border-(--grey-1)">
									<div className="flex items-center justify-between px-4 py-3">
										<span className="text-sm text-(--text-1)">Uploaded By:</span>
										<span className="text-foreground text-sm font-medium">
											{uploadedBy}
										</span>
									</div>
									<div className="flex items-center justify-between px-4 py-3">
										<span className="text-sm text-(--text-1)">Upload Date:</span>
										<span className="text-foreground text-sm font-medium">
											{uploadDate}
										</span>
									</div>
									{document.rejectionReason && (
										<div className="flex items-start justify-between gap-4 px-4 py-3">
											<span className="shrink-0 text-sm text-(--text-1)">
												Rejection Reason:
											</span>
											<span className="text-right text-sm font-medium text-(--red-1)">
												{document.rejectionReason}
											</span>
										</div>
									)}
								</div>
							</div>

							{!isSettled && (
								<div className="flex gap-3 pt-1">
									<button
										onClick={() => setStep("reject")}
										disabled={loading}
										className="flex-1 cursor-pointer rounded-xl border border-(--grey-1) px-4 py-3.5 text-sm font-semibold text-(--red-1) transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
										Reject Document
									</button>
									<button
										onClick={handleApprove}
										disabled={loading}
										className="flex-1 cursor-pointer rounded-xl bg-(--green-1) px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
										{loading ? "Approving..." : "Approve Document"}
									</button>
								</div>
							)}
						</div>
					)}

					{step === "reject" && (
						<div className="flex flex-col gap-4">
							<DocumentHeader document={document} />

							<div className="min-h-50 space-y-3">
								<TextField
									label="Reason for Rejection"
									id="rejectionReason"
									placeholder="Select or type reason for rejection..."
									value={rejectionReason}
									onChange={(val) => {
										setRejectionReason(val)
										if (touched && val) setTouched(false)
									}}
									error={hasError ? "Please enter a rejection reason." : undefined}
								/>

								<textarea
									value={additionalNote}
									onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
										setAdditionalNote(e.target.value)
									}
									placeholder="Additional notes (optional)"
									rows={6}
									disabled={loading}
									className="text-foreground w-full resize-none rounded-xl border border-(--grey-1) bg-(--grey-4) px-4 py-3.5 text-sm transition placeholder:text-(--text-1) focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
								/>
							</div>

							<div className="flex gap-3 pt-1">
								<button
									onClick={() => {
										if (loading) return
										setStep("review")
										setRejectionReason("")
										setAdditionalNote("")
										setTouched(false)
									}}
									disabled={loading}
									className="text-foreground flex-1 cursor-pointer rounded-xl border border-(--grey-1) px-4 py-3.5 text-sm font-semibold transition hover:bg-(--grey-4) disabled:cursor-not-allowed disabled:opacity-50">
									Go Back
								</button>

								<button
									onClick={handleConfirmRejection}
									disabled={loading}
									className="bg-foreground text-background flex-1 cursor-pointer rounded-xl px-4 py-3.5 text-sm font-semibold transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50">
									{loading ? "Confirming..." : "Confirm Rejection"}
								</button>
							</div>
						</div>
					)}
				</>
			)}
		</Modal>
	)
}
