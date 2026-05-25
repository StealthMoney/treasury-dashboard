"use client"
import Image from "next/image"
import { HiOutlineBell } from "react-icons/hi2"
import { HiOutlineMenu } from "react-icons/hi"
import { usePathname } from "next/navigation"
import { useProfile } from "@/app/contexts/user_provider"
import { returnUserInitials } from "@/app/functions/helpers/initials"
import { AppuserProps } from "@/app/types/app_user"

const TITLE_MAP: Record<string, string> = {
	"manage-business": "Manage Business",
	"manage-credit": "Manage Credit",
	"manage-report": "Manage Report",
	"manage-waitlist": "Manage Waitlist",
	"manage-document": "Manage Document",
	"manage-profile": "Manage Profile",
	"manage-settings": "Manage Settings",
	credit: "Credit",
	report: "Report",
	profile: "Profile",
	settings: "Settings",
	admin: "Admin",
}

export default function Topdash({ onMenuClick }: { onMenuClick: () => void }) {
	const pathname = usePathname()
	const { user, isKyb } = useProfile()

	const segments = pathname.split("/").filter(Boolean)
	const lastSegment = segments[segments.length - 1] ?? ""

	const formattedTitle =
		segments
			.slice()
			.reverse()
			.map((s) => TITLE_MAP[s])
			.find(Boolean) ??
		lastSegment
			.split("-")
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(" ")

	return (
		<header className="bg-background fixed top-0 left-0 z-50 flex h-20 w-full border-b border-(--grey-1)">
			<div className="flex w-[20%] items-center gap-3 border-r border-r-(--grey-1) px-4">
				<button title="menu" onClick={onMenuClick} className="text-2xl md:hidden">
					<HiOutlineMenu />
				</button>

				<Image
					src="/images/logo.svg"
					width={100}
					height={40}
					alt="logo"
					className="hidden md:flex"
				/>
			</div>

			<div className="flex flex-1 items-center justify-between px-6">
				<h1>{!isKyb ? formattedTitle : ""}</h1>

				<div className="flex items-center gap-3">
					<button
						title="notification"
						className="w-8- h-8 rounded-full border border-(--grey-1) bg-white p-2">
						<HiOutlineBell />
					</button>
					<button className="bg-foreground flex h-8 w-8 items-center justify-center rounded-full px-1 py-1 text-white">
						{returnUserInitials(user as AppuserProps)}
					</button>
				</div>
			</div>
		</header>
	)
}
