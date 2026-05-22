import { getBusinessesDocuments } from "@/app/server/business"

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url)

	const query = searchParams.toString()
	console.log(query, "llapi")

	const res = await getBusinessesDocuments(query)
	if (!res.success) {
		return Response.json({ error: res.error }, { status: 400 })
	}

	return Response.json(res.data)
}
