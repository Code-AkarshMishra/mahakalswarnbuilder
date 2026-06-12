"use client";

import { useState } from "react";
import Image from "next/image";

export default function ModernDesignCollection() {
    const [isOpen, setIsOpen] = useState(false);



    // The newly added raw site/recent project images
    const recentImages = [
        { id: 4, src: "/projects/exterior-night.jpg", title: "Exterior Night View" },
        { id: 5, src: "/projects/exterior-day.jpg", title: "Exterior Day View" },
        { id: 6, src: "/projects/kitchen.jpg", title: "Modern Kitchen Layout" },
        { id: 7, src: "/projects/tv-unit.jpg", title: "Living Room TV Unit" },
        { id: 8, src: "/projects/bedroom.jpg", title: "Bedroom Interiors" },
        { id: 9, src: "/projects/empty-room.jpg", title: "Spacious Room Layout" },
        { id: 10, src: "/projects/bathroom.jpg", title: "Premium Washroom" },
        { id: 11, src: "/projects/staircase.jpg", title: "Staircase & Entrance" },
    ];

    return (
        <section className="py-12 md:py-16 bg-[#FCFAF6]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">


                {/* Explore More Toggle Button */}
                <div className="flex justify-center mt-10 md:mt-12 mb-2 relative z-10">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base rounded-full border-2 border-[#B89645] text-[#B89645] font-semibold bg-white/80 backdrop-blur-sm active:scale-95 sm:hover:bg-[#B89645] sm:hover:text-white transition-all duration-300 focus:outline-none flex items-center gap-2 shadow-sm"
                    >
                        {isOpen ? "Show Less" : "Explore More"}
                        <svg
                            className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                {/* Dropdown Section for Recent Projects */}
                <div className={`grid transition-[grid-template-rows,opacity] duration-700 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">

                        <div className="pt-8 pb-4">
                            {/* Divider and Subheading */}
                            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 justify-center">
                                <div className="h-0.5 w-8 md:w-12 bg-gray-300"></div>
                                <h3 className="text-lg md:text-2xl font-bold text-gray-800 tracking-tight text-center">
                                    Recent On-Site Projects
                                </h3>
                                <div className="h-0.5 w-8 md:w-12 bg-gray-300"></div>
                            </div>

                            {/* Recent Projects Grid - 2 columns on mobile, 3 on tablet, 4 on desktop */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                                {recentImages.map((image) => (
                                    <div
                                        key={image.id}
                                        className="group relative aspect-[4/3] w-full rounded-lg md:rounded-xl overflow-hidden shadow-sm bg-gray-100"
                                    >
                                        <Image
                                            src={image.src}
                                            alt={image.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />

                                        {/* Gradient Overlay: Touch friendly & elegant */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5 md:p-4">
                                            <p className="text-white font-medium text-xs md:text-sm tracking-wide line-clamp-2 drop-shadow-sm">
                                                {image.title}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}