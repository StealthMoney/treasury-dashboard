"use client";

import { useState } from "react";
import { AiOutlinePlus, AiOutlineMore, AiOutlineSetting } from "react-icons/ai";
import { KYBStepWrapper } from "../reusables/kybstepwraper";

interface Approver {
  id: string;
  name: string;
  email: string;
  role: string;
  dateAssigned: string;
  status: "Active" | "Inactive";
}

export function MultiSigTab() {
  const [approvers, setApprovers] = useState<Approver[]>([
    {
      id: "1",
      name: "John F Doe",
      email: "johnfdoe@gmail.com",
      role: "Approver One",
      dateAssigned: "09-10-2025",
      status: "Active",
    },
    {
      id: "2",
      name: "John F Doe",
      email: "johnfdoe@gmail.com",
      role: "Approver Two",
      dateAssigned: "09-10-2025",
      status: "Active",
    },
    {
      id: "3",
      name: "John F Doe",
      email: "johnfdoe@gmail.com",
      role: "Approver Three",
      dateAssigned: "09-10-2025",
      status: "Active",
    },
    {
      id: "4",
      name: "John F Doe",
      email: "johnfdoe@gmail.com",
      role: "Approver Four",
      dateAssigned: "09-10-2025",
      status: "Active",
    },
    {
      id: "5",
      name: "John F Doe",
      email: "johnfdoe@gmail.com",
      role: "Approver Five",
      dateAssigned: "09-10-2025",
      status: "Active",
    },
  ]);

  const handleAddApprover = () => {
    alert("Not functional yet");
  };

  const handleApproverSettings = () => {
    alert("Not functional yet");
  };

  return (
    <KYBStepWrapper
      title={
        <div className="inline-block text-sm">
          <span className="font-medium">Operational Approval - </span>
          <span className="text-[#05AD5D] font-semibold">
            {approvers.length}
          </span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Title and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4">
          <h3 className="text-[20px] font-semibold text-[#171717]">
            MultiSig Settings
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleApproverSettings}
              className="flex items-center gap-2 px-4 py-2 border border-(--grey-1) rounded-lg font-medium hover:cursor-pointer transition-colors"
            >
              <AiOutlineSetting size={18} />
              <span>Approver Settings</span>
            </button>
            <button
              onClick={handleAddApprover}
              className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg font-medium hover:cursor-pointer transition-colors justify-center sm:justify-start"
            >
              <AiOutlinePlus size={18} />
              <span>Add Approver</span>
            </button>
          </div>
        </div>

        {/* Table - Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-(--grey-4)">
                <th className="text-left py-5 px-4 font-medium text-(--text-1) text-[16px]">
                  Name
                </th>
                <th className="text-left py-5 px-4 font-medium text-(--text-1) text-[16px]">
                  Role
                </th>
                <th className="text-left py-5 px-4 font-medium text-(--text-1) text-[16px]">
                  Date Assigned
                </th>
                <th className="text-left py-5 px-4 font-medium text-(--text-1) text-[16px]">
                  Status
                </th>
                <th className="text-left py-5 px-4 font-medium text-(--text-1) text-[16px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {approvers.map((approver) => (
                <tr
                  key={approver.id}
                  className="border-b border-(--grey-1) hover:bg-muted/50"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {approver.name}
                      </p>
                      <p className="text-sm text-(--text-1)">
                        {approver.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <span className="bg-(--grey-4) border rounded-full border-(--grey-1) px-2 py-2">
                      {approver.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <div>{approver.dateAssigned}</div>
                    <div className="text-xs text-muted-foreground">
                      14:57 PM
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-2 bg-[#EAF5ED] text-[#05AD5D] text-[14px] font-medium rounded-full">
                      {approver.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      title="more"
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <AiOutlineMore
                        size={18}
                        className="text-muted-foreground"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-3">
          {approvers.map((approver) => (
            <div
              key={approver.id}
              className="border border-border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{approver.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {approver.email}
                  </p>
                </div>
                <button
                  title="more"
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <AiOutlineMore size={18} className="text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Role</p>
                  <p className="font-medium">{approver.role}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                    {approver.status}
                  </span>
                </div>
              </div>

              <div className="text-sm">
                <p className="text-muted-foreground text-xs">Date Assigned</p>
                <p className="font-medium">{approver.dateAssigned} 14:57 PM</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </KYBStepWrapper>
  );
}
