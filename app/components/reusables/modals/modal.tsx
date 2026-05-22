"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ModalConfig } from "@/app/types/general"

export function Modal({
	isOpen,
	title,
	children,
	onClose,
	showOverlay = true,
	variant = "slide",
}: ModalConfig) {
	const [shouldRender, setShouldRender] = useState(false)
	const [visible, setVisible] = useState(false)
	const raf1 = useRef<number | null>(null)
	const raf2 = useRef<number | null>(null)
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		// clear any in-flight animations
		if (raf1.current) cancelAnimationFrame(raf1.current)
		if (raf2.current) cancelAnimationFrame(raf2.current)
		if (timer.current) clearTimeout(timer.current)

		if (isOpen) {
			document.body.style.overflow = "hidden"
			document.body.classList.add("modal-open")
			// double-rAF: first frame mounts the node, second frame triggers transition
			raf1.current = requestAnimationFrame(() => {
				setShouldRender(true)
				raf2.current = requestAnimationFrame(() => {
					setVisible(true)
				})
			})
		} else {
			document.body.classList.remove("modal-open")
			raf1.current = requestAnimationFrame(() => {
				setVisible(false)
			})
			timer.current = setTimeout(() => {
				setShouldRender(false)
				document.body.style.overflow = ""
			}, 300)
		}

		return () => {
			if (raf1.current) cancelAnimationFrame(raf1.current)
			if (raf2.current) cancelAnimationFrame(raf2.current)
			if (timer.current) clearTimeout(timer.current)
		}
	}, [isOpen])

	// safety cleanup on unmount
	useEffect(() => {
		return () => {
			document.body.style.overflow = ""
			document.body.classList.remove("modal-open")
		}
	}, [])

	if (!shouldRender || typeof window === "undefined") return null

	const content =
		variant === "slide" ? (
			<>
				{showOverlay && (
					<div
						className="fixed inset-0 z-40 transition-opacity duration-300"
						style={{
							opacity: visible ? 1 : 0,
							backgroundColor: "rgba(0,0,0,0.3)",
						}}
						onClick={onClose}
					/>
				)}
				<div
					className="bg-background fixed top-0 right-0 z-50 flex h-full w-full max-w-lg flex-col shadow-2xl transition-transform duration-300 ease-in-out"
					style={{ transform: visible ? "translateX(0)" : "translateX(100%)" }}>
					{(title || onClose) && (
						<div className="flex shrink-0 items-center justify-between border-b border-(--grey-1) px-6 py-5">
							{title && (
								<h2 className="text-foreground text-lg font-semibold">{title}</h2>
							)}
							{onClose && (
								<button
									title="close"
									onClick={onClose}
									className="hover:text-foreground ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-(--text-1) transition hover:bg-(--grey-4)">
									<svg
										className="h-5 w-5"
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
								</button>
							)}
						</div>
					)}
					<div className="flex-1 overflow-y-auto p-6">{children}</div>
				</div>
			</>
		) : (
			<>
				{showOverlay && (
					<div
						className="fixed inset-0 z-40 transition-opacity duration-300"
						style={{
							opacity: visible ? 1 : 0,
							backgroundColor: "rgba(0,0,0,0.5)",
						}}
						onClick={onClose}
					/>
				)}
				<div
					className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
					style={{ opacity: visible ? 1 : 0 }}>
					<div className="bg-background relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg">
						{(title || onClose) && (
							<div className="bg-background sticky top-0 z-10 flex items-center justify-between border-b border-(--grey-1) px-6 py-4">
								{title && (
									<h2 className="text-foreground text-lg font-semibold">{title}</h2>
								)}
								{onClose && (
									<button
										title="close"
										onClick={onClose}
										className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-(--text-1) transition hover:bg-(--grey-4)">
										<svg
											className="h-5 w-5"
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
									</button>
								)}
							</div>
						)}
						<div className="p-6">{children}</div>
					</div>
				</div>
			</>
		)

	return createPortal(content, document.body)
}
