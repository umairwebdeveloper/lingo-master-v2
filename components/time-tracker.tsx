"use client";

import { useEffect, useRef } from "react";

export default function TimeTracker() {
    const startTimeRef = useRef(Date.now());

    useEffect(() => {
        const sendTimeSpent = () => {
            const endTime = Date.now();
            const timeSpent = endTime - startTimeRef.current;
            const data = JSON.stringify({ timeSpent });

            // Using sendBeacon to reliably send data when the user is leaving
            navigator.sendBeacon("/api/track-time", data);
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                sendTimeSpent();
            } else {
                // Reset start time when the tab becomes active again
                startTimeRef.current = Date.now();
            }
        };

        const handleBeforeUnload = () => {
            // Send data if the user is leaving the page
            if (document.visibilityState === "visible") {
                sendTimeSpent();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    return null;
}
