import Image from "next/image";

const projects = [
    {
        title: "Swarn Enclave",
        location: "Lucknow",
        image: "/images/site-main.jpg",
    },
    {
        title: "Executive Heights",
        location: "Noida",
        image: "/images/17b351180cbae033217fb5b4a44d6339.jpg",
    }
];

export default function Projects() {
    return (
        <section id="projects" className="py-24 bg-premium-silk">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="font-serif text-5xl text-navy-premium mb-16">Architectural Excellence</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {projects.map((p, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="relative h-96 overflow-hidden mb-6 shadow-2xl">
                                <Image
                                    src={p.image}
                                    alt={p.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Fixes Image performance warning
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                />
                            </div>
                            <h3 className="font-serif text-2xl text-navy-premium">{p.title}</h3>
                            <p className="text-gray-500 text-sm">{p.location}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}