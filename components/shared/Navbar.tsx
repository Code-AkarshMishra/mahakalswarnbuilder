"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" }, { name: "Projects", href: "#projects" },
        { name: "About Founder", href: "#about" }, { name: "Contact", href: "#contact" },
    ];

    return (
        // FIX: Solid bg-[#FDFBF7] on scroll instead of transparent glass, increased z-index to z-[999]
        <nav className={`fixed w-full z-[999] transition-all duration-300 ${isScrolled ? "bg-[#FDFBF7] py-2 md:py-3 shadow-lg border-b border-[#D4AF37]/30" : "bg-black/20 backdrop-blur-sm md:bg-transparent py-4 md:py-6"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 sm:gap-3 z-50">
                    <img src="/logo/ms-shivling.png" className="h-10 sm:h-12 md:h-14 w-auto animate-gold-glow" alt="MS Logo" />
                    <div className="flex flex-col justify-center">
                        <span className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tighter text-pure-gold drop-shadow-md leading-tight">
                            MAHAKAL SWARN
                        </span>
                        <span className="font-serif text-[10px] sm:text-xs md:text-sm font-black tracking-[0.2em] md:tracking-[0.4em] text-pure-gold drop-shadow-md leading-none mt-1">
                            BUILDER
                        </span>
                    </div>
                </Link>

                <div className="hidden lg:flex gap-10">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="nav-fill-link">
                            {link.name}
                        </Link>
                    ))}
                </div>

                <button className="lg:hidden text-pure-gold p-2 z-50 bg-navy-deep/80 rounded-md" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-full left-0 w-full bg-[#001F3F] border-t-4 border-[#D4AF37] shadow-2xl lg:hidden">
                        <div className="flex flex-col p-6 sm:p-8 gap-6 text-center">
                            {navLinks.map((link) => (
                                <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-[#D4AF37] text-lg sm:text-xl font-black uppercase tracking-widest hover:text-white transition-all">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}