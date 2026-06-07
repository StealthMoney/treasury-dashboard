"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { getProfile } from "../server/get_profile"
import { AppuserProps } from "../types/app_user"
import { signOut } from "next-auth/react"
import { Dispatch, SetStateAction } from "react"

type ProfileContextType = {
	user: AppuserProps | null
	loading: boolean
	error: string | null
	isKyb: boolean
	retry: () => void
	logout: () => void
	setIsKyb: Dispatch<SetStateAction<boolean>>
}

const ProfileContext = createContext<ProfileContextType>({
	user: null,
	loading: true,
	error: null,
	isKyb: false,
	retry: () => {},
	logout: () => {},
	setIsKyb: () => {},
})

const CACHE_KEY = "profile_cache"
const CACHE_DURATION = 40 * 60 * 1000

function getValidCache(): AppuserProps | null {
	if (typeof window === "undefined") return null
	try {
		const cached = localStorage.getItem(CACHE_KEY)
		if (!cached) return null

		const parsed = JSON.parse(cached)
		if (Date.now() - parsed.timestamp > CACHE_DURATION) {
			localStorage.removeItem(CACHE_KEY)
			return null
		}

		return parsed.data
	} catch {
		localStorage.removeItem(CACHE_KEY)
		return null
	}
}

export const ProfileProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const { status } = useSession()
	const [user, setUser] = useState<AppuserProps | null>(() => getValidCache())
	const [loading, setLoading] = useState<boolean>(() => getValidCache() === null)
	const [isKyb, setIsKyb] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	const fetchProfile = async () => {
		setLoading(true)
		setError(null)

		try {
			const res = await getProfile()

			if (res.success) {
				setUser(res.data)
				localStorage.setItem(
					CACHE_KEY,
					JSON.stringify({ data: res.data, timestamp: Date.now() })
				)
			} else {
				setError(res.error || "Couldn't get your data")
			}
		} catch (err) {
			console.error(err)
			setError(err instanceof Error ? err.message : "Something went wrong")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (status !== "authenticated") {
			if (status === "unauthenticated") {
				setUser(null)
				setLoading(false)
			}
			return
		}

		if (user) {
			setLoading(false)
			return
		}

		let cancelled = false

		;(async () => {
			try {
				const res = await getProfile()
				if (cancelled) return

				if (res.success) {
					setUser(res.data)
					localStorage.setItem(
						CACHE_KEY,
						JSON.stringify({ data: res.data, timestamp: Date.now() })
					)
				} else {
					setError(res.error || "Couldn't get your data")
				}
			} catch (err) {
				if (!cancelled) {
					console.error(err)
					setError(err instanceof Error ? err.message : "Something went wrong")
				}
			} finally {
				if (!cancelled) setLoading(false)
			}
		})()

		return () => {
			cancelled = true
		}
	}, [status])

	const retry = () => fetchProfile()
	const logout = async () => {
		if (typeof window === "undefined") return null
		localStorage.removeItem(CACHE_KEY)
		setUser(null)
		await signOut()
	}

	return (
		<ProfileContext.Provider
			value={{ user, loading, error, retry, logout, isKyb, setIsKyb }}>
			{children}
		</ProfileContext.Provider>
	)
}

export const useProfile = () => useContext(ProfileContext)
