"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { HiPlus, HiX } from "react-icons/hi"
import { KYBStepWrapper } from "../components/reusables/kybstepwraper"
import {
	baseButtonBlack,
	baseButtonWhite,
	baseInput,
	baseSelect,
	splitLeft,
	splitRight,
} from "../components/reusables/classes"
import { FaArrowLeft } from "react-icons/fa"
import { FilePickerField } from "../components/reusables/general_inputs"
import { uploadKybDoc } from "../server/upgrade_account"
import { Spinner } from "../components/reusables/spinner"
import { fileToBase64 } from "../functions/helpers/base64"
import { useProfile } from "../contexts/user_provider"
import { useBanklists, useBankverify } from "../hooks/use_bank_list"
import { Banklist } from "../types/general"
import { FeedbackModal } from "../components/reusables/feedback_modal"
import Image from "next/image"
import { KYBReviewScreens } from "../components/reusables/kybreview"

interface OwnerInfo {
	id: string
	firstName: string
	lastName: string
	email: string
	phoneNumber: string
	dayOfBirth: string
	monthOfBirth: string
	yearOfBirth: string
	idDoc1: string
	idNumber1: string
	idUpload: File | null
	homeState: string
	homeCity: string
	homePostalCode: string
	homeStreet: string
	homeProofUpload: File | null
	bvn: string
}

interface KYBFormData {
	// Step 1
	companyName: string
	businessDescription: string
	staffSize: string
	annualSalesVolume: string
	annualSalesVolumeCurrency: string
	industry: string
	businessType: string
	cacNumber: string

	// Step 2
	businessEmail: string
	supportEmail: string
	disputeEmail: string
	phoneNumber: string
	phoneNumberCountry: string
	website: string
	linkedin: string
	twitter: string
	instagram: string

	// Step 3
	officeCountry: string
	officeState: string
	officeCity: string
	officePostalCode: string
	officeStreet: string

	// Step 4 - Now an array of owners
	owners: OwnerInfo[]

	// Step 5
	incorporationDoc: File | null
	taxFilingDoc: File | null
	registrationStatus: File | null
	mouDoc: File | null
	boardRegisterDoc: File | null
	proofOfAddressDoc: File | null
	supportingDoc: File[]

	// Step 6
	bankName: string
	accountNumber: string
	accountName: string
}

const initialFormData: KYBFormData = {
	companyName: "",
	businessDescription: "",
	staffSize: "",
	annualSalesVolume: "",
	annualSalesVolumeCurrency: "NGN",
	industry: "",
	businessType: "",
	cacNumber: "",
	businessEmail: "",
	supportEmail: "",
	disputeEmail: "",
	phoneNumber: "",
	phoneNumberCountry: "NGN",
	website: "",
	linkedin: "",
	twitter: "",
	instagram: "",
	officeCountry: "",
	officeState: "",
	officeCity: "",
	officePostalCode: "",
	officeStreet: "",
	owners: [
		{
			id: crypto.randomUUID?.() || Date.now().toString(),
			firstName: "",
			lastName: "",
			email: "",
			phoneNumber: "",
			dayOfBirth: "",
			monthOfBirth: "",
			yearOfBirth: "",
			idDoc1: "",
			idNumber1: "",
			idUpload: null,
			homeState: "",
			homeCity: "",
			homePostalCode: "",
			homeStreet: "",
			homeProofUpload: null,
			bvn: "",
		},
	],
	incorporationDoc: null,
	taxFilingDoc: null,
	registrationStatus: null,
	mouDoc: null,
	boardRegisterDoc: null,
	proofOfAddressDoc: null,
	supportingDoc: [],
	bankName: "",
	accountNumber: "",
	accountName: "",
}

interface KYBScreensProps {
	onClose: () => void
	onComplete: () => void
}

// Multi-file picker with individual file removal
function MultiFilePickerField({
	label,
	files,
	onFilesChange,
	error,
}: {
	label: string
	files: File[]
	onFilesChange: (files: File[]) => void
	error?: string
}) {
	const inputRef = useRef<HTMLInputElement>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const picked: File[] = Array.from(e.target.files ?? [])
		const merged: File[] = [
			...files,
			...picked.filter((p) => !files.some((f) => f.name === p.name)),
		]
		onFilesChange(merged)
		e.target.value = ""
	}

	const removeFile = (fileName: string) => {
		onFilesChange(files.filter((f) => f.name !== fileName))
	}

	return (
		<div>
			<p className="mb-2 text-[14px] text-(--text-1)" aria-label={label}>
				{label}
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
				<p className="text-[14px] text-(--text-1)">+ Choose file(s)</p>
			</div>
			{files.length > 0 && (
				<div className="mt-2 space-y-2">
					{files.map((file, idx) => (
						<div
							key={idx}
							className="flex items-center justify-between rounded-lg bg-(--grey-4) p-2">
							<p className="text-foreground flex-1 truncate text-[12px]">
								📎 {file.name}
							</p>
							<button
								title="upload"
								onClick={(e) => {
									e.stopPropagation()
									removeFile(file.name)
								}}
								className="rounded-full p-1 transition hover:bg-(--grey-3)"
								type="button">
								<HiX className="h-4 w-4 text-(--red-1)" />
							</button>
						</div>
					))}
				</div>
			)}
			{error && <p className="mt-1 text-sm text-(--red-1)">{error}</p>}
		</div>
	)
}

// ─── email format helper ───────────────────────────────────────────────────────
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

// ─── phone format helper (must start with + and have country code digits) ─────
// e.g. +2348012345678  or  +14155551234
const isValidPhone = (v: string) => /^\+\d{7,15}$/.test(v.replace(/\s/g, ""))

// ─── website format helper ────────────────────────────────────────────────────
const isValidWebsite = (v: string) =>
	/^(https?:\/\/)?([\w-]+\.)+[\w]{2,}(\/.*)?$/.test(v)

// ─── account number: digits only, 10 chars (Nigerian standard) ────────────────
const isValidAccountNumber = (v: string) => /^\d{10}$/.test(v)

export function KYBScreens({ onClose, onComplete }: KYBScreensProps) {
	const [currentStep, setCurrentStep] = useState(1)
	const [formData, setFormData] = useState<KYBFormData>(initialFormData)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [loading, setLoading] = useState(false)
	const [chosenBankCode, setChosenBankCode] = useState<Banklist | null>(null)
	const [enabled, setEnabled] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const [isReviewMode, setIsReviewMode] = useState(false)
	const [reviewStep, setReviewStep] = useState(1)
	const { user } = useProfile()

	const { data: banklists } = useBanklists()
	const { data: verifyInfo, refetch } = useBankverify(
		enabled,
		setEnabled,
		formData.accountNumber,
		chosenBankCode?.nipBankCode || ""
	)

	const updateFormData = useCallback((updates: Partial<KYBFormData>) => {
		setFormData((prev) => ({ ...prev, ...updates }))
		setErrors((prev) => {
			const newErrors = { ...prev }
			Object.keys(updates).forEach((key) => delete newErrors[key])
			return newErrors
		})
	}, [])

	// Update specific owner field
	const updateOwner = useCallback(
		(ownerId: string, updates: Partial<OwnerInfo>) => {
			setFormData((prev) => ({
				...prev,
				owners: prev.owners.map((owner) =>
					owner.id === ownerId ? { ...owner, ...updates } : owner
				),
			}))
			// Clear errors for this owner's fields
			setErrors((prev) => {
				const newErrors = { ...prev }
				Object.keys(updates).forEach((key) => {
					delete newErrors[`owner_${ownerId}_${key}`]
				})
				return newErrors
			})
		},
		[]
	)

	const addOwner = useCallback(() => {
		const newOwner: OwnerInfo = {
			id: crypto.randomUUID?.() || Date.now().toString(),
			firstName: "",
			lastName: "",
			email: "",
			phoneNumber: "",
			dayOfBirth: "",
			monthOfBirth: "",
			yearOfBirth: "",
			idDoc1: "",
			idNumber1: "",
			idUpload: null,
			homeState: "",
			homeCity: "",
			homePostalCode: "",
			homeStreet: "",
			homeProofUpload: null,
			bvn: "",
		}
		setFormData((prev) => ({
			...prev,
			owners: [newOwner, ...prev.owners], // Add new owner at the top
		}))
	}, [])

	// Cache on mount/unmount
	useEffect(() => {
		return () => setFormData(initialFormData)
	}, [])

	const validateStep = (step: number) => {
		const newErrors: Record<string, string> = {}

		switch (step) {
			case 1:
				if (!formData.companyName)
					newErrors.companyName = "Company Name is required"
				if (!formData.businessDescription)
					newErrors.businessDescription = "Business Description is required"
				if (!formData.staffSize) newErrors.staffSize = "Staff Size is required"
				if (!formData.annualSalesVolume)
					newErrors.annualSalesVolume = "Annual Projected Sales Volume is required"
				else if (
					isNaN(Number(formData.annualSalesVolume)) ||
					Number(formData.annualSalesVolume) <= 0
				)
					newErrors.annualSalesVolume =
						"Enter a valid positive number (e.g. 5000000)"
				if (!formData.industry) newErrors.industry = "Industry is required"
				if (!formData.businessType)
					newErrors.businessType = "Business Type is required"
				if (!formData.cacNumber) newErrors.cacNumber = "CAC number is required"
				else if (!/^rc\d+$/i.test(formData.cacNumber))
					newErrors.cacNumber = "CAC number must start with RC (e.g. RC1234567)"
				else if (!/^rc\d{6,}$/i.test(formData.cacNumber)) {
					newErrors.cacNumber = "CAC format invalid" // at least 6digits after rc
				}
				break

			case 2:
				if (!formData.businessEmail)
					newErrors.businessEmail = "Business Email is required"
				else if (!isValidEmail(formData.businessEmail))
					newErrors.businessEmail = "Enter a valid email (e.g. info@company.com)"

				if (!formData.phoneNumber)
					newErrors.phoneNumber = "Phone Number is required"
				else if (!isValidPhone(formData.phoneNumber))
					newErrors.phoneNumber = "Include country code (e.g. +2348012345678)"

				if (!formData.website) newErrors.website = "Website is required"
				else if (!isValidWebsite(formData.website))
					newErrors.website = "Enter a valid URL (e.g. https://company.com)"

				// optional socials – validate format only if provided
				if (formData.linkedin && !isValidWebsite(formData.linkedin))
					newErrors.linkedin =
						"Enter a valid LinkedIn URL (e.g. https://linkedin.com/company/name)"
				if (formData.twitter && !isValidWebsite(formData.twitter))
					newErrors.twitter =
						"Enter a valid Twitter URL (e.g. https://twitter.com/handle)"
				if (formData.instagram && !isValidWebsite(formData.instagram))
					newErrors.instagram =
						"Enter a valid Instagram URL (e.g. https://instagram.com/handle)"
				break

			case 3:
				if (!formData.officeCountry) newErrors.officeCountry = "Country is required"
				if (!formData.officeState)
					newErrors.officeState = "State or Region is required"
				if (!formData.officeCity) newErrors.officeCity = "City is required"
				if (!formData.officePostalCode)
					newErrors.officePostalCode = "Postal Code is required"
				else if (!/^\d{5,10}$/.test(formData.officePostalCode))
					newErrors.officePostalCode = "Enter a valid postal code (e.g. 100001)"
				if (!formData.officeStreet)
					newErrors.officeStreet = "Street Address is required"
				break

			case 4:
				formData.owners.forEach((owner) => {
					if (!owner.firstName)
						newErrors[`owner_${owner.id}_firstName`] = "First Name is required"
					if (!owner.lastName)
						newErrors[`owner_${owner.id}_lastName`] = "Last Name is required"
					if (!owner.email)
						newErrors[`owner_${owner.id}_email`] = "Email is required"
					else if (!isValidEmail(owner.email))
						newErrors[`owner_${owner.id}_email`] =
							"Enter a valid email (e.g. info@company.com)"

					if (!owner.phoneNumber)
						newErrors[`owner_${owner.id}_phoneNumber`] = "Phone Number is required"
					else if (!/^\+\d{7,15}$/.test(owner.phoneNumber))
						newErrors[`owner_${owner.id}_phoneNumber`] =
							"Include country code (e.g. +2348012345678)"

					if (!owner.bvn) newErrors[`owner_${owner.id}_bvn`] = "BVN is required"
					else if (isNaN(Number(owner.bvn)) || owner.bvn.length !== 11)
						newErrors[`owner_${owner.id}_bvn`] =
							"Enter a valid 11-digit BVN (e.g. 12345678901)"

					if (!owner.dayOfBirth)
						newErrors[`owner_${owner.id}_dayOfBirth`] = "Day of Birth is required"
					if (!owner.monthOfBirth)
						newErrors[`owner_${owner.id}_monthOfBirth`] = "Month of Birth is required"
					if (!owner.yearOfBirth)
						newErrors[`owner_${owner.id}_yearOfBirth`] = "Year of Birth is required"
					if (!owner.idDoc1)
						newErrors[`owner_${owner.id}_idDoc1`] =
							"Identification Document is required"
					if (!owner.idNumber1)
						newErrors[`owner_${owner.id}_idNumber1`] =
							"Identification Number is required"
					if (!owner.idUpload)
						newErrors[`owner_${owner.id}_idUpload`] =
							"Identification Document Upload is required"
					if (!owner.homeState)
						newErrors[`owner_${owner.id}_homeState`] = "State or Region is required"
					if (!owner.homeCity)
						newErrors[`owner_${owner.id}_homeCity`] = "City is required"
					if (!owner.homePostalCode)
						newErrors[`owner_${owner.id}_homePostalCode`] = "Postal Code is required"
					if (!owner.homeStreet)
						newErrors[`owner_${owner.id}_homeStreet`] = "Street Address is required"
					if (!owner.homeProofUpload)
						newErrors[`owner_${owner.id}_homeProofUpload`] =
							"Proof of Address Upload is required"
				})
				break

			case 5:
				// Required docs (marked with *)
				if (!formData.incorporationDoc)
					newErrors.incorporationDoc = "Certification of Incorporation is required"
				if (!formData.registrationStatus)
					newErrors.registrationStatus = "Status of Registration is required"
				if (!formData.mouDoc)
					newErrors.mouDoc = "Memorandum of Understanding is required"
				if (!formData.boardRegisterDoc)
					newErrors.boardRegisterDoc = "Register of Board of Directors is required"
				if (!formData.proofOfAddressDoc)
					newErrors.proofOfAddressDoc = "Proof of Address is required"
				if (!formData.taxFilingDoc)
					newErrors.taxFilingDoc = "Tax Document is required"
				break

			case 6:
				if (!formData.bankName) newErrors.bankName = "Bank Name is required"
				if (!formData.accountNumber)
					newErrors.accountNumber = "Account Number is required"
				else if (!isValidAccountNumber(formData.accountNumber))
					newErrors.accountNumber =
						"Enter a valid 10-digit account number (e.g. 0123456789)"
				if (!formData.accountName)
					newErrors.accountName = "Account Name is required"
				else if (
					!verifyInfo ||
					verifyInfo?.responseCode !== "000" ||
					!verifyInfo?.successful
				)
					newErrors.accountName = "Could not validate given bank details"
				break

			default:
				break
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleNext = () => {
		if (validateStep(currentStep)) {
			// After step 6 is completed, enter review mode
			if (currentStep === 6) {
				setIsReviewMode(true)
				setReviewStep(1)
			} else {
				setCurrentStep(currentStep + 1)
			}
		}
	}

	const handlePrevious = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1))
	}

	const handleClose = () => {
		setCurrentStep(1)
		setFormData(initialFormData)
		onClose()
	}

	const mapDocType = (value: string): string => {
		switch (value) {
			case "Passport":
				return "PASSPORT"
			case "Driver License":
				return "DRIVER_LICENSE"
			case "National ID":
				return "NATIONAL_ID"
			case "Proof of Address":
				return "PROOF_OF_ADDRESS"
			case "Bank Statement":
				return "BANK_STATEMENT"
			case "Invoice":
				return "INVOICE"
			default:
				return "OTHER"
		}
	}

	type DocPayload = {
		fileBase64: string
		fileName: string
		contentType: string
		identificationNumber: string
		otherDocumentDescription?: string
		documentType: string
	}

	const toDoc = async (file: File, typeValue: string, idNumber = "") => {
		const documentType = mapDocType(typeValue)

		const base: DocPayload = {
			fileBase64: await fileToBase64(file),
			fileName: file.name,
			contentType: file.type,
			identificationNumber: idNumber,
			documentType,
		}

		// ONLY include this for OTHER
		if (documentType === "OTHER") {
			base.otherDocumentDescription = file.name
		}

		return base
	}

	const handleSubmit = async () => {
		if (!validateStep(currentStep)) return

		try {
			setLoading(true)

			const companyDocuments = await Promise.all(
				[
					formData.incorporationDoc && toDoc(formData.incorporationDoc, "OTHER"),

					formData.taxFilingDoc && toDoc(formData.taxFilingDoc, "INVOICE"),

					formData.registrationStatus && toDoc(formData.registrationStatus, "OTHER"),

					formData.mouDoc && toDoc(formData.mouDoc, "OTHER"),

					formData.boardRegisterDoc && toDoc(formData.boardRegisterDoc, "OTHER"),

					formData.proofOfAddressDoc &&
						toDoc(formData.proofOfAddressDoc, "PROOF_OF_ADDRESS"),

					...formData.supportingDoc.map((file) => toDoc(file, "OTHER")),
				].filter(Boolean) as Promise<DocPayload>[]
			)

			const businessDirectors = await Promise.all(
				formData.owners.map(async (owner) => {
					const dob = `${owner.yearOfBirth}-${String(owner.monthOfBirth).padStart(
						2,
						"0"
					)}-${String(owner.dayOfBirth).padStart(2, "0")}`

					return {
						firstName: owner.firstName,
						lastName: owner.lastName,
						email: owner.email,
						phoneNumber: owner.phoneNumber,
						dob,
						bvn: owner.bvn,
						addressLine1: owner.homeStreet,
						addressLine2: owner.homeState,
						city: owner.homeCity,
						state: owner.homeState,
						country: formData.officeCountry || "Nigeria",
						postalCode: owner.homePostalCode,

						...(owner.idUpload &&
							owner.idDoc1 && {
								passportDocument: await toDoc(
									owner.idUpload,
									owner.idDoc1,
									owner.idNumber1
								),
							}),

						...(owner.homeProofUpload && {
							proofOfAddressDocument: await toDoc(
								owner.homeProofUpload,
								"Proof of Address"
							),
						}),

						role: "DIRECTOR",
						ownershipPercentage: 0,
						isPep: false,
					}
				})
			)

			const payload = {
				businessName: formData.companyName,
				businessDescription: formData.businessDescription,
				staffSize: formData.staffSize,
				industry: formData.industry,
				annualRevenue: Number(formData.annualSalesVolume) || 0,
				annualRevenueCurrency: formData.annualSalesVolumeCurrency,
				cacNumber: formData.cacNumber,
				website: formData.website,
				linkedIn: formData.linkedin,
				twitter: formData.twitter,
				instagram: formData.instagram,
				phoneNumber: formData.phoneNumber,
				email: formData.businessEmail,
				disputeEmail: formData.disputeEmail,
				supportEmail: formData.supportEmail,
				businessType: formData.businessType,
				addressLine1: formData.officeStreet,
				addressLine2: "N/A",
				city: formData.officeCity,
				state: formData.officeState,
				country: formData.officeCountry,
				postalCode: formData.officePostalCode,
				businessDirectors,
				companyDocuments,
				bankDetail: {
					bankName: formData.bankName,
					accountNumber: formData.accountNumber,
					accountName: formData.accountName,
				},
			}

			const result = await uploadKybDoc(JSON.stringify(payload))

			if (result.success) {
				setCurrentStep(1)
				setFormData(initialFormData)
				localStorage.removeItem("profile_cache")
				onComplete()
			} else {
				setSubmitError(result.error || "Failed to submit KYB documents.")
			}
		} catch (err) {
			console.error("KYB submission failed:", err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		const chosen = banklists?.data?.find((item: Banklist) => {
			if (item.bankName === formData.bankName) {
				return item.nipBankCode
			}
		})
		setChosenBankCode(chosen)
	}, [formData.bankName, banklists])

	useEffect(() => {
		if (user?.kybStatus === "ACTIVE" || user?.kybStatus === "PENDING_REVIEW") {
			setEnabled(false)
			return
		} else if (!formData.bankName || formData.bankName === "") {
			setEnabled(false)
			return
		} else {
			setEnabled(true)
		}
	}, [formData.bankName, user?.kybStatus])

	useEffect(() => {
		if (formData.bankName !== "" && formData.accountNumber !== "") {
			refetch()
		}
	}, [formData.bankName, formData.accountName, formData.accountNumber, refetch])

	useEffect(() => {
		updateFormData({ accountName: verifyInfo?.data?.accountName })
	}, [verifyInfo?.data, updateFormData])

	if (isReviewMode) {
		return (
			<KYBReviewScreens
				formData={formData}
				onBack={() => {
					setIsReviewMode(false)
					setCurrentStep(6)
				}}
				onEditStep={(step: number) => {
					setIsReviewMode(false)
					setCurrentStep(step)
				}}
				onComplete={handleSubmit}
			/>
		)
	}

	return (
		<div className="bg-background min-h-screen w-full px-6 py-8 md:max-w-[80%]">
			{/* Header with Back Button */}
			<button
				onClick={(e) => {
					e.stopPropagation()

					if (currentStep > 1) {
						handlePrevious()
					} else {
						handleClose()
					}
				}}
				className="text-foreground hover:text-foreground/85 mb-6 flex cursor-pointer items-center gap-2 text-[16px] transition">
				<FaArrowLeft className="bg-background h-8 w-8 rounded-lg border border-(--grey-1)" />
				Go Back
			</button>

			<div className="mx-auto">
				<div className="mb-8">
					<h1 className="text-foreground mb-2 text-[20px] font-bold">
						Complete KYB
					</h1>
					<p className="text-[14px] text-(--text-1)">
						Submit your business details and documents to meet regulatory
						requirements.
					</p>
				</div>

				{/* Step Indicator */}
				<div className="mb-8 flex items-center justify-center text-center">
					<div className="h-full w-[42%] border-t border-t-(--grey-1)"></div>
					<p className="text-foreground text-s[16px] font-medium tracking-widest lg:mx-2">
						KYB STEP {currentStep}/
						<span className="text-(--text-1) lg:w-[20%]">6</span>
					</p>
					<div className="h-full w-[42%] border-t border-t-(--grey-1)"></div>
				</div>

				{/* Step 1: Company Profile */}
				{currentStep === 1 && (
					<KYBStepWrapper
						title="Business Profile"
						footer={
							<div className="flex items-center justify-center gap-4 pt-6">
								<button onClick={handleNext} className={`${baseButtonBlack} py-3`}>
									Proceed to Company Contact
								</button>
							</div>
						}>
						<div className="bg-background space-y-6 px-6 py-8">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="w-full">
									<input
										type="text"
										placeholder="Company Name*"
										value={formData.companyName}
										onChange={(e) => updateFormData({ companyName: e.target.value })}
										className={baseInput}
									/>
									{errors.companyName && (
										<p className="text-sm text-(--red-1)">{errors.companyName}</p>
									)}
								</div>
								<div className="w-full">
									<input
										type="text"
										placeholder="Business Description*"
										value={formData.businessDescription}
										onChange={(e) =>
											updateFormData({ businessDescription: e.target.value })
										}
										className={baseInput}
									/>
									{errors.businessDescription && (
										<p className="text-sm text-(--red-1)">{errors.businessDescription}</p>
									)}
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="w-full">
									<select
										title="staff-size"
										value={formData.staffSize}
										onChange={(e) => updateFormData({ staffSize: e.target.value })}
										className={baseSelect}>
										<option value="">Staff Size*</option>
										<option value="1-10">1-10</option>
										<option value="11-50">11-50</option>
										<option value="51-200">51-200</option>
										<option value="200+">200+</option>
									</select>
									{errors.staffSize && (
										<p className="text-sm text-(--red-1)">{errors.staffSize}</p>
									)}
								</div>

								<div className="flex w-full flex-col">
									<div className="flex w-full">
										<input
											type="text"
											placeholder="Annual Projected Sales Volume*"
											value={
												formData.annualSalesVolume
													? Number(formData.annualSalesVolume).toLocaleString("en-US")
													: ""
											}
											onChange={(e) => {
												// Strip all non-digit characters before storing
												const raw = e.target.value.replace(/[^0-9]/g, "")
												updateFormData({ annualSalesVolume: raw })
											}}
											className={splitLeft}
										/>
										<select
											title="annual-sales-volume"
											value={formData.annualSalesVolumeCurrency}
											onChange={(e) =>
												updateFormData({
													annualSalesVolumeCurrency: e.target.value,
												})
											}
											className={splitRight}>
											<option value="NGN">NGN</option>
										</select>
									</div>
									{(errors.annualSalesVolume || errors.annualSalesVolumeCurrency) && (
										<p className="text-sm text-(--red-1)">{errors.annualSalesVolume}</p>
									)}
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="w-full">
									<select
										title="industry"
										value={formData.industry}
										onChange={(e) => updateFormData({ industry: e.target.value })}
										className={baseSelect}>
										<option value="">Industry*</option>
										<option value="Technology">Technology</option>
										<option value="Finance">Finance</option>
										<option value="Retail">Retail</option>
										<option value="Manufacturing">Manufacturing</option>
										<option value="Other">Other</option>
									</select>
									{errors.industry && (
										<p className="text-sm text-(--red-1)">{errors.industry}</p>
									)}
								</div>

								<div className="w-full">
									<select
										title="business type"
										value={formData.businessType}
										onChange={(e) => updateFormData({ businessType: e.target.value })}
										className={baseSelect}>
										<option value="">Business Type*</option>
										<option value="Sole Proprietorship">Sole Proprietorship</option>
										<option value="Partnership">Partnership</option>
										<option value="Corporation">Corporation</option>
										<option value="LLC">LLC</option>
										<option value="Other">Other</option>
									</select>
									{errors.businessType && (
										<p className="text-sm text-(--red-1)">{errors.businessType}</p>
									)}
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="w-full">
									<input
										type="text"
										placeholder="CAC Number*"
										value={formData.cacNumber}
										onChange={(e) => updateFormData({ cacNumber: e.target.value })}
										className={baseInput}
									/>
									{errors.cacNumber && (
										<p className="text-sm text-(--red-1)">{errors.cacNumber}</p>
									)}
								</div>
							</div>
						</div>
					</KYBStepWrapper>
				)}

				{/* Step 2: Company Contact */}
				{currentStep === 2 && (
					<KYBStepWrapper
						title="Company Contact"
						footer={
							<div className="flex flex-col gap-4 pt-6 md:flex-row">
								<button onClick={handlePrevious} className={baseButtonWhite}>
									Go Back
								</button>
								<button onClick={handleNext} className={baseButtonBlack}>
									Proceed to Office Address
								</button>
							</div>
						}>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="w-full">
								<input
									type="email"
									placeholder="Business Email* (e.g. info@company.com)"
									value={formData.businessEmail}
									onChange={(e) => updateFormData({ businessEmail: e.target.value })}
									className={baseInput}
								/>
								{errors.businessEmail && (
									<p className="text-sm text-(--red-1)">{errors.businessEmail}</p>
								)}
							</div>

							<div className="w-full">
								<input
									type="email"
									placeholder="Support Email (e.g. support@company.com)"
									value={formData.supportEmail}
									onChange={(e) => updateFormData({ supportEmail: e.target.value })}
									className={baseInput}
								/>
								{errors.supportEmail && (
									<p className="text-sm text-(--red-1)">{errors.supportEmail}</p>
								)}
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="w-full">
								<input
									type="email"
									placeholder="Dispute Email (e.g. disputes@company.com)"
									value={formData.disputeEmail}
									onChange={(e) => updateFormData({ disputeEmail: e.target.value })}
									className={baseInput}
								/>
								{errors.disputeEmail && (
									<p className="text-sm text-(--red-1)">{errors.disputeEmail}</p>
								)}
							</div>
							<div className="flex flex-col">
								<div className="flex w-full">
									<input
										type="tel"
										placeholder="Phone Number* (e.g. +2348012345678)"
										value={formData.phoneNumber}
										onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
										className={baseInput}
									/>
								</div>
								{errors.phoneNumber && (
									<p className="text-sm text-(--red-1)">{errors.phoneNumber}</p>
								)}
							</div>

							<div className="w-full">
								<input
									type="text"
									placeholder="Website* (e.g. https://company.com)"
									value={formData.website}
									onChange={(e) => updateFormData({ website: e.target.value })}
									className={baseInput}
								/>
								{errors.website && (
									<p className="text-sm text-(--red-1)">{errors.website}</p>
								)}
							</div>

							<div className="w-full">
								<input
									type="text"
									placeholder="Linkedin (e.g. https://linkedin.com/company/name)"
									value={formData.linkedin}
									onChange={(e) => updateFormData({ linkedin: e.target.value })}
									className={baseInput}
								/>
								{errors.linkedin && (
									<p className="text-sm text-(--red-1)">{errors.linkedin}</p>
								)}
							</div>

							<div className="w-full">
								<input
									type="text"
									placeholder="Twitter (e.g. https://twitter.com/handle)"
									value={formData.twitter}
									onChange={(e) => updateFormData({ twitter: e.target.value })}
									className={baseInput}
								/>
								{errors.twitter && (
									<p className="text-sm text-(--red-1)">{errors.twitter}</p>
								)}
							</div>

							<div className="w-full">
								<input
									type="text"
									placeholder="Instagram (e.g. https://instagram.com/handle)"
									value={formData.instagram}
									onChange={(e) => updateFormData({ instagram: e.target.value })}
									className={baseInput}
								/>
								{errors.instagram && (
									<p className="text-sm text-(--red-1)">{errors.instagram}</p>
								)}
							</div>
						</div>
					</KYBStepWrapper>
				)}

				{/* Step 3: Office Address */}
				{currentStep === 3 && (
					<KYBStepWrapper
						title="Office Address"
						footer={
							<div className="flex flex-col gap-4 pt-6 md:flex-row">
								<button onClick={handlePrevious} className={baseButtonWhite}>
									Go Back
								</button>
								<button onClick={handleNext} className={baseButtonBlack}>
									Proceed to Owner&apos;s Information
								</button>
							</div>
						}>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="flex flex-col">
								<input
									title="country"
									placeholder="Country"
									value={formData.officeCountry}
									onChange={(e) => updateFormData({ officeCountry: e.target.value })}
									className={baseInput}
								/>
								{errors.officeCountry && (
									<p className="text-sm text-(--red-1)">{errors.officeCountry}</p>
								)}
							</div>

							<div className="flex flex-col">
								<input
									title="Office state"
									placeholder="State"
									value={formData.officeState}
									onChange={(e) => updateFormData({ officeState: e.target.value })}
									className={baseInput}
								/>
								{errors.officeState && (
									<p className="text-sm text-(--red-1)">{errors.officeState}</p>
								)}
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="flex flex-col">
								<input
									type="text"
									placeholder="City*"
									value={formData.officeCity}
									onChange={(e) => updateFormData({ officeCity: e.target.value })}
									className={baseInput}
								/>
								{errors.officeCity && (
									<p className="text-sm text-(--red-1)">{errors.officeCity}</p>
								)}
							</div>

							<div className="flex flex-col">
								<input
									type="text"
									placeholder="Postal Code* (e.g. 100001)"
									value={formData.officePostalCode}
									onChange={(e) => updateFormData({ officePostalCode: e.target.value })}
									className={baseInput}
								/>
								{errors.officePostalCode && (
									<p className="text-sm text-(--red-1)">{errors.officePostalCode}</p>
								)}
							</div>
						</div>

						<input
							type="text"
							placeholder="Street Address*"
							value={formData.officeStreet}
							onChange={(e) => updateFormData({ officeStreet: e.target.value })}
							className={`${baseInput} w-full`}
						/>
						{errors.officeStreet && (
							<p className="text-sm text-(--red-1)">{errors.officeStreet}</p>
						)}

						<div className="flex gap-4 pt-6"></div>
					</KYBStepWrapper>
				)}

				{/* Step 4: Owner's Information */}
				{currentStep === 4 && (
					<KYBStepWrapper
						title={
							<div className="flex items-center justify-between rounded-lg">
								<p className="text-foreground text-[14px] font-semibold">
									Director(s) Information
								</p>

								<div className="flex flex-col items-center gap-x-2 md:flex-row">
									<small className="hidden text-(--text-1) md:flex">
										Multiple Directors?
									</small>
									<button
										onClick={addOwner}
										className="bg-foreground text-background hover:bg-foreground/85 flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm transition">
										<HiPlus className="h-4 w-4" />
										Add Director
									</button>
								</div>
							</div>
						}
						footer={
							<div className="flex flex-col gap-4 pt-6 md:flex-row">
								<button onClick={handlePrevious} className={baseButtonWhite}>
									Go Back
								</button>
								<button onClick={handleNext} className={baseButtonBlack}>
									Proceed to Company Documents
								</button>
							</div>
						}>
						<div className="space-y-8">
							{formData.owners.map((owner, index) => (
								<div
									key={owner.id}
									className="space-y-6 border-b border-(--grey-1) pb-8 last:border-0">
									<div className="flex items-center justify-between">
										<p className="font-semibold text-gray-900">
											Director {formData.owners.length - index}
										</p>
										{formData.owners.length > 1 && (
											<button
												onClick={() => {
													setFormData((prev) => ({
														...prev,
														owners: prev.owners.filter((o) => o.id !== owner.id),
													}))
												}}
												className="text-sm text-(--red-1) hover:underline">
												Remove
											</button>
										)}
									</div>

									{/* Identification Section */}
									<div className="space-y-4">
										<div className="relative my-6 flex items-center justify-center">
											<div className="absolute inset-x-0 top-1/2 border-t border-(--grey-1)" />
											<span className="bg-background text-foreground relative px-4 text-[14px] font-medium uppercase">
												IDENTIFICATION
											</span>
										</div>

										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div className="flex flex-col">
												<input
													title="first name"
													placeholder="First name"
													value={owner.firstName}
													onChange={(e) =>
														updateOwner(owner.id, { firstName: e.target.value })
													}
													className={baseInput}
												/>
												{errors[`owner_${owner.id}_firstName`] && (
													<p className="text-sm text-(--red-1)">
														{errors[`owner_${owner.id}_firstName`]}
													</p>
												)}
											</div>

											<div className="flex flex-col">
												<input
													title="last name"
													placeholder="Last name"
													value={owner.lastName}
													onChange={(e) =>
														updateOwner(owner.id, { lastName: e.target.value })
													}
													className={baseInput}
												/>
												{errors[`owner_${owner.id}_lastName`] && (
													<p className="text-sm text-(--red-1)">
														{errors[`owner_${owner.id}_lastName`]}
													</p>
												)}
											</div>
										</div>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div className="flex flex-col">
												<input
													title="email"
													value={owner.email}
													placeholder="Email"
													onChange={(e) => updateOwner(owner.id, { email: e.target.value })}
													className={baseInput}
												/>
												{errors[`owner_${owner.id}_email`] && (
													<p className="text-sm text-(--red-1)">
														{errors[`owner_${owner.id}_email`]}
													</p>
												)}
											</div>

											<div className="flex flex-col">
												<input
													title="phone number"
													placeholder="Phone number"
													value={owner.phoneNumber}
													onChange={(e) =>
														updateOwner(owner.id, {
															phoneNumber: e.target.value,
														})
													}
													className={baseInput}
												/>
												{errors[`owner_${owner.id}_phoneNumber`] && (
													<p className="text-sm text-(--red-1)">
														{errors[`owner_${owner.id}_phoneNumber`]}
													</p>
												)}
											</div>
										</div>

										<div className="grid grid-cols-1 gap-4">
											<div className="flex flex-col">
												<input
													title="BVN"
													value={owner.bvn}
													placeholder="BVN"
													onChange={(e) => updateOwner(owner.id, { bvn: e.target.value })}
													className={baseInput}
												/>
												{errors[`owner_${owner.id}_bvn`] && (
													<p className="text-sm text-(--red-1)">
														{errors[`owner_${owner.id}_bvn`]}
													</p>
												)}
											</div>
										</div>

										<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
											<div className="flex flex-col">
												<select
													title="dob"
													value={owner.dayOfBirth}
													onChange={(e) =>
														updateOwner(owner.id, {
															dayOfBirth: e.target.value,
														})
													}
													className={baseSelect}>
													<option value="">Day of Birth*</option>
													{[...Array(31)].map((_, i) => (
														<option key={i + 1} value={String(i + 1)}>
															{i + 1}
														</option>
													))}
												</select>
												{errors[`owner_${owner.id}_dayOfBirth`] && (
													<p className="text-sm text-(--red-1)">
														{errors[`owner_${owner.id}_dayOfBirth`]}
													</p>
												)}
											</div>

											<div className="flex flex-col">
												<select
													title="mob"
													value={owner.monthOfBirth}
													onChange={(e) =>
														updateOwner(owner.id, {
															monthOfBirth: e.target.value,
														})
													}
													className={baseSelect}>
													<option value="">Month of Birth*</option>
													{[...Array(12)].map((_, i) => (
														<option key={i + 1} value={String(i + 1)}>
															{i + 1}
														</option>
													))}
												</select>
												{errors[`owner_${owner.id}_monthOfBirth`] && (
													<p className="text-sm text-(--red-1)">
														{errors[`owner_${owner.id}_monthOfBirth`]}
													</p>
												)}
											</div>

											<div className="flex flex-col">
												<select
													title="yob"
													value={owner.yearOfBirth}
													onChange={(e) =>
														updateOwner(owner.id, {
															yearOfBirth: e.target.value,
														})
													}
													className={baseSelect}>
													<option value="">Year of Birth*</option>
													{[...Array(100)].map((_, i) => {
														const year = new Date().getFullYear() - i
														return (
															<option key={year} value={String(year)}>
																{year}
															</option>
														)
													})}
												</select>
												{errors[`owner_${owner.id}_yearOfBirth`] && (
													<p className="text-sm text-(--red-1)">
														{errors[`owner_${owner.id}_yearOfBirth`]}
													</p>
												)}
											</div>
										</div>

										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div className="flex flex-col">
												<select
													title="owner document"
													value={owner.idDoc1}
													onChange={(e) => updateOwner(owner.id, { idDoc1: e.target.value })}
													className={baseSelect}>
													<option value="">Identification Document*</option>
													<option value="Passport">Passport</option>
													<option value="Driver License">Driver License</option>
													<option value="National ID">National ID</option>
												</select>
												{errors[`owner_${owner.id}_idDoc1`] && (
													<p className="text-sm text-(--red-1)">
														{errors[`owner_${owner.id}_idDoc1`]}
													</p>
												)}
											</div>

											<div className="flex flex-col">
												<input
													type="text"
													placeholder="Identification Number*"
													value={owner.idNumber1}
													onChange={(e) =>
														updateOwner(owner.id, { idNumber1: e.target.value })
													}
													className={baseInput}
												/>
											</div>
											{errors[`owner_${owner.id}_idNumber1`] && (
												<p className="text-sm text-(--red-1)">
													{errors[`owner_${owner.id}_idNumber1`]}
												</p>
											)}
										</div>

										<FilePickerField
											label="Upload Identification Document"
											file={owner.idUpload}
											onFileChange={(file) => updateOwner(owner.id, { idUpload: file })}
											onFileRemove={() => updateOwner(owner.id, { idUpload: null })}
											error={errors[`owner_${owner.id}_idUpload`]}
											required
										/>
									</div>

									{/* Home Address Section */}
									<div className="space-y-4 pt-6">
										<div className="relative my-6 flex items-center justify-center">
											<div className="absolute inset-x-0 top-1/2 border-t border-(--grey-1)" />
											<span className="bg-background text-foreground relative px-4 text-[14px] font-medium uppercase">
												HOME ADDRESS
											</span>
										</div>

										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div className="flex flex-col">
												<input
													type="text"
													placeholder="State"
													value={owner.homeState}
													onChange={(e) =>
														updateOwner(owner.id, { homeState: e.target.value })
													}
													className={baseInput}
												/>
												{errors[`owner_${owner.id}_homeState`] && (
													<p className="text-sm text-(--red-1)">
														{errors[`owner_${owner.id}_homeState`]}
													</p>
												)}
											</div>

											<div className="flex flex-col">
												<input
													type="text"
													placeholder="City"
													value={owner.homeCity}
													onChange={(e) =>
														updateOwner(owner.id, { homeCity: e.target.value })
													}
													className={baseInput}
												/>
												{errors[`owner_${owner.id}_homeCity`] && (
													<p className="text-sm text-(--red-1)">
														{errors[`owner_${owner.id}_homeCity`]}
													</p>
												)}
											</div>
										</div>

										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div className="flex flex-col">
												<input
													type="text"
													placeholder="Postal code"
													value={owner.homePostalCode}
													onChange={(e) =>
														updateOwner(owner.id, {
															homePostalCode: e.target.value,
														})
													}
													className={baseInput}
												/>
												{errors[`owner_${owner.id}_homePostalCode`] && (
													<p className="text-sm text-(--red-1)">
														{errors[`owner_${owner.id}_homePostalCode`]}
													</p>
												)}
											</div>

											<div className="flex flex-col">
												<input
													title="street"
													placeholder="Street Address"
													value={owner.homeStreet}
													onChange={(e) =>
														updateOwner(owner.id, {
															homeStreet: e.target.value,
														})
													}
													className={baseInput}
												/>
												{errors[`owner_${owner.id}_homeStreet`] && (
													<p className="text-sm text-(--red-1)">
														{errors[`owner_${owner.id}_homeStreet`]}
													</p>
												)}
											</div>
										</div>

										<FilePickerField
											label="Proof of Address"
											file={owner.homeProofUpload}
											onFileChange={(file) =>
												updateOwner(owner.id, { homeProofUpload: file })
											}
											onFileRemove={() => updateOwner(owner.id, { homeProofUpload: null })}
											error={errors[`owner_${owner.id}_homeProofUpload`]}
											required
										/>

										<div className="bg-background mt-12 space-y-2 rounded-lg border border-(--grey-1) text-[14px] text-(--text-1)">
											<div className="bg-(--grey-4) px-2 py-4">
												<p className="text-foreground font-semibold">
													This action requires:
												</p>
											</div>
											<div className="space-y-3 p-4">
												<p className="text-xs">
													Proof of address can be any of the following documents:
												</p>
												<ol className="list-inside list-decimal space-y-1 text-xs">
													<li>Utility bill (not later than 3 months old).</li>
													<li>
														Bank statement showing current address (not later than 6 months
														old).
													</li>
													<li>Tax statements (last two taxable years).</li>
													<li>Government-issued ID with address.</li>
													<li>Letter from a public authority.</li>
												</ol>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</KYBStepWrapper>
				)}

				{/* Step 5: Company Documents */}
				{currentStep === 5 && (
					<KYBStepWrapper
						title="Company Documents"
						footer={
							<div className="flex flex-col gap-4 md:flex-row">
								<button onClick={handlePrevious} className={baseButtonWhite}>
									Go Back
								</button>
								<button onClick={handleNext} className={baseButtonBlack}>
									Proceed to Bank Details
								</button>
							</div>
						}>
						<p className="text-[16px] text-(--text-1)">
							Please upload all the relevant documents as requested
						</p>

						{/* Incorporation Documents */}
						<div>
							<div className="relative my-6 flex items-center justify-center">
								<div className="absolute inset-x-0 top-1/2 border-t border-(--grey-1)" />
								<span className="bg-background relative px-4 text-[14px] font-medium text-(--text-1) uppercase">
									Incorporation Documents
								</span>
							</div>

							<div className="space-y-3">
								<FilePickerField
									label="Certification of Incorporation (Formation)"
									file={formData.incorporationDoc}
									onFileChange={(file) => updateFormData({ incorporationDoc: file })}
									onFileRemove={() => updateFormData({ incorporationDoc: null })}
									error={errors.incorporationDoc}
									required
								/>
								<FilePickerField
									label="Tax Filing Document"
									file={formData.taxFilingDoc}
									onFileChange={(file) => updateFormData({ taxFilingDoc: file })}
									onFileRemove={() => updateFormData({ taxFilingDoc: null })}
									error={errors.taxFilingDoc}
									required
								/>
								<FilePickerField
									label="Status of Registration"
									file={formData.registrationStatus}
									onFileChange={(file) => updateFormData({ registrationStatus: file })}
									onFileRemove={() => updateFormData({ registrationStatus: null })}
									error={errors.registrationStatus}
									required
								/>
								<FilePickerField
									label="Memorandum of Understanding"
									file={formData.mouDoc}
									onFileChange={(file) => updateFormData({ mouDoc: file })}
									onFileRemove={() => updateFormData({ mouDoc: null })}
									error={errors.mouDoc}
									required
								/>
								<FilePickerField
									label="Register of Board of Directors"
									file={formData.boardRegisterDoc}
									onFileChange={(file) => updateFormData({ boardRegisterDoc: file })}
									onFileRemove={() => updateFormData({ boardRegisterDoc: null })}
									error={errors.boardRegisterDoc}
									required
								/>
							</div>
						</div>

						{/* Proof of Address */}
						<div>
							<div className="relative my-6 flex items-center justify-center">
								<div className="absolute inset-x-0 top-1/2 border-t border-(--grey-1)" />
								<span className="bg-background text-foreground relative px-4 text-[16px] font-medium uppercase">
									PROOF OF ADDRESS
								</span>
							</div>
							<p className="mb-4 text-[14px] text-(--text-1)">
								You are to upload one of the following document- Utility bill, bank
								statement and tax filing showing the registered address of the company
							</p>
							<FilePickerField
								label="Proof of Address"
								file={formData.proofOfAddressDoc}
								onFileChange={(file) => updateFormData({ proofOfAddressDoc: file })}
								onFileRemove={() => updateFormData({ proofOfAddressDoc: null })}
								error={errors.proofOfAddressDoc}
								required
							/>
						</div>

						{/* Supporting Documents */}
						<div>
							<div className="relative my-6 flex items-center justify-center">
								<div className="absolute inset-x-0 top-1/2 border-t border-(--grey-1)" />
								<span className="bg-background text-foreground relative px-4 text-[16px] font-medium uppercase">
									OTHER SUPPORTING DOCUMENTS
								</span>
							</div>
							<p className="mb-4 text-[14px] text-(--text-1)">
								Upload other supporting documents
							</p>
							<MultiFilePickerField
								label="Supporting Document (Optional)"
								files={formData.supportingDoc}
								onFilesChange={(files) => updateFormData({ supportingDoc: files })}
								error={errors.supportingDoc}
							/>
						</div>
					</KYBStepWrapper>
				)}

				{/* Step 6: Bank Account Details */}
				{currentStep === 6 && (
					<KYBStepWrapper
						title="Bank Account Details"
						footer={
							<div className="flex flex-col gap-4 md:flex-row">
								<button onClick={handlePrevious} className={baseButtonWhite}>
									Go Back
								</button>
								<button onClick={handleNext} className={baseButtonBlack}>
									Proceed to Submit
								</button>
							</div>
						}>
						<p className="text-[14px] text-(--text-1)">
							To help us verify your account, the name on your bank account should
							match the name you provided as the owner of your business
						</p>

						<select
							title="bank name"
							value={formData.bankName}
							onChange={(e) => updateFormData({ bankName: e.target.value })}
							className={`${baseSelect} w-full`}>
							<option value="">Bank Name*</option>
							{banklists?.data?.map((item: Banklist, index: number) => (
								<option key={index} value={item.bankName}>
									{item.bankName}
								</option>
							))}
						</select>
						{errors.bankName && (
							<p className="-mt-6 ml-1 text-sm text-(--red-1)">{errors.bankName}</p>
						)}

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="w-full">
								<input
									type="text"
									placeholder="Account Number* (10 digits, e.g. 0123456789)"
									value={formData.accountNumber}
									onChange={(e) => updateFormData({ accountNumber: e.target.value })}
									className={baseInput}
								/>
								{errors.accountNumber && (
									<p className="text-sm text-(--red-1)">{errors.accountNumber}</p>
								)}
							</div>

							<div>
								<input
									type="text"
									placeholder="Account Name*"
									disabled
									value={verifyInfo?.data?.accountName}
									className={`${baseInput} cursor-not-allowed bg-gray-200!`}
								/>
								{errors.accountName && (
									<p className="text-sm text-(--red-1)">{errors.accountName}</p>
								)}
							</div>
						</div>
					</KYBStepWrapper>
				)}
			</div>

			<FeedbackModal
				isOpen={!!submitError}
				onClose={() => setSubmitError(null)}
				icon={
					<Image
						src="/images/failed.svg"
						className="h-24 w-24"
						width={50}
						height={50}
						alt="icon"
					/>
				}
				title="Submission Failed"
				description={submitError ?? "An unexpected error occurred."}
				buttonCount={1}
				buttons={[
					{
						label: "Close",
						variant: "outline",
						onClick: () => setSubmitError(null),
					},
				]}
			/>
		</div>
	)
}
