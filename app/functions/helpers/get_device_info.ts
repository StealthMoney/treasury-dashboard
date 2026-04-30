export const getDeviceInfo = () => {
	const platform =
		(navigator as any).userAgentData?.platform ||
		navigator.userAgent.match(/\(([^)]+)\)/)?.[1] ||
		"unknown"

	return [
		navigator.userAgent,
		platform,
		navigator.language,
		`${window.screen.width}x${window.screen.height}`,
		Intl.DateTimeFormat().resolvedOptions().timeZone,
	].join(" | ")
}
