export interface BankDetails {
	bankName: string
	accountName: string
	accountNumber: string
}

export interface BusinessDetails {
	businessName: string
	businessType: string
	email: string
	website: string
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
	businessInfo: BusinessDetails | null
}
