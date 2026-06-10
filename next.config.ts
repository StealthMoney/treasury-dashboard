import type { NextConfig } from "next"
const envURL =
	process.env.STEALTH_ENDPOINT || process.env.NEXT_PUBLIC_STEALTH_ENDPOINT

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		serverActions: {
			bodySizeLimit: "5mb",
		},
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: envURL || "https://api.staging.stealthtreasury.com/v1/api",
				pathname: "/**",
			},
		],
	},
}

export default nextConfig
