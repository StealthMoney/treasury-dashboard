import Image from "next/image"

type KybStatus = "ACTIVE" | "PENDING_REVIEW" | "SUSPENDED" | null

interface KybBannerProps {
	kybStatus: KybStatus
	onAction: () => void
}

export default function KybBanner({ kybStatus, onAction }: KybBannerProps) {
	const contentMap: Record<
		string,
		{ header: string; text: string; button: string | null }
	> = {
		null: {
			header: "Upgrade Your Account",
			text:
				"Upgrade your account by verifying your business (KYB) to unlock all platform features.",
			button: "Upgrade your account",
		},
		PENDING_REVIEW: {
			header: "Your verification is under review",
			text:
				"We're reviewing your business details. This usually takes 24–48 hours. You'll be notified once your account is approved.",
			button: null,
		},
		SUSPENDED: {
			header: "Verification failed.",
			text:
				"We couldn't verify your business details. Please review your information and try again.",
			button: "Retry verification",
		},
	}

	const current = contentMap[String(kybStatus)] // ← coerce null → "null"

	if (!current) return null

	return (
		<div className="mb-8 flex w-full flex-col items-center justify-between rounded-2xl border border-[#FFC299] bg-[#FFF6F0] px-6 md:flex-row">
			<div className="w-full space-y-1 md:max-w-[40%]">
				<h1 className="text-foreground text-[20px] font-semibold">
					{current.header}
				</h1>

				<p className="text-[14px] text-[#602600]">{current.text}</p>

				{current.button && (
					<button
						onClick={onAction}
						className="bg-foreground text-background mt-1 cursor-pointer rounded-lg px-2 py-2">
						{current.button}
					</button>
				)}
			</div>

			<div className="hidden md:flex">
				<Image
					src={
						kybStatus === null
							? "/images/prompt.svg"
							: kybStatus === "PENDING_REVIEW"
								? "/images/under_review.svg"
								: "/images/failed.svg"
					}
					alt="kyb_status"
					className="w-full"
					width={100}
					height={100}
				/>
			</div>
		</div>
	)
}
