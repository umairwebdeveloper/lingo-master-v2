import React from "react";

const Loader: React.FC = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-[#0A65FC] "></div>
        </div>
    );
};

export default Loader;
