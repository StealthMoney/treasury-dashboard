// types/result.ts
export type Result<T> =
	| { success: true; data: T }
	| { success: false; error: string }

export type NavLink = {
	text: string
	href: string
	logo: React.ReactNode
}

type InterestRateType = "FIX" | "VARIABLE"

type StatusType = "ACTIVE" | "INACTIVE"

export interface LoanType {
	id: number
	interestRate: number
	interestRateType: InterestRateType
	status: StatusType
	durationInDays: number
	createdAt: string
	updatedAt: string
}

export type LoanStatus =
	| "REVIEW"
	| "APPROVED"
	| "REJECTED"
	| "DISBURSED"
	| "REPAID"
	| "OVERDUE"

export interface LoanApplication {
	loanTypeId: number
	loanStatus: LoanStatus
	durationInDays: number
	loanAmount: number
	currency: string
	loanStartDate: string
	loanDueDate: string
	reference: string
	interest: number
}

export type LoanStatusUI = "REVIEW" | "APPROVED" | "REJECTED" | "DISBURSED"
export interface LoanApplicationUI {
	loanTypeId: number
	loanStatus: LoanStatusUI
	durationInDays: number
	loanAmount: number
	currency: string
	loanStartDate: string
	loanDueDate: string
	reference: string
	interest: number
}

export type StepStatus =
	| "completed"
	| "current"
	| "pending"
	| "failed"
	| "submitted"
	| "inreview"

export interface StatusItem {
	text: string
	status: StepStatus
	suffix?: string
}

export interface Banklist {
	nipBankCode: string
	bankName: string
}

type NameInquiryData = {
	accountName: string
	accountNumber: string
	kycLevel: string | null
	nameInquiryReference: string | null
	channelCode: string | null
}

export type NameInquiryResponse = {
	data: NameInquiryData
	responseMessage: string
	responseCode: string
	successful: boolean
}

export interface InitiateLoanRepaymentDetails {
	accountNumber: string
	accountName: string
	bankName: string
	narration: string
	repaymentReference: string
	currency: string
	amount: number
	interest: number
	amountDue: number
	loanDueDate: string
}

export interface RepaymentRecord {
	amountPaid: number
	repaymentReference: string
	repaymentStatus: string
	repaymentDate: string
}
