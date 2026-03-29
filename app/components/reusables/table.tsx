import { ReactNode } from "react";
import Image from "next/image";

export interface TableColumn<T> {
  header: string | ReactNode;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

export interface TablePagination {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  extraHeader?: string | ReactNode;
  pagination?: TablePagination;
  kybStatus: "unverified" | "inreview" | "failed" | "verified";
  tableButtonClick?: () => void;
}

export function Table<T extends { id: string | number }>({
  data,
  columns,
  extraHeader,
  pagination,
  kybStatus,
  tableButtonClick,
}: TableProps<T>) {
  const isEmpty = data.length === 0;

  return (
    <div className="border border-(--grey-1) rounded-lg overflow-hidden bg-background mb-8">
      {/* Optional extra header */}
      {extraHeader && (
        <div className="px-4 sm:px-6 py-4 border-b border-(--grey-1) bg-(--grey-4)">
          <h3 className="text-[14px] sm:text-[16px] font-semibold text-foreground">
            {extraHeader}
          </h3>
        </div>
      )}

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 gap-4">
          <Image
            src="/images/no_credit.svg"
            alt="No credit"
            width={120}
            height={120}
          />
          <p className="text-sm text-(--text-1) text-center">
            {kybStatus === "verified"
              ? "You have no credit history yet!"
              : "Upload your invoices and bank statements to access a line of credit for your business."}
          </p>
          {kybStatus === "verified" && (
            <button
              onClick={tableButtonClick}
              className="mt-2 px-6 py-2.5 cursor-pointer text-sm font-medium bg-foreground text-background rounded-lg hover:opacity-90 transition"
            >
              Apply for credit
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-(--grey-1) bg-gray-50">
                  {columns.map((col, index) => (
                    <th
                      key={index}
                      className={`px-4 sm:px-6 py-4 text-left text-xs sm:text-sm text-(--text-1) font-normal whitespace-nowrap ${col.className ?? ""}`}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`border-b border-(--grey-1) transition ${
                      rowIndex !== data.length - 1 ? "hover:bg-gray-50" : ""
                    }`}
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-4 sm:px-6 py-4 ${col.className ?? ""}`}
                      >
                        {typeof col.accessor === "function"
                          ? col.accessor(row)
                          : (row[col.accessor] as ReactNode)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Optional Pagination */}
          {pagination && (
            <div className="px-4 sm:px-6 py-5 border-t border-(--grey-1) flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-background">
              <p className="text-xs sm:text-sm text-[#64748B]">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {Math.min(pagination.itemsPerPage, data.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {pagination.totalItems}
                </span>{" "}
                items
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    pagination.onPageChange(
                      Math.max(pagination.currentPage - 1, 1),
                    )
                  }
                  disabled={pagination.currentPage === 1}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-(--grey-3) border border-(--grey-1) rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-600 transition"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    pagination.onPageChange(
                      Math.min(
                        pagination.currentPage + 1,
                        Math.ceil(
                          pagination.totalItems / pagination.itemsPerPage,
                        ),
                      ),
                    )
                  }
                  disabled={
                    pagination.currentPage ===
                    Math.ceil(pagination.totalItems / pagination.itemsPerPage)
                  }
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-(--grey-3) border border-(--grey-1) rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-600 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
