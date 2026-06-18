import { Transaction2 } from "@/app/types/general"
import { StatusBadge } from "../status_badge"
import { useState } from "react"
import { formatNaira } from "@/app/functions/helpers/formatNaira"
import { formatDateWithSuffix } from "@/app/functions/helpers/formatted_date"
import { generateReceiptHTML } from "@/app/functions/helpers/generate_download_content"

export default function TransactionDetailContent({
	transaction,
	onClose,
}: {
	transaction: Transaction2
	onClose: () => void
}) {
	const [downloading, setDownloading] = useState(false)

	async function downloadReceiptAsPDF(tx: Transaction2) {
		// Open print dialog on a new window with the receipt HTML
		const html = generateReceiptHTML(tx)
		const win = window.open("", "_blank", "width=700,height=900")
		if (!win) return
		win.document.write(html)
		win.document.close()
		win.focus()
		// Small delay to let the page render before print dialog
		setTimeout(() => {
			win.print()
			win.close()
		}, 400)
	}

	const rows: { label: string; value: React.ReactNode }[] = [
		{
			label: "Status",
			value: <StatusBadge status={transaction.status} />,
		},
		{
			label: "Transaction Type",
			value: (
				<span className="text-foreground text-sm font-medium">
					{transaction.transactionType.replace(/_/g, " ")}
				</span>
			),
		},
		{
			label: "Amount",
			value: (
				<span className="text-foreground text-sm font-semibold">
					{formatNaira(transaction.amount)}
				</span>
			),
		},
		{
			label: "Business",
			value: (
				<div className="text-right">
					<p className="text-foreground text-sm font-medium">
						{transaction.business.name}
					</p>
					<p className="text-xs text-(--text-1)">{transaction.business.rcNumber}</p>
				</div>
			),
		},
		{
			label: "Bank Account",
			value: (
				<div className="text-right">
					<p className="text-foreground text-sm font-medium">
						{transaction.bankAccount.accountName}
					</p>
					<p className="text-xs text-(--text-1)">
						{transaction.bankAccount.bankName}
					</p>
					<p className="text-xs text-(--text-1)">
						{transaction.bankAccount.accountNumber}
					</p>
				</div>
			),
		},
		{
			label: "Reference ID",
			value: (
				<span className="text-foreground max-w-45 text-right text-sm font-medium break-all">
					{transaction.transactionId}
				</span>
			),
		},
		{
			label: "Date",
			value: (
				<span className="text-foreground text-sm font-medium">
					{formatDateWithSuffix(transaction.date)}
				</span>
			),
		},
		{
			label: "Notes",
			value: (
				<span className="text-foreground text-right text-sm">
					{transaction.notes}
				</span>
			),
		},
	]

	return (
		<div className="flex h-full flex-col">
			{/* Detail Rows */}
			<div className="flex-1 space-y-0 divide-y divide-(--grey-1)">
				{rows.map(({ label, value }) => (
					<div key={label} className="flex items-start justify-between gap-4 py-4">
						<span className="shrink-0 text-sm text-(--text-1)">{label}</span>
						<div className="flex justify-end">{value}</div>
					</div>
				))}
			</div>

			{/* Footer Buttons */}
			<div className="mt-6 flex gap-3 border-t border-(--grey-1) pt-6">
				<button
					onClick={onClose}
					className="bg-background text-foreground flex-1 rounded-lg border border-(--grey-1) px-4 py-2.5 text-sm font-medium transition hover:bg-(--grey-4)">
					Back
				</button>
				<button
					disabled={downloading}
					onClick={async () => {
						setDownloading(true)
						await downloadReceiptAsPDF(transaction)
						setDownloading(false)
					}}
					className="bg-foreground text-background flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition hover:opacity-90 disabled:opacity-60">
					{downloading ? "Preparing…" : "Download Receipt"}
				</button>
			</div>
		</div>
	)
}
