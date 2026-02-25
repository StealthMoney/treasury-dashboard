"use client";

import { useState } from "react";
import { AiOutlinePlus, AiOutlineMore } from "react-icons/ai";
import { KYBStepWrapper } from "../reusables/kybstepwraper";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  dateJoined: string;
  status: "Active" | "Inactive";
}

export function TeamTab() {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John F Doe",
      email: "johnfdoe@gmail.com",
      role: "Chief Admin",
      dateJoined: "09-10-2025",
      status: "Active",
    },
    {
      id: "2",
      name: "John F Doe",
      email: "johnfdoe@gmail.com",
      role: "Chief Admin",
      dateJoined: "09-10-2025",
      status: "Active",
    },
    {
      id: "3",
      name: "John F Doe",
      email: "johnfdoe@gmail.com",
      role: "Chief Admin",
      dateJoined: "09-10-2025",
      status: "Active",
    },
    {
      id: "4",
      name: "John F Doe",
      email: "johnfdoe@gmail.com",
      role: "Chief Admin",
      dateJoined: "09-10-2025",
      status: "Active",
    },
    {
      id: "5",
      name: "John F Doe",
      email: "johnfdoe@gmail.com",
      role: "Chief Admin",
      dateJoined: "09-10-2025",
      status: "Active",
    },
  ]);

  const handleAddMember = () => {
   alert("Not functional yet");
  };

  return (
    <KYBStepWrapper title="Team">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 -mt-4">
          <div className="px-4">
            <h3 className="text-[20px] font-semibold text-[#171717]">
              Team members
            </h3>
          </div>
          <button
            onClick={handleAddMember}
            className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg font-medium hover:cursor-pointer transition-colors w-full sm:w-auto justify-center sm:justify-start"
          >
            <AiOutlinePlus size={18} />
            <span>Add Member</span>
          </button>
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
                  Date Joined
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
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-(--grey-1) hover:bg-muted/50"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {member.name}
                      </p>
                      <p className="text-sm text-(--text-1)">
                        {member.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <span className="bg-(--grey-4) border rounded-full border-(--grey-1) px-2 py-2">{member.role}</span>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <div>{member.dateJoined}</div>
                    <div className="text-[14px] text-muted-foreground">
                      14:57 PM
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-2 bg-[#EAF5ED] text-[#05AD5D] text-[14px] font-medium rounded-full">
                      {member.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <AiOutlineMore
                        size={18}
                        className="text-foreground"
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
          {members.map((member) => (
            <div
              key={member.id}
              className="border border-border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{member.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.email}
                  </p>
                </div>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <AiOutlineMore size={18} className="text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Role</p>
                  <p className="font-medium">{member.role}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                    {member.status}
                  </span>
                </div>
              </div>

              <div className="text-sm">
                <p className="text-muted-foreground text-xs">Date Joined</p>
                <p className="font-medium">{member.dateJoined} 14:57 PM</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </KYBStepWrapper>
  );
}
