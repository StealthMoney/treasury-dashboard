"use client"

import { useEffect, ReactNode } from "react"
import { createPortal } from "react-dom"
import { AiOutlineClose } from "react-icons/ai"
import { Spinner } from "../reusables/spinner"

export interface ModalButton {
	label: string
	onClick: () => void
	variant?: "primary" | "outline"
	disabled?: boolean
	loading?: boolean
}

export interface FeedbackModalProps {
	isOpen: boolean
	onClose: () => void
	icon?: ReactNode
	title: string
	description: string
	buttonCount?: 1 | 2
	buttons?: ModalButton[]
}

export function FeedbackModal({
	isOpen,
	onClose,
	icon,
	title,
	description,
	buttonCount = 1,
	buttons = [],
}: FeedbackModalProps) {
	useEffect(() => {
		if (!isOpen) return
		const scrollbarWidth =
			window.innerWidth - document.documentElement.clientWidth
		document.body.style.overflow = "hidden"
		document.body.style.paddingRight = `${scrollbarWidth}px`
		return () => {
			document.body.style.overflow = ""
			document.body.style.paddingRight = ""
		}
	}, [isOpen])

	// Escape key to close
	useEffect(() => {
		if (!isOpen) return
		const handle = (e: KeyboardEvent) => e.key === "Escape" && onClose()
		window.addEventListener("keydown", handle)
		return () => window.removeEventListener("keydown", handle)
	}, [isOpen, onClose])

	if (!isOpen || typeof document === "undefined") return null

	const resolvedButtons = buttons.slice(0, buttonCount)

	return createPortal(
		<>
			{/* Backdrop */}
			<div
				onClick={onClose}
				aria-hidden="true"
				className="fixed inset-0 z-50 bg-[#D1D4DB80]/50 backdrop-blur-sm"
			/>

			{/* Panel */}
			<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
				<div
					role="dialog"
					aria-modal="true"
					onClick={(e) => e.stopPropagation()}
					className="bg-background relative w-full max-w-130 overflow-hidden shadow-lg"
					style={{ animation: "modalIn 0.2s ease-out both" }}>
					<button
						onClick={onClose}
						aria-label="Close"
						className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-(--grey-1) transition-colors hover:bg-(--grey-4)">
						<AiOutlineClose className="h-4 w-4 text-(--text-1)" />
					</button>

					<div className="flex flex-col items-center gap-4 px-8 pt-14 pb-2 text-center">
						{icon && <div className="mb-1">{icon}</div>}

						<h2 className="text-foreground text-lg font-bold">{title}</h2>

						<p className="max-w-85 text-sm leading-relaxed text-(--text-1)">
							{description}
						</p>
					</div>

					{resolvedButtons.length > 0 && (
						<div
							className={`flex gap-3 p-6 pt-8 ${
								buttonCount === 2 ? "flex-row" : "flex-col"
							}`}>
							{resolvedButtons.map((btn, i) => (
								<button
									key={i}
									onClick={btn.onClick}
									disabled={btn.disabled || btn.loading}
									className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
										btn.variant === "outline"
											? "bg-background text-foreground border border-(--grey-1)"
											: "bg-foreground text-background"
									} `}>
									{btn.loading && <Spinner />}
									{btn.label}
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			<style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
		</>,
		document.body
	)
}
