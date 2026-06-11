export const getBaseUrl = () => {
	if (typeof window === "undefined") return ""
	return window.location.origin
}
