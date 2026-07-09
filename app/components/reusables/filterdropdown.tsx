"use client"

import { useState, useRef, useEffect } from "react"

export interface FilterOption {
	label: string
	value: string
}

interface FilterDropdownProps {
	options: FilterOption[]
	selected: string
	onChange: (value: string) => void
}

export function FilterDropdown({
	options,
	selected,
	onChange,
}: FilterDropdownProps) {
	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	const selectedLabel =
		options.find((o) => o.value === selected)?.label ?? options[0].label

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false)
			}
		}
		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	return (
		<div ref={ref} className="relative">
			<button
				onClick={() => setOpen((prev) => !prev)}
				className="text-foreground flex cursor-pointer items-center gap-1 text-sm font-medium">
				{selectedLabel}
				<svg
					className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{open && (
				<div className="bg-background absolute right-0 z-10 mt-2 min-w-[160px] rounded-lg border border-(--grey-1) py-1 shadow-sm">
					{options.map((option) => (
						<button
							key={option.value}
							onClick={() => {
								onChange(option.value)
								setOpen(false)
							}}
							className={`w-full cursor-pointer px-4 py-2 text-left text-sm transition hover:bg-(--grey-4) ${
								selected === option.value
									? "text-foreground font-medium"
									: "text-(--text-1)"
							}`}>
							{option.label}
						</button>
					))}
				</div>
			)}
		</div>
	)
}
