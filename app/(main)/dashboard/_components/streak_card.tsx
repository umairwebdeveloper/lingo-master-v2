"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Loader from "@/components/loader";
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

interface UserStreak {
    id: number;
    userId: string;
    streakCount: number;
    lastLoginDate: string;
    weekdaysActive: boolean[];
}

const WeekStreakCard: React.FC = () => {
    const [data, setData] = useState<UserStreak | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [extraDaySaved, setExtraDaySaved] = useState(false);

    // Helper function to check for a continuous streak of a given length
    const hasConsecutiveStreak = (
        days: boolean[],
        requiredStreak: number
    ): boolean => {
        let count = 0;
        for (let i = 0; i < days.length; i++) {
            if (days[i]) {
                count++;
                if (count >= requiredStreak) {
                    return true;
                }
            } else {
                count = 0;
            }
        }
        return false;
    };

    // Fetch the user's streak data
    useEffect(() => {
        axios
            .get<UserStreak>("/api/user-steak/new")
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching streak data:", err);
                setError("Failed to load streak data");
                setLoading(false);
            });
    }, []);

    // Check for a continuous 5-day streak and send extra day API request if met
    useEffect(() => {
        if (data && !extraDaySaved) {
            if (hasConsecutiveStreak(data.weekdaysActive, 5)) {
                axios
                    .post("/api/user-steak/extra-day", {
                        extraDays: 1,
                    })
                    .then(() => {
                        setExtraDaySaved(true);
                    })
                    .catch((err) => {
                        console.error("Error adding extra day:", err);
                    });
            }
        }
    }, [data, extraDaySaved]);

    if (loading) {
        return (
            <div className="bg-white rounded-xl border p-3">
                <Loader />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-white rounded-xl border p-3">
                {error || "No data available"}
            </div>
        );
    }

    // Weekday letters (index 0 = Sunday, 1 = Monday, etc.)
    const weekDays = [
        { day: "M" },
        { day: "D" },
        { day: "W" },
        { day: "D" },
        { day: "V" },
        { day: "Z" },
        { day: "Z" },
    ];

    // Combine weekday letters with API's boolean array.
    const days = weekDays.map((item, index) => ({
        ...item,
        isActive: data.weekdaysActive && data.weekdaysActive[index],
    }));

    const countActive = data.weekdaysActive.filter((value) => value).length;
    const hasStreak = hasConsecutiveStreak(data.weekdaysActive, 5);

    return (
        <div className="bg-white rounded-3xl border p-[20px]">
            <div className="flex items-center gap-4">
                <h2 className={`${albertSans.className} text-2xl text-[#3D3D3D] font-semibold leading-normal`}>
                    Week Streak
                </h2>
                <button>
                    <span className="text-gray-500 hover:text-gray-600">
                        <img src="/information-circle.svg" alt="Info icon" className="w-6 h-6 inline" />
                    </span>
                </button>
            </div>

            <div className="my-3 flex items-center gap-2">
                {days.map((dayItem, idx) => (
                    <div key={idx} className="relative w-8 h-8">
                        {dayItem.isActive ? (
                            <>
                                <Image
                                    src="/logos/streak.svg"
                                    alt={`Day ${dayItem.day}`}
                                    fill
                                    className="rounded-full"
                                />
                                <span className="absolute top-1 inset-0 flex items-center justify-center text-white font-bold text-sm">
                                    {dayItem.day}
                                </span>
                            </>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-[#F6F6F6] text-[#3D3D3D] border border-[#D1D1D1] flex items-center justify-center gap-[8px] text-sm font-bold">
                                {dayItem.day}
                            </div>
                        )}
                    </div>
                ))}

                <span className="ml-auto text-2xl font-bold text-blue-600">
                    {countActive}
                </span>
            </div>
            {hasStreak && (
                <>
                        <p className={`${albertSans.className} mt-[12px] mb-[12px] text-[#6D6D6D] text-[13.5px]`}>
                        Congratulations!!
                        </p>
                        <p className={`${albertSans.className} mt-[12px] mb-[12px] text-[#6D6D6D] text-[13.5px]`}>

                        🥳 You earned 1 extra day!
                        </p>
                </>
            )}
        </div>
    );
};

export default WeekStreakCard;
