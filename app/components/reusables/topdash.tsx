"use client";
import Image from "next/image";
import { HiOutlineBell } from "react-icons/hi2";
import { HiOutlineMenu } from "react-icons/hi";
import { usePathname } from "next/navigation";

export default function Topdash({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const title = pathname.replace(/\//g, "");
  const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <header className="fixed top-0 left-0 z-50 bg-background w-full h-20 border-b border-(--grey-1) flex">
      <div className="w-[20%] flex items-center gap-3 px-4 border-r border-r-(--grey-1)">
        <button onClick={onMenuClick} className="md:hidden text-2xl">
          <HiOutlineMenu />
        </button>

        <Image
          src="/images/logo.svg"
          width={100}
          height={40}
          alt="logo"
          className="md:flex hidden"
        />
      </div>

      <div className="flex-1 flex justify-between items-center px-6">
        <h1>{formattedTitle}</h1>

        <div className="flex items-center gap-3">
          <button className="rounded-full border w-8- h-8 border-(--grey-1) bg-white p-2">
            <HiOutlineBell />
          </button>
          <button className="bg-foreground text-white w-8 h-8 rounded-full px-1 py-1 flex justify-center items-center">
            BO
          </button>
        </div>
      </div>
    </header>
  );
}
