"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Importowanie usePathname

export const Navbar = () => {
    const pathname = usePathname(); // Uzyskanie aktualnej ścieżki

    return (
        <nav className="flex h-20 w-full items-center justify-center bg-background">
            <div className="flex items-center gap-4">
                <Link
                    href="/"
                    className={`inline-flex h-10 items-center justify-center rounded-md px-6 py-2 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${
                        pathname === '/'
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                >
                    Home
                </Link>
                <Link
                    href="/verify"
                    className={`inline-flex h-10 items-center justify-center rounded-md px-6 py-2 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${
                        pathname === '/verify'
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                >
                    Verify
                </Link>
            </div>
        </nav>
    )
};