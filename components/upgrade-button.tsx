import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

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

const UpgradeButton = () => {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push("/#pricing")}
            className="flex items-center space-x-0 text-blue-500 hover:text-blue-600 font-medium group"
        >
            <span className={`${inter.className} text-[14px] font-medium leading-[150%] text-[#0A65FC]`}>
              Upgrade Pakket
            </span>
            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
    );
};

export default UpgradeButton;
