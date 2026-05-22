"use client"

import { useState } from "react"
import { Modal } from "./modal"
import { RejectionModalProps } from "@/app/types/general"

export default function RejectionModal({
	loading,
	isOpen,
	onClose,
	onConfirm,
	subject = "document",
}: RejectionModalProps) {
	const [reason, setReason] = useState("")
	const [touched, setTouched] = useState(false)

	const hasError = touched && !reason.trim()

	const handleConfirm = () => {
		setTouched(true)
		if (!reason.trim()) return
		onConfirm(reason.trim())
		setReason("")
		setTouched(false)
	}

	const handleClose = () => {
		setReason("")
		setTouched(false)
		onClose()
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title={`Reject ${subject}`}
			showOverlay={true}
			variant="center">
			<div className="space-y-5">
				{/* Icon */}
				<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
					<svg
						className="h-7 w-7 text-(--red-1)"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</div>

				<div className="text-center">
					<h3 className="text-foreground text-lg font-semibold capitalize">
						Reject {subject}?
					</h3>
					<p className="mt-1 text-sm text-(--text-1)">
						Provide a reason for rejection. This will be visible to the submitter.
					</p>
				</div>

				{/* Reason textarea */}
				<div>
					<label className="text-foreground mb-1.5 block text-sm font-medium">
						Rejection Reason{" "}
						<span className="text-(--red-1)" aria-hidden>
							*
						</span>
					</label>
					<textarea
						value={reason}
						onChange={(e) => {
							setReason(e.target.value)
							if (touched && e.target.value.trim()) setTouched(false)
						}}
						onBlur={() => setTouched(true)}
						placeholder={`Explain why this ${subject} is being rejected…`}
						rows={4}
						className={`text-foreground bg-background w-full resize-none rounded-lg border px-3.5 py-3 text-sm transition placeholder:text-(--grey-3) focus:ring-2 focus:ring-(--green-1) focus:outline-none ${
							hasError ? "border-(--red-1)" : "border-(--grey-1)"
						}`}
					/>
					{hasError && (
						<p className="mt-1.5 text-xs text-(--red-1)">
							A rejection reason is required.
						</p>
					)}
				</div>

				<div className="flex gap-3 pt-1">
					<button
						onClick={handleClose}
						className="flex-1 cursor-pointer rounded-lg border border-(--grey-1) px-4 py-3 font-medium text-(--text-1) transition hover:bg-(--grey-4)">
						Cancel
					</button>
					<button
						onClick={handleConfirm}
						className="flex-1 cursor-pointer rounded-lg bg-(--red-1) px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
						{loading ? "Confirming Rejection..." : "Confirm Rejection"}
					</button>
				</div>
			</div>
		</Modal>
	)
}
