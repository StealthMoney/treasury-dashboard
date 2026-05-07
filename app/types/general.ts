export interface KYBFormData {
	// Step 1
	companyName: string
	businessDescription: string
	staffSize: string
	annualSalesVolume: string
	annualSalesVolumeCurrency: string
	industry: string
	businessType: string
	cacNumber: string

	// Step 2
	businessEmail: string
	supportEmail: string
	disputeEmail: string
	phoneNumber: string
	phoneNumberCountry: string
	website: string
	linkedin: string
	twitter: string
	instagram: string

	// Step 3
	officeCountry: string
	officeState: string
	officeCity: string
	officePostalCode: string
	officeStreet: string

	// Step 4 - Now an array of owners
	owners: OwnerInfo[]

	// Step 5
	incorporationDoc: File | null
	taxFilingDoc: File | null
	registrationStatus: File | null
	mouDoc: File | null
	boardRegisterDoc: File | null
	proofOfAddressDoc: File | null
	supportingDoc: File[]

	// Step 6
	bankName: string
	accountNumber: string
	accountName: string
}

export interface OwnerInfo {
	id: string
	firstName: string
	lastName: string
	email: string
	phoneNumber: string
	dayOfBirth: string
	monthOfBirth: string
	yearOfBirth: string
	idDoc1: string
	idNumber1: string
	idUpload: File | null
	homeState: string
	homeCity: string
	homePostalCode: string
	homeStreet: string
	homeProofUpload: File | null
	bvn: string
}

// types/result.ts
export type Result<T> =
	| { success: true; data: T }
	| { success: false; error: string }

export type NavLink = {
	text: string
	href: string
	logo: React.ReactNode
}

export type AuthHeaders = {
	Authorization: string
	"Content-Type": string
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

export interface Pageable {
	pageNumber: number
	pageSize: number
	sort: Sort
	offset: number
	paged: boolean
	unpaged: boolean
}

export interface Sort {
	empty: boolean
	sorted: boolean
	unsorted: boolean
}

export type DocPayload = {
	fileBase64: string
	fileName: string
	contentType: string
	identificationNumber: string
	otherDocumentDescription?: string
	documentType: string
}

export interface PaginatedLoans {
	content: LoanApplication[]
	pageable: Pageable
	last: boolean
	totalPages: number
	totalElements: number
	first: boolean
	size: number
	number: number
	sort: Sort
	numberOfElements: number
	empty: boolean
}

export interface PaginatedLoanApplicationResponse {
	content: LoanApplication[]
	pageable: Pageable
	last: boolean
	totalPages: number
	totalElements: number
	first: boolean
	size: number
	number: number
	sort: Sort
	numberOfElements: number
	empty: boolean
}

export type LoanStatusUI =
	| "REVIEW"
	| "APPROVED"
	| "REJECTED"
	| "DISBURSED"
	| "REPAID"
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
