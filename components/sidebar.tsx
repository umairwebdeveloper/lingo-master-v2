"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import SideBarItem from "./sidebar-item";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  collapsed: boolean;
  hovered: boolean;
  toggleSidebar: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  classNames: string;
};

export const Sidebar = ({
  collapsed,
  hovered,
  toggleSidebar,
  onMouseEnter,
  onMouseLeave,
  classNames,
}: Props) => {
  const effectiveCollapsed = collapsed && !hovered;

  return (
    <>
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cn(
          "group flex flex-col h-full transition-all duration-500 ease-in-out lg:fixed left-0 top-0 px-4 border-r bg-white z-40",
          effectiveCollapsed ? "w-24" : "w-64",
          classNames
        )}
      >
        <div className="flex items-center justify-center pt-6 pb-7">
          <Link href="/dashboard">
            <Image
              src={
                effectiveCollapsed
                  ? "/logos/half_logo.svg"
                  : "/logos/full_logo.svg"
              }
              height={effectiveCollapsed ? 40 : 200}
              width={effectiveCollapsed ? 40 : 200}
              alt="mascot"
            />
          </Link>
        </div>
        <div className="flex flex-col gap-y-2 flex-1">
          <SideBarItem
            label="Dashboard"
            href="/dashboard"
            iconSrc="/sidebar_icons/dashboard.svg"
            activeIconSrc="/sidebar_icons/dashboard_active.svg"
            collapsed={effectiveCollapsed}
          />
          <SideBarItem
            label="Video Cursus"
            href="/videos"
            iconSrc="/sidebar_icons/play.svg"
            activeIconSrc="/sidebar_icons/play_active.svg"
            collapsed={effectiveCollapsed}
          />
          <SideBarItem
            label="Examens"
            href="/learn"
            iconSrc="/sidebar_icons/exam.svg"
            activeIconSrc="/sidebar_icons/exam_active.svg"
            collapsed={effectiveCollapsed}
          />
          <SideBarItem
            label="Bestellingen"
            href="/plan"
            iconSrc="/sidebar_icons/price.svg"
            activeIconSrc="/sidebar_icons/price_active.svg"
            collapsed={effectiveCollapsed}
          />
          <hr className="mt-3" />
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="hidden lg:flex items-center justify-center w-8 h-10 absolute top-[50px] z-[99] bg-white border border-l-0 rounded-r-md shadow-md transition-all duration-300"
        style={{
          left: effectiveCollapsed ? 96 : 256,
        }}
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>
    </>
  );
};
