"use client"

import { useEffect, useState } from "react"

type NetworkState = {
	isOnline: boolean
	isSlow: boolean
	effectiveType?: string
}

export const useNetworkStatus = (): NetworkState => {
	const [networkState, setNetworkState] = useState<NetworkState>({
		isOnline: true,
		isSlow: false,
	})

	useEffect(() => {
		const updateNetworkStatus = () => {
			const connection =
				(navigator as any).connection ||
				(navigator as any).mozConnection ||
				(navigator as any).webkitConnection

			const effectiveType = connection?.effectiveType

			const slowNetworks = ["slow-2g", "2g", "3g"]

			const isSlow = slowNetworks.includes(effectiveType)

			setNetworkState({
				isOnline: navigator.onLine,
				isSlow,
				effectiveType,
			})
		}

		updateNetworkStatus()

		window.addEventListener("online", updateNetworkStatus)
		window.addEventListener("offline", updateNetworkStatus)

		const connection = (navigator as any).connection

		connection?.addEventListener?.("change", updateNetworkStatus)

		return () => {
			window.removeEventListener("online", updateNetworkStatus)
			window.removeEventListener("offline", updateNetworkStatus)

			connection?.removeEventListener?.("change", updateNetworkStatus)
		}
	}, [])

	return networkState
}
