"use client"
import { SessionProvider } from "next-auth/react"
import AuthGuard from "./authguard"
import { ProfileProvider } from "@/app/contexts/user_provider"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function ProvideWrapper({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<SessionProvider>
			<AuthGuard>
				<ProfileProvider>{children}</ProfileProvider>
			</AuthGuard>
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				pauseOnHover
				theme="light"
				toastClassName="custom-toast"
				className="custom-toast-body"
				progressClassName="custom-toast-progress"
			/>
		</SessionProvider>
	)
}
