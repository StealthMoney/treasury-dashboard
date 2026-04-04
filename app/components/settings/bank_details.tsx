"use client"

import { useState } from "react"
import { KYBStepWrapper } from "../reusables/kybstepwraper"
import { SelectField, TextField } from "../reusables/general_inputs"
import { AiOutlineEdit, AiOutlinePlus } from "react-icons/ai"

interface BankDetail {
	bankName: string
	accountNumber: string
	accountName: string
}

interface BankDetailErrors {
	bankName?: string
	accountNumber?: string
	accountName?: string
}

const BANK_OPTIONS = [
	{ value: "access", label: "Access Bank" },
	{ value: "gtb", label: "Guaranty Trust Bank" },
	{ value: "zenith", label: "Zenith Bank" },
	{ value: "first_bank", label: "First Bank of Nigeria" },
	{ value: "uba", label: "United Bank for Africa" },
	{ value: "stanbic", label: "Stanbic IBTC Bank" },
	{ value: "sterling", label: "Sterling Bank" },
	{ value: "union", label: "Union Bank" },
	{ value: "wema", label: "Wema Bank" },
	{ value: "fidelity", label: "Fidelity Bank" },
	{ value: "polaris", label: "Polaris Bank" },
	{ value: "keystone", label: "Keystone Bank" },
]

const EMPTY_BANK_DETAIL: BankDetail = {
	bankName: "",
	accountNumber: "",
	accountName: "",
}

function BankDetailForm({
	data,
	errors,
	onChange,
	disabled,
	idPrefix = "",
}: {
	data: BankDetail
	errors: BankDetailErrors
	onChange: (field: keyof BankDetail, value: string) => void
	disabled: boolean
	idPrefix?: string
}) {
	return (
		<div
			className={`space-y-4 ${disabled ? "pointer-events-none opacity-50" : ""}`}>
			<SelectField
				label=""
				id={`${idPrefix}bankName`}
				value={data.bankName}
				onChange={(v) => onChange("bankName", v)}
				options={BANK_OPTIONS}
				placeholder="Bank Name*"
				error={errors.bankName}
				disabled={disabled}
			/>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<TextField
					label=""
					id={`${idPrefix}accountNumber`}
					placeholder="Account Number*"
					value={data.accountNumber}
					onChange={(v) => onChange("accountNumber", v)}
					error={errors.accountNumber}
					disabled={disabled}
				/>
				<TextField
					label=""
					id={`${idPrefix}accountName`}
					placeholder="Account Name*"
					value={data.accountName}
					onChange={(v) => onChange("accountName", v)}
					error={errors.accountName}
					disabled={disabled}
				/>
			</div>
		</div>
	)
}

function validateBankDetail(data: BankDetail): BankDetailErrors {
	const errors: BankDetailErrors = {}

	if (!data.bankName) errors.bankName = "Bank name is required"

	if (!data.accountNumber.trim()) {
		errors.accountNumber = "Account number is required"
	} else if (!/^\d{10}$/.test(data.accountNumber.trim())) {
		errors.accountNumber = "Account number must be exactly 10 digits"
	}

	if (!data.accountName.trim()) {
		errors.accountName = "Account name is required"
	}

	return errors
}

export function BankAccountDetailTab() {
	const [bankDetails, setBankDetails] = useState<BankDetail[]>([
		{ ...EMPTY_BANK_DETAIL },
	])

	const [errors, setErrors] = useState<BankDetailErrors[]>([{}])
	const [isEditing, setIsEditing] = useState(false)
	const [isSaving, setIsSaving] = useState(false)

	const handleEditToggle = () => {
		if (isEditing) setErrors([{}])
		setIsEditing((prev) => !prev)
	}

	const handleChange = (
		index: number,
		field: keyof BankDetail,
		value: string
	) => {
		const updated = [...bankDetails]
		updated[index][field] = value
		setBankDetails(updated)

		if (errors[index]?.[field]) {
			const updatedErrors = [...errors]
			updatedErrors[index][field] = undefined
			setErrors(updatedErrors)
		}
	}

	const handleAdd = () => {
		setBankDetails((prev) => [...prev, { ...EMPTY_BANK_DETAIL }])
		setErrors((prev) => [...prev, {}])
	}

	const handleRemove = (index: number) => {
		if (index === 0) return

		setBankDetails((prev) => prev.filter((_, i) => i !== index))
		setErrors((prev) => prev.filter((_, i) => i !== index))
	}

	const handleSave = async () => {
		const validationErrors = bankDetails.map(validateBankDetail)
		setErrors(validationErrors)

		const hasErrors = validationErrors.some((err) => Object.keys(err).length > 0)
		if (hasErrors) return

		setIsSaving(true)
		try {
			await new Promise((res) => setTimeout(res, 800))
			setIsEditing(false)
		} catch (err) {
			console.error(err)
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<KYBStepWrapper title="Bank Account Detail">
			<div className="space-y-8">
				<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
					<h2 className="text-foreground text-xl font-semibold md:text-[20px]">
						Business Payout Details {bankDetails.length > 1 ? "1" : ""}
					</h2>

					<div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
						<button
							onClick={handleEditToggle}
							className="order-2 flex items-center justify-center gap-1.5 rounded-lg border border-(--grey-1) px-4 py-2 text-sm font-medium transition-colors hover:bg-(--grey-4) sm:order-1">
							<AiOutlineEdit className="h-4 w-4" />
							<span className="hidden sm:inline">
								{isEditing ? "Cancel" : "Edit Details"}
							</span>
							<span className="sm:hidden">{isEditing ? "Cancel" : "Edit"}</span>
						</button>

						<button
							onClick={handleAdd}
							className="bg-foreground text-background order-1 flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 sm:order-2">
							<AiOutlinePlus className="h-4 w-4" />
							<span className="sm:inline">Add Bank Details</span>
						</button>
					</div>
				</div>

				{bankDetails.map((detail, index) => (
					<div key={index} className="space-y-6">
						{index !== 0 && (
							<div className="flex items-center justify-between gap-4">
								<h2 className="text-foreground text-xl font-semibold md:text-[20px]">
									Business Payout Details {index + 1}
								</h2>
								<button
									onClick={() => handleRemove(index)}
									className="cursor-pointer text-sm whitespace-nowrap text-(--text-2) transition-colors">
									Remove
								</button>
							</div>
						)}

						<BankDetailForm
							data={detail}
							errors={errors[index] || {}}
							onChange={(field, value) => handleChange(index, field, value)}
							disabled={!isEditing}
							idPrefix={`bank-${index}-`}
						/>
					</div>
				))}

				{isEditing && (
					<div className="mt-8 flex justify-center px-2">
						<button
							onClick={handleSave}
							disabled={isSaving}
							className="bg-foreground text-background w-full rounded-lg py-3 font-medium transition-colors disabled:opacity-60 md:max-w-md">
							{isSaving ? "Saving..." : "Save Changes"}
						</button>
					</div>
				)}

				{!isEditing && (
					<div className="flex justify-center px-2 pt-4">
						<button
							disabled
							className="bg-foreground text-background w-full cursor-not-allowed rounded-lg py-3 font-medium opacity-60 md:max-w-md">
							Save Changes
						</button>
					</div>
				)}
			</div>
		</KYBStepWrapper>
	)
}
