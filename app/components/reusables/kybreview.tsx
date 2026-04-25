"use client"

import { SetStateAction, useEffect, useState, Dispatch } from "react"
import { FaArrowLeft } from "react-icons/fa"
import { KYBStepWrapper } from "./kybstepwraper"
import { baseButtonBlack, baseButtonWhite } from "./classes"
import { Spinner } from "./spinner"
import { ReviewRow, DocumentReviewRow } from "./review_generals"
import { KYBFormData } from "@/app/types/general"
import OwnerAccordion from "./owner_accordion"
import Image from "next/image"
import { FeedbackModal } from "./feedback_modal"
import { showToast } from "@/app/functions/helpers/notify_user"

interface KYBReviewScreensProps {
	step: number
	formData: KYBFormData
	onBack: () => void
	onEditStep: (step: number) => void
	loading: boolean
	isOnline: boolean
	err: string | null
	setErr: Dispatch<SetStateAction<string | null>>
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

export function KYBReviewScreens({
	step,
	formData,
	onBack,
	onEditStep,
	loading,
	isOnline,
	err,
	setErr,
	onComplete,
}: KYBReviewScreensProps) {
	const [activeTab, setActiveTab] = useState(1)

	const handleNext = () => {
		if (activeTab < REVIEW_TABS.length) {
			setActiveTab(activeTab + 1)
		}
	}

	useEffect(() => {
		setActiveTab(step)
	}, [step])

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
						<OwnerAccordion owners={formData.owners} />
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
								<div className="my-6" />
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
							<button
								disabled={loading || !isOnline}
								onClick={onComplete}
								className={`${baseButtonBlack} py-3`}>
								Submit {loading && <Spinner />}
							</button>
						) : (
							<button onClick={handleNext} className={`${baseButtonBlack} py-3`}>
								Next
							</button>
						)}
					</div>
				</div>
			</div>

			<FeedbackModal
				isOpen={!!err}
				onClose={() => setErr(null)}
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
				description={err ?? "An unexpected error occurred."}
				buttonCount={1}
				buttons={[
					{
						label: "Close",
						variant: "outline",
						onClick: () => setErr(null),
					},
				]}
			/>
		</div>
	)
}
