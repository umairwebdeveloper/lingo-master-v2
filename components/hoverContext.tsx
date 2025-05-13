"use client";


import React, { createContext, useContext, useState } from "react";

// Maak een interface voor de context waarde
interface HoverContextType {
    isHovered: boolean;
    setIsHovered: React.Dispatch<React.SetStateAction<boolean>>;
}

const HoverContext = createContext<HoverContextType | undefined>(undefined);

export const useHover = () => {
    const context = useContext(HoverContext);
    if (!context) {
        throw new Error("useHover must be used within a HoverProvider");
    }
    return context;
};

export const HoverProvider = ({ children }: { children: React.ReactNode }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <HoverContext.Provider value={{ isHovered, setIsHovered }}>
            {children}
        </HoverContext.Provider>
    );
};
