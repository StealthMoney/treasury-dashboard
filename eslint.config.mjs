import { defineConfig, globalIgnores } from "eslint/config"
import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
})

export default defineConfig([
	globalIgnores([
		"**/logs",
		"**/*.log",
		"**/npm-debug.log*",
		"**/yarn-debug.log*",
		"**/yarn-error.log*",
		"**/pnpm-debug.log*",
		"**/lerna-debug.log*",
		"**/node_modules",
		"**/dist",
		"**/dist-ssr",
		"**/*.local",
		".vscode/*",
		"!.vscode/extensions.json",
		"**/.idea",
		"**/.DS_Store",
		"**/*.suo",
		"**/*.ntvs*",
		"**/*.njsproj",
		"**/*.sln",
		"**/*.sw?",
		"**/.env",
		"**/.env.*",
	]),
	{
		extends: [...nextCoreWebVitals, ...compat.extends("prettier")],
	},
])
