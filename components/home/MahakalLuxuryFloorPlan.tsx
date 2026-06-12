// components/MahakalLuxuryShowcase.tsx

"use client";

import Image from "next/image";

const interiors = [
    {
        title: "Modern Kitchen",
        image: "/kitchen.jpg",
        desc: "Luxury modular kitchen with elegant lighting and premium storage.",
    },
    {
        title: "Premium Dining",
        image: "/dining.jpg",
        desc: "Stylish dining area crafted with warmth and modern elegance.",
    },
    {
        title: "Master Bedroom",
        image: "/master-bedroom.jpg",
        desc: "Luxury bedroom aesthetics with ambient textures and comfort.",
    },
    {
        title: "Kids Bedroom",
        image: "/kids-room.jpg",
        desc: "Modern pastel room with soft luxury and creative styling.",
    },
];

const extras = [
    {
        title: "Modern Exterior",
        image: "/modern-house.jpg",
    },
    {
        title: "TV Panel Design",
        image: "/tv-panel.jpg",
    },
    {
        title: "Workspace Design",
        image: "/office.jpg",
    },
];

export default function MahakalLuxuryShowcase() {
    return (
        <section className="w-full bg-[#f7f3eb] py-24 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">

                {/* ================= HERO ================= */}

                <div className="grid lg:grid-cols-2 gap-14 items-center mb-28">

                    {/* IMAGE SECTION */}
                    <div className="relative w-full">

                        {/* RESPONSIVE IMAGE CONTAINER */}
                        <div
                            className="
        relative
        w-full
        aspect-[16/10]
        rounded-[40px]
        overflow-hidden
        shadow-[0_30px_80px_rgba(0,0,0,0.12)]
        bg-white
      "
                        >
                            <Image
                                src="/hall.jpg"
                                alt="Luxury Hall"
                                fill

                                /*
                                  IMPORTANT:
                                  object-contain = full image always visible
                                  no crop on any device
                                */
                                className="object-contain"

                                /*
                                  RESPONSIVE IMAGE LOADING
                                */
                                sizes="
          (max-width: 768px) 100vw,
          (max-width: 1200px) 90vw,
          50vw
        "

                                priority
                            />

                            {/* OPTIONAL LIGHT OVERLAY */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
                        </div>

                        {/* GOLD BADGE */}
                        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full border border-[#d4af37]/40 shadow-md">

                            <p className="text-[#b78b2e] text-xs md:text-sm tracking-[3px] uppercase font-semibold">
                                Luxury Interior
                            </p>
                        </div>
                    </div>

                    {/* CONTENT SECTION */}
                    <div>

                        <p className="text-[#c59d3f] tracking-[5px] uppercase text-sm mb-5">
                            Mahakal Swarn Builders
                        </p>

                        <h1 className="text-4xl md:text-6xl leading-[1.1] font-bold text-[#171717]">
                            White • Gold <br />
                            Luxury Living
                        </h1>

                        <p className="text-gray-600 text-base md:text-lg leading-relaxed mt-8 max-w-xl">
                            Premium interior experiences crafted with elegant aesthetics,
                            luxury textures and timeless architectural styling.
                        </p>

                        {/* FEATURES */}
                        <div className="grid grid-cols-2 gap-4 md:gap-6 mt-10">

                            <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-[#ead9b0]">
                                <h3 className="text-3xl md:text-4xl font-bold text-[#b78b2e]">
                                    250+
                                </h3>

                                <p className="text-gray-600 mt-2 text-sm md:text-base">
                                    Premium Interior Concepts
                                </p>
                            </div>

                            <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-[#ead9b0]">
                                <h3 className="text-3xl md:text-4xl font-bold text-[#b78b2e]">
                                    15+
                                </h3>

                                <p className="text-gray-600 mt-2 text-sm md:text-base">
                                    Modern Luxury Designs
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= INTERIOR GRID ================= */}
                <div className="mb-28">

                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <p className="text-[#c59d3f] uppercase tracking-[4px] text-sm mb-3">
                                Interior Spaces
                            </p>

                            <h2 className="text-5xl font-bold text-[#171717]">
                                Elegant Home Interiors
                            </h2>
                        </div>

                        <div className="hidden md:block w-40 h-[2px] bg-[#d4af37]" />
                    </div>

                    {/* GRID */}
                    <div className="grid md:grid-cols-2 gap-10">

                        {interiors.map((item, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-[36px] overflow-hidden border border-[#efe2c3] shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition duration-500"
                            >
                                {/* IMAGE */}
                                <div className="relative h-[380px] overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition duration-700"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                </div>

                                {/* CONTENT */}
                                <div className="p-8">
                                    <h3 className="text-3xl font-bold text-[#171717]">
                                        {item.title}
                                    </h3>

                                    <p className="text-gray-600 leading-relaxed mt-4">
                                        {item.desc}
                                    </p>

                                    <div className="w-16 h-[2px] bg-[#c59d3f] mt-6" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ================= EXTRA SHOWCASE ================= */}
                <div>

                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <p className="text-[#c59d3f] uppercase tracking-[4px] text-sm mb-3">
                                Premium Concepts
                            </p>

                            <h2 className="text-5xl font-bold text-[#171717]">
                                Modern Design Collection
                            </h2>
                        </div>

                        <div className="hidden md:block w-40 h-[2px] bg-[#d4af37]" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">

                        {extras.map((item, index) => (
                            <div
                                key={index}
                                className="group rounded-[30px] overflow-hidden bg-white border border-[#efe2c3] shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:-translate-y-2 transition duration-500"
                            >
                                {/* IMAGE */}
                                <div className="relative h-[300px] overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition duration-700"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>

                                {/* TITLE */}
                                <div className="p-7">
                                    <h3 className="text-2xl font-bold text-[#171717]">
                                        {item.title}
                                    </h3>

                                    <div className="w-14 h-[2px] bg-[#c59d3f] mt-5" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}