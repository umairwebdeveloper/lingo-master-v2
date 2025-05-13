import Image from "next/image";
import Link from "next/link";
import {
    MapPin,
    Mail,
    Phone,
    Facebook,
    Twitter,
    Youtube,
    Instagram,
    Linkedin,
} from "lucide-react";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white text-gray-700">
            {/* Top: Logo + Social */}
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                        <Image
                            src="/logos/full_logo.svg"
                            alt="theoriebuddy logo"
                            width={250}
                            height={250}
                        />
                    </div>
                    <div className="flex space-x-4">
                        <Link href="#" aria-label="Facebook">
                            <Facebook className="w-5 h-5 hover:text-blue-600 transition" />
                        </Link>
                        <Link href="#" aria-label="Twitter">
                            <Twitter className="w-5 h-5 hover:text-blue-600 transition" />
                        </Link>
                        <Link href="#" aria-label="YouTube">
                            <Youtube className="w-5 h-5 hover:text-blue-600 transition" />
                        </Link>
                        <Link href="#" aria-label="Instagram">
                            <Instagram className="w-5 h-5 hover:text-blue-600 transition" />
                        </Link>
                        <Link href="#" aria-label="LinkedIn">
                            <Linkedin className="w-5 h-5 hover:text-blue-600 transition" />
                        </Link>
                    </div>
                </div>

                <hr className="my-8 border-t border-gray-200" />

                {/* Main columns */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Our Address */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">
                            Our Address
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-2">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                <span>123 Address New York, USA</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Mail className="w-5 h-5 text-blue-600" />
                                <span>hello@LearnEase.com</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Phone className="w-5 h-5 text-blue-600" />
                                <span>+1 234 567 890</span>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            {[
                                "Home",
                                "About Us",
                                "Courses",
                                "FAQ",
                                "Contact",
                            ].map((link) => (
                                <li key={link}>
                                    <Link
                                        href={`/${link
                                            .toLowerCase()
                                            .replace(/\s+/g, "")}`}
                                        className="hover:text-blue-600 transition"
                                    >
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Courses Category */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">
                            Courses Category
                        </h4>
                        <ul className="space-y-2">
                            {[
                                "Business Management",
                                "Programming",
                                "Creative Arts",
                                "Digital Strategy",
                                "Accounting",
                            ].map((cat) => (
                                <li key={cat}>
                                    <Link
                                        href="#"
                                        className="hover:text-blue-600 transition"
                                    >
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">
                            Join our newsletter to keep up to date with us!
                        </h4>
                        {/* <form className="flex">
                            <input
                                type="email"
                                placeholder="Email"
                                className="flex-1 px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-r-full hover:bg-blue-700 transition"
                            >
                                Subscribe
                            </button>
                        </form> */}
                        <p className="mt-2 text-sm text-gray-500">
                            Get the latest news about our updates and discounts
                        </p>
                    </div>
                </div>
            </div>

            <hr className="border-t border-gray-200" />

            {/* Bottom: Copyright & Links */}
            <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between text-sm text-gray-500">
                <span>Copyright © {year} TheorieBuddy</span>
                <div className="flex space-x-4 mt-2 md:mt-0">
                    <Link href="/privacy" className="hover:underline">
                        Privacy beleid
                    </Link>
                    <span>|</span>
                    <Link href="/terms" className="hover:underline">
                        Algemene voorwaarden
                    </Link>
                </div>
            </div>
        </footer>
    );
}
