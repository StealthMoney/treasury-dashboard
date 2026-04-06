import Layoutclient from "../components/reusables/layoutclient"

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <Layoutclient>{children}</Layoutclient>
}
