import { Metadata } from "next"
import GlobalProfileGuard from "./components/reusables/profile_guard"
import ProvideWrapper from "./components/reusables/provider_wrapper"
import QueryProvider from "./contexts/query_provider"
import "./globals.css"

export const metadata: Metadata = {
	title:
		"Stealth Treasury | Modern treasury infrastructure for companies & businesses.",
	description: "Modern treasury infrastructure for companies & businesses.",
	metadataBase: new URL("https://app.stealthtreasury.com"),
	icons: {
		icon: "/favicon.ico",
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className="overflow-x-hidden antialiased">
				<QueryProvider>
					<ProvideWrapper>
						<GlobalProfileGuard>{children}</GlobalProfileGuard>
					</ProvideWrapper>
				</QueryProvider>
			</body>
		</html>
	)
}
