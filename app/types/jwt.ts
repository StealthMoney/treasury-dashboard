export type DecodedJwt = {
	sub: string
	auth: string
	iat?: number
	exp: number
}
