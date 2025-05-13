"use client";

import { Menu } from "lucide-react";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Sidebar } from "@/components/sidebar";

const MobileSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarHovered, setSidebarHovered] = useState(false);

    const toggleSidebar = () => {
        setCollapsed((prev) => !prev);
    };

    const handleSidebarMouseEnter = () => {
        if (collapsed) {
            setSidebarHovered(true);
        }
    };

    const handleSidebarMouseLeave = () => {
        if (collapsed) {
            setSidebarHovered(false);
        }
    };

    // const effectiveExpanded = !collapsed || sidebarHovered;
    return (
        <Sheet>
            <SheetTrigger>
                <Menu />
            </SheetTrigger>
            <SheetContent className="p-0 max-w-fit z-[100]" side={"left"}>
                <Sidebar
                    collapsed={collapsed}
                    hovered={sidebarHovered}
                    toggleSidebar={toggleSidebar}
                    onMouseEnter={handleSidebarMouseEnter}
                    onMouseLeave={handleSidebarMouseLeave}
                    classNames={""}
                />
            </SheetContent>
        </Sheet>
    );
};

export default MobileSidebar;
