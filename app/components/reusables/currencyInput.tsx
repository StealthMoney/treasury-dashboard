"use client"
interface CurrencyInputProps {
	value: string
	onChange: (value: string) => void
	currency: "NGN" | "USD"
	onCurrencyChange: (currency: "NGN" | "USD") => void
	placeholder?: string
	label?: string
	description?: string
	message?: string
	assetName?: string
	balance?: number
	showmax: boolean
	error?: string
	disabled?: boolean
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
	value,
	onChange,
	currency,
	onCurrencyChange,
	placeholder = "Amount to purchase",
	label,
	description,
	message,
	assetName = false,
	balance,
	showmax = false,
	error,
	disabled,
}) => {
	const formatDisplay = (raw: string) => {
		const digits = raw.replace(/\D/g, "")
		if (!digits) return ""
		return Number(digits).toLocaleString("en-US")
	}

	const stripCommas = (formatted: string) => formatted.replace(/,/g, "")

	const displayValue = formatDisplay(value)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = stripCommas(e.target.value)
		if (raw && !/^\d+$/.test(raw)) return

		onChange(raw)
	}

	return (
		<div className="space-y-4">
			{label && (
				<label className="text-foreground text-sm font-medium">{label}</label>
			)}
			<div className="flex">
				<input
					disabled={disabled}
					type="text"
					inputMode="numeric"
					value={displayValue}
					onChange={handleChange}
					placeholder={placeholder}
					className="flex-1 rounded-tl-lg rounded-bl-lg border border-(--grey-1) bg-(--grey-4) px-4 py-3 text-(--text-1) focus:outline-none"
				/>
				<select
					title="currency"
					value={currency}
					onChange={(e) => onCurrencyChange(e.target.value as "NGN" | "USD")}
					className="bg-background cursor-pointer rounded-tr-lg rounded-br-lg border border-(--grey-1) px-4 py-3 font-medium focus:outline-none">
					<option value="NGN">NGN</option>
					{/* <option value="USD">USD</option> */}
				</select>
			</div>
			{error && <p className="mt-1 text-sm text-(--red-1)">{error}</p>}

			<div className="flex items-center justify-between">
				<p className="text-sm text-(--text-1)">
					{description}{" "}
					<span className="text-foreground font-semibold">
						{balance?.toLocaleString("en-US", {
							maximumFractionDigits: 2,
						})}{" "}
					</span>
					{assetName && <span className="ml-2">{assetName}</span>}
					{message && (
						<span className="text-foreground font-semibold">{message}</span>
					)}
				</p>

				{showmax && (
					<button className="text-foreground px-3 py-1 text-xs font-medium">
						Max
					</button>
				)}
			</div>
		</div>
	)
}
