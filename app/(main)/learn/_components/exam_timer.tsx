"use client";

import { useState, useEffect, useRef } from "react";

const TIMER_DURATION = 30 * 60; // 30 minutes

interface ExamTimerProps {
    examId: string | number;
    onComplete?: (examId: string | number) => void;
}

export default function ExamTimer({ examId, onComplete }: ExamTimerProps) {
    // derive enabled from localStorage
    const [enabled, setEnabled] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("examMode") === "true";
        }
        return false;
    });

    // update enabled on storage changes
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === "examMode") {
                setEnabled(e.newValue === "true");
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    // keys for this exam
    const timeKey = `examRemainingTime_${examId}`;
    const runningKey = `examTimerRunning_${examId}`;

    const [remainingTime, setRemainingTime] = useState<number>(() => {
        if (
            typeof window !== "undefined" &&
            localStorage.getItem("examMode") === "true"
        ) {
            const saved = parseInt(localStorage.getItem(timeKey) || "", 10);
            return isNaN(saved) ? TIMER_DURATION : saved;
        }
        return TIMER_DURATION;
    });
    const [isRunning, setIsRunning] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(runningKey) === "true";
        }
        return false;
    });
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // persist state
    useEffect(() => {
        localStorage.setItem(timeKey, String(remainingTime));
    }, [remainingTime, timeKey]);
    useEffect(() => {
        localStorage.setItem(runningKey, String(isRunning));
    }, [isRunning, runningKey]);

    // countdown
    useEffect(() => {
        if (enabled && isRunning) {
            intervalRef.current = setInterval(() => {
                setRemainingTime((prev) => {
                    if (prev > 1) {
                        return prev - 1;
                    }
                    // Time reached zero: reset and notify
                    clearInterval(intervalRef.current!);
                    setIsRunning(false);
                    if (onComplete) onComplete(examId);
                    return TIMER_DURATION;
                });
            }, 1000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [enabled, isRunning, examId, onComplete]);

    if (!enabled) return null;

    const pad = (num: number) => num.toString().padStart(2, "0");
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return (
        <div className="flex gap-2 items-center my-3">
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
        </div>
    );
}
