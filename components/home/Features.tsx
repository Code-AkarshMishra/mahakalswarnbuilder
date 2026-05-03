"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Building2, Home, Hammer, Ruler } from "lucide-react";
import React from 'react';

const items = [
    { title: "Residential Luxury", Icon: Home, desc: "Bespoke Vastu Villas" },
    { title: "Commercial Hubs", Icon: Building2, desc: "Prime Retail Spaces" },
    { title: "Civil Consulting", Icon: Ruler, desc: "Structural Excellence" },
    { title: "Smart Security", Icon: ShieldCheck, desc: "AI-Safe Protocols" }
];

export default function Features() {
    const checklist = [
        "Prime Location: Near City Hubs",
        "Modern Home Design: Vastu Compliant",
        "Trusted Construction Quality",
        "Ready to Visit Site Available",
        "Commercial Construction Excellence"
    ];

    return (
        <section className="py-16 md:py-32 bg-[#FDFBF7] perspective-container overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center mb-16 md:mb-32">

                    {/* Left Side: Checklist */}
                    <div className="space-y-8 md:space-y-12">
                        <h2 className="font-serif text-4xl md:text-6xl text-[#001F3F] leading-tight font-black text-center lg:text-left">
                            Engineering <span className="text-[#D4AF37] italic drop-shadow-md">The Future</span>
                        </h2>

                        <div className="grid grid-cols-1 gap-4 md:gap-5">
                            {checklist.map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.02, x: 10 }}
                                    className="flex items-center gap-4 md:gap-5 p-4 md:p-6 bg-white border-l-4 border-[#D4AF37] shadow-md cursor-default transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                                >
                                    <Hammer className="text-[#D4AF37] flex-shrink-0" size={20} />
                                    <p className="text-sm md:text-lg font-black text-[#001F3F] uppercase tracking-tighter">{item}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Image */}
                    <motion.div
                        whileHover={{ rotateY: -10, rotateX: 5 }}
                        // FIX: aspect-[4/3] on mobile so it fits nicely. Fixed height only on desktop (lg:h-[600px]).
                        className="relative aspect-[4/3] lg:aspect-auto lg:h-[600px] w-full border-[8px] md:border-[15px] border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] overflow-hidden group rounded-xl"
                    >
                        <Image
                            src="/images/site-main.jpg"
                            alt="Construction Quality"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            // FIX: Removed grayscale completely. It will stay colorful.
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-[#001F3F]/5 group-hover:bg-transparent transition-all" />
                    </motion.div>
                </div>

                {/* Bottom 4 Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="card-3d group p-8 md:p-10 bg-white rounded-xl border border-gray-100 flex flex-col items-center text-center cursor-pointer transition-all duration-500 hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:-translate-y-2"
                        >
                            <div className="text-[#D4AF37] mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500">
                                <item.Icon size={40} strokeWidth={1.5} />
                            </div>
                            <h4 className="font-serif text-xl md:text-2xl font-bold text-[#001F3F] mb-2 md:mb-3">{item.title}</h4>
                            <p className="text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] text-gray-500 font-bold">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}