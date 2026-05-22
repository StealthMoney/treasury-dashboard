"use client"

import { Modal } from "./modal"
import { getFileIconFromName } from "../file_icons"
import { BusinessDocument } from "@/app/types/general"
import Image from "next/image"
import { useEffect, useState } from "react"
import PdfPreview from "../pdfViewer"

interface DocumentReviewModalProps {
	loading: boolean
	isOpen: boolean
	document: BusinessDocument | null
	onClose: () => void
	onApprove: () => void
	onReject: () => void
}

export default function DocumentReviewModal({
	loading,
	isOpen,
	document,
	onClose,
	onApprove,
	onReject,
}: DocumentReviewModalProps) {
	const handleDownload = async () => {
		if (!document) return
		try {
			const res = await fetch(document.fileUrl)
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
	}

	const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)

	useEffect(() => {
		if (document?.contentType !== "application/pdf") return
		let objectUrl: string
		fetch(document.fileUrl)
			.then((res) => res.blob())
			.then((blob) => {
				objectUrl = URL.createObjectURL(blob)
				setPdfBlobUrl(objectUrl)
			})
		return () => {
			if (objectUrl) URL.revokeObjectURL(objectUrl)
		}
	}, [document?.fileUrl, document?.contentType])

	return (
		<Modal
			isOpen={isOpen && !!document}
			onClose={onClose}
			title="Document Review"
			showOverlay={true}
			variant="slide">
			{document && (
				<div className="space-y-6">
					{/* Document Header */}
					<div className="flex items-start justify-between border-b border-(--grey-1) pb-4">
						<div className="flex items-center gap-3">
							<span className="shrink-0">
								{getFileIconFromName(document.fileName, true)}
							</span>
							<div>
								<p className="text-foreground font-semibold">{document.fileName}</p>
								<p className="text-xs tracking-wide text-(--text-1) uppercase">
									{document.documentType.replace(/_/g, " ")}
								</p>
							</div>
						</div>
						<div
							className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
								document.status === "VERIFIED"
									? "bg-green-50 text-(--green-1)"
									: document.status === "REJECTED"
										? "bg-red-50 text-(--red-1)"
										: "bg-orange-50 text-orange-600"
							}`}>
							<span
								className={`h-2 w-2 rounded-full ${
									document.status === "VERIFIED"
										? "bg-(--green-1)"
										: document.status === "REJECTED"
											? "bg-(--red-1)"
											: "bg-orange-500"
								}`}
							/>
							{document.status === "VERIFIED"
								? "Verified"
								: document.status === "REJECTED"
									? "Rejected"
									: "Pending Review"}
						</div>
					</div>

					{/* Document Viewer */}
					<div className="relative flex min-h-85 items-center justify-center overflow-hidden rounded-lg border border-(--grey-1) bg-(--grey-4)">
						{document.contentType?.startsWith("image/") ? (
							<img
								src={document.fileUrl}
								alt={document.fileName}
								className="h-full max-h-96 w-full object-contain"
							/>
						) : document.contentType === "application/pdf" ? (
							<PdfPreview fileUrl={document.fileUrl} />
						) : (
							<div className="px-6 text-center">
								<p className="text-sm text-(--text-1)">Preview not available</p>
								<p className="mt-1 text-xs text-(--text-1)">{document.fileName}</p>
							</div>
						)}

						{/* Controls */}
						<div className="absolute top-3 right-3 flex gap-2">
							<button
								onClick={handleDownload}
								title="download"
								className="bg-background cursor-pointer rounded-lg border border-(--grey-1) p-2 transition hover:bg-(--grey-4)">
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

							{document.contentType !== "application/pdf" && (
								<a
									href={document.fileUrl}
									target="_blank"
									rel="noopener noreferrer"
									title="open"
									className="bg-background cursor-pointer rounded-lg border border-(--grey-1) p-2 transition hover:bg-(--grey-4)">
									<svg
										className="h-4 w-4 text-(--text-1)"
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
								</a>
							)}
						</div>
					</div>

					{/* Upload info */}
					<div className="grid grid-cols-2 gap-4 border-t border-(--grey-1) pt-4">
						<div>
							<p className="mb-1 text-sm text-(--text-1)">Document ID:</p>
							<p className="text-foreground font-medium">{document.publicId}</p>
						</div>
						<div className="text-right">
							<p className="mb-1 text-sm text-(--text-1)">Upload Date:</p>
							<p className="text-foreground font-medium">
								{new Date(document.uploadedAt).toLocaleDateString("en-GB", {
									day: "numeric",
									month: "long",
									year: "numeric",
								})}
							</p>
						</div>
						{document.documentIdentificationNumber && (
							<div className="col-span-2">
								<p className="mb-1 text-sm text-(--text-1)">ID Number:</p>
								<p className="text-foreground font-medium">
									{document.documentIdentificationNumber}
								</p>
							</div>
						)}
						{document.rejectionReason && (
							<div className="col-span-2">
								<p className="mb-1 text-sm text-(--text-1)">Rejection Reason:</p>
								<p className="font-medium text-(--red-1)">{document.rejectionReason}</p>
							</div>
						)}
					</div>

					{/* Actions */}
					<div className="flex gap-4 border-t border-(--grey-1) pt-6">
						<button
							onClick={onReject}
							className="flex-1 cursor-pointer rounded-lg border border-(--grey-1) px-4 py-3 font-medium text-(--red-1) transition hover:bg-red-50">
							Reject
						</button>
						<button
							onClick={onApprove}
							className="flex-1 cursor-pointer rounded-lg bg-(--green-1) px-4 py-3 font-medium text-white transition hover:bg-green-700">
							{loading ? "Approving..." : "Approve"}
						</button>
					</div>
				</div>
			)}
		</Modal>
	)
}
