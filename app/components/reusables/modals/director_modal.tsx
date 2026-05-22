"use client"

import { useState } from "react"
import { Modal } from "./modal"
import { BusinessDirector } from "@/app/types/general"

interface DirectorDetailModalProps {
	loading: boolean
	isOpen: boolean
	director: BusinessDirector | null
	onClose: () => void
	onApprove: () => void
	onReject: () => void
}

function StatusBadge({ status }: { status: BusinessDirector["status"] }) {
	const base =
		"inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
	if (status === "VERIFIED")
		return (
			<div className={`${base} bg-green-50 text-(--green-1)`}>
				<span className="h-2 w-2 rounded-full bg-(--green-1)" />
				Verified
			</div>
		)
	if (status === "REJECTED")
		return (
			<div className={`${base} bg-red-50 text-(--red-1)`}>
				<span className="h-2 w-2 rounded-full bg-(--red-1)" />
				Rejected
			</div>
		)
	return (
		<div className={`${base} bg-orange-50 text-orange-600`}>
			<span className="h-2 w-2 rounded-full bg-orange-500" />
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
				className="hover:text-foreground cursor-pointer text-(--text-1) transition">
				{visible ? (
					<svg
						className="h-3.5 w-3.5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
						/>
					</svg>
				) : (
					<svg
						className="h-3.5 w-3.5"
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
				)}
			</button>
		</span>
	)
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className="flex items-center justify-between border-b border-(--grey-1) py-3">
			<p className="shrink-0 text-sm text-(--text-1)">{label}</p>
			<p className="text-foreground ml-4 text-right text-sm font-medium">
				{value}
			</p>
		</div>
	)
}

export default function DirectorDetailModal({
	loading,
	isOpen,
	director,
	onClose,
	onApprove,
	onReject,
}: DirectorDetailModalProps) {
	return (
		<Modal
			isOpen={isOpen && !!director}
			onClose={onClose}
			title="Director Details"
			showOverlay={true}
			variant="slide">
			{director && (
				<div className="flex h-full flex-col">
					<div className="flex-1">
						{/* Header */}
						<div className="mb-1 flex items-start justify-between border-b border-(--grey-1) pb-5">
							<div>
								<p className="text-foreground text-base font-bold">
									{director.firstName} {director.lastName}
								</p>
								<p className="mt-0.5 text-xs tracking-wide text-(--text-1) uppercase">
									{director.role.replace(/_/g, " ")}
								</p>
							</div>
							<div className="ml-4 flex flex-col items-end gap-2">
								<StatusBadge status={director.status} />
								{director.isPep && (
									<div className="inline-flex items-center gap-1.5 rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700">
										<svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
												clipRule="evenodd"
											/>
										</svg>
										PEP
									</div>
								)}
							</div>
						</div>

						{/* Details */}
						<Row
							label="Date of Birth"
							value={new Date(director.dob).toLocaleDateString("en-GB", {
								day: "numeric",
								month: "long",
								year: "numeric",
							})}
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
							value={new Date(director.createdAt).toLocaleDateString("en-GB", {
								day: "numeric",
								month: "long",
								year: "numeric",
							})}
						/>
						<Row label="Public ID" value={director.publicId} />

						{/* Rejection reason */}
						{director.status === "REJECTED" && director.rejectionReason && (
							<div className="mt-5 rounded-lg border border-red-100 bg-red-50 p-4">
								<p className="mb-1 text-xs font-semibold tracking-wide text-(--red-1) uppercase">
									Rejection Reason
								</p>
								<p className="text-sm text-(--red-1)">{director.rejectionReason}</p>
							</div>
						)}
					</div>

					{/* Actions — only shown for pending directors */}
					{director.status === "PENDING" && (
						<div className="-mx-6 mt-6 flex gap-3 border-t border-(--grey-1) px-6 pt-6 pb-0">
							<button
								onClick={onReject}
								className="flex-1 cursor-pointer rounded-lg border border-(--grey-1) px-4 py-3 font-medium text-(--red-1) transition hover:bg-red-50">
								Reject
							</button>
							<button
								onClick={onApprove}
								className="flex-1 cursor-pointer rounded-lg bg-(--green-1) px-4 py-3 font-medium text-white transition hover:opacity-90 active:scale-[0.99]">
								{loading ? "Approving..." : "Approve"}
							</button>
						</div>
					)}
				</div>
			)}
		</Modal>
	)
}
