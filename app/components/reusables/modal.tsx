"use client"

import React, { ReactNode } from "react"
import { HiXMark } from "react-icons/hi2"
import Image from "next/image"
import { Spinner } from "./spinner"
import { usePathname } from "next/navigation"

export interface StepConfig {
	title: string
	description?: string
	content: ReactNode
	actionLabel?: string
	showBackButton?: boolean
}

export interface StepModalProps {
	isOpen: boolean
	onClose: () => void
	title: string
	subtitle?: string
	steps: StepConfig[]
	currentStep: number
	onNextStep: () => void
	onPreviousStep: () => void
	onSubmit?: () => void
	isSuccess?: boolean
	amount?: string
	isError?: string
	imagePath?: string
	loading?: boolean
	repaySuccess?: boolean
	successTitle?: string
	successMessage?: string | ReactNode
	successButtonLabel?: string
	successtable?: ReactNode
}

export const StepModal: React.FC<StepModalProps> = ({
	isOpen,
	onClose,
	title,
	subtitle,
	steps,
	currentStep,
	onNextStep,
	onPreviousStep,
	onSubmit,
	amount,
	isSuccess,
	isError,
	imagePath,
	loading,
	successTitle,
	successMessage,
	successButtonLabel,
	successtable,
	repaySuccess,
}) => {
	const pathname = usePathname()

	if (!isOpen) return null

	const isLastStep = currentStep === steps.length - 1
	const currentStepConfig = steps[currentStep]

	return (
		<div className="fixed inset-0 z-50">
			{/* Overlay */}
			<div
				className="absolute inset-0 bg-black/50"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Right-side Panel Modal */}
			<div className="fixed top-0 right-0 flex h-screen w-full max-w-lg flex-col overflow-hidden bg-white shadow-lg">
				{/* Header */}
				<div className="flex shrink-0 items-start justify-between p-6">
					<div>
						<h2 className="text-foreground text-[20px] font-bold">{title}</h2>
						{subtitle && (
							<p className="mt-1 text-[14px] text-(--text-1)">{subtitle}</p>
						)}
					</div>
					<button
						onClick={onClose}
						className="shrink-0 text-gray-400 transition hover:text-gray-600"
						aria-label="Close modal">
						<HiXMark className="h-6 w-6" />
					</button>
				</div>

				{/* Content - Scrollable */}
				<div className="flex-1 overflow-y-auto p-6">
					{isSuccess ? (
						/* Success Screen */
						<>
							<div className="flex flex-col items-center justify-center py-8">
								<Image
									src={imagePath || "/images/success.svg"}
									width={100}
									height={100}
									alt="success"
									className="mb-6 h-24 w-24"
								/>

								<h3 className="text-foreground mb-2 text-center text-[20px] font-bold">
									{successTitle}
								</h3>

								{repaySuccess && (
									<div className="flex w-full flex-col items-center justify-center">
										<p className="text-center text-[14px] text-(--text-1)">
											Your credit payment of{" "}
											<span className="text-foreground font-semibold">₦{amount}</span> has
											been completed successfully
										</p>
									</div>
								)}

								<p className="text-center text-[14px] text-(--text-1)">
									{successMessage}
								</p>
							</div>

							{successtable}

							{isError && isError !== "" && (
								<p className="text-center text-[14px] text-(--red-1)">{isError}</p>
							)}
						</>
					) : (
						/* Step Content */
						<>
							{!pathname.match("/report") && (
								<div className="mb-6">
									<p className="text-center text-[16px] font-semibold tracking-wide">
										<span className="text-foreground">STEP {currentStep + 1}</span>
										<span className="text-(--text-1)">
											/{steps.length} - {currentStepConfig.title}{" "}
										</span>
									</p>
								</div>
							)}
							<div>{currentStepConfig.content}</div>
						</>
					)}
				</div>

				{/* Footer */}
				<div className="bg-background flex shrink-0 gap-3 p-6">
					{!isSuccess && !pathname.match("/report") && (
						<button
							onClick={onPreviousStep}
							disabled={currentStep === 0 || loading}
							className="flex-1 rounded-lg border border-(--grey-1) px-4 py-3 font-semibold text-gray-900 transition hover:bg-(--grey-4) disabled:cursor-not-allowed disabled:opacity-50">
							Go Back
						</button>
					)}
					<button
						disabled={loading}
						onClick={
							isSuccess ? onClose : isLastStep ? onSubmit || onNextStep : onNextStep
						}
						className={`bg-foreground text-background hover:bg-foreground/85 flex flex-1 cursor-pointer items-center justify-center gap-x-3 rounded-lg px-4 py-3 transition`}>
						{isSuccess
							? successButtonLabel || "Close"
							: pathname.match("/report")
								? "Generate Report"
								: isLastStep
									? "Submit"
									: "Continue"}

						{loading && <Spinner />}
					</button>
				</div>
			</div>
		</div>
	)
}
