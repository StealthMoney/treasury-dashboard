"use client"

import { useProfile } from "@/app/contexts/user_provider"
import { FeedbackModal } from "./feedback_modal"
import { useSession } from "next-auth/react"

export default function GlobalProfileGuard({
	children,
}: {
	children: React.ReactNode
}) {
	const { error, retry, logout } = useProfile()
	const { status } = useSession()

	const shouldShowModal = status === "authenticated" && !!error

	return (
		<>
			{children}

			<FeedbackModal
				isOpen={shouldShowModal}
				onClose={() => {}}
				title="Something went wrong"
				description="Couldn't get your data. Please try again."
				buttonCount={2}
				buttons={[
					{
						label: "Retry",
						variant: "outline",
						onClick: retry,
					},
					{
						label: "Logout",
						variant: "primary",
						onClick: logout,
					},
				]}
			/>
		</>
	)
}
