import { AiOutlineCheck } from "react-icons/ai";

type Status = "submitted" | "inreview" | "pending";

interface StatusItem {
  text: string;
  status: Status;
}

interface Table {
  header?: string;

  // default mode
  columns?: string[];

  // status mode
  useStatus?: boolean;
  statusItems?: StatusItem[];
  showAsList: boolean;
}

export default function Message_table({
  header = "Approval Status:",
  columns = ["Required Approval", "Approved so far", "Estimated completion"],
  useStatus = false,
  statusItems = [],
  showAsList = true,
}: Table) {
  return (
    <div className="bg-background border border-(--grey-1) rounded-lg overflow-hidden">
      <div className="bg-(--grey-4) p-4">
        <p className="font-semibold text-foreground text-[14px]">{header}</p>
      </div>

      <div className="px-4 py-3">
        {/* ✅ DEFAULT MODE (your current UI untouched) */}
        {!useStatus && (
          <ul className="space-y-3 text-[14px] text-(--text-1) list-disc pl-5 marker:text-(--text-1)">
            {columns.map((col, index) =>
              showAsList ? <li key={index}>{col}</li> : col,
            )}
          </ul>
        )}

        {/* ✅ STATUS MODE */}
        {useStatus && (
          <div className="space-y-3">
            {statusItems.map((item, index) => {
              const isSubmitted = item.status === "submitted";
              const isInReview = item.status === "inreview";

              return (
                <div key={index} className="flex items-center gap-3">
                  {/* indicator */}
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center
                      ${
                        isSubmitted
                          ? "bg-green-500 border-green-500"
                          : isInReview
                            ? "border border-dashed border-(--text-1)"
                            : "border border-(--grey-1)"
                      }
                    `}
                  >
                    {isSubmitted && (
                      <AiOutlineCheck className="w-3 h-3 text-white" />
                    )}
                  </div>

                  {/* text */}
                  <p
                    className={`text-[14px] ${
                      isSubmitted ? "line-through" : ""
                    }`}
                  >
                    {item.text}

                    {isInReview && (
                      <span className="font-semibold ml-1">(In review)</span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
