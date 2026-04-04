import { getCreditTypes } from "@/app/server/credits"

export async function GET() {
	const res = await getCreditTypes()

	if (!res.success) {
		return Response.json({ error: res.error }, { status: 400 })
	}

	return Response.json(res.data)
}
