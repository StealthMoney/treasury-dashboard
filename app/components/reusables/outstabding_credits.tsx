import { RiErrorWarningLine } from "react-icons/ri";

interface OutstandingCreditsProps {
  total?: string;
  principal?: string;
  interest?: string;
  dueDate?: string;
  daysLeft?: string;
}

export default function OutstandingCredits({
  total = "₦ 100,842,500.00",
  principal = "₦ 100,000,000.00",
  interest = "₦ 842,500.00",
  dueDate = "17 Jun 2026",
  daysLeft = "45 days left",
}: OutstandingCreditsProps) {
  return (
    <div className="bg-(--grey-4) rounded-2xl p-2 text-center space-y-2">
      <div className="bg-background rounded-2xl py-8">
        <div className="flex items-center justify-center gap-2">
          <span className="text-(--text-1) text-[14px] inline-flex gap-x-2">
            <RiErrorWarningLine color="#707070" size={18} /> Outstanding Credit
          </span>
        </div>

        <h2 className="text-[32px] font-bold text-foreground">{total}</h2>

        <div className="border-b-3 my-1 mb-2 border-b-(--grey-4) max-w-[90%] h-4 mx-auto"></div>

        <div className="flex justify-center gap-6 text-[12px] pt-2 mt-4">
          <span className="text-(--text-1)">
            Principal:{" "}
            <span className="font-semibold text-foreground">{principal}</span>
          </span>

          <span className="text-(--text-1)">
            Interest:{" "}
            <span className="font-semibold text-foreground">{interest}</span>
          </span>
        </div>
      </div>

      <div className="flex justify-center gap-2 text-[12px] pt-2">
        <span className="text-(--text-1) flex items-center gap-1">
          <RiErrorWarningLine color="#F18B38" size={18} /> Due:{" "}
          <span className="font-semibold text-foreground">{dueDate}</span>
        </span>

        <span className="text-foreground flex items-center">
          (<span className="text-(--text-1)">{daysLeft}</span>)
        </span>
      </div>
    </div>
  );
}
