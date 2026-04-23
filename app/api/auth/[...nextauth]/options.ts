process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions, Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import { jwtDecode } from "jwt-decode"
import { DecodedJwt } from "@/app/types/jwt"

// ─── Augment NextAuth types ────────────────────────────────────────────────────
declare module "next-auth" {
	interface User {
		id_token?: string
	}

	interface Session {
		accessToken?: string
		user: {
			email?: string | null
			name?: string | null
			image?: string | null
			role?: string
		}
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id_token?: string
	}
}

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: {
					label: "username",
					type: "text",
					placeholder: "extheo@stealth.money",
				},
				password: {
					label: "Password",
					type: "password",
					placeholder: "********",
				},
			},
			async authorize(credentials, req) {
				let baseUrl = process.env.NEXTAUTH_URL
				if (!baseUrl) {
					const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
					baseUrl = `${protocol}:${req?.headers?.host}`
				}
				const res = await fetch(`${baseUrl}/api/login`, {
					method: "POST",
					body: JSON.stringify({
						username: credentials?.username,
						password: credentials?.password,
					}),
					headers: { "Content-Type": "application/json" },
				})

				const user = await res.json()
				return {
					...user,
					id: user.id_token,
				}
			},
		}),
	],
	pages: {
		signIn: "/",
		signOut: "/",
	},
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async signIn({ user }) {
			return Boolean(user?.id_token)
		},

		async jwt({ token, user }) {
			if (user?.id_token) {
				token.id_token = user.id_token
			}
			return token
		},

		async session({ session, token }: { session: Session; token: JWT }) {
			session.accessToken = undefined

			if (token.id_token) {
				const decoded: DecodedJwt = jwtDecode(token.id_token)
				session.accessToken = token.id_token
				session.expires = new Date(decoded.exp * 1000).toISOString()

				if (decoded.sub.includes("@")) {
					token.email = decoded.sub
					session.user.email = decoded.sub
				} else {
					token.name = decoded.sub
					session.user.name = decoded.sub
				}

				session.user.role = decoded.auth
			}

			return session
		},
	},
	events: {
		signOut: async ({ token }) => {
			token.id_token = undefined
		},
	},
}
