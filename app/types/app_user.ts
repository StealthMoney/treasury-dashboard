export interface BankDetails {
	bankName: string
	accountName: string
	accountNumber: string
}

export interface AppuserProps {
	userId: number
	login: string
	firstName: string
	lastName: string
	email: string
	imageUrl: string | null

	businessAdmin: boolean
	businessUser: boolean
	systemAdmin: boolean
	systemUser: boolean

	kybStatus: "ACTIVE" | "PENDING_REVIEW" | "SUSPENDED" | null

	profileMenu: string[]

	langKey: string | null

	bankDetails: BankDetails | null
}
