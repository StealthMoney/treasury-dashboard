"use client"

import { useEffect, useState } from "react"
import { Modal } from "./modal"
import { BusinessDirector } from "@/app/types/general"
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io"
import { FaRegClock } from "react-icons/fa6"

interface DirectorDetailModalProps {
	loading: boolean
	isOpen: boolean
	director: BusinessDirector | null
	onClose: () => void
	onApprove: () => void
	onRejectInitiate: () => void
	onReject: (reason: string) => void
}

type Step = "review" | "reject"

function StatusBadge({ status }: { status: BusinessDirector["status"] }) {
	const base =
		"inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"

	if (status === "VERIFIED")
		return (
			<div className={`${base} bg-(--grey-1) text-(--text-1)`}>
				<IoMdCheckmarkCircle size={14} className="text-(--green-1)" />
				Approved
			</div>
		)

	if (status === "REJECTED")
		return (
			<div className={`${base} bg-red-50 text-(--red-1)`}>
				<IoMdCloseCircle size={14} className="text-(--red-1)" />
				Rejected
			</div>
		)

	return (
		<div className={`${base} bg-orange-50 text-orange-600`}>
			<FaRegClock size={14} className="text-orange-500" />
			Pending
		</div>
	)
}

function MaskedBvn({ bvn }: { bvn: string }) {
	const [visible, setVisible] = useState(false)

	return (
		<span className="inline-flex items-center gap-2">
			<span className="font-mono">
				{visible ? bvn : "•".repeat(bvn.length - 4) + bvn.slice(-4)}
			</span>
			<button
				onClick={() => setVisible((v) => !v)}
				className="hover:text-foreground cursor-pointer text-(--text-1)">
				{visible ? "Hide" : "Show"}
			</button>
		</span>
	)
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className="flex items-center justify-between border-b border-(--grey-1) py-3">
			<p className="text-sm text-(--text-1)">{label}</p>
			<p className="text-foreground text-right text-sm font-medium">{value}</p>
		</div>
	)
}

export default function DirectorDetailModal({
	loading,
	isOpen,
	director,
	onClose,
	onApprove,
	onRejectInitiate,
	onReject,
}: DirectorDetailModalProps) {
	const [step, setStep] = useState<Step>("review")
	const [rejectionReason, setRejectionReason] = useState("")
	const [touched, setTouched] = useState(false)

	// reset when modal closes
	const resetModalState = () => {
		setStep("review")
		setRejectionReason("")
		setTouched(false)
	}

	if (!director) return null

	const handleConfirmReject = () => {
		setTouched(true)
		if (!rejectionReason.trim()) return

		onReject(rejectionReason)
	}

	const handleClose = () => {
		resetModalState()
		setTimeout(() => {
			onClose()
		}, 1000)
	}

	const handleRejection = () => {
		onRejectInitiate()
		setStep("reject")
	}

	const handleGoBack = () => {
		setStep("review")
		setRejectionReason("")
	}

	const hasError = touched && !rejectionReason.trim()
	const isSettled =
		director.status === "VERIFIED" || director.status === "REJECTED"

	return (
		<Modal
			isOpen={isOpen && !!director}
			onClose={handleClose}
			title={step === "review" ? "Director Details" : "Reject Director"}
			showOverlay
			variant="slide">
			{step === "review" && (
				<div className="flex h-full flex-col">
					<div className="flex-1">
						{/* Header */}
						<div className="mb-4 flex items-start justify-between border-b border-(--grey-1) pb-4">
							<div>
								<p className="text-foreground text-base font-bold">
									{director.firstName} {director.lastName}
								</p>
								<p className="text-xs tracking-wide text-(--text-1) uppercase">
									{director.role.replace(/_/g, " ")}
								</p>
							</div>

							<StatusBadge status={director.status} />
						</div>

						{/* Details */}
						<Row
							label="Date of Birth"
							value={new Date(director.dob).toLocaleDateString("en-GB")}
						/>
						<Row label="BVN" value={<MaskedBvn bvn={director.bvn} />} />
						<Row label="Email" value={director.email} />
						<Row label="Phone" value={director.phoneNumber} />

						<Row
							label="Address"
							value={[
								director.addressLine1,
								director.addressLine2,
								director.city,
								director.state,
								director.country,
							]
								.filter(Boolean)
								.join(", ")}
						/>

						<Row
							label="Added"
							value={new Date(director.createdAt).toLocaleDateString("en-GB")}
						/>

						<Row label="Public ID" value={director.publicId} />

						{director.status === "REJECTED" && director.rejectionReason && (
							<div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-4">
								<p className="text-xs font-semibold text-(--red-1) uppercase">
									Rejection Reason
								</p>
								<p className="text-sm text-(--red-1)">{director.rejectionReason}</p>
							</div>
						)}
					</div>

					{director.status === "PENDING" && (
						<div className="mt-6 flex gap-3 border-t border-(--grey-1) pt-4">
							<button
								onClick={handleRejection}
								disabled={loading}
								className="flex-1 cursor-pointer rounded-lg border border-(--grey-1) px-4 py-3 text-sm font-medium text-(--red-1)">
								Reject
							</button>

							<button
								onClick={onApprove}
								disabled={loading}
								className="flex-1 cursor-pointer rounded-lg bg-(--green-1) px-4 py-3 text-sm font-medium text-white">
								{loading ? "Approving..." : "Approve"}
							</button>
						</div>
					)}
				</div>
			)}

			{step === "reject" && (
				<div className="flex flex-col gap-4">
					<div className="border-b border-(--grey-1) pb-4">
						<p className="text-foreground text-base font-bold">Reject Director</p>
						<p className="text-xs text-(--text-1)">Provide reason for rejection</p>
					</div>

					<textarea
						value={rejectionReason}
						onChange={(e) => {
							setRejectionReason(e.target.value)
							if (touched) setTouched(false)
						}}
						placeholder="Reason for rejection..."
						rows={5}
						className="w-full resize-none rounded-xl border border-(--grey-1) bg-(--grey-4) px-4 py-3 text-sm focus:outline-none"
					/>

					{hasError && (
						<p className="text-xs text-(--red-1)">Rejection reason is required</p>
					)}

					<div className="flex gap-3 pt-2">
						<button
							onClick={handleGoBack}
							disabled={loading}
							className="flex-1 cursor-pointer rounded-lg border border-(--grey-1) px-4 py-3 text-sm font-medium">
							Go Back
						</button>

						<button
							onClick={handleConfirmReject}
							disabled={loading}
							className="flex-1 cursor-pointer rounded-lg bg-(--red-1) px-4 py-3 text-sm font-medium text-white">
							{loading ? "Processing..." : "Confirm Rejection"}
						</button>
					</div>
				</div>
			)}
		</Modal>
	)
}
