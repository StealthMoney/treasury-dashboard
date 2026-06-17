import { getBusinessesDocumentsStats } from "@/app/server/business"

export async function GET(req: Request) {
	const res = await getBusinessesDocumentsStats()
	if (!res.success) {
		return Response.json({ error: res.error }, { status: 400 })
	}

	return Response.json(res.data)
}
