"use client"

import { useState } from "react"
import { KYBStepWrapper } from "../reusables/kybstepwraper"
import { SelectField, TextField } from "../reusables/general_inputs"
import PageSkeleton from "../reusables/page_skeleton"
import { useProfile } from "@/app/contexts/user_provider"
import { usePathname } from "next/navigation"

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
			<TextField
				label=""
				id={`${idPrefix}bankNumber`}
				placeholder="Bank Name"
				value={data.bankName}
				onChange={(v) => onChange("bankName", v)}
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

export function BankAccountDetailTab() {
	const { user, loading } = useProfile()
	const [bankDetails, setBankDetails] = useState<BankDetail>({
		bankName: user?.bankDetails?.bankName || "",
		accountNumber: user?.bankDetails?.accountNumber || "",
		accountName: user?.bankDetails?.accountName || "",
	})

	const path = usePathname()
	const disabled = !path.includes("admin")

	const [errors] = useState<BankDetailErrors>({})

	const handleChange = (field: keyof BankDetail, value: string) => {
		setBankDetails((prev) => ({
			...prev,
			[field]: value,
		}))
	}

	if (loading) {
		return (
			<div className="bg-background min-h-screen w-full px-6">
				<div className="w-full overflow-x-auto md:max-w-[80%]">
					<PageSkeleton />
				</div>
			</div>
		)
	}

	return (
		<KYBStepWrapper title="Bank Account Detail">
			<div className="space-y-8">
				<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
					<h2 className="text-foreground text-xl font-semibold md:text-[20px]">
						Business Payout Details
					</h2>
				</div>

				<div className="space-y-6">
					<BankDetailForm
						data={bankDetails}
						errors={errors}
						onChange={(field, value) => handleChange(field, value)}
						disabled={true}
						idPrefix="bank-"
					/>
				</div>
				{!disabled && (
					<div className="flex justify-center pt-4">
						<button
							// onClick={handleSave}
							className="rounded-lg bg-black px-8 py-3 font-medium text-white transition-colors hover:bg-black/90">
							Save Changes
						</button>
					</div>
				)}
			</div>
		</KYBStepWrapper>
	)
}
