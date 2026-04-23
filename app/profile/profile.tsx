"use client"

import { useState, useRef, ChangeEvent } from "react"
import { TextField } from "../components/reusables/general_inputs"
import { KYBStepWrapper } from "../components/reusables/kybstepwraper"
import Image from "next/image"
import { useProfile } from "../contexts/user_provider"
import PageSkeleton from "../components/reusables/page_skeleton"

interface ProfileTabProps {
	onSave?: (data: ProfileData) => void
}

interface ProfileData {
	firstName: string
	lastName: string
	emailAddress: string
	phoneNumber: string
	logoFile?: File
}

export function ProfileTab({ onSave }: ProfileTabProps) {
	const { user, loading } = useProfile()

	const [data, setData] = useState<ProfileData>({
		firstName: user?.firstName || "",
		lastName: user?.lastName || "",
		emailAddress: user?.email || "",
		phoneNumber: "",
	})

	const [logoPreview, setLogoPreview] = useState<string | null>(null)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [uploadedFileName, setUploadedFileName] = useState<string>("")
	const fileInputRef = useRef<HTMLInputElement>(null)

	const validateEmail = (email: string): boolean => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	}

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {}

		if (!data.firstName.trim()) {
			newErrors.firstName = "First name is required"
		}

		if (!data.lastName.trim()) {
			newErrors.lastName = "Last name is required"
		}

		if (!data.emailAddress.trim()) {
			newErrors.emailAddress = "Email is required"
		} else if (!validateEmail(data.emailAddress)) {
			newErrors.emailAddress = "Please enter a valid email (e.g., name@domain.com)"
		}

		if (!data.phoneNumber.trim()) {
			newErrors.phoneNumber = "Phone number is required"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			if (!file.type.startsWith("image/")) {
				setErrors((prev) => ({
					...prev,
					logo: "Only image files are allowed",
				}))
				return
			}

			setUploadedFileName(file.name)
			setData((prev) => ({ ...prev, logoFile: file }))
			setLogoPreview(URL.createObjectURL(file))

			setErrors((prev) => {
				const { logo, ...rest } = prev
				return rest
			})
		}
	}

	const handleSave = () => {
		if (validateForm()) {
			onSave?.(data)
			alert("Profile saved successfully!")
		}
	}

	if (loading) {
		return (
			<div className="bg-background min-h-screen w-full px-6">
				<div className="w-full overflow-x-auto md:max-w-[80%]">
					<PageSkeleton />
				</div>
			</div>
		)
	}

	return (
		<KYBStepWrapper title="Profile">
			<div className="space-y-6">
				<div>
					{/* Logo Upload */}
					<div className="mb-6 flex items-start gap-4">
						<div className="shrink-0">
							<div className="bg-muted flex h-20 w-20 items-center justify-center overflow-hidden rounded-full">
								<Image
									src={logoPreview || "/images/pending.svg"}
									alt="profile image preview"
									className="h-full w-full rounded-full object-cover"
									width={100}
									height={100}
								/>
							</div>
						</div>
						<div className="flex-1">
							<div className="space-y-2">
								<h4 className="font-medium">Profile Picture</h4>
								<button
									disabled
									type="button"
									onClick={() => fileInputRef.current?.click()}
									className="text-foreground/70 hover:text-foreground flex items-center gap-2 transition-colors">
									<span className="text-xl">+</span>
									<span>Upload file</span>
								</button>
								{errors.logo && <p className="text-xs text-red-500">{errors.logo}</p>}
							</div>
							<input
								disabled
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								className="hidden"
								aria-label="Upload profile picture"
							/>
						</div>
					</div>

					{/* Form Fields */}
					<div className="space-y-4">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<TextField
								disabled
								label="First Name"
								id="firstName"
								placeholder="Enter first name"
								value={data.firstName}
								onChange={(v) => setData((prev) => ({ ...prev, firstName: v }))}
								error={errors.firstName}
							/>
							<TextField
								disabled
								label="Last Name"
								id="lastName"
								placeholder="Enter last name"
								value={data.lastName}
								onChange={(v) => setData((prev) => ({ ...prev, lastName: v }))}
								error={errors.lastName}
							/>
						</div>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<TextField
								disabled
								label="Email Address"
								id="emailAddress"
								placeholder="Enter email"
								type="email"
								value={data.emailAddress}
								onChange={(v) => setData((prev) => ({ ...prev, emailAddress: v }))}
								error={errors.emailAddress}
							/>
							<TextField
								disabled
								label="Phone Number"
								id="phoneNumber"
								placeholder="Enter phone number"
								value={data.phoneNumber}
								onChange={(v) => setData((prev) => ({ ...prev, phoneNumber: v }))}
								error={errors.phoneNumber}
							/>
						</div>
					</div>
				</div>

				<div className="flex justify-center pt-4">
					<button
						disabled
						onClick={handleSave}
						className="cursor-not-allowed rounded-lg bg-black px-8 py-3 font-medium text-white transition-colors hover:bg-black/90">
						Save Changes
					</button>
				</div>
			</div>
		</KYBStepWrapper>
	)
}
