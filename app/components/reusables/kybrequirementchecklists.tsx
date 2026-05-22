"use client"

import { useState, useEffect } from "react"
import { BsListCheck } from "react-icons/bs"
import { HiX, HiChevronDown, HiChevronUp } from "react-icons/hi"
import { MdOutlineUploadFile } from "react-icons/md"

// ─── File upload documents only ──────────────────────────────────────────────

const UPLOAD_REQUIREMENTS = [
	{
		section: "Director(s) Documents",
		subtitle: "Required per each director added",
		color: "bg-amber-500",
		items: [
			{
				label: "Identification Document",
				note: "Passport, Driver's License, or National ID",
				required: true,
			},
			{
				label: "Proof of Address",
				note:
					"Utility bill (≤3 months old), bank statement (≤6 months), tax statement, or govt-issued ID with address",
				required: true,
			},
		],
	},
	{
		section: "Incorporation Documents",
		subtitle: "Official company formation documents",
		color: "bg-blue-500",
		items: [
			{
				label: "Certificate of Incorporation",
				note: "Official business formation certificate",
				required: true,
			},
			{
				label: "Status of Registration",
				note: "Current registration status document",
				required: true,
			},
			{
				label: "Memorandum of Understanding (MOU)",
				note: null,
				required: true,
			},
			{
				label: "Register of Board of Directors",
				note: null,
				required: true,
			},
			{
				label: "Tax Filing Document",
				note: "Most recent tax filing",
				required: false,
			},
		],
	},
	{
		section: "Company Proof of Address",
		subtitle: "Upload one of the following",
		color: "bg-emerald-500",
		items: [
			{
				label: "Utility Bill",
				note: "Not older than 3 months",
				required: true,
			},
			{
				label: "Bank Statement",
				note: "Showing registered company address, not older than 6 months",
				required: true,
			},
			{
				label: "Tax Filing Document",
				note: "Showing registered company address",
				required: true,
			},
		],
	},
	{
		section: "Supporting Documents",
		subtitle: "Optional — any additional relevant files",
		color: "bg-slate-400",
		items: [
			{
				label: "Any other supporting documents",
				note: "PDF, JPG, JPEG, PNG, DOC, DOCX accepted",
				required: false,
			},
		],
	},
]

// ─── Component ────────────────────────────────────────────────────────────────

export function KYBRequirementsChecklist() {
	const [open, setOpen] = useState(false)
	const [expandedSections, setExpandedSections] = useState<
		Record<number, boolean>
	>({})
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		const t = setTimeout(() => setMounted(true), 300)
		return () => clearTimeout(t)
	}, [])

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : ""
		return () => {
			document.body.style.overflow = ""
		}
	}, [open])

	const toggleSection = (idx: number) => {
		setExpandedSections((prev) => ({
			...prev,
			[idx]: prev[idx] === false ? true : false,
		}))
	}

	const requiredCount = UPLOAD_REQUIREMENTS.reduce(
		(acc, g) => acc + g.items.filter((i) => i.required).length,
		0
	)

	return (
		<>
			{/* ── Floating Action Button ───────────────────────────────────────── */}
			<div
				style={{
					opacity: mounted ? 1 : 0,
					transform: mounted ? "scale(1)" : "scale(0.7)",
					transition:
						"opacity 0.3s ease, transform 0.4s cubic-bezier(.34,1.56,.64,1)",
				}}
				className="fixed right-6 bottom-6 z-50">
				<button
					onClick={() => setOpen(true)}
					aria-label="View required upload documents"
					className="bg-foreground flex h-14 w-14 cursor-pointer items-center justify-center rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.22)] transition-all duration-200 hover:scale-110 hover:shadow-[0_6px_28px_rgba(0,0,0,0.28)] active:scale-95">
					<BsListCheck className="text-background h-6 w-6" />
				</button>
			</div>

			{/* ── Backdrop ────────────────────────────────────────────────────── */}
			{open && (
				<div
					onClick={() => setOpen(false)}
					className="fixed inset-0 z-60 bg-black/40 backdrop-blur-[2px]"
					style={{ animation: "kybFadeIn 0.2s ease forwards" }}
				/>
			)}

			{/* ── Drawer Panel ────────────────────────────────────────────────── */}
			<div
				role="dialog"
				aria-modal="true"
				style={{
					transform: open ? "translateX(0)" : "translateX(105%)",
					transition: "transform 0.35s cubic-bezier(.32,.72,0,1)",
				}}
				className="bg-background fixed top-0 right-0 bottom-0 z-70 flex w-full max-w-100 flex-col shadow-[-6px_0_40px_rgba(0,0,0,0.1)]">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-(--grey-1) px-5 py-4">
					<div className="flex items-center gap-3">
						<div className="bg-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
							<MdOutlineUploadFile className="text-background h-5 w-5" />
						</div>
						<div>
							<p className="text-foreground text-[15px] font-bold">
								Document Checklist
							</p>
							<p className="text-[11px] text-(--text-1)">
								{requiredCount} required uploads to complete KYB
							</p>
						</div>
					</div>
					<button
						onClick={() => setOpen(false)}
						aria-label="Close checklist"
						className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-(--grey-1) bg-(--grey-4) transition">
						<HiX className="h-4 w-4 text-(--text-1)" />
					</button>
				</div>

				{/* Banner */}
				<div className="border-b border-(--grey-1) bg-(--grey-4) px-5 py-3">
					<p className="text-[12px] leading-relaxed text-(--text-1)">
						Prepare these files before you begin to avoid interruptions.{" "}
						<span className="text-foreground font-medium">Required</span> items must
						be uploaded to submit your KYB.
					</p>
				</div>

				{/* Sections */}
				<div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
					{UPLOAD_REQUIREMENTS.map((group, idx) => {
						const isCollapsed = expandedSections[idx] === false

						return (
							<div
								key={idx}
								className="overflow-hidden rounded-xl border border-(--grey-1)">
								{/* Section toggle */}
								<button
									onClick={() => toggleSection(idx)}
									className="flex w-full cursor-pointer items-center justify-between bg-(--grey-4) px-4 py-3 transition">
									<div className="flex items-center gap-2.5 text-left">
										<span
											className={`h-2.5 w-2.5 shrink-0 rounded-full ${group.color}`}
										/>
										<div>
											<p className="text-foreground text-[13px] font-semibold">
												{group.section}
											</p>
											<p className="text-[11px] text-(--text-1)">{group.subtitle}</p>
										</div>
									</div>
									{isCollapsed ? (
										<HiChevronDown className="h-4 w-4 shrink-0 text-(--text-1)" />
									) : (
										<HiChevronUp className="h-4 w-4 shrink-0 text-(--text-1)" />
									)}
								</button>

								{/* Items */}
								{!isCollapsed && (
									<ul className="divide-y divide-(--grey-1)">
										{group.items.map((item, i) => (
											<li
												key={i}
												className="bg-background flex items-start gap-3 px-4 py-3">
												<span
													className={`mt-1.25 h-1.5 w-1.5 shrink-0 rounded-full ${
														item.required ? group.color : "bg-slate-300"
													}`}
												/>
												<div className="min-w-0 flex-1">
													<div className="flex items-center gap-2">
														<p className="text-foreground text-[13px] leading-snug font-medium">
															{item.label}
														</p>
														{!item.required && (
															<span className="shrink-0 rounded-full bg-(--grey-4) px-2 py-0.5 text-[10px] text-(--text-1)">
																optional
															</span>
														)}
													</div>
													{item.note && (
														<p className="mt-0.5 text-[11px] leading-relaxed text-(--text-1)">
															{item.note}
														</p>
													)}
												</div>
											</li>
										))}
									</ul>
								)}
							</div>
						)
					})}

					<div className="h-2" />
				</div>

				{/* Footer */}
				<div className="border-t border-(--grey-1) px-5 py-4">
					<button
						onClick={() => setOpen(false)}
						className="bg-foreground text-background w-full cursor-pointer rounded-xl py-3 text-[13px] font-semibold transition hover:opacity-85 active:scale-[0.98]">
						Got it
					</button>
				</div>
			</div>

			<style>{`
        @keyframes kybFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
		</>
	)
}
