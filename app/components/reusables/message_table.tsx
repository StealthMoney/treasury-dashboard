import { AiOutlineCheck } from "react-icons/ai";
import { StatusItem } from "@/app/types/general";

interface Table {
  header?: string;
  columns?: string[];
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
        {!useStatus && (
          <ul className="space-y-3 text-[14px] text-(--text-1) list-disc pl-5 marker:text-(--text-1)">
            {columns.map((col, index) =>
              showAsList ? <li key={index}>{col}</li> : col,
            )}
          </ul>
        )}

        {useStatus && (
          <div className="space-y-3">
            {statusItems.map((item, index) => {
              const isCompleted = item.status === "completed";
              const isCurrent = item.status === "current";
              const isFailed = item.status === "failed";

              return (
                <div key={index} className="flex items-center gap-3">
                  {/* indicator */}
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0
                      ${
                        isCompleted
                          ? "bg-green-500 border-green-500"
                          : isCurrent
                            ? "border border-dashed border-(--text-1)"
                            : isFailed
                              ? "bg-red-500 border-red-500"
                              : "border border-(--grey-1)"
                      }
                    `}
                  >
                    {isCompleted && (
                      <AiOutlineCheck className="w-3 h-3 text-white" />
                    )}
                    {isFailed && (
                      <span className="text-white text-[10px] font-bold leading-none">
                        ✕
                      </span>
                    )}
                  </div>

                  {/* text */}
                  <p
                    className={`text-[14px] ${
                      isCompleted ? "line-through text-(--text-1)" : ""
                    } ${isFailed ? "text-red-500" : ""}`}
                  >
                    {item.text}
                    {item.suffix && (
                      <span className="font-semibold ml-1">{item.suffix}</span>
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
