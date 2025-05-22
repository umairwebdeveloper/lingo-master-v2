"use client";

import { useState, useEffect, useRef } from "react";

const TIMER_DURATION = 30 * 60; // 30 minutes

interface ExamTimerProps {
    examId: string | number;
    enabled: boolean;
    onComplete?: (examId: string | number) => void;
}

export default function ExamTimer({
    examId,
    enabled,
    onComplete,
}: ExamTimerProps) {
    const [remainingTime, setRemainingTime] = useState<number>(TIMER_DURATION);
    const [isRunning, setIsRunning] = useState<boolean>(enabled);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // reset & auto-start whenever `enabled` flips on
    useEffect(() => {
        if (enabled) {
            setRemainingTime(TIMER_DURATION);
            setIsRunning(true);
        } else {
            setIsRunning(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    }, [enabled]);

    // countdown loop
    useEffect(() => {
        if (!isRunning) return;

        intervalRef.current = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev > 1) return prev - 1;

                // time's up
                clearInterval(intervalRef.current!);
                setIsRunning(false);
                onComplete?.(examId);
                return TIMER_DURATION;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, examId, onComplete]);

    if (!enabled) return null;

    const pad = (n: number) => n.toString().padStart(2, "0");
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return (
        <div className="flex gap-2 items-center my-3 border p-3 rounded-xl bg-white">
            <div className="text-xl font-mono">
                {pad(minutes)}:{pad(seconds)}
            </div>
        </div>
    );
}
