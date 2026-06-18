import { showBusinessesDocuments } from "@/app/server/business"

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params

	const res = await showBusinessesDocuments(id)

	if (!res.success) {
		return Response.json({ error: res.error }, { status: 400 })
	}

	return new Response(res.data)
}
