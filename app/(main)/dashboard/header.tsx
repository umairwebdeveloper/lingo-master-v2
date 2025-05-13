"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    SignInButton,
    SignedIn,
    SignedOut,
    useUser,
    useClerk,
} from "@clerk/nextjs";
import { ChevronDown } from "lucide-react";
import MobileSidebar from "@/components/mobile-sidebar";
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


export const Header = () => {
    const { isSignedIn, user }: any = useUser();
    const clerk = useClerk();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // A ref to the dropdown container, used for detecting outside clicks
    const dropdownRef = useRef<HTMLDivElement>(null);

    const greetingName =
        isSignedIn && user ? user.firstName || user.username || "Buddy" : "";

    // Toggles the custom dropdown menu
    const handleClick = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    // Close the dropdown when clicking outside of it
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        }

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    // Example action: open the Clerk user profile
    const handleViewProfile = () => {
        clerk.openUserProfile();
        setIsDropdownOpen(false);
    };

    // Example action: sign out
    const handleSignOut = () => {
        clerk.signOut();
        setIsDropdownOpen(false);
    };

    // Custom user button and dropdown
    const CustomUserButton = () => {
        if (!user) return null;

        return (
            <div className="relative" ref={dropdownRef}>
                {/* Button that toggles the dropdown */}
                <button
                    onClick={handleClick}
                    className={
                        isDropdownOpen
                            ? "flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 border transition-colors"
                            : "flex items-center space-x-2 px-3 py-1 rounded-full bg-white hover:bg-gray-100 border transition-colors"
                    }
                >
                    {/* Avatar */}
                    <img
                        src={user.profileImageUrl}
                        alt="User avatar"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    {/* Name */}
                    <span className={`${albertSans.className} text-[#6D6D6D] text-[18px] font-medium leading-normal`}>
                        {greetingName}</span>
                    {/* Down arrow icon */}
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-md z-10">
                        {/* User Info Section */}
                        <div className="p-4 border-b">
                            <div className="flex items-center gap-x-2">
                                <img
                                    src={user?.profileImageUrl}
                                    alt="User avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-800">
                                        {user?.fullName ||
                                            user?.firstName ||
                                            "User"}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {user?.primaryEmailAddress
                                            ?.emailAddress || "No email"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Menu Actions */}
                        <button
                            onClick={handleViewProfile}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            View Profile
                        </button>
                        <button
                            onClick={handleSignOut}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="sticky top-0 w-full bg-gray-50 py-3 flex items-center justify-between border-b mb-5 text-neutral-400 z-50 bg-[#f6f6f6]">
            <div className="w-full flex justify-between items-center px-3 md:px-6">
                <div className="flex gap-2 items-center">
                    <div className="lg:hidden pt-2">
                        <MobileSidebar />
                    </div>
                    <h3 className={`${inter.className} text-[24px] font-medium leading-[130%] text-[#3D3D3D] hidden lg:block`}>
                    Hallo{greetingName && `, ${greetingName}`} 👋
                    </h3>
                    <div className="lg:hidden">
                        <Image
                            src="/logos/full_logo.svg"
                            height={150}
                            width={150}
                            alt="mascot"
                        />
                    </div>
                </div>
                <div>
                    <SignedIn>
                        {/* Show custom user button if signed in */}
                        <CustomUserButton />
                    </SignedIn>
                    <SignedOut>
                        {/* Show sign-in button if signed out */}
                        <SignInButton />
                    </SignedOut>
                </div>
            </div>
        </div>
    );
};
