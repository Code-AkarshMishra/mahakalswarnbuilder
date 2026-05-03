"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const projects = [
    { title: "Swarn Enclave", location: "Lucknow", image: "/images/site-main.jpg" },
    { title: "Executive Heights", location: "Delhi NCR", image: "/images/residency.jpg" }
];

export default function Projects() {
    return (
        <section id="projects" className="py-20 md:py-32 bg-[#FDFBF7] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                <div className="text-center mb-12 md:mb-20">
                    <h2 className="font-serif text-4xl md:text-6xl text-navy-deep leading-tight font-black">
                        Architectural <span className="text-[#D4AF37] italic drop-shadow-md">Excellence</span>
                    </h2>
                    <p className="text-gray-500 uppercase tracking-[0.1em] md:tracking-[0.3em] font-bold text-xs md:text-sm mt-4">
                        Delivering Premium Quality in Lucknow | Delhi | Noida
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                    {projects.map((p, i) => (
                        <motion.div key={i} whileHover={{ y: -10 }} className="group cursor-pointer">
                            {/* FIX: Removed fixed h-[400px], used aspect ratio to prevent cropping on mobile */}
                            <div className="relative aspect-[4/3] md:aspect-video lg:h-[400px] overflow-hidden mb-6 md:mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.2)] border-[8px] md:border-[10px] border-white rounded-xl">
                                <Image
                                    src={p.image} alt={p.title} fill sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-[#001F3F]/20 group-hover:bg-transparent transition-all" />
                            </div>
                            <div className="flex justify-between items-center px-2 md:px-4">
                                <div>
                                    <h3 className="font-serif text-2xl md:text-3xl text-[#001F3F] font-black">{p.title}</h3>
                                    <p className="text-gray-500 text-xs md:text-sm font-bold mt-1 md:mt-2 tracking-widest uppercase">{p.location}</p>
                                </div>
                                <div className="w-8 md:w-12 h-1 bg-[#D4AF37] group-hover:w-16 md:group-hover:w-24 transition-all duration-500" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}