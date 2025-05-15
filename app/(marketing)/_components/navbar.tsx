import { useActiveSection } from "@/lib/useActiveSection";
import { useState, useEffect } from "react";
import {
    ClerkLoaded,
    ClerkLoading,
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";

interface NavLink {
    name: string;
    id: string;
}

const navLinks: NavLink[] = [
    { name: "Home", id: "heroSection" },
    { name: "Theorie examen oefenen", id: "oefenen" },
    { name: "Hoe werkt het?", id: "howWorks" },
    { name: "Contact Us", id: "contact" },
];

export default function Navbar() {
    const [showBorder, setShowBorder] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const activeId = useActiveSection(navLinks.map((item) => item.id));

    useEffect(() => {
        const onScroll = () => {
            const hero = document.getElementById("heroSection");
            if (!hero) return;
            setShowBorder(window.scrollY > hero.offsetHeight - 70);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    return (
        <nav
            className={`fixed w-full z-20 top-0 start-0 transition-colors ${
                showBorder
                    ? "border-b border-gray-300 dark:border-gray-600 bg-blue-50"
                    : "bg-white dark:bg-gray-900"
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

                {/* desktop auth + action buttons */}
                <div className="hidden md:flex items-center space-x-3 md:order-2">
                    <button
                        type="button"
                        onClick={() =>
                            document
                                .getElementById("pricing")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="text-black bg-gray-50 border hover:bg-gray-100 focus:ring-4 focus:outline-none rounded-full font-medium text-sm px-4 py-2"
                    >
                        Bestellen
                    </button>

                    {/* Clerk Auth */}
                    <ClerkLoading>
                        <Loader className="animate-spin h-5 w-5 text-gray-500" />
                    </ClerkLoading>
                    <ClerkLoaded>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                        <SignedOut>
                            <SignInButton>
                                <button className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none rounded-full font-medium text-sm px-4 py-2">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton>
                                <button className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none rounded-full focus:ring-blue-300 font-medium text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Get Started
                                </button>
                            </SignUpButton>
                        </SignedOut>
                    </ClerkLoaded>
                </div>

                {/* mobile menu toggle */}
                <button
                    onClick={toggleMenu}
                    aria-controls="navbar-sticky"
                    aria-expanded={isMenuOpen}
                    className="inline-flex items-center w-10 h-10 justify-center text-gray-500 rounded-full md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                >
                    <span className="sr-only">Open main menu</span>
                    <img src="/landing_page/menu_icon.svg" />
                </button>

                {/* nav links + mobile auth/actions */}
                <div
                    id="navbar-sticky"
                    className={`${
                        isMenuOpen ? "block" : "hidden"
                    } w-full md:flex md:w-auto md:order-1 items-center justify-between`}
                >
                    {/* mobile-only auth + action buttons */}
                    <div className="flex flex-col space-y-2 my-4 md:hidden">
                        <button
                            type="button"
                            onClick={() =>
                                document
                                    .getElementById("pricing")
                                    ?.scrollIntoView({ behavior: "smooth" })
                            }
                            className="text-black bg-gray-50 border hover:bg-gray-100 focus:ring-4 focus:outline-none rounded-full font-medium text-sm px-4 py-2"
                        >
                            Bestellen
                        </button>

                        {/* Clerk Auth Mobile */}
                        <ClerkLoading>
                            <Loader className="animate-spin h-5 w-5 text-gray-500" />
                        </ClerkLoading>
                        <ClerkLoaded>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                            <SignedOut>
                                <SignInButton>
                                    <button className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none rounded-full focus:ring-blue-300 font-medium text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Sign In
                                    </button>
                                </SignInButton>
                                <SignUpButton>
                                    <button className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none rounded-full font-medium text-sm px-4 py-2">
                                        Sign Up
                                    </button>
                                </SignUpButton>
                            </SignedOut>
                        </ClerkLoaded>
                    </div>

                    <ul className="flex flex-col p-4 space-y-2 font-medium border border-gray-200 rounded-lg md:space-x-4 md:space-y-0 md:p-0 md:flex-row md:mt-0 md:border-0 rtl:space-x-reverse">
                        {navLinks.map((link) => (
                            <li key={link.id}>
                                <a
                                    href={`#${link.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document
                                            .getElementById(link.id)
                                            ?.scrollIntoView({
                                                behavior: "smooth",
                                            });
                                        setIsMenuOpen(false);
                                    }}
                                    className={`block py-2 px-3 rounded-sm hover:bg-gray-200 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ${
                                        activeId === link.id
                                            ? "md:text-blue-600"
                                            : "md:text-gray-900"
                                    }`}
                                >
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
