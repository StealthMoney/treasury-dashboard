"use client"

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import React, { useState, ChangeEvent, useRef } from "react"
import { HiX } from "react-icons/hi"
import { InputFieldProps, TextFieldProps } from "@/app/types/inputs"
import { getFileIcon } from "./review_generals"
import { FaRegTrashAlt } from "react-icons/fa"
import { FiSearch } from "react-icons/fi"

type SelectOption = string | { label: string; value: string }

export function SelectField({
	label,
	id,
	value,
	onChange,
	options,
	placeholder,
	error,
	disabled,
	compact,
}: {
	label: string | React.ReactNode
	id: string
	value: string
	onChange: (v: string) => void
	options: SelectOption[]
	placeholder: string
	error?: string
	disabled?: boolean
	compact?: boolean
}) {
	return (
		<div className={compact ? "" : "space-y-1.5"}>
			{label && !compact && (
				<label htmlFor={id} className="block text-sm font-medium text-(--text-1)">
					{label}
				</label>
			)}
			<div
				className={`relative rounded-lg border ${compact ? "bg-background" : "bg-(--grey-4)"} transition-all ${error ? "border-(--red-1)" : "border-(--grey-1) focus-within:border-(--grey-1)"} ${disabled ? "opacity-50" : ""}`}>
				<select
					id={id}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					disabled={disabled}
					className={`w-full cursor-pointer appearance-none bg-transparent text-sm text-(--text-1) outline-none ${
						compact ? "px-3 py-2 pr-7 text-xs" : "px-3 py-2.5"
					}`}>
					<option value="" disabled>
						{placeholder}
					</option>
					{options.map((o) =>
						typeof o === "string" ? (
							<option key={o} value={o}>
								{o}
							</option>
						) : (
							<option key={o.value} value={o.value}>
								{o.label}
							</option>
						)
					)}
				</select>
				<div className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-(--text-1)">
					<svg width="10" height="6" viewBox="0 0 12 8" fill="none">
						<path
							d="M1 1L6 6L11 1"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
					</svg>
				</div>
			</div>
			{error && <p className="text-xs text-(--red-1)">{error}</p>}
		</div>
	)
}

export function FilePickerField({
	label,
	file,
	onFileChange,
	onFileRemove,
	error,
	required = false,
}: {
	label: string | React.ReactNode
	file: File | null
	onFileChange: (file: File | null) => void
	onFileRemove: () => void
	error?: string
	required?: boolean
}) {
	const inputRef = useRef<HTMLInputElement>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const picked = e.target.files?.[0] ?? null
		onFileChange(picked)
	}

	return (
		<div>
			<label
				className="mb-2 text-[14px] text-(--text-1)"
				aria-label={typeof label === "string" ? label : undefined}>
				{label} {required && "*"}
			</label>
			<input
				title="upload file"
				ref={inputRef}
				type="file"
				accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
				className="hidden"
				onChange={handleFileChange}
			/>
			<div
				onClick={() => inputRef.current?.click()}
				className="cursor-pointer rounded-lg border-2 border-dashed border-(--grey-1) bg-(--grey-4) p-4 text-center transition hover:border-(--grey-2)">
				<p className="text-[14px] text-(--text-1)">+ Choose file</p>
			</div>
			{file && (
				<div className="mt-2 flex items-center justify-between rounded-lg bg-(--grey-4) p-2">
					<p className="text-foreground flex-1 truncate text-[12px]">
						📎 {file.name}
					</p>
					<button
						title="remove file"
						onClick={(e) => {
							e.stopPropagation()
							onFileRemove()
						}}
						className="rounded-full p-1 transition hover:bg-(--grey-3)"
						type="button">
						<HiX className="h-4 w-4 text-(--red-1)" />
					</button>
				</div>
			)}
			{error && <p className="mt-1 text-sm text-(--red-1)">{error}</p>}
		</div>
	)
}

export function TextField({
	label,
	id,
	placeholder,
	value,
	onChange,
	error,
	prefix,
	type = "text",
	disabled = false,
	compact,
	searchIcon,
}: TextFieldProps & { compact?: boolean; searchIcon?: boolean }) {
	return (
		<div className={compact ? "" : "space-y-1.5"}>
			{label && !compact && (
				<label htmlFor={id} className="text-foreground block text-sm font-medium">
					{label}
				</label>
			)}
			<div
				className={`flex items-center rounded-lg border ${compact ? "bg-background" : "bg-(--grey-4)"} transition-all ${error ? "border-(--red-1) focus-within:border-(--red-1)" : "border-(--grey-1) focus-within:border-(--grey-1)"}`}>
				{searchIcon && (
					<span className="pl-3 text-(--text-1)">
						<FiSearch size={14} />
					</span>
				)}
				{prefix && !searchIcon && (
					<span className="bg-background border border-(--grey-1) py-2.5 pr-2 pl-3 text-[14px] text-(--text-1) select-none">
						{prefix}
					</span>
				)}
				<input
					id={id}
					type={type}
					placeholder={placeholder}
					value={value}
					onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
					disabled={disabled}
					className={`text-foreground flex-1 bg-transparent text-[14px] placeholder-(--text-1) outline-none ${
						compact ? "px-2 py-2 text-xs" : "px-3 py-2.5"
					}`}
				/>
			</div>
			{error && <p className="text-xs text-(--red-1)">{error}</p>}
		</div>
	)
}

interface PasswordFieldProps {
	label: string
	id: string
	placeholder?: string
	value: string
	onChange: (v: string) => void
	error?: string
	disabled?: boolean
}

export function PasswordField({
	label,
	id,
	placeholder = "Password",
	value,
	onChange,
	error,
	disabled = false,
}: PasswordFieldProps) {
	const [showPassword, setShowPassword] = useState(false)

	return (
		<div className="space-y-1.5">
			<label htmlFor={id} className="text-foreground block text-sm font-medium">
				{label}
			</label>
			<div
				className={`flex items-center rounded-lg border bg-(--grey-4) transition-all ${error ? "border-(--red-1) focus-within:border-(--red-1)" : "border-(--grey-1) focus-within:border-(--grey-1)"}`}>
				<input
					id={id}
					type={showPassword ? "text" : "password"}
					placeholder={placeholder}
					value={value}
					onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
					disabled={disabled}
					className="text-foreground flex-1 bg-transparent px-3 py-2.5 text-[14px] placeholder-(--text-1) outline-none"
				/>
				<button
					type="button"
					onClick={() => setShowPassword(!showPassword)}
					className="text-muted-foreground hover:text-foreground pr-3 transition-colors"
					disabled={disabled}>
					{showPassword ? (
						<AiOutlineEyeInvisible size={20} />
					) : (
						<AiOutlineEye size={20} />
					)}
				</button>
			</div>
			{error && <p className="text-xs text-(--red-1)">{error}</p>}
		</div>
	)
}

export function InputField({
	label,
	id,
	type = "text",
	placeholder,
	value,
	onChange,
	error,
	prefix,
	showToggle,
	showPassword,
	onToggle,
}: InputFieldProps) {
	return (
		<div className="space-y-1.5">
			<label htmlFor={id} className="block text-sm font-medium text-gray-700">
				{label}
			</label>
			<div
				className={`flex items-center rounded-lg border bg-gray-50 transition-all focus-within:bg-white ${error ? "border-(--red-1) focus-within:border-(--red-1) focus-within:ring-1 focus-within:ring-red-200" : "border-gray-200 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-200"}`}>
				{prefix && (
					<span className="border-r border-gray-200 py-2.5 pr-3 pl-3 text-sm whitespace-nowrap text-gray-400 select-none">
						{prefix}
					</span>
				)}
				<input
					id={id}
					type={showToggle ? (showPassword ? "text" : "password") : type}
					placeholder={placeholder}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none"
				/>
				{showToggle && (
					<button
						type="button"
						onClick={onToggle}
						className="pr-3 text-gray-400 transition-colors hover:text-gray-600">
						{showPassword ? (
							<AiOutlineEyeInvisible size={18} />
						) : (
							<AiOutlineEye size={18} />
						)}
					</button>
				)}
			</div>
			{error && <p className="mt-1 text-xs text-(--red-1)">{error}</p>}
		</div>
	)
}

export function MultiFileInvoicePickerField({
	label,
	hint,
	files,
	onFilesChange,
	error,
}: {
	label: string
	hint?: string
	files: File[] | null
	onFilesChange: (files: File[]) => void
	error?: string
}) {
	const inputRef = useRef<HTMLInputElement>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (files) {
			const picked: File[] = Array.from(e.target.files ?? [])
			const merged: File[] = [
				...files,
				...picked.filter((p) => !files.some((f) => f.name === p.name)),
			]
			onFilesChange(merged)
			e.target.value = ""
		}
	}

	const removeFile = (fileName: string) => {
		if (files) onFilesChange(files.filter((f) => f.name !== fileName))
	}

	return (
		<div>
			<p className="text-foreground block text-sm font-medium">
				{label}
				{hint && <span className="font-normal text-(--text-1)"> ({hint})</span>}
			</p>

			<input
				title="file-picker"
				ref={inputRef}
				type="file"
				accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
				multiple
				className="hidden"
				onChange={handleFileChange}
			/>

			<div
				onClick={() => inputRef.current?.click()}
				className="cursor-pointer rounded-lg border-2 border-dashed border-(--grey-1) bg-(--grey-4) p-4 text-center transition hover:border-(--grey-2)">
				<span className="text-[14px] text-(--text-1)">+ &nbsp;Choose file</span>
			</div>

			{files && files.length > 0 && (
				<div className="mt-2 grid grid-cols-3 gap-2">
					{files.map((file, idx) => (
						<div
							key={idx}
							className="group flex h-10 w-full items-center gap-2 rounded-2xl border border-(--grey-1) px-2 py-1">
							{getFileIcon(file, false)}

							<span className="min-w-0 flex-1 truncate text-[12px] text-(--text-1)">
								{file.name}
							</span>

							<button
								title="Remove file"
								type="button"
								onClick={(e) => {
									e.stopPropagation()
									removeFile(file.name)
								}}
								className={[
									"flex h-5.5 w-5.5 shrink-0 cursor-pointer items-center justify-center",
									"rounded-full border border-[#FFC2C2] bg-[#FFF0F0]",
									"opacity-0 transition-opacity group-hover:opacity-100",
									"[@media(hover:none)]:opacity-100",
								].join(" ")}>
								<FaRegTrashAlt className="h-2.5 w-2.5 text-(--red-1)" />
							</button>
						</div>
					))}
				</div>
			)}

			{error && <p className="mt-1 text-sm text-(--red-1)">{error}</p>}
		</div>
	)
}
