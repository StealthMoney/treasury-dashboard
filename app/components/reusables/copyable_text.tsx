import { useState } from "react"

export function CopyableText({ text }: { text: string }) {
	const [copied, setCopied] = useState(false)

	const handleCopy = () => {
		navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div
			className="relative inline-block max-w-45 cursor-pointer"
			onClick={handleCopy}>
			<p className="truncate text-xs font-semibold text-gray-900 sm:text-sm">
				{text}
			</p>
			{copied && (
				<span className="absolute -top-5 left-5 -translate-x-1/2 rounded px-2 py-1 text-[10px] whitespace-nowrap text-green-500">
					Copied!
				</span>
			)}
		</div>
	)
}
