import { useMemo } from "react";
import { LoanApplication } from "../types/general";
import { StatData } from "../components/reusables/stats_section";
import { formatDateWithSuffix } from "../functions/helpers/formatted_date";

export const useCreditStats = (creditHistoryData: LoanApplication[]) => {
  return useMemo(() => {
    if (creditHistoryData.length === 0) return [];

    const firstLoan = creditHistoryData[0];

    const startDate = new Date(firstLoan.loanStartDate);
    const dueDate = new Date(firstLoan.loanDueDate);
    const diffInMs = dueDate.getTime() - startDate.getTime();
    const daysLeft = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    return [
      {
        label: "Active Loans",
        value: `₦ ${firstLoan.loanAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        footer: formatDateWithSuffix(firstLoan.loanStartDate),
      },
      {
        label: "Due Date",
        value: formatDateWithSuffix(firstLoan.loanDueDate),
        footer: `${daysLeft} days left`,
      },
      {
        label: "Loan Interest",
        value: `${firstLoan.interest.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        footer: "+10.00 %", // hardcoded for now
      },
    ] as StatData[];
  }, [creditHistoryData]);
};
