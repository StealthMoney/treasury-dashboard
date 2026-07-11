"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AiOutlineArrowLeft } from "react-icons/ai"
import Image from "next/image"
import { Spinner } from "../components/reusables/spinner"
import { FeedbackModal } from "../components/reusables/feedback_modal"
import LeftPanel from "../components/reusables/left_panel"
import { signIn } from "next-auth/react"

const CODE_LENGTH = 6
const RESEND_SECONDS = 60

function OtpInputGroup({
	values,
	onChange,
	error,
	disabled,
}: {
	values: string[]
	onChange: (next: string[]) => void
	error?: string
	disabled?: boolean
}) {
	const inputRefs = useRef<Array<HTMLInputElement | null>>([])

	const setValueAt = (index: number, char: string) => {
		const next = [...values]
		next[index] = char
		onChange(next)
	}

	const handleChange = (index: number, raw: string) => {
		// Only ever keep the last typed character, digits only
		const char = raw.replace(/[^0-9]/g, "").slice(-1)
		setValueAt(index, char)

		if (char && index < CODE_LENGTH - 1) {
			inputRefs.current[index + 1]?.focus()
		}
	}

	const handleKeyDown = (
		index: number,
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Backspace") {
			if (values[index]) {
				setValueAt(index, "")
				return
			}
			if (index > 0) {
				e.preventDefault()
				setValueAt(index - 1, "")
				inputRefs.current[index - 1]?.focus()
			}
			return
		}

		if (e.key === "ArrowLeft" && index > 0) {
			e.preventDefault()
			inputRefs.current[index - 1]?.focus()
		}

		if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
			e.preventDefault()
			inputRefs.current[index + 1]?.focus()
		}
	}

	const handlePaste = (
		index: number,
		e: React.ClipboardEvent<HTMLInputElement>
	) => {
		e.preventDefault()
		const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "")

		if (!pasted) return

		const next = [...values]
		let cursor = index

		for (let i = 0; i < pasted.length && cursor < CODE_LENGTH; i++, cursor++) {
			next[cursor] = pasted[i]
		}

		onChange(next)

		const focusIndex = Math.min(cursor, CODE_LENGTH - 1)
		inputRefs.current[focusIndex]?.focus()
	}

	return (
		<div>
			<div className="flex items-center justify-between gap-2">
				{Array.from({ length: CODE_LENGTH }).map((_, index) => (
					<input
						title="otp"
						key={index}
						ref={(el) => {
							inputRefs.current[index] = el
						}}
						type="text"
						inputMode="numeric"
						pattern="[0-9]*"
						autoComplete="one-time-code"
						maxLength={1}
						disabled={disabled}
						value={values[index] ?? ""}
						onChange={(e) => handleChange(index, e.target.value)}
						onKeyDown={(e) => handleKeyDown(index, e)}
						onPaste={(e) => handlePaste(index, e)}
						className={`bg-background text-foreground focus:border-foreground focus:ring-foreground/10 h-14 w-12 rounded-xl border text-center text-2xl font-semibold transition-all outline-none focus:ring-2 disabled:opacity-60 ${
							error ? "border-(--red-1)" : "border-(--grey-1)"
						}`}
					/>
				))}
			</div>
			{error && <p className="mt-2 text-sm text-(--red-1)">{error}</p>}
		</div>
	)
}

export default function VerifyOtpPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const otpChallengeId = searchParams.get("otp_challenge_id")
	const callbackUrl = searchParams.get("callbackUrl") ?? "/credit"

	const [values, setValues] = useState<string[]>(Array(CODE_LENGTH).fill(""))
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)
	const [resending, setResending] = useState(false)
	const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)

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

	useEffect(() => {
		if (!otpChallengeId) {
			setModal({
				open: true,
				type: "error",
				title: "Session Expired",
				description:
					"We couldn't find your verification session. Please log in again.",
			})
		}
	}, [otpChallengeId])

	useEffect(() => {
		if (secondsLeft <= 0) return
		const timer = setInterval(() => {
			setSecondsLeft((s) => s - 1)
		}, 1000)
		return () => clearInterval(timer)
	}, [secondsLeft])

	const code = values.join("")

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault()

		if (!otpChallengeId) return

		if (code.length < CODE_LENGTH) {
			setError("Please enter the complete code")
			return
		}

		try {
			setLoading(true)
			setError("")

			const res = await signIn("credentials", {
				otp_code: code,
				otp_challenge_id: otpChallengeId,
				redirect: false,
				callbackUrl,
			})

			if (res?.error) {
				setError(res.error || "Invalid or expired code")
				return
			}

			router.push("/")
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

	const handleResend = async () => {
		if (secondsLeft > 0 || resending) return

		try {
			setResending(true)

			const res = await fetch("/api/resend_otp", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ otp_challenge_id: otpChallengeId }),
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

			setValues(Array(CODE_LENGTH).fill(""))
			setSecondsLeft(RESEND_SECONDS)
		} catch (err) {
			setModal({
				open: true,
				type: "error",
				title: "Error",
				description: "Something went wrong. Please try again.",
			})
			console.error(err)
		} finally {
			setResending(false)
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
							label: !otpChallengeId ? "Continue" : "Close",
							variant: "primary",
							onClick: () => {
								setModal((m) => ({ ...m, open: false }))
								if (!otpChallengeId) {
									router.push("/")
								}
							},
						},
					]}
				/>

				<div className="h-15 py-4" />

				{/* Main content */}
				<div className="bg-background m-auto flex flex-1 lg:max-w-[90%]">
					<LeftPanel />

					{/* Right panel */}
					<div className="flex flex-1 flex-col justify-center overflow-y-auto px-8 py-10 md:px-16">
						<div className="animate-fade-in-up mx-auto w-full max-w-md">
							<button
								type="button"
								onClick={() => router.push("/")}
								className="hover:text-foreground mb-6 flex items-center gap-2 text-sm text-(--text-1) transition-colors hover:cursor-pointer">
								<AiOutlineArrowLeft size={16} />
								Back to login
							</button>

							<div className="mb-8">
								<h1 className="text-foreground text-[20px] font-medium">
									Verify Your Email
								</h1>
								<p className="mt-1 text-[16px] text-(--text-1)">
									Enter the 6-digit code we sent to your email.
								</p>
							</div>

							<form onSubmit={handleSubmit} className="space-y-6">
								<OtpInputGroup
									values={values}
									onChange={(next) => {
										setValues(next)
										if (error) setError("")
									}}
									error={error}
									disabled={loading}
								/>

								<button
									disabled={loading}
									type="submit"
									className="flex w-full cursor-pointer items-center justify-center gap-x-2 rounded-xl bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 active:bg-black disabled:opacity-60">
									Verify Code {loading && <Spinner />}
								</button>
							</form>

							<p className="mt-6 text-center text-[16px] text-(--text-1)">
								Didn&apos;t get a code?{" "}
								{secondsLeft > 0 ? (
									<span className="font-medium text-(--text-1)">
										Resend in {secondsLeft}s
									</span>
								) : (
									<button
										type="button"
										onClick={handleResend}
										disabled={resending}
										className="text-foreground border-none bg-transparent p-0 font-medium underline hover:cursor-pointer disabled:opacity-60">
										{resending ? "Resending..." : "Resend Code"}
									</button>
								)}
							</p>
						</div>
					</div>
				</div>

				<div className="h-16" />
			</div>
		</>
	)
}
