"use client"

import { useState } from "react"
import { FaArrowLeft, FaFilePdf, FaImage } from "react-icons/fa"
import { KYBStepWrapper } from "./kybstepwraper"
import { baseButtonBlack, baseButtonWhite } from "./classes"

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
	companyName: string
	businessDescription: string
	staffSize: string
	annualSalesVolume: string
	annualSalesVolumeCurrency: string
	industry: string
	businessType: string
	cacNumber: string
	businessEmail: string
	supportEmail: string
	disputeEmail: string
	phoneNumber: string
	phoneNumberCountry: string
	website: string
	linkedin: string
	twitter: string
	instagram: string
	officeCountry: string
	officeState: string
	officeCity: string
	officePostalCode: string
	officeStreet: string
	owners: OwnerInfo[]
	incorporationDoc: File | null
	taxFilingDoc: File | null
	registrationStatus: File | null
	mouDoc: File | null
	boardRegisterDoc: File | null
	proofOfAddressDoc: File | null
	supportingDoc: File[]
	bankName: string
	accountNumber: string
	accountName: string
}

interface KYBReviewScreensProps {
	formData: KYBFormData
	onBack: () => void
	onEditStep: (step: number) => void
	onComplete: () => void
}

const REVIEW_TABS = [
	{ id: 1, label: "Business Profile" },
	{ id: 2, label: "Business Contact" },
	{ id: 3, label: "Office Address" },
	{ id: 4, label: "Owner's Info" },
	{ id: 5, label: "Business Document" },
	{ id: 6, label: "Bank Account Details" },
]

// Helper function to detect file type
const getFileIcon = (file: File | null) => {
	if (!file) return null
	const isPdf =
		file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
	const isImage =
		file.type.startsWith("image/") ||
		/\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)

	if (isPdf) return <FaFilePdf className="h-4 w-4 text-(--red-1)" />
	if (isImage) return <FaImage className="h-4 w-4 text-blue-500" />
	return <FaFilePdf className="h-4 w-4 text-(--red-1)" />
}

// Review row component for consistent display
function ReviewRow({
	label,
	value,
}: {
	label: string
	value: string | React.ReactNode
}) {
	return (
		<div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
			<p className="text-[14px] font-medium text-(--text-1)">{label}</p>
			<p className="text-foreground text-[14px] wrap-break-words sm:max-w-[60%] sm:text-right">
				{value}
			</p>
		</div>
	)
}

function DocumentReviewRow({
	label,
	file,
}: {
	label: string
	file: File | null
}) {
	return (
		<div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
			<p className="text-[14px] font-medium text-(--text-1)">{label}</p>
			{file ? (
				<div className="flex items-center gap-2 sm:max-w-[60%]">
					<p className="text-foreground text-[14px] break-all">{file.name}</p>
					{getFileIcon(file)}
				</div>
			) : (
				<p className="text-foreground text-[14px]">-</p>
			)}
		</div>
	)
}

export function KYBReviewScreens({
	formData,
	onBack,
	onEditStep,
	onComplete,
}: KYBReviewScreensProps) {
	const [activeTab, setActiveTab] = useState(1)

	const handleNext = () => {
		if (activeTab < REVIEW_TABS.length) {
			setActiveTab(activeTab + 1)
		}
	}

	return (
		<div className="bg-background min-h-screen w-full px-4 py-6 sm:px-6 sm:py-8 md:max-w-[80%]">
			<button
				onClick={onBack}
				className="text-foreground hover:text-foreground/85 mb-6 flex cursor-pointer items-center gap-2 text-[16px] transition">
				<FaArrowLeft className="bg-background h-8 w-8 rounded-lg border border-(--grey-1) p-2" />
				Go Back
			</button>

			<div className="mx-auto">
				<div className="mb-8">
					<h1 className="text-foreground mb-2 text-[20px] font-bold">
						Review your KYB
					</h1>
					<p className="text-[14px] text-(--text-1)">
						Please confirm that all the details you provided are correct
					</p>
				</div>

				{/* Tabs Navigation */}
				<div className="mb-8 overflow-x-auto">
					<div className="flex h-auto min-h-14 w-fit min-w-full gap-1 rounded-lg bg-[#F5F5F5] p-1 md:gap-2">
						{REVIEW_TABS.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`cursor-pointer rounded-md px-2 py-2 text-xs font-medium whitespace-nowrap transition-all sm:px-3 sm:text-sm md:flex-1 md:px-2 md:text-center lg:px-4 ${
									activeTab === tab.id
										? "bg-background text-foreground font-medium shadow-sm"
										: "hover:text-foreground text-(--text-1)"
								}`}>
								{tab.label}
							</button>
						))}
					</div>
				</div>

				{/* Review Content */}
				{activeTab === 1 && (
					<KYBStepWrapper title="Business Profile Review">
						<ReviewRow label="Business Name:" value={formData.companyName} />
						<ReviewRow
							label="Business Description:"
							value={formData.businessDescription}
						/>
						<ReviewRow label="Staff Size:" value={formData.staffSize} />
						<ReviewRow
							label="Annual Projected Sales Volume:"
							value={`${Number(formData.annualSalesVolume).toLocaleString("en-US")} ${formData.annualSalesVolumeCurrency}`}
						/>
						<ReviewRow label="Industry:" value={formData.industry} />
						<ReviewRow label="Business Type:" value={formData.businessType} />
						<ReviewRow label="CAC Number:" value={formData.cacNumber} />
					</KYBStepWrapper>
				)}

				{activeTab === 2 && (
					<KYBStepWrapper title="Business Contact Review">
						<ReviewRow label="Business Email:" value={formData.businessEmail} />
						<ReviewRow label="Support Email:" value={formData.supportEmail || "-"} />
						<ReviewRow label="Dispute Email:" value={formData.disputeEmail || "-"} />
						<ReviewRow label="Phone Number:" value={formData.phoneNumber} />
						<ReviewRow label="Website:" value={formData.website} />
						<ReviewRow
							label="LinkedIn:"
							value={
								formData.linkedin ? (
									<a
										href={formData.linkedin}
										className="break-all text-blue-600 hover:underline"
										target="_blank"
										rel="noopener noreferrer">
										{formData.linkedin}
									</a>
								) : (
									"-"
								)
							}
						/>
						<ReviewRow
							label="Twitter:"
							value={
								formData.twitter ? (
									<a
										href={formData.twitter}
										className="break-all text-blue-600 hover:underline"
										target="_blank"
										rel="noopener noreferrer">
										{formData.twitter}
									</a>
								) : (
									"-"
								)
							}
						/>
						<ReviewRow
							label="Instagram:"
							value={
								formData.instagram ? (
									<a
										href={formData.instagram}
										className="break-all text-blue-600 hover:underline"
										target="_blank"
										rel="noopener noreferrer">
										{formData.instagram}
									</a>
								) : (
									"-"
								)
							}
						/>
					</KYBStepWrapper>
				)}

				{activeTab === 3 && (
					<KYBStepWrapper title="Office Address Review">
						<ReviewRow label="Country:" value={formData.officeCountry} />
						<ReviewRow label="State or Origin:" value={formData.officeState} />
						<ReviewRow label="City:" value={formData.officeCity} />
						<ReviewRow label="Postal Code:" value={formData.officePostalCode} />
						<ReviewRow label="Street Address:" value={formData.officeStreet} />
					</KYBStepWrapper>
				)}

				{activeTab === 4 && (
					<KYBStepWrapper title="Owner's Info Review">
						<div className="space-y-8">
							{formData.owners.map((owner, index) => (
								<div key={owner.id}>
									<div className="mb-6 flex items-center justify-between">
										<div>
											<p className="text-foreground text-[16px] font-semibold">
												{owner.firstName} {owner.lastName}
											</p>
											<p className="text-[12px] text-(--text-1)">
												Owner {formData.owners.length - index}
											</p>
										</div>
									</div>

									<div className="space-y-4">
										<ReviewRow
											label="Full Name:"
											value={`${owner.firstName} ${owner.lastName}`}
										/>
										<ReviewRow
											label="Date of Birth:"
											value={`${owner.dayOfBirth} ${getMonthName(
												Number(owner.monthOfBirth)
											)} ${owner.yearOfBirth}`}
										/>
										<ReviewRow label="Identification Document:" value={owner.idDoc1} />
										<ReviewRow label="Identification Number:" value={owner.idNumber1} />
										<DocumentReviewRow label="Document:" file={owner.idUpload} />
										<ReviewRow label="State of Origin:" value={owner.homeState} />
										<ReviewRow label="City:" value={owner.homeCity} />
										<ReviewRow label="Postal Code:" value={owner.homePostalCode} />
										<ReviewRow label="Street Address:" value={owner.homeStreet} />
										<DocumentReviewRow
											label="Proof of Address:"
											file={owner.homeProofUpload}
										/>
									</div>

									{index < formData.owners.length - 1 && (
										<div className="my-8 border-t border-(--grey-2)" />
									)}
								</div>
							))}
						</div>
					</KYBStepWrapper>
				)}

				{activeTab === 5 && (
					<KYBStepWrapper title="Business Document Review">
						<DocumentReviewRow
							label="Certification of Incorporation:"
							file={formData.incorporationDoc}
						/>
						<DocumentReviewRow
							label="Tax Filing Document:"
							file={formData.taxFilingDoc}
						/>
						<DocumentReviewRow
							label="Status of Registration:"
							file={formData.registrationStatus}
						/>
						<DocumentReviewRow
							label="Memorandum of Understanding:"
							file={formData.mouDoc}
						/>
						<DocumentReviewRow
							label="Register of Board of Directors:"
							file={formData.boardRegisterDoc}
						/>
						<DocumentReviewRow
							label="Proof of Address:"
							file={formData.proofOfAddressDoc}
						/>
						{formData.supportingDoc.length > 0 && (
							<>
								<div className="my-6 border-t border-(--grey-2)" />
								<p className="text-foreground mb-4 text-[14px] font-semibold">
									Supporting Documents
								</p>
								{formData.supportingDoc.map((doc, idx) => (
									<DocumentReviewRow key={idx} label="Document" file={doc} />
								))}
							</>
						)}
					</KYBStepWrapper>
				)}

				{activeTab === 6 && (
					<KYBStepWrapper title="Bank Account Review">
						<ReviewRow label="Bank Name:" value={formData.bankName} />
						<ReviewRow label="Account Name:" value={formData.accountName} />
						<ReviewRow label="Account Number:" value={formData.accountNumber} />
					</KYBStepWrapper>
				)}

				{/* Action Buttons */}
				<div className="mt-8 flex flex-col gap-4 md:flex-row md:justify-center">
					<button
						onClick={() => {
							onEditStep(activeTab)
						}}
						className={`${baseButtonWhite} py-3 md:max-w-50`}>
						Edit Information
					</button>

					<div className="flex flex-col gap-4 md:flex-row md:gap-4">
						{activeTab === REVIEW_TABS.length ? (
							<button onClick={onComplete} className={`${baseButtonBlack} py-3`}>
								Submit
							</button>
						) : (
							<button onClick={handleNext} className={`${baseButtonBlack} py-3`}>
								Next
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

// Helper function to get month name
function getMonthName(month: number): string {
	const months = [
		"",
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	]
	return months[month] || ""
}
