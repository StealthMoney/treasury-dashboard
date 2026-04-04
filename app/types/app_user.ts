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

	kybCompleted: boolean

	profileMenu: string[]

	langKey: string | null
}
