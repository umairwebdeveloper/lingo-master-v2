"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Albert_Sans } from '@next/font/google';
import { Inter } from '@next/font/google';



const albertSans = Albert_Sans({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400' , '500', '600']
})

const inter = Inter({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400' , '500', '600']
})

type Props = {
    label: string;
    iconSrc: string;
    activeIconSrc?: string;
    href: string;
    collapsed?: boolean;
};

const SideBarItem = ({
    label,
    iconSrc,
    activeIconSrc,
    href,
    collapsed = false,
}: Props) => {
    const pathname = usePathname();
    const active = pathname.startsWith(href);
    const currentIconSrc = active && activeIconSrc ? activeIconSrc : iconSrc;

    return (
        <Link
            href={href}
            className={`flex items-center justify-start h-[52px] px-4 ${
                collapsed ? "" : "py-2"
            } rounded-full ${
                active
                    ? "bg-[#EEF7FF] text-sky-500 hover:bg-sky-500/20 border-2 border-[#D8ECFF] transition-none"
                    : "bg-transparent text-slate-500 border-transparent border-2 hover:bg-slate-100 transition-none"
            }`}
        >
            <Image
                src={currentIconSrc}
                alt={label}
                height={32}
                width={32}
                className="mr-5"
            />
            {!collapsed && (
                <div
                    className={`${albertSans.className} text-[14px] font-medium leading-normal transition-opacity opacity-100 ${
                        active ? "text-[#3D3D3D]" : "text-[#6D6D6D]"
                    }`}
                >
                    {label}
                </div>
            )}
        </Link>
    );
};    

export default SideBarItem;
