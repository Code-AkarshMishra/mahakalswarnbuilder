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
        { name: "Home", href: "/" },
        { name: "Projects", href: "#projects" },
        { name: "About Founder", href: "#about" },
        { name: "Contact", href: "#contact" },
    ];

    return (
        <nav className={`fixed w-full z-[100] transition-all duration-700 ${isScrolled ? "bg-white/90 backdrop-blur-xl py-3 shadow-2xl border-b border-gold-prime/20" : "bg-transparent py-6"}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3">
                    <img src="/logo/ms-shivling.png" className="h-14 w-auto animate-gold-glow" alt="MS Logo" />
                    <span className="font-serif text-2xl md:text-3xl font-black tracking-tighter text-pure-gold drop-shadow-md">
                        MAHAKAL  SWARN  BUILDER
                    </span>
                </Link>

                <div className="hidden md:flex gap-10">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="nav-fill-link">
                            {link.name}
                        </Link>
                    ))}
                </div>

                <button className="md:hidden text-pure-gold p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
                </button>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="absolute top-full left-0 w-full bg-navy-deep border-t border-pure-gold/30 shadow-2xl md:hidden overflow-hidden">
                        <div className="flex flex-col p-8 gap-6 text-center">
                            {navLinks.map((link) => (
                                <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-pure-gold text-xl font-black uppercase tracking-widest hover:text-white transition-all">
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