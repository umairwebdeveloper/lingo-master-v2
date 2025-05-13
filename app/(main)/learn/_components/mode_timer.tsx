"use client";

import { useState, useEffect, useRef } from "react";
import { Switch } from "@/components/ui/switch";
import { Albert_Sans } from "@next/font/google";

const albertSans = Albert_Sans({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600"],
});

const TIMER_DURATION = 30 * 60; // 30 minutes in seconds

export default function ModeTimer() {
    // Mode toggle
    const [enabled, setEnabled] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("examMode") === "true";
        }
        return false;
    });

    // Timer state
    const [remainingTime, setRemainingTime] = useState<number>(() => {
        if (
            typeof window !== "undefined" &&
            localStorage.getItem("examMode") === "true"
        ) {
            const saved = parseInt(
                localStorage.getItem("examRemainingTime") || "",
                10
            );
            return isNaN(saved) ? TIMER_DURATION : saved;
        }
        return TIMER_DURATION;
    });
    const [isRunning, setIsRunning] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("examTimerRunning") === "true";
        }
        return false;
    });
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Persist mode
    useEffect(() => {
        localStorage.setItem("examMode", String(enabled));
        if (enabled && remainingTime === TIMER_DURATION && !isRunning) {
            setIsRunning(true);
        }
        if (!enabled) {
            setIsRunning(false);
        }
    }, [enabled]);

    // Persist timer values
    useEffect(() => {
        localStorage.setItem("examRemainingTime", String(remainingTime));
    }, [remainingTime]);
    useEffect(() => {
        localStorage.setItem("examTimerRunning", String(isRunning));
    }, [isRunning]);

    // Countdown effect
    useEffect(() => {
        if (enabled && isRunning) {
            intervalRef.current = setInterval(() => {
                setRemainingTime((prev) => {
                    if (prev > 0) return prev - 1;
                    clearInterval(intervalRef.current!);
                    setIsRunning(false);
                    return 0;
                });
            }, 1000);
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [enabled, isRunning]);

    const pad = (num: number) => num.toString().padStart(2, "0");
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return (
        <div className="flex items-center gap-4 mb-6 justify-end">
            <Switch checked={enabled} onCheckedChange={setEnabled} />
            <h3
                className={`${albertSans.className} font-semibold text-[#3D3D3D] text-[18px]`}
            >
                {enabled ? "Examenmode" : "Oefenmode"}
            </h3>

            {enabled && (
                <>
                    <div className="text-xl font-mono">
                        {pad(minutes)}:{pad(seconds)}
                    </div>
                    <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        onClick={() => setIsRunning(false)}
                        disabled={!isRunning || remainingTime === 0}
                    >
                        Pause
                    </button>
                    <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        onClick={() => setIsRunning(true)}
                        disabled={isRunning || remainingTime === 0}
                    >
                        Resume
                    </button>
                    <button
                        className="px-3 py-1 border rounded"
                        onClick={() => {
                            setRemainingTime(TIMER_DURATION);
                            setIsRunning(true);
                        }}
                    >
                        Restart
                    </button>
                </>
            )}
        </div>
    );
}
