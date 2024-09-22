"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/verify', label: 'Verify' },
        { href: '/features', label: 'Features' },
    ];

    return (
        <nav className="sticky top-0 z-10 w-full bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                    pathname === item.href
                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};
