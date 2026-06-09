"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AiOutlineCheck } from "react-icons/ai"
import Image from "next/image"
import { Spinner } from "@/app/components/reusables/spinner"
import { FeedbackModal } from "@/app/components/reusables/feedback_modal"
import LeftPanel from "@/app/components/reusables/left_panel"
import { InputField } from "@/app/components/reusables/general_inputs"

const PASSWORD_CRITERIA = [
	{
		key: "length",
		label: "10 characters",
		test: (p: string) => p.length >= 10,
	},
	{ key: "upper", label: "Uppercase", test: (p: string) => /[A-Z]/.test(p) },
	{
		key: "special",
		label: "Special Character",
		test: (p: string) => /[^A-Za-z0-9]/.test(p),
	},
	{ key: "lower", label: "Lowercase", test: (p: string) => /[a-z]/.test(p) },
	{ key: "number", label: "Numbers", test: (p: string) => /[0-9]/.test(p) },
]

function ResetPasswordForm({
	loading,
	onSubmit,
}: {
	loading: boolean
	onSubmit: (password: string, confirmPassword: string) => void
}) {
	const [form, setForm] = useState({
		password: "",
		confirmPassword: "",
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [showPw, setShowPw] = useState(false)
	const [showConfirmPw, setShowConfirmPw] = useState(false)

	const set = (k: string) => (v: string) => {
		setForm((f) => ({ ...f, [k]: v }))
		if (errors[k]) {
			setErrors((e) => ({ ...e, [k]: "" }))
		}
	}

	const validate = () => {
		const e: Record<string, string> = {}

		if (!form.password) {
			e.password = "New Password is required"
		} else if (PASSWORD_CRITERIA.some((c) => !c.test(form.password))) {
			e.password = "Password does not meet all criteria"
		}

		if (!form.confirmPassword) {
			e.confirmPassword = "Please confirm your new password"
		} else if (form.password !== form.confirmPassword) {
			e.confirmPassword = "Passwords do not match"
		}

		setErrors(e)
		return Object.keys(e).length === 0
	}

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault()
		if (validate()) {
			onSubmit(form.password, form.confirmPassword)
		}
	}

	const criteriaMet = PASSWORD_CRITERIA.map((c) => c.test(form.password))

	return (
		<div className="animate-fade-in-up mx-auto w-full max-w-md">
			<div className="mb-6">
				<h1 className="text-foreground text-[20px] font-medium">
					Reset Your Password
				</h1>
				<p className="mt-1 text-[16px] text-(--text-1)">
					Enter and confirm your new password to reset your password
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				<InputField
					label="New Password"
					id="newPassword"
					placeholder=""
					value={form.password}
					onChange={set("password")}
					error={errors.password}
					showToggle
					showPassword={showPw}
					onToggle={() => setShowPw(!showPw)}
				/>

				<InputField
					label="Confirm New Password"
					id="confirmPassword"
					placeholder=""
					value={form.confirmPassword}
					onChange={set("confirmPassword")}
					error={errors.confirmPassword}
					showToggle
					showPassword={showConfirmPw}
					onToggle={() => setShowConfirmPw(!showConfirmPw)}
				/>

				<div className="grid grid-cols-3 gap-2 pt-1">
					{PASSWORD_CRITERIA.map((c, i) => (
						<div
							key={c.key}
							className="flex items-center gap-1.5 rounded-full border border-(--grey-1) px-1 py-1">
							<div
								className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${criteriaMet[i] ? "border-[#009D50] bg-[#009D50]" : "border-(--grey-1)"}`}>
								{criteriaMet[i] && <AiOutlineCheck size={10} className="text-white" />}
							</div>
							<span
								className={`text-xs transition-colors duration-200 ${criteriaMet[i] ? "font-medium text-[#009D50]" : "text-gray-500"}`}>
								{c.label}
							</span>
						</div>
					))}
				</div>

				<div className="pt-2">
					<button
						disabled={loading}
						type="submit"
						className="bg-foreground active:bg-foreground text-background flex w-full items-center justify-center gap-x-2 rounded-xl py-3 text-sm font-medium transition-colors hover:cursor-pointer">
						Reset Password {loading && <Spinner />}
					</button>
				</div>
			</form>
		</div>
	)
}

export default function Page() {
	const router = useRouter()
	const [loading, setLoading] = useState<boolean>(false)

	const [modal, setModal] = useState<{
		open: boolean
		type: "success" | "error"
		title: string
		description: string
	}>({
		open: false,
		type: "success",
		title: "",
		description: "",
	})

	const searchParams = useSearchParams()
	const key = searchParams.get("key")

	useEffect(() => {
		if (!key) {
			setModal({
				open: true,
				type: "error",
				title: "Invalid Request",
				description: "Invalid request attempt. Missing required key parameter.",
			})
		}
	}, [key])

	const handleResetPassword = async (password: string) => {
		if (!key) {
			setModal({
				open: true,
				type: "error",
				title: "Invalid Request",
				description: "Invalid request attempt. Missing required key parameter.",
			})
			return
		}

		try {
			setLoading(true)

			const res = await fetch("/api/reset_password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					key,
					newPassword: password,
				}),
			})

			const result = await res.json()

			if (!res.ok) {
				setModal({
					open: true,
					type: "error",
					title: "Request Failed",
					description: result.message || "Something went wrong. Please try again.",
				})
				return
			}

			setModal({
				open: true,
				type: "success",
				title: "Password Reset Successful",
				description:
					"Your password has been reset successfully. You can now log in with your new password.",
			})
		} catch (err) {
			setModal({
				open: true,
				type: "error",
				title: "Error",
				description: "Something went wrong. Please try again.",
			})
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.35s ease forwards;
                }
            `}</style>

			<div className="flex min-h-screen flex-col bg-[#FBFBFB]">
				<FeedbackModal
					isOpen={modal.open}
					onClose={() => {
						setModal((m) => ({ ...m, open: false }))
						if (modal.type === "success") {
							router.push("/")
						}
					}}
					icon={
						<Image
							src={
								modal.type === "success" ? "/images/mail.svg" : "/images/failed.svg"
							}
							className="h-24 w-24"
							width={50}
							height={50}
							alt="icon"
						/>
					}
					title={modal.title}
					description={modal.description}
					buttonCount={1}
					buttons={[
						{
							label: modal.type === "success" || !key ? "Go to Login" : "close",
							variant: "primary",
							onClick: () => {
								setModal((m) => ({ ...m, open: false }))
								if (modal.type === "success" || !key) router.push("/")
							},
						},
					]}
				/>

				<div className="h-15 py-4" />

				{/* Main content */}
				<div className="bg-background m-auto flex flex-1 lg:max-w-[90%]">
					<LeftPanel />

					<div className="flex flex-1 flex-col justify-center overflow-y-auto px-8 py-10 md:px-16">
						<ResetPasswordForm loading={loading} onSubmit={handleResetPassword} />
					</div>
				</div>

				<div className="h-16" />
			</div>
		</>
	)
}
