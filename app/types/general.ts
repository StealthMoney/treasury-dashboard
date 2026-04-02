// types/result.ts
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type NavLink = {
  text: string;
  href: string;
  logo: React.ReactNode;
};

type InterestRateType = "FIX" | "VARIABLE";

type StatusType = "ACTIVE" | "INACTIVE";

export interface LoanType {
  id: number;
  interestRate: number;
  interestRateType: InterestRateType;
  status: StatusType;
  durationInDays: number;
  createdAt: string;
  updatedAt: string;
}

export type LoanStatus = "REVIEW" | "APPROVED" | "REJECTED" | "PENDING";

export interface LoanApplication {
  loanTypeId: number; 
  loanStatus: LoanStatus;
  durationInDays: number;
  loanAmount: number;
  currency: string;
  loanStartDate: string; 
  loanDueDate: string;  
  reference: string;
  interest: number;
}
