"use client"

import { useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useProfile } from "@/app/contexts/user_provider"
import { LineLoader } from "./line_loader"

type AuthDecision =
	| { type: "loading" }
	| { type: "redirect"; to: string }
	| { type: "allow" }

function resolveAuth(
	status: string,
	session: ReturnType<typeof useSession>["data"],
	user: ReturnType<typeof useProfile>["user"],
	pathname: string
): AuthDecision {
	if (status === "loading") return { type: "loading" }

	const PUBLIC_ROUTES = [
		"/",
		"/account/activate",
		"/account/reset/finish",
		"/otp",
		"/api/*",
	]

	const USER_ROUTES: Record<string, string> = {
		"/credit": "Credit",
		"/report": "Report",
		"/profile": "Profile",
		"/settings": "Settings",
	}

	const ADMIN_ROUTES: Record<string, string> = {
		"/admin/overview": "Overview",
		"/admin/manage-credit": "Manage Credit",
		"/admin/manage-report": "Manage Report",
		"/admin/manage-profile": "Profile",
		"/admin/settings": "Settings",
		"/admin/manage-waitlist": "Manage Waitlist",
		"/admin/manage-business": "Manage Business",
		"/admin/manage-document": "Manage Document",
		"/admin/manage-transactions": "Manage Transaction",
	}
	const ROUTE_MAP = { ...USER_ROUTES, ...ADMIN_ROUTES }

	const isPublic = PUBLIC_ROUTES.includes(pathname)
	const isLoggedIn = Boolean(session?.accessToken)

	const isTokenExpired = session?.expires
		? new Date(session.expires).getTime() < Date.now()
		: true

	if ((!isLoggedIn || isTokenExpired) && !isPublic) {
		return { type: "redirect", to: "/" }
	}

	// if (isLoggedIn && !user) return { type: "loading" }

	if (isLoggedIn && user) {
		const matchedEntry = Object.entries(ROUTE_MAP).find(
			([route]) => pathname === route || pathname.startsWith(route + "/")
		)

		const requiredMenu = matchedEntry?.[1] ?? null

		const hasAccess = requiredMenu
			? user.profileMenu.includes(requiredMenu)
			: true

		if (!hasAccess) {
			const firstRoute = Object.entries(ROUTE_MAP).find(([, menu]) =>
				user.profileMenu.includes(menu)
			)?.[0]

			if (firstRoute) {
				return { type: "redirect", to: firstRoute }
			}
		}

		if (pathname === "/") {
			const relevantRoutes = user.systemAdmin ? ADMIN_ROUTES : USER_ROUTES

			const defaultRoute =
				Object.entries(relevantRoutes).find(([, menu]) =>
					user.profileMenu.includes(menu)
				)?.[0] ?? "/"

			return { type: "redirect", to: defaultRoute }
		}
	}

	return { type: "allow" }
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
	const { data: session, status } = useSession()
	const { user, loading: profileLoading } = useProfile()
	const router = useRouter()
	const pathname = usePathname()

	const decision = useMemo(() => {
		if (status === "loading") {
			return { type: "loading", to: "/" }
		}

		console.log(user, "iss")
		return resolveAuth(status, session, user, pathname)
	}, [status, session, user, pathname])

	useEffect(() => {
		if (decision.type === "redirect") {
			router.replace(decision.to)
		}
	}, [decision, router])

	if (decision.type === "loading" || decision.type === "redirect") {
		return (
			<div className="flex min-h-screen w-full items-center justify-center">
				<LineLoader className="scale-125" />
			</div>
		)
	}

	return <>{children}</>
}
