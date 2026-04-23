export interface InputFieldProps {
	label: string
	id: string
	type?: string
	placeholder?: string
	value: string
	onChange: (v: string) => void
	error?: string
	prefix?: string
	showToggle?: boolean
	showPassword?: boolean
	onToggle?: () => void
}

export interface TextFieldProps {
	label: string
	id: string
	placeholder?: string
	value: string
	onChange: (v: string) => void
	error?: string
	prefix?: string
	type?: string
	disabled?: boolean
}
