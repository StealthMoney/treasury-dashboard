"use client"

import { Modal } from "./modal"
import { getFileIconFromName } from "../file_icons"
import { BusinessDocument } from "@/app/types/general"
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io"
import { FaCloudUploadAlt } from "react-icons/fa"

interface DocumentHistoryModalProps {
	isOpen: boolean
	document: BusinessDocument | null
	onClose: () => void
}

interface TimelineStep {
	label: string
	subtitle?: string
	date?: string
	time?: string
	user?: string
	bgColor: string
	icon: React.ReactNode
	active: boolean
}

function formatDate(iso?: string | null): string | undefined {
	if (!iso) return undefined
	return new Date(iso).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
	})
}

function formatTime(iso?: string | null): string | undefined {
	if (!iso) return undefined
	return new Date(iso).toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	})
}

// Shared icon sizes
const iconSize = 20

const UploadIcon = () => <FaCloudUploadAlt size={iconSize} color="white" />

const ReviewIcon = () => (
	<svg
		width={iconSize}
		height={iconSize}
		viewBox="0 0 24 24"
		fill="none"
		stroke="white"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round">
		<circle cx="12" cy="12" r="3" />
		<path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
	</svg>
)

const RejectIcon = () => (
	<svg
		width={iconSize}
		height={iconSize}
		viewBox="0 0 24 24"
		fill="none"
		stroke="white"
		strokeWidth={2.5}
		strokeLinecap="round"
		strokeLinejoin="round">
		<path d="M18 6L6 18M6 6l12 12" />
	</svg>
)

const ApproveIcon = () => (
	<svg
		width={iconSize}
		height={iconSize}
		viewBox="0 0 24 24"
		fill="none"
		stroke="white"
		strokeWidth={2.5}
		strokeLinecap="round"
		strokeLinejoin="round">
		<path d="M5 13l4 4L19 7" />
	</svg>
)

function buildTimeline(doc: BusinessDocument): TimelineStep[] {
	const isApproved = doc.status === "VERIFIED"
	const isRejected = doc.status === "REJECTED"
	const isPending = doc.status === "PENDING"

	const finalStepIso = isApproved
		? doc.verifiedAt
		: isRejected
			? doc.rejectedAt
			: null

	const steps: TimelineStep[] = [
		{
			label: "Uploaded",
			date: formatDate(doc.uploadedAt),
			time: formatTime(doc.uploadedAt),
			user: "Admin",
			bgColor: "bg-blue-500",
			icon: <UploadIcon />,
			active: true,
		},
		{
			label: "Submitted for Review",
			date: formatDate(doc.createdAt),
			time: formatTime(doc.createdAt),
			user: "Admin",
			bgColor: "bg-orange-400",
			icon: <ReviewIcon />,
			active: true,
		},
	]

	if (isRejected) {
		steps.push({
			label: "Rejected",
			subtitle: doc.rejectionReason ?? undefined,
			date: formatDate(finalStepIso),
			time: formatTime(finalStepIso),
			bgColor: "bg-red-600",
			icon: <RejectIcon />,
			active: true,
		})
		// Re-uploaded step — only if there's a re-upload timestamp
		if ((doc as any).reUploadedAt) {
			steps.push({
				label: "Re-uploaded",
				date: formatDate((doc as any).reUploadedAt),
				time: formatTime((doc as any).reUploadedAt),
				user: "Admin",
				bgColor: "bg-blue-500",
				icon: <UploadIcon />,
				active: true,
			})
		}
		steps.push({
			label: "Approved",
			user: "compliance officer",
			bgColor: "bg-(--grey-3)",
			icon: <ApproveIcon />,
			active: false,
		})
	} else if (isApproved) {
		steps.push({
			label: "Approved",
			date: formatDate(finalStepIso),
			time: formatTime(finalStepIso),
			user: "compliance officer",
			bgColor: "bg-(--green-1)",
			icon: <ApproveIcon />,
			active: true,
		})
	} else {
		// PENDING
		steps.push({
			label: "Pending Approval",
			bgColor: "bg-(--grey-3)",
			icon: <ApproveIcon />,
			active: false,
		})
	}

	return steps
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
				<div className="space-y-4">
					{/* Document header */}
					<div className="flex items-center justify-between rounded-xl border border-(--grey-1) px-4 py-3.5">
						<div className="flex items-center gap-3">
							<span className="shrink-0">
								{getFileIconFromName(document.fileName, true)}
							</span>
							<div>
								<p className="text-foreground max-w-[140px] truncate text-sm font-semibold lg:max-w-[200px]">
									{document.fileName}
								</p>
								<p className="text-xs text-(--text-1)">
									{(document as any)?.businessName ||
										document.documentType.replace(/_/g, " ")}
								</p>
							</div>
						</div>

						{/* Status badge — matches design: green filled for approved */}
						<div
							className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
								document.status === "VERIFIED"
									? "bg-(--grey-1) text-(--text-1)"
									: document.status === "REJECTED"
										? "bg-red-50 text-(--red-1)"
										: "bg-orange-50 text-orange-600"
							}`}>
							{document.status === "VERIFIED" ? (
								<IoMdCheckmarkCircle size={14} className="text-(--green-1)" />
							) : document.status === "REJECTED" ? (
								<IoMdCloseCircle size={14} className="text-(--red-1)" />
							) : (
								<span className="h-2 w-2 rounded-full bg-orange-500" />
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

					{/* Timeline */}
					<div className="rounded-xl border border-(--grey-1) px-5 py-5">
						{buildTimeline(document).map((step, index, arr) => {
							const isLast = index === arr.length - 1
							return (
								<div key={index} className="flex gap-x-4">
									{/* Left column: dot + connector */}
									<div className="flex flex-col items-center">
										<div
											className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
												step.active ? step.bgColor : "bg-(--grey-2)"
											}`}>
											{step.icon}
										</div>

										{!isLast && (
											<div
												className="flex w-[25px] items-center justify-center bg-[#F7F8F9]"
												style={{ minHeight: "48px" }}>
												<div className="w-px border-2 border-(--grey-1) h-full" />
											</div>
										)}
									</div>

									<div className={`flex-1 ${!isLast ? "pb-8" : ""} pt-2.5`}>
										<p
											className={`text-sm leading-tight font-semibold ${
												step.active ? "text-foreground" : "text-(--grey-3)"
											}`}>
											{step.label}
										</p>

										{step.subtitle && (
											<p className="mt-0.5 text-sm text-(--text-1)">
												{step.subtitle}
												{(step.date || step.time) && (
													<>
														{" · "}
														{step.date}
														{step.time && ` · ${step.time}`}
													</>
												)}
											</p>
										)}

										{!step.subtitle && step.active && (step.user || step.date) && (
											<p className="mt-0.5 text-sm text-(--text-1)">
												{step.user && `By ${step.user}`}
												{step.date && ` · ${step.date}`}
												{step.time && ` · ${step.time}`}
											</p>
										)}

										{step.subtitle && step.user && (
											<p className="mt-0.5 text-xs text-(--grey-3)">By {step.user}</p>
										)}
									</div>
								</div>
							)
						})}
					</div>
				</div>
			)}
		</Modal>
	)
}
