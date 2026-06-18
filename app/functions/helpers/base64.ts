import { DocPayload } from "@/app/types/general"

export const fileToBase64 = (file: File): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve((reader.result as string).split(",")[1])
		reader.onerror = reject
		reader.readAsDataURL(file)
	})

const mapDocType = (value: string): string => {
	switch (value) {
		case "Passport":
			return "PASSPORT"
		case "Driver License":
			return "DRIVER_LICENSE"
		case "National ID":
			return "NATIONAL_ID"
		case "Proof of Address":
			return "PROOF_OF_ADDRESS"
		case "Bank Statement":
			return "BANK_STATEMENT"
		case "Invoice":
			return "INVOICE"

		case "PASSPORT":
		case "DRIVER_LICENSE":
		case "NATIONAL_ID":
		case "PROOF_OF_ADDRESS":
		case "BANK_STATEMENT":
		case "INVOICE":
		case "OTHER":
			return value

		default:
			return "OTHER"
	}
}

export const toDoc = async (file: File, typeValue: string, idNumber = "") => {
	const documentType = mapDocType(typeValue)

	const base: DocPayload = {
		fileBase64: await fileToBase64(file),
		fileName: file.name,
		contentType: file.type,
		identificationNumber: idNumber,
		documentType,
	}

	// ONLY include this for OTHER
	if (documentType === "OTHER") {
		base.otherDocumentDescription = file.name
	}

	return base
}
