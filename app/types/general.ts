import { ISODateString } from "next-auth"
import { ReactNode } from "react"
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
	text: string | null
	href: string | null
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
	| "REVIEWING_REPAYMENT"

export interface LoanApplication {
	loanId: number
	loanTypeId: number
	loanStatus: LoanStatus
	durationInDays: number
	loanAmount: number
	currency: string
	loanStartDate: string
	loanDueDate: string
	reference: string
	interest: number
	createdAt: ISODateString
	businessName: string
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
	| "REVIEWING_REPAYMENT"
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

export interface ModalConfig {
	isOpen: boolean
	title?: string
	children: ReactNode
	onClose?: () => void
	showOverlay?: boolean
	variant?: "center" | "slide"
}

export interface RejectionModalProps {
	loading: boolean
	isOpen: boolean
	onClose: () => void
	onConfirm: (reason: string) => void
	subject?: string //
}

export interface DisplayBusiness {
	id: string
	name: string
	rc: string
	dateJoined: string
	time: string
	joinedVia: string
	browser: string
	kybStatus: "Completed" | "Pending" | "Rejected" | "Suspended"
	status: "Active" | "Inactive" | "Suspended"
	industry: string
	address: string
	contactPerson: string
	contactRole: string
	email: string
	phone: string
	financialStats: any[]
	documents: any[]
}

export interface RepaymentRecord {
	amountPaid: number
	repaymentReference: string
	repaymentStatus: string
	repaymentDate: string
}

export type DocumentType =
	| "PASSPORT"
	| "DRIVERS_LICENSE"
	| "NATIONAL_ID"
	| "CAC_CERTIFICATE"
	| "UTILITY_BILL"
	| "BANK_STATEMENT"

export type ReviewStatus = "PENDING" | "VERIFIED" | "REJECTED"

// Update DocumentStatus to reuse ReviewStatus
export type DocumentStatus = ReviewStatus

export interface BusinessDirector {
	id: number
	businessId: number
	publicId: string
	firstName: string
	lastName: string
	email: string
	phoneNumber: string
	dob: string
	bvn: string
	addressLine1: string
	addressLine2: string
	city: string
	state: string
	country: string
	postalCode: string
	createdById: number
	lastModifiedById: number
	createdAt: string
	updatedAt: string
	role: "DIRECTOR" | "SHAREHOLDER" | "BENEFICIAL_OWNER"
	ownershipPercentage: number
	status: ReviewStatus
	isPep: boolean
	rejectionReason: string | null
}

export interface DocumentStats {
	totalDocuments: number
	totalApproved: number
	totalPending: number
	totalRejected: number
}

export interface BusinessStats {
	totalBusinesses: number
	activeBusinesses: number
	inactiveBusinesses: number
}

export interface BusinessDocument {
	id: string // mapped from publicId for Table compatibility
	publicId: string
	ownerId: number
	documentType: DocumentType
	fileName: string
	businessName: string
	contentType: string
	status: DocumentStatus
	documentIdentificationNumber: string
	otherDocumentDescription: string
	rejectionReason: string | null
	uploadedAt: string
	verifiedAt: string | null
	rejectedAt: string | null
	createdAt: string
}

export interface BusinessDocumentPageResponse {
	content: BusinessDocument[]
	pageNo: number
	pageSize: number
	totalElements: number
	totalPages: number
	last: boolean
}

export type BusinessStatus =
	| "ACTIVE"
	| "PENDING_REVIEW"
	| "REJECTED"
	| "SUSPENDED"

export interface Business {
	id: number
	businessName: string
	businessDescription: string
	staffSize: string
	industry: string
	annualRevenue: number
	annualRevenueCurrency: string
	phoneNumber: string
	website: string
	linkedIn: string
	twitter: string
	instagram: string
	email: string
	disputeEmail: string
	supportEmail: string
	businessType: string
	cacNumber: string
	addressLine1: string
	addressLine2: string
	city: string
	state: string
	country: string
	postalCode: string
	status: BusinessStatus
	createdById: number | null
	lastModifiedById: number | null
	createdAt: string
	updatedAt: string
}

export interface BusinessResponse {
	content: Business[]
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

export interface PageableResponse<T> {
	totalPages: number
	totalElements: number
	first: boolean
	size: number
	content: T[]
	number: number
	sort: {
		empty: boolean
		sorted: boolean
		unsorted: boolean
	}
	numberOfElements: number
	pageable: {
		offset: number
		sort: {
			empty: boolean
			sorted: boolean
			unsorted: boolean
		}
		paged: boolean
		pageNumber: number
		pageSize: number
		unpaged: boolean
	}
	last: boolean
	empty: boolean
}

export type TransactionType = "CREDIT_LINE" | "REPAYMENT"

export interface BusinessOverviewStats {
	annualRevenue: number
	activeLoan: number
	cashFlow: number
	existingLiabilities: number
}

export interface RecentActivity {
	title: string
	description: string
	performedBy: string
	email: string | null
	date: string
}

export interface ActivityLog extends RecentActivity {
	id: number
	iconType: "approved" | "rejected" | "uploaded" | "repaid"
}

export type TransactionStatus =
	| "REJECTED"
	| "REPAID"
	| "APPROVED"
	| "DISBURSED"
	| "REVIEW"
	| "REVIEWING_REPAYMENT"

export interface Transaction {
	date: string
	amount: number
	transactionType: TransactionType
	status: TransactionStatus
}

export interface BusinessOverviewResponse {
	stats: BusinessOverviewStats
	recentActivities: RecentActivity[]
	transactions: Transaction[]
}

export interface LoanStats {
	totalDisbursed: number
	totalRepaid: number
	outstandingBalance: number
	overdueLoans: number
}

export interface TransactionBusiness {
	name: string
	rcNumber: string
}

export interface TransactionBankAccount {
	bankName: string
	accountName: string
	accountNumber: string
}

export interface Transaction2 {
	transactionId: string
	date: string
	business: TransactionBusiness
	amount: number
	initiatedBy: string
	status: TransactionStatus
	notes: string
	bankAccount: TransactionBankAccount
	transactionType: string
}

export interface TransactionStats {
	totalVolumeNgn: number
	outstandingBalance: number
	repayments: number
	overdueAmount: number
}

export interface TransactionPageData {
	stats: TransactionStats
	transactions: {
		content: Transaction2[]
		pageNo: number
		pageSize: number
		totalElements: number
		totalPages: number
		last: boolean
	}
}

export interface payloadProps {
	data: {
		id_token: string
	}
}
export interface TokenProp {
	id_token: string
}

export interface OverviewStats {
	totalBusinesses: number
	pendingReviews: number
	approvedCreditLines: number
	disbursedCreditLines: number
	flaggedBusinesses: number
}

export interface PendingAction {
	title: string
	description: string
	time: ISODateString
	publicId: string | null
}

export interface RecentActivity2 {
	id: string | number
	activities: string
	performedBy: string
	email: string
	date: string
}

export interface RecentBusiness {
	id: number
	businessName: string
	rcNumber: string
	email: string
	status: "ACTIVE" | "INACTIVE" | "PENDING"
	annualRevenue: number
	annualRevenueCurrency: string
	createdAt: string
	updatedAt: string
}

export interface AdminOverviewResponse {
	stats: OverviewStats
	pendingActions: PendingAction[]
	recentActivities: RecentActivity2[]
	recentBusinesses: RecentBusiness[]
}
