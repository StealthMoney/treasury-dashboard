process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

import NextAuth from "next-auth/next"
import { authOptions } from "./options"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
