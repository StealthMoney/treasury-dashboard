"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PiHandCoins } from "react-icons/pi"
import { TbFileAnalytics } from "react-icons/tb"
import { CiSettings, CiLogout, CiHeadphones } from "react-icons/ci"
import { RiUser3Line } from "react-icons/ri"
import { signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { Spinner } from "./spinner"
import { FeedbackModal } from "./feedback_modal"
import { filterLinks } from "@/app/functions/helpers/available_links"
import { useProfile } from "@/app/contexts/user_provider"
import { IoDocumentLockOutline } from "react-icons/io5"
import { LiaBusinessTimeSolid } from "react-icons/lia"
import { MdFormatListBulleted } from "react-icons/md"

export default function Sidebar({
	open,
	onClose,
}: {
	open: boolean
	onClose: () => void
}) {
	const [loading, setLoading] = useState(false)
	const [showLogoutModal, setShowLogoutModal] = useState(false)

	const { user, loading: userInfoLoading } = useProfile()

	const pathname = usePathname()

	const navLinks = [
		{
			logo: <PiHandCoins />,
			text: user?.systemAdmin ? "Overview" : null,
			href: user?.systemAdmin ? "/admin/overview" : null,
		},
		{
			logo: <PiHandCoins />,
			text: user?.systemAdmin ? "Manage Credit" : "Credit",
			href: user?.systemAdmin ? "/admin/manage-credit" : "/credit",
		},
		{
			logo: <LiaBusinessTimeSolid />,
			text: user?.systemAdmin ? "Manage Business" : null,
			href: user?.systemAdmin ? "/admin/manage-business" : null,
		},
		{
			logo: <IoDocumentLockOutline />,
			text: user?.systemAdmin ? "Manage Document" : null,
			href: user?.systemAdmin ? "/admin/manage-document" : null,
		},
		{
			logo: <MdFormatListBulleted />,
			text: user?.systemAdmin ? "Manage Transaction" : null,
			href: user?.systemAdmin ? "/admin/manage-transactions" : null,
		},
		{
			logo: <TbFileAnalytics />,
			text: user?.systemAdmin ? null : "Report",
			href: user?.systemAdmin ? null : "/report",
		},
		{
			logo: <RiUser3Line />,
			text: "Profile",
			href: user?.systemAdmin ? "/admin/manage-profile" : "/profile",
		},
		{
			logo: <CiSettings />,
			text: "Settings",
			href: user?.systemAdmin ? "/admin/manage-settings" : "/settings",
		},
	]

	const filteredLinks = filterLinks(user, navLinks)

	const handleLogout = async () => {
		setLoading(true)
		localStorage.clear()
		await signOut()
		setLoading(false)
	}

	return (
		<>
			<FeedbackModal
				isOpen={showLogoutModal}
				onClose={() => setShowLogoutModal(false)}
				title="Confirm Logout"
				description="Are you sure you want to log out of your account?"
				buttonCount={2}
				buttons={[
					{
						label: "Cancel",
						variant: "outline",
						onClick: () => setShowLogoutModal(false),
					},
					{
						label: "Logout",
						variant: "primary",
						onClick: handleLogout,
						loading: loading,
					},
				]}
			/>

			{/* Overlay */}
			{open && (
				<div
					onClick={onClose}
					className="bg-foreground/40 fixed inset-0 z-40 md:hidden"
				/>
			)}

			<aside
				className={`bg-background fixed top-20 left-0 z-50 flex h-[calc(100vh-80px)] w-[75%] flex-col justify-between px-5 transition-transform duration-300 md:w-[20%] md:border-r md:border-r-(--grey-1) ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"} `}>
				<div className="mt-5 flex flex-col gap-2">
					{filteredLinks.map((item) => {
						const isActive =
							pathname === item.href || pathname.startsWith(item.href + "/")

						return (
							<Link
								key={item.href}
								href={item.href || ""}
								onClick={onClose}
								className={`flex items-center gap-2 rounded-md px-2 py-2 transition-colors ${
									isActive
										? "text-foreground bg-(--grey-1)"
										: "hover:text-foreground text-(--text-1) hover:bg-(--grey-1)"
								} `}>
								{item.logo}
								{item.text}
							</Link>
						)
					})}
				</div>

				<div className="mb-6 flex flex-col gap-2">
					<Link
						href="mailto:info@stealthtreasury.com"
						className="text-foreground flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 transition-opacity">
						<CiHeadphones /> Support
					</Link>

					<button
						onClick={() => setShowLogoutModal(true)}
						className="mb-6 flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-(--red-1) transition-colors">
						<CiLogout /> Logout {loading && <Spinner />}
					</button>
				</div>
			</aside>
		</>
	)
}
