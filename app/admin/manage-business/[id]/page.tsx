import BusinessDetailPage from "@/app/components/manage-business/main"

type PageProps = {
	params: Promise<{
		id: string
	}>
}

export default async function Page({ params }: PageProps) {
	const resolvedParams = await params

	return <BusinessDetailPage id={resolvedParams.id} />
}
