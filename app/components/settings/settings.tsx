"use client"

import { useState } from "react"
import { PasswordField } from "../reusables/general_inputs"
import { AiOutlineCheck } from "react-icons/ai"

interface PasswordCriteria {
	minChars: boolean
	uppercase: boolean
	special: boolean
	lowercase: boolean
	numbers: boolean
}

export function PasswordSettingTab() {
	const [oldPassword, setOldPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [criteria, setCriteria] = useState<PasswordCriteria>({
		minChars: false,
		uppercase: false,
		special: false,
		lowercase: false,
		numbers: false,
	})

	const checkPasswordCriteria = (password: string) => {
		setCriteria({
			minChars: password.length >= 10,
			uppercase: /[A-Z]/.test(password),
			special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
			lowercase: /[a-z]/.test(password),
			numbers: /[0-9]/.test(password),
		})
	}

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {}

		if (!oldPassword.trim()) {
			newErrors.oldPassword = "Old password is required"
		}

		if (!newPassword.trim()) {
			newErrors.newPassword = "New password is required"
		} else if (newPassword.length < 10) {
			newErrors.newPassword = "Password must be at least 10 characters"
		}

		if (!confirmPassword.trim()) {
			newErrors.confirmPassword = "Please confirm your password"
		} else if (newPassword !== confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match"
		}

		if (newPassword === oldPassword) {
			newErrors.newPassword = "New password must be different from old password"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleNewPasswordChange = (value: string) => {
		setNewPassword(value)
		checkPasswordCriteria(value)
	}

	const handleSave = () => {
		if (validateForm()) {
			alert("Password changed successfully!")
			setOldPassword("")
			setNewPassword("")
			setConfirmPassword("")
			setCriteria({
				minChars: false,
				uppercase: false,
				special: false,
				lowercase: false,
				numbers: false,
			})
		}
	}

	return (
		<div className="space-y-6">
			<div>
				<h3 className="mb-6 text-lg font-semibold">Password Settings</h3>

				<div className="max-w-xl space-y-4">
					{/* Old Password */}
					<div>
						<h4 className="mb-2 text-sm font-medium">Old Password</h4>
						<PasswordField
							label=""
							id="oldPassword"
							placeholder="Password"
							value={oldPassword}
							onChange={setOldPassword}
							error={errors.oldPassword}
						/>
					</div>

					{/* New Password and Confirm Password */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<h4 className="mb-2 text-sm font-medium">New Password</h4>
							<PasswordField
								label=""
								id="newPassword"
								placeholder="Password"
								value={newPassword}
								onChange={handleNewPasswordChange}
								error={errors.newPassword}
							/>
						</div>
						<div>
							<h4 className="mb-2 text-sm font-medium">Confirm Password</h4>
							<PasswordField
								label=""
								id="confirmPassword"
								placeholder="Password"
								value={confirmPassword}
								onChange={setConfirmPassword}
								error={errors.confirmPassword}
							/>
						</div>
					</div>

					{/* Password Criteria */}
					<div className="bg-muted/50 mt-6 rounded-lg p-4">
						<div className="flex flex-wrap gap-4">
							<label className="flex cursor-pointer items-center gap-2">
								<div
									className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
										criteria.minChars ? "border-green-500 bg-green-500" : "border-border"
									}`}>
									{criteria.minChars && (
										<AiOutlineCheck className="h-3 w-3 text-white" />
									)}
								</div>
								<span className="text-sm">10 characters</span>
							</label>

							<label className="flex cursor-pointer items-center gap-2">
								<div
									className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
										criteria.uppercase ? "border-green-500 bg-green-500" : "border-border"
									}`}>
									{criteria.uppercase && (
										<AiOutlineCheck className="h-3 w-3 text-white" />
									)}
								</div>
								<span className="text-sm">Uppercase</span>
							</label>

							<label className="flex cursor-pointer items-center gap-2">
								<div
									className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
										criteria.special ? "border-green-500 bg-green-500" : "border-border"
									}`}>
									{criteria.special && <AiOutlineCheck className="h-3 w-3 text-white" />}
								</div>
								<span className="text-sm">Special Character</span>
							</label>

							<label className="flex cursor-pointer items-center gap-2">
								<div
									className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
										criteria.lowercase ? "border-green-500 bg-green-500" : "border-border"
									}`}>
									{criteria.lowercase && (
										<AiOutlineCheck className="h-3 w-3 text-white" />
									)}
								</div>
								<span className="text-sm">Lowercase</span>
							</label>

							<label className="flex cursor-pointer items-center gap-2">
								<div
									className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
										criteria.numbers ? "border-green-500 bg-green-500" : "border-border"
									}`}>
									{criteria.numbers && <AiOutlineCheck className="h-3 w-3 text-white" />}
								</div>
								<span className="text-sm">Numbers</span>
							</label>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-center pt-4">
				<button
					onClick={handleSave}
					className="rounded-lg bg-black px-8 py-3 font-medium text-white transition-colors hover:bg-black/90">
					Save Changes
				</button>
			</div>
		</div>
	)
}
