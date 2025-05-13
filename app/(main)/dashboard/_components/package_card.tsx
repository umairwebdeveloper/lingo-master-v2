"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/progress-bar";
import UpgradeButton from "@/components/upgrade-button";
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

const PackageCard: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const router = useRouter();

    useEffect(() => {
        axios
            .get<any>("/api/payment")
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching package data", err);
                setError("Failed to load package data");
                setLoading(false);
            });
    }, []);

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

    const { packageType, formattedPackageExpireDate, daysLeft, totalDays } =
        data;
    const progressPercent = (daysLeft / totalDays) * 100;

    return (
        <div className="bg-white rounded-3xl border p-[20px] h-full">
            <div className="flex items-center gap-4">
                <h2 className={`${albertSans.className} text-2xl text-[#3D3D3D] font-semibold leading-normal`}>
                    Huidig Pakket
                </h2>
                <span className={`${inter.className} text-[13px] font-medium leading-[120%] text-[#0E9F6E] bg-[rgba(41, 160, 116, 0.1)] border-2 border-[#31C48D] px-[12px] py-[4px] rounded-full`}>
                Premium
                </span>
            </div>

            <p className={`${albertSans.className} mt-[12px] mb-[12px] text-[#6D6D6D] text-[13.5px]`}>
                Loopt af op: {formattedPackageExpireDate}
            </p>
            <p className={`${albertSans.className} mt-[12px] mb-[12px] text-[#6D6D6D] text-[13.5px]`}>
                {daysLeft}/{totalDays} dag
            </p>

            <div className="mt-0">
                <ProgressBar progress={progressPercent} />
            </div>

            <div className="flex justify-end mt-2">
                <UpgradeButton />
            </div>
        </div>
    );
};

export default PackageCard;
