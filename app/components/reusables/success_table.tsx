import { useState } from "react"
import { IoIosCopy } from "react-icons/io"
import { FaCheck } from "react-icons/fa6"

interface MessageItem {
	text: string
	copy?: string
}

interface Table {
	header?: string
	messages?: {
		col1?: string
		message1?: string | MessageItem
		col2?: string
		message2?: string | MessageItem
		col3?: string
		message3?: string | MessageItem
		col4?: string
		message4?: string | MessageItem
	}
}

export default function Success_table({
	header = "Approval Status:",
	messages = {},
}: Table) {
	const {
		col1 = "Required Approval",
		message1 = "2 of 5 multisig approvals",
		col2 = "Approved so far",
		message2 = "Funds moved to cold storage",
		col3 = "Estimated completion",
		message3 = "~30 minutes after approval",
		col4,
		message4,
	} = messages

	const [isCopying, setIsCopying] = useState<Record<string, boolean>>({})

	const handleCopy = async (key: string, value: string) => {
		setIsCopying((prev) => ({ ...prev, [key]: true }))

		try {
			await navigator.clipboard.writeText(value)
		} finally {
			setTimeout(() => {
				setIsCopying((prev) => ({ ...prev, [key]: false }))
			}, 800) // small UX delay
		}
	}

	const renderMessage = (msg?: string | MessageItem, key?: string) => {
		if (!msg) return null

		if (typeof msg === "string") {
			return msg
		}

		return (
			<span className="d-inline-flex align-items-center justify-center gap-2">
				{msg.text}

				{msg.copy && (
					<button
						onClick={() => handleCopy(key!, msg.copy!)}
						className="btn btn-sm ml-1 border-0 bg-transparent p-0"
						style={{ cursor: "pointer" }}>
						{isCopying[key!] ? (
							<FaCheck size={15} color="#05AD5D" />
						) : (
							<IoIosCopy size={15} color="black" />
						)}
					</button>
				)}
			</span>
		)
	}

	return (
		<div className="bg-background overflow-hidden rounded-lg border border-(--grey-1)">
			<div className="bg-(--grey-4) p-4">
				<p className="text-foreground text-[14px] font-semibold">{header}</p>
			</div>

			<div className="px-4">
				<table className="w-full border-collapse text-[14px] text-(--text-1)">
					<tbody>
						<tr className="border-b border-b-(--grey-1)">
							<td className="py-4 pr-4">{col1}</td>
							<td className="text-foreground py-4 text-right font-semibold">
								{renderMessage(message1, "message1")}
							</td>
						</tr>

						<tr className="border-b border-b-(--grey-1)">
							<td className="py-4 pr-4">{col2}</td>
							<td className="text-foreground py-4 text-right font-semibold">
								{renderMessage(message2, "message2")}
							</td>
						</tr>

						{col3 && message3 && (
							<tr className={col4 && message4 ? "border-b border-b-(--grey-1)" : ""}>
								<td className="py-4 pr-4">{col3}</td>
								<td className="text-foreground py-4 text-right font-semibold">
									{renderMessage(message3, "message3")}
								</td>
							</tr>
						)}

						{col4 && message4 && (
							<tr>
								<td className="py-4 pr-4">{col4}</td>
								<td className="text-foreground py-4 text-right font-semibold">
									{renderMessage(message4, "message4")}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}
