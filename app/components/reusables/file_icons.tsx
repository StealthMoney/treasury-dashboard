import { BsFileEarmarkPdf } from "react-icons/bs"
import { FaImage, FaFileWord, FaFile } from "react-icons/fa6"

export const getFileIconFromName = (name: string, colored: boolean) => {
	const lower = name.toLowerCase()

	const isPdf = lower.endsWith(".pdf")
	const isImage = /\.(jpg|jpeg|png|gif|webp)$/.test(lower)
	const isDoc = /\.(doc|docx)$/.test(lower)

	if (isPdf)
		return (
			<BsFileEarmarkPdf
				className={`h-5 w-5 ${colored ? "text-(--red-1)" : "text-(--text-1)"}`}
			/>
		)
	if (isImage)
		return (
			<FaImage
				className={`h-5 w-5 ${colored ? "text-blue-500" : "text-(--text-1)"}`}
			/>
		)
	if (isDoc)
		return (
			<FaFileWord
				className={`h-5 w-5 ${colored ? "text-blue-700" : "text-(--text-1)"}`}
			/>
		)

	return <FaFile className="h-5 w-5 text-(--text-1)" />
}

export const getFileBgClass = (name: string) => {
	const lower = name.toLowerCase()

	const isPdf = lower.endsWith(".pdf")
	const isImage = /\.(jpg|jpeg|png|gif|webp)$/.test(lower)
	const isDoc = /\.(doc|docx)$/.test(lower)

	if (isPdf) return "bg-[#FF0505]/10"
	if (isImage) return "bg-blue-500/10"
	if (isDoc) return "bg-blue-700/10"

	return "bg-(--grey-1)"
}
