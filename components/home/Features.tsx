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
        <section className="py-32 bg-heritage-dark perspective-container">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
                    <div className="space-y-12">
                        <h2 className="font-serif text-6xl text-navy-deep leading-tight font-black">
                            Engineering <span className="text-[#D4AF37] italic drop-shadow-md">The Future</span>
                        </h2>

                        <div className="grid grid-cols-1 gap-5">
                            {checklist.map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.02, x: 10 }}
                                    className="flex items-center gap-5 p-6 bg-white border-l-4 border-[#D4AF37] shadow-lg cursor-default transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                                >
                                    <Hammer className="text-[#D4AF37] flex-shrink-0" size={24} />
                                    <p className="text-lg font-black text-[#001F3F] uppercase tracking-tighter">{item}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        whileHover={{ rotateY: -10, rotateX: 5 }}
                        className="relative h-[650px] w-full border-[15px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden group rounded-xl"
                    >
                        <Image src="/images/site-main.jpg" alt="Construction Site" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-[#001F3F]/10 group-hover:bg-transparent transition-all" />
                    </motion.div>
                </div>

                {/* PREMIUM WHITE CARDS WITH GOLDEN GLOW SHADOW */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="card-3d group p-10 bg-white rounded-xl border border-gray-100 flex flex-col items-center text-center cursor-pointer transition-all duration-500 hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:-translate-y-2"
                        >
                            <div className="text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform duration-500">
                                <item.Icon size={48} strokeWidth={1.5} />
                            </div>
                            <h4 className="font-serif text-2xl font-bold text-[#001F3F] mb-3">{item.title}</h4>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}