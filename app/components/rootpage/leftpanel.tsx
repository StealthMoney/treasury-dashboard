"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
	AiOutlineEye,
	AiOutlineEyeInvisible,
	AiOutlineCheck,
	AiOutlineArrowLeft,
} from "react-icons/ai"
import Image from "next/image"
import { Spinner } from "../reusables/spinner"
import { signIn } from "next-auth/react"
import { FeedbackModal } from "../reusables/feedback_modal"
import LeftPanel from "../reusables/left_panel"
import { InputField } from "../reusables/general_inputs"

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

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function ForgotPasswordForm({
	onBack,
	loading,
	onSubmit,
}: {
	onBack: () => void
	loading: boolean
	onSubmit: (email: string) => void
}) {
	const [email, setEmail] = useState("")
	const [error, setError] = useState("")

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault()
		if (!email.trim()) {
			setError("Email Address is required")
			return
		}
		if (!isValidEmail(email)) {
			setError("Incorrect format for Email Address")
			return
		}
		setError("")
		onSubmit(email)
	}

	return (
		<div className="animate-fade-in-up mx-auto w-full max-w-md">
			<button
				type="button"
				onClick={onBack}
				className="hover:text-foreground mb-6 flex items-center gap-2 text-sm text-(--text-1) transition-colors hover:cursor-pointer">
				<AiOutlineArrowLeft size={16} />
				Back to login
			</button>

			<div className="mb-6">
				<h1 className="text-foreground text-[20px] font-medium">
					Reset Your Password
				</h1>
				<p className="mt-1 text-[16px] text-(--text-1)">
					Enter your email address and we&apos;ll send you a link to reset your
					password.
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				<InputField
					label="Email Address"
					id="forgotEmail"
					type="email"
					placeholder=""
					value={email}
					onChange={(v) => {
						setEmail(v)
						if (error) setError("")
					}}
					error={error}
				/>

				<div className="pt-2">
					<button
						disabled={loading}
						type="submit"
						className="flex w-full cursor-pointer items-center justify-center gap-x-2 rounded-xl bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 active:bg-black disabled:opacity-60">
						Send Reset Link {loading && <Spinner />}
					</button>
				</div>
			</form>
		</div>
	)
}

function SignUpForm({
	onSuccess,
	loading,
}: {
	onSuccess: (data: {
		firstName: string
		lastName: string
		email: string
		password: string
	}) => void
	loading: boolean
}) {
	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [showPw, setShowPw] = useState(false)

	const set = (k: string) => (v: string) => setForm((f) => ({ ...f, [k]: v }))

	const validate = () => {
		const e: Record<string, string> = {}
		if (!form.firstName.trim()) e.firstName = "First Name is required"
		if (!form.lastName.trim()) e.lastName = "Last Name is required"
		if (!form.email.trim()) e.email = "Email Address is required"
		else if (!isValidEmail(form.email))
			e.email = "Incorrect format for Email Address"
		if (!form.password) e.password = "Password is required"
		else if (PASSWORD_CRITERIA.some((c) => !c.test(form.password)))
			e.password = "Password does not meet all criteria"
		setErrors(e)
		return Object.keys(e).length === 0
	}

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault()
		if (validate()) onSuccess(form)
	}

	const criteriaMet = PASSWORD_CRITERIA.map((c) => c.test(form.password))

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-2 gap-3">
				<InputField
					label="First Name"
					id="firstName"
					placeholder=""
					value={form.firstName}
					onChange={set("firstName")}
					error={errors.firstName}
				/>
				<InputField
					label="Last Name"
					id="lastName"
					placeholder=""
					value={form.lastName}
					onChange={set("lastName")}
					error={errors.lastName}
				/>
			</div>
			<InputField
				label="Email Address"
				id="email"
				type="email"
				placeholder=""
				value={form.email}
				onChange={set("email")}
				error={errors.email}
			/>
			<InputField
				label="Password"
				id="password"
				placeholder=""
				value={form.password}
				onChange={set("password")}
				error={errors.password}
				showToggle
				showPassword={showPw}
				onToggle={() => setShowPw(!showPw)}
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
					className="flex w-full cursor-pointer items-center justify-center gap-x-2 rounded-xl bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 active:bg-black">
					Create Account {loading && <Spinner />}
				</button>
			</div>
			<p className="text-center text-xs text-gray-500">
				By creating an account, you agree to Stealth Treasury&apos;s{" "}
				<a
					href="#"
					className="font-medium text-gray-700 underline hover:text-gray-900">
					Terms
				</a>
			</p>
		</form>
	)
}

function SignInForm({
	onSuccess,
	loading,
	onForgotPassword,
}: {
	onSuccess: (data: { email: string; password: string }) => void
	loading: boolean
	onForgotPassword: () => void
}) {
	const [form, setForm] = useState({ email: "", password: "" })
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [showPw, setShowPw] = useState(false)

	const set = (k: string) => (v: string) => setForm((f) => ({ ...f, [k]: v }))

	const validate = () => {
		const e: Record<string, string> = {}
		if (!form.email.trim()) e.email = "Email Address is required"
		else if (!isValidEmail(form.email))
			e.email = "Incorrect format for Email Address"
		if (!form.password) e.password = "Password is required"
		setErrors(e)
		return Object.keys(e).length === 0
	}

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault()
		if (validate()) onSuccess(form)
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<InputField
				label="Email Address"
				id="signinEmail"
				type="email"
				placeholder=""
				value={form.email}
				onChange={set("email")}
				error={errors.email}
			/>
			<InputField
				label="Password"
				id="signinPassword"
				placeholder=""
				value={form.password}
				onChange={set("password")}
				error={errors.password}
				showToggle
				showPassword={showPw}
				onToggle={() => setShowPw(!showPw)}
			/>

			<p className="text-center text-[16px] text-(--text-1)">
				Forgot your password?{" "}
				<button
					type="button"
					onClick={onForgotPassword}
					className="text-foreground border-none bg-transparent p-0 font-medium underline hover:cursor-pointer">
					Click here
				</button>
			</p>
			<div className="lg:mt-32">
				<button
					disabled={loading}
					type="submit"
					className="bg-foreground active:bg-foreground text-background flex w-full items-center justify-center gap-x-2 rounded-xl py-3 text-sm font-medium transition-colors hover:cursor-pointer">
					Sign In {loading && <Spinner />}
				</button>
			</div>
		</form>
	)
}

export default function AuthPage() {
	const router = useRouter()
	const [tab, setTab] = useState<"signup" | "signin">("signin")
	const [view, setView] = useState<"auth" | "forgot-password">("auth")
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
	const callbackUrl = searchParams.get("callbackUrl") ?? "/credit"

	const handleRegister = async (data: {
		firstName: string
		lastName: string
		email: string
		password: string
	}) => {
		try {
			setLoading(true)

			const payload = {
				...data,
				login: data.email,
			}

			const res = await fetch("/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			})

			const result = await res.json()
			if (!res.ok) {
				setModal({
					open: true,
					type: "error",
					title: "Registration Failed",
					description: result.message || "Something went wrong",
				})
				return
			}

			setModal({
				open: true,
				type: "success",
				title: "Check Your mail",
				description:
					"Your account has been created successfully. We've sent an activation email to your inbox. Please check your email to activate your account.",
			})
		} catch (err) {
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const handleLogin = async (data: { email: string; password: string }) => {
		try {
			setLoading(true)
			const res = await signIn("credentials", {
				username: data.email,
				password: data.password,
				redirect: false,
				callbackUrl,
			})

			if (res && !res.ok) {
				setModal({
					open: true,
					type: "error",
					title: "Login Failed",
					description: "Invalid credentials",
				})
				return
			}

			router.push("/credit")
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

	const handleForgotPassword = async (email: string) => {
		try {
			setLoading(true)

			const res = await fetch("/api/forgot_password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
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
				title: "Check Your Mail",
				description:
					"If an account exists for that email, we've sent a password reset link. Please check your inbox.",
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
					onClose={() => setModal((m) => ({ ...m, open: false }))}
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
							label: "Close",
							variant: "primary",
							onClick: () => setModal((m) => ({ ...m, open: false })),
						},
					]}
				/>

				{/* Top nav — hidden when on forgot password view */}
				{view === "auth" && (
					<div className="flex justify-center py-4">
						<div className="flex rounded-full bg-[#F5F5F5] p-1">
							<button
								onClick={() => setTab("signup")}
								className={`cursor-pointer rounded-full px-6 py-2 text-[16px] font-medium transition-all ${tab === "signup" ? "bg-background text-foreground border border-(--grey-1) shadow-sm" : "text-(--text-1)"}`}>
								Sign Up
							</button>
							<button
								onClick={() => setTab("signin")}
								className={`cursor-pointer rounded-full px-6 py-2 text-[16px] font-medium transition-all ${tab === "signin" ? "bg-background text-foreground border border-(--grey-1) shadow-sm" : "text-(--text-1)"}`}>
								Sign In
							</button>
						</div>
					</div>
				)}

				{/* Spacer when top nav is hidden so layout height stays consistent */}
				{view === "forgot-password" && <div className="h-15 py-4" />}

				{/* Main content */}
				<div className="bg-background m-auto flex flex-1 lg:max-w-[90%]">
					<LeftPanel />

					{/* Right panel */}
					<div className="flex flex-1 flex-col justify-center overflow-y-auto px-8 py-10 md:px-16">
						{view === "forgot-password" ? (
							<ForgotPasswordForm
								onBack={() => {
									setView("auth")
									setTab("signin")
								}}
								loading={loading}
								onSubmit={handleForgotPassword}
							/>
						) : (
							<div className="animate-fade-in-up mx-auto w-full max-w-md">
								{tab === "signup" ? (
									<>
										<div className="mb-6">
											<h1 className="text-foreground text-[20px] font-medium">
												Create Your Account
											</h1>
											<p className="mt-1 text-[16px] text-(--text-1)">
												Let&apos;s start with basic information.
											</p>
										</div>
										<SignUpForm onSuccess={handleRegister} loading={loading} />
									</>
								) : (
									<>
										<div className="mb-6">
											<h1 className="text-foreground text-[20px] font-medium">
												Welcome Back
											</h1>
											<p className="mt-1 text-[16px] text-(--text-1)">
												Enter your email and password to pick up where you stopped.
											</p>
										</div>
										<SignInForm
											onSuccess={handleLogin}
											loading={loading}
											onForgotPassword={() => setView("forgot-password")}
										/>
									</>
								)}
							</div>
						)}
					</div>
				</div>

				<div className="h-16" />
			</div>
		</>
	)
}
