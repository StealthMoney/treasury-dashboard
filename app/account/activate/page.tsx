"use client"
import { useSearchParams } from "next/navigation"
import React, { Suspense } from "react"
import { activate } from "@/app/server/activate"

import { FeedbackModal } from "@/app/components/reusables/feedback_modal"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { LineLoader } from "@/app/components/reusables/line_loader"

interface Data {
	status: number
	message: string
}

const ActivationContent = () => {
	const searchParams = useSearchParams()
	const key = searchParams.get("key")
	const router = useRouter()

	const [loading, setLoading] = React.useState(true)
	const [data, setData] = React.useState<Data | null>(null)
	const hasActivated = React.useRef(false)

	React.useEffect(() => {
		if (hasActivated.current) return
		hasActivated.current = true

		const runActivation = async () => {
			if (!key) {
				setData({
					status: 400,
					message: "Invalid or missing activation link.",
				})
				setLoading(false)
				return
			}

			try {
				const res = await activate(key)
				setData(res)
			} catch (err) {
				console.error("Something went wrong", err)
				setData({
					status: 500,
					message: "Something went wrong.",
				})
			} finally {
				setLoading(false)
			}
		}

		runActivation()
	}, [key])

	if (loading) {
		return (
			<div className="bg-background flex min-h-screen items-center justify-center">
				<LineLoader className="scale-125" />
			</div>
		)
	}

	const isSuccess = data?.status === 200

	return (
		<div className="bg-background flex min-h-screen items-center justify-center">
			<FeedbackModal
				isOpen={true}
				onClose={() => router.push("/")}
				icon={
					<Image
						src={isSuccess ? "/images/success.svg" : "/images/failed.svg"}
						className="h-24 w-24"
						width={50}
						height={50}
						alt="icon"
					/>
				}
				title={isSuccess ? "Activation Successful" : "Activation Failed"}
				description={
					isSuccess
						? "Your account has been successfully activated."
						: data?.message || "We couldn't activate your account."
				}
				buttonCount={isSuccess ? 1 : 2}
				buttons={
					isSuccess
						? [
								{
									label: "Continue to Login",
									variant: "primary",
									onClick: () => router.push("/"),
								},
							]
						: [
								{
									label: "Go Home",
									variant: "outline",
									onClick: () => router.push("/"),
								},
								{
									label: "Retry Activation",
									variant: "primary",
									onClick: () => window.location.reload(),
								},
							]
				}
			/>
		</div>
	)
}

const LoadingFallback = () => (
	<div className="bg-background flex min-h-screen items-center justify-center">
		<LineLoader className="scale-125" />
	</div>
)

export default function Page() {
	return (
		<Suspense fallback={<LoadingFallback />}>
			<ActivationContent />
		</Suspense>
	)
}
