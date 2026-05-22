"use client"

import { Modal } from "./modal"
import Image from "next/image"

interface ApprovalModalProps {
	approvalMessage: {
		type: "success" | "failed"
		title: string
		message: string
	} | null
	isOpen: boolean
	onClose: () => void
}

export default function ApprovalModal({
	isOpen,
	onClose,
	approvalMessage,
}: ApprovalModalProps) {
	if (!isOpen) return null

	return (
		<Modal isOpen={isOpen} onClose={onClose} showOverlay={true}>
			<div className="flex flex-col items-center justify-center px-4 py-12">
				{/* Success Icon */}
				<div className="mb-6">
					<Image
						src={
							approvalMessage?.type === "success"
								? "/images/success.svg"
								: "/images/failed.svg"
						}
						alt={approvalMessage?.type || ""}
						width={20}
						height={20}
						className="h-24 w-24"
					/>
				</div>

				{/* Message */}
				<h2 className="text-foreground mb-3 text-center text-2xl font-bold">
					{approvalMessage?.title}
				</h2>
				<p className="mb-8 max-w-sm text-center text-(--text-1)">
					{approvalMessage?.message}
				</p>

				<button
					onClick={onClose}
					className="w-full rounded-lg bg-(--green-1) px-6 py-3 font-medium text-white transition hover:bg-green-700">
					Done
				</button>
			</div>
		</Modal>
	)
}
