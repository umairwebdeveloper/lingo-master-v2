// hooks/useScrollSpy.ts
import { useState, useEffect } from "react";

export function useScrollSpy(
    ids: string[],
    options?: IntersectionObserverInit
) {
    const [activeId, setActiveId] = useState<string>(ids[0]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "0% 0% -70% 0%", // triggers when section top crosses 30% from top
                threshold: 0,
                ...options,
            }
        );

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => {
            ids.forEach((id) => {
                const el = document.getElementById(id);
                if (el) observer.unobserve(el!);
            });
        };
    }, [ids, options]);

    return activeId;
}
