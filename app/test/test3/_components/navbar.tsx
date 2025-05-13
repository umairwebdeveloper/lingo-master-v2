import { useActiveSection } from "@/lib/useActiveSection";
import { useState, useEffect } from "react";

interface NavLink {
    name: string;
    id: string;
}

const navLinks: NavLink[] = [
    { name: "Home", id: "heroSection" },
    { name: "Theorie examen oefenen", id: "oefenen" },
    { name: "Hoe werkt het?", id: "hoe-werkt-het" },
    { name: "Contact Us", id: "contact" },
];

export default function Navbar() {
    const [showBorder, setShowBorder] = useState(false);
    const activeId = useActiveSection(navLinks.map((item) => item.id));

    useEffect(() => {
        const onScroll = () => {
            const hero = document.getElementById("heroSection");
            if (!hero) return;
            const heroHeight = hero.offsetHeight;
            setShowBorder(window.scrollY > heroHeight - 70);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav
            className={`dark:bg-gray-900 fixed w-full z-20 top-0 start-0 transition-colors ${
                showBorder
                    ? "border-b border-gray-300 dark:border-gray-600 bg-blue-50"
                    : "bg-white"
            }`}
        >
            <div className="container flex flex-wrap items-center justify-between mx-auto p-4">
                <a
                    href="#"
                    className="flex items-center space-x-3 rtl:space-x-reverse"
                >
                    <img
                        src="/logos/full_logo.svg"
                        className="h-8"
                        alt="Flowbite Logo"
                    />
                </a>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <div className="hidden md:flex space-x-3">
                        <button
                            type="button"
                            className="text-black bg-gray-50 border hover:bg-gray-100 focus:ring-4 focus:outline-none rounded-full font-medium text-sm px-4 py-2 text-center"
                        >
                            Bestellen
                        </button>
                        <button
                            type="button"
                            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none rounded-full focus:ring-blue-300 font-medium text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Get started
                        </button>
                    </div>
                    <button
                        data-collapse-toggle="navbar-sticky"
                        type="button"
                        className="inline-flex items-center w-10 h-10 justify-center text-sm text-gray-500 rounded-full md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-sticky"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
                        <img src="/landing_page/menu_icon.svg" />
                    </button>
                </div>
                <div
                    className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                    id="navbar-sticky"
                >
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-200 rounded-lg md:space-x-4 lg:space-x-6 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
                        {navLinks.map((link) => {
                            const isActive = activeId === link.id;
                            return (
                                <li key={link.id}>
                                    <a
                                        href={`#${link.id}`}
                                        className={
                                            `block py-2 px-3 rounded-sm hover:bg-gray-200 md:hover:bg-transparent md:hover:text-blue-700 md:p-0  ` +
                                            (isActive
                                                ? "md:text-blue-600"
                                                : "md:text-gray-900")
                                        }
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
