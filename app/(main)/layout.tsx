"use client";

import { Sidebar } from "@/components/sidebar";
import React, { useState } from "react";
import { Header } from "./dashboard/header";

type Props = {
    children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
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

    const effectiveExpanded = !collapsed || sidebarHovered;

    return (
        <>
            <Sidebar
                collapsed={collapsed}
                hovered={sidebarHovered}
                toggleSidebar={toggleSidebar}
                onMouseEnter={handleSidebarMouseEnter}
                onMouseLeave={handleSidebarMouseLeave}
                classNames={`hidden lg:flex`}
            />
            <main
                className={`transition-all duration-250 ${
                    effectiveExpanded ? "lg:pl-[256px]" : "lg:pl-[96px]"
                } h-full`}
            >
                <div className="min-h-screen transition-all duration-250 bg-gray-50 bg-[#F6F6F6]">
                    <Header />
                    {children}
                </div>
            </main>
        </>
    );
};

export default MainLayout;
