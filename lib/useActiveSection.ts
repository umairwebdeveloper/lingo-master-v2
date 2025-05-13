// hooks/useActiveSection.ts
import { useState, useEffect } from "react";

export function useActiveSection(sectionIds: string[]) {
    const [active, setActive] = useState<string>("");

    useEffect(() => {
        const handleScroll = () => {
            // Loop through each section and see if its midpoint is in the viewport
            for (const id of sectionIds) {
                const el = document.getElementById(id);
                if (!el) continue;

                const { top, bottom } = el.getBoundingClientRect();
                const mid = (top + bottom) / 2;

                if (mid >= 0 && mid <= window.innerHeight) {
                    setActive(id);
                    return; // stop at first matching section
                }
            }
            setActive(""); // none in view
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // initialize on mount
        return () => window.removeEventListener("scroll", handleScroll);
    }, [sectionIds]);

    return active;
}
