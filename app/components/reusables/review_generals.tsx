import { FaFile, FaFileWord } from "react-icons/fa6"
import { FaFilePdf, FaImage } from "react-icons/fa"

// Review row component for consistent display
export function ReviewRow({
	label,
	value,
}: {
	label: string
	value: string | React.ReactNode
}) {
	return (
		<div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
			<p className="text-[14px] text-(--grey-3)">{label}</p>
			<p
				className={`text-foreground wrap-break-words text-[14px] sm:max-w-[60%] sm:text-right ${label?.toLowerCase() === "account name:" ? "font-bold" : "font-medium"}`}>
				{value}
			</p>
		</div>
	)
}

// Helper function to detect file type
export const getFileIcon = (file: File | null, colored: boolean) => {
	if (!file) return null
	const isPdf =
		file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
	const isImage =
		file.type.startsWith("image/") ||
		/\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)

	const isDoc =
		file.type === "application/msword" ||
		file.type ===
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
		/\.(doc|docx)$/i.test(file.name)

	if (isPdf)
		return (
			<FaFilePdf
				className={` ${colored ? "text-(--red-1)" : "text-(--text-1)"} h-4 w-4`}
			/>
		)
	if (isImage)
		return (
			<FaImage
				className={` ${colored ? "text-blue-500" : "text-(--text-1)"} h-4 w-4`}
			/>
		)
	if (isDoc)
		return (
			<FaFileWord
				className={` ${colored ? "text-blue-700" : "text-(--text-1)"} h-4 w-4`}
			/>
		)
	return <FaFile className="h-4 w-4 text-(--text-1)" />
}

export function DocumentReviewRow({
	label,
	file,
}: {
	label: string
	file: File | null
}) {
	return (
		<div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
			<p className="text-[14px] text-(--grey-3)">{label}</p>
			{file ? (
				<div className="flex items-center gap-2 sm:max-w-[60%]">
					<p className="text-foreground text-[14px] break-all">{file.name}</p>
					{getFileIcon(file, true)}
				</div>
			) : (
				<p className="text-foreground text-[14px]">-</p>
			)}
		</div>
	)
}
