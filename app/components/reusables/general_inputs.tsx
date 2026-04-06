"use client"

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import React, { useState, ChangeEvent, useRef } from "react"
import { HiX } from "react-icons/hi"

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
}: {
	label: string | React.ReactNode
	id: string
	value: string
	onChange: (v: string) => void
	options: SelectOption[]
	placeholder: string
	error?: string
	disabled?: boolean
}) {
	return (
		<div className="space-y-1.5">
			<label htmlFor={id} className="block text-sm font-medium text-(--text-1)">
				{label}
			</label>
			<div
				className={`relative rounded-lg border bg-(--grey-4) transition-all ${error ? "border-(--red-1)" : "border-(--grey-1) focus-within:border-(--grey-1)"} ${disabled ? "opacity-50" : ""}`}>
				<select
					id={id}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					disabled={disabled}
					className="w-full cursor-pointer appearance-none bg-transparent px-3 py-2.5 text-sm text-(--text-1) outline-none">
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
				<div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-(--text-1)">
					<svg width="12" height="8" viewBox="0 0 12 8" fill="none">
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

// export function TextField({
//   label,
//   id,
//   placeholder,
//   value,
//   onChange,
//   error,
//   prefix,
// }: {
//   label: string;
//   id: string;
//   placeholder?: string;
//   value: string;
//   onChange: (v: string) => void;
//   error?: string;
//   prefix?: string;
// }) {
//   return (
//     <div className="space-y-1.5">
//       <label htmlFor={id} className="block text-sm font-medium text-(--text-1)">
//         {label}
//       </label>
//       <div
//         className={`flex items-center border rounded-lg bg-(--grey-4) transition-all ${error ? "border-(--red-1) focus-within:border-(--red-1)" : "border-(--grey-1) focus-within:border-(--grey-1)"}`}
//       >
//         {prefix && (
//           <span className="pl-3 pr-2 text-(--text-1) text-[14px] select-none border bg-background border-(--grey-1) py-2.5">
//             {prefix}
//           </span>
//         )}
//         <input
//           id={id}
//           type="text"
//           placeholder={placeholder}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           className="flex-1 px-3 py-2.5 bg-transparent text-[14px] text-foreground placeholder-(--text-1) outline-none"
//         />
//       </div>
//       {error && <p className="text-xs text-(--red-1)">{error}</p>}
//     </div>
//   );
// }

interface TextFieldProps {
	label: string
	id: string
	placeholder?: string
	value: string
	onChange: (v: string) => void
	error?: string
	prefix?: string
	type?: string
	disabled?: boolean
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
}: TextFieldProps) {
	return (
		<div className="space-y-1.5">
			<label htmlFor={id} className="text-foreground block text-sm font-medium">
				{label}
			</label>
			<div
				className={`flex items-center rounded-lg border bg-(--grey-4) transition-all ${error ? "border-(--red-1) focus-within:border-(--red-1)" : "border-(--grey-1) focus-within:border-(--grey-1)"}`}>
				{prefix && (
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
					className="text-foreground flex-1 bg-transparent px-3 py-2.5 text-[14px] placeholder-(--text-1) outline-none"
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
