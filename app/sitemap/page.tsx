import type { Metadata } from "next";
import Link from "next/link";
import { 
    Home, 
    Calculator, 
    Building2, 
    User, 
    Phone, 
    FileCode, 
    ShieldCheck, 
    CheckCircle2, 
    ArrowLeft, 
    MapPin, 
    Mail, 
    Receipt, 
    ExternalLink 
} from "lucide-react";

export const metadata: Metadata = {
    title: "Sitemap & Navigation Index",
    description: "Complete directory and sitemap for Mahakal Swarn Builder - luxury construction rates, 3D architectural planning, and corporate details in Lucknow and Delhi NCR.",
    alternates: {
        canonical: "https://www.mahakalswarnbuilder.in/sitemap",
    },
};

export default function SitemapPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-[#001428] via-[#001F3F] to-[#001428] text-white">
            {/* Top Navigation Bar */}
            <header className="border-b border-[#D4AF37]/20 bg-black/30 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors text-sm font-semibold"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Home</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <img
                            src="/logo/ms-shivling.png"
                            alt="Mahakal Swarn Builder Logo"
                            className="h-9 w-auto"
                        />
                        <span className="font-serif text-lg font-black tracking-tight text-[#D4AF37]">
                            MAHAKAL SWARN BUILDER
                        </span>
                    </div>
                </div>
            </header>

            {/* Hero Header */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-4">
                    <FileCode size={14} />
                    <span>Official Directory & Site Index</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#D4AF37] tracking-tight mb-4">
                    Website Sitemap & Directory
                </h1>
                <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 leading-relaxed">
                    Explore all sections of Mahakal Swarn Builder — North India's premier luxury construction startup delivering turnkey residential, commercial, and architectural projects.
                </p>
            </section>

            {/* Sitemap Grid */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. Main Website Sections */}
                <div className="bg-[#002850]/60 border border-[#D4AF37]/20 rounded-2xl p-6 shadow-xl hover:border-[#D4AF37]/50 transition-all">
                    <div className="flex items-center gap-3 mb-4 text-[#D4AF37]">
                        <Home size={22} />
                        <h2 className="font-serif text-xl font-bold">Main Navigation</h2>
                    </div>
                    <ul className="space-y-3 text-sm">
                        <li>
                            <Link href="/" className="text-gray-200 hover:text-[#D4AF37] flex items-center justify-between group">
                                <span>Homepage</span>
                                <span className="text-xs text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">/</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/#calculator" className="text-gray-200 hover:text-[#D4AF37] flex items-center justify-between group">
                                <span>Construction Cost Calculator</span>
                                <span className="text-xs text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">#calculator</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/#projects" className="text-gray-200 hover:text-[#D4AF37] flex items-center justify-between group">
                                <span>Featured Luxury Projects</span>
                                <span className="text-xs text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">#projects</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/#about" className="text-gray-200 hover:text-[#D4AF37] flex items-center justify-between group">
                                <span>About Founder & Heritage</span>
                                <span className="text-xs text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">#about</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/#contact" className="text-gray-200 hover:text-[#D4AF37] flex items-center justify-between group">
                                <span>Direct Contact & Consultation</span>
                                <span className="text-xs text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">#contact</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* 2. Construction Pricing Packages */}
                <div className="bg-[#002850]/60 border border-[#D4AF37]/20 rounded-2xl p-6 shadow-xl hover:border-[#D4AF37]/50 transition-all">
                    <div className="flex items-center gap-3 mb-4 text-[#D4AF37]">
                        <Calculator size={22} />
                        <h2 className="font-serif text-xl font-bold">Construction Packages</h2>
                    </div>
                    <ul className="space-y-4 text-sm">
                        <li className="border-b border-white/10 pb-3">
                            <Link href="/#calculator" className="block group">
                                <div className="flex items-center justify-between font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                                    <span>Basic Tier Package</span>
                                    <span className="text-xs text-[#D4AF37]">₹1,850 / sq.ft</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    High-grade Red Bricks, UltraTech/Ambuja Cement, Fe550D TMT, standard sanitary & wiring.
                                </p>
                            </Link>
                        </li>
                        <li className="border-b border-white/10 pb-3">
                            <Link href="/#calculator" className="block group">
                                <div className="flex items-center justify-between font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                                    <span>Moderate Tier Package</span>
                                    <span className="text-xs text-[#D4AF37]">₹1,985 / sq.ft</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    Double-charged vitrified flooring, branded modular fittings, weather-proof exterior finish.
                                </p>
                            </Link>
                        </li>
                        <li>
                            <Link href="/#calculator" className="block group">
                                <div className="flex items-center justify-between font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                                    <span>Advance Tier Package</span>
                                    <span className="text-xs text-[#D4AF37]">₹2,150 / sq.ft</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    Italian-finish vitrified tiles, smart home lighting, designer teak/flush woodwork & facade.
                                </p>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* 3. Core Services */}
                <div className="bg-[#002850]/60 border border-[#D4AF37]/20 rounded-2xl p-6 shadow-xl hover:border-[#D4AF37]/50 transition-all">
                    <div className="flex items-center gap-3 mb-4 text-[#D4AF37]">
                        <Building2 size={22} />
                        <h2 className="font-serif text-xl font-bold">Services & Solutions</h2>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-200">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            <span>Turnkey Residential Construction</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            <span>3D Architectural CAD & Elevation Design</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            <span>100% Vastu-Compliant Floor Plans</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            <span>Commercial Hubs & Retail Showrooms</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            <span>Complete Material Supply & Quality Audits</span>
                        </li>
                    </ul>
                </div>

                {/* 4. Head Office & Contact */}
                <div className="bg-[#002850]/60 border border-[#D4AF37]/20 rounded-2xl p-6 shadow-xl hover:border-[#D4AF37]/50 transition-all">
                    <div className="flex items-center gap-3 mb-4 text-[#D4AF37]">
                        <Phone size={22} />
                        <h2 className="font-serif text-xl font-bold">Corporate Information</h2>
                    </div>
                    <div className="space-y-3 text-xs sm:text-sm text-gray-300">
                        <div className="flex items-start gap-2">
                            <MapPin size={16} className="text-[#D4AF37] flex-shrink-0 mt-1" />
                            <span>Vibhuti Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={16} className="text-[#D4AF37] flex-shrink-0" />
                            <a href="tel:+918707790653" className="hover:text-[#D4AF37] transition-colors">
                                +91 87077 90653 / +91 97938 90653
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail size={16} className="text-[#D4AF37] flex-shrink-0" />
                            <a href="mailto:mahakalswarnbuilder@gmail.com" className="hover:text-[#D4AF37] transition-colors">
                                mahakalswarnbuilder@gmail.com
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <Receipt size={16} className="text-[#D4AF37] flex-shrink-0" />
                            <span className="font-mono text-white">GSTIN: 09CXUPT7007D1ZY</span>
                        </div>
                    </div>
                </div>

                {/* 5. Founder & Governance */}
                <div className="bg-[#002850]/60 border border-[#D4AF37]/20 rounded-2xl p-6 shadow-xl hover:border-[#D4AF37]/50 transition-all">
                    <div className="flex items-center gap-3 mb-4 text-[#D4AF37]">
                        <User size={22} />
                        <h2 className="font-serif text-xl font-bold">Founder & Leadership</h2>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-3">
                        Founded by <strong className="text-white font-semibold">Swarn Kumar Tripathi</strong>. Guided by engineering precision, transparent billing, and dedicated milestone delivery.
                    </p>
                    <Link
                        href="/#about"
                        className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline font-bold"
                    >
                        <span>Read Founder Biography</span>
                        <ExternalLink size={12} />
                    </Link>
                </div>

                {/* 6. Technical Search Engine Feeds */}
                <div className="bg-[#002850]/60 border border-[#D4AF37]/20 rounded-2xl p-6 shadow-xl hover:border-[#D4AF37]/50 transition-all">
                    <div className="flex items-center gap-3 mb-4 text-[#D4AF37]">
                        <ShieldCheck size={22} />
                        <h2 className="font-serif text-xl font-bold">Search Engine Feeds</h2>
                    </div>
                    <ul className="space-y-3 text-sm">
                        <li>
                            <a
                                href="/sitemap.xml"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between text-gray-200 hover:text-[#D4AF37] transition-colors"
                            >
                                <span className="font-mono text-xs">/sitemap.xml</span>
                                <span className="text-xs bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded">XML Feed</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/robots.txt"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between text-gray-200 hover:text-[#D4AF37] transition-colors"
                            >
                                <span className="font-mono text-xs">/robots.txt</span>
                                <span className="text-xs bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded">Robots Standard</span>
                            </a>
                        </li>
                        <li className="pt-2 border-t border-white/10">
                            <span className="text-xs text-gray-400">
                                Protected Admin routes (/admin) are excluded from indexation according to industry security standards.
                            </span>
                        </li>
                    </ul>
                </div>

            </section>

            {/* Footer */}
            <footer className="border-t border-[#D4AF37]/20 mt-12 py-8 text-center text-xs text-gray-400">
                <p className="tracking-widest uppercase text-[10px] text-gray-500 font-bold mb-2">
                    Mahakal Swarn Builder &bull; Construction & Real Estate
                </p>
                <p>&copy; {new Date().getFullYear()} Mahakal Swarn Builder. All rights reserved.</p>
            </footer>
        </main>
    );
}
