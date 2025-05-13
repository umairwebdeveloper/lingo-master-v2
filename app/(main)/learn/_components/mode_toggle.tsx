"use client";

import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Albert_Sans } from "@next/font/google";

const albertSans = Albert_Sans({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600"],
});

export default function ModeToggle({
    enabled,
    onChange,
}: {
    enabled: boolean;
    onChange: (val: boolean) => void;
}) {
    useEffect(() => {
        localStorage.setItem("examMode", String(enabled));
    }, [enabled]);

    return (
        <>
            <div className="flex items-center gap-4 mb-6 justify-end">
                <Switch checked={enabled} onCheckedChange={onChange} />
                <h3
                    className={`${albertSans.className} font-semibold text-[#3D3D3D] text-[18px]`}
                >
                    {enabled ? "Examenmode" : "Oefenmode"}
                </h3>
            </div>
        </>
    );
}
