"use client";

import { useState } from "react";
import { ProfileTab } from "./profile";
import { PasswordSettingTab } from "./password";

type TabType = "profile" | "password";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: "profile", label: "Admin Profile" },
    { id: "password", label: "Password Setting" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "password":
        return <PasswordSettingTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen w-full lg:px-6 bg-background">
      <div className="px-4 sm:px-6 lg:px-8 py-8 md:max-w-[80%]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[20px] font-bold text-foreground mb-2">
            Profile management
          </h1>
          <p className="text-(--text-1) text-[16px]">
            Manage your business profile here
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-4 min-w-full bg-[#F5F5F5] p-1 rounded-lg w-fit md:w-full h-14">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all md:min-w-[15%] cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm font-medium"
                    : "text-(--text-1) hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {/* <div className="bg-white border border-border rounded-lg p-6 md:p-8"> */}
        {renderTabContent()}
        {/* </div> */}
      </div>
    </div>
  );
}
