"use client"

import { Modal } from "./modal"
import { getFileIconFromName } from "../file_icons"
import { BusinessDocument } from "@/app/types/general"

interface DocumentHistoryModalProps {
	isOpen: boolean
	document: BusinessDocument | null
	onClose: () => void
}

interface TimelineStep {
	label: string
	description: string
	date?: string
	time?: string
	user?: string
	dotColor: string
	iconPath: string
	active: boolean
}

function formatDate(iso?: string | null): string | undefined {
	if (!iso) return undefined
	return new Date(iso).toLocaleDateString("en-GB")
}

function formatTime(iso?: string | null): string | undefined {
	if (!iso) return undefined
	return new Date(iso).toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	})
}

function buildTimeline(doc: BusinessDocument): TimelineStep[] {
	const isApproved = doc.status === "VERIFIED"
	const isRejected = doc.status === "REJECTED"
	const isPending = doc.status === "PENDING"

	// Pick the most relevant timestamp for the final step
	const finalStepIso = isApproved
		? doc.verifiedAt
		: isRejected
			? doc.rejectedAt
			: null

	return [
		{
			label: "Uploaded",
			description: doc.otherDocumentDescription || "Document uploaded",
			date: formatDate(doc.uploadedAt),
			time: formatTime(doc.uploadedAt),
			user: "Admin",
			dotColor: "bg-blue-500",
			iconPath: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
			active: true,
		},
		{
			label: "Submitted for Review",
			description: "Document submitted for review",
			date: formatDate(doc.createdAt),
			time: formatTime(doc.createdAt),
			user: "Admin",
			dotColor: "bg-orange-500",
			iconPath:
				"M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
			active: true,
		},
		{
			label: isApproved
				? "Approved"
				: isRejected
					? "Rejected"
					: "Pending Approval",
			description: isApproved
				? "Document approved by compliance officer"
				: isRejected
					? (doc.rejectionReason ?? "Document rejected — awaiting resubmission")
					: "Awaiting review by compliance officer",
			date: formatDate(finalStepIso),
			time: formatTime(finalStepIso),
			user: isPending ? undefined : "Compliance Officer",
			dotColor: isApproved
				? "bg-(--green-1)"
				: isRejected
					? "bg-red-600"
					: "bg-(--grey-3)",
			iconPath: isApproved
				? "M5 13l4 4L19 7"
				: isRejected
					? "M6 18L18 6M6 6l12 12"
					: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
			active: !isPending,
		},
	]
}

export default function DocumentHistoryModal({
	isOpen,
	document,
	onClose,
}: DocumentHistoryModalProps) {
	return (
		<Modal
			isOpen={isOpen && !!document}
			onClose={onClose}
			title="Document History"
			showOverlay={true}
			variant="slide">
			{document && (
				<div className="space-y-6">
					{/* Document header */}
					<div className="flex items-center justify-between border-b border-(--grey-1) pb-4">
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

					{/* Timeline */}
					<div>
						{buildTimeline(document).map((step, index, arr) => (
							<div key={index} className="flex gap-4">
								{/* Dot + connector */}
								<div className="flex flex-col items-center">
									<div
										className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
											step.active ? step.dotColor : "bg-(--grey-3)"
										}`}>
										<svg
											className="h-4 w-4 text-white"
											fill="none"
											stroke="currentColor"
											strokeWidth={2}
											strokeLinecap="round"
											strokeLinejoin="round"
											viewBox="0 0 24 24">
											<path d={step.iconPath} />
										</svg>
									</div>
									{index < arr.length - 1 && (
										<div className="my-1 min-h-[32px] w-px flex-1 bg-(--grey-1)" />
									)}
								</div>

								{/* Content */}
								<div className="flex-1 pb-6">
									<p
										className={`text-sm font-semibold ${
											step.active ? "text-foreground" : "text-(--grey-3)"
										}`}>
										{step.label}
									</p>
									<p
										className={`mt-0.5 text-sm ${
											step.active ? "text-(--text-1)" : "text-(--grey-3)"
										}`}>
										{step.description}
									</p>
									{step.active && step.user && (
										<p className="mt-1 text-xs text-(--grey-3)">
											By {step.user}
											{step.date && ` · ${step.date}`}
											{step.time && ` · ${step.time}`}
										</p>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</Modal>
	)
}
