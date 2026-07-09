import { payloadProps, TokenProp, Result } from "@/app/types/general"
interface HeaderProps {
	Authorization: string
	"Content-Type": string
}

type RefreshCallback = (payload: payloadProps) => Promise<Result<TokenProp>>

export const callRefresh = async (
	headers: HeaderProps | null,
	callback: RefreshCallback
) => {
	const token = headers?.Authorization

	if (!token) {
		throw new Error("Missing Authorization token")
	}

	const payload: payloadProps = {
		data: {
			id_token: token,
		},
	}

	const res = await callback(payload)
	return res
}
