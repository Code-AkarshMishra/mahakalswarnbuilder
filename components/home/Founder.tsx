// components/home/Founder.tsx
export default function Founder() {
    return (
        <section id="about" className="py-32 bg-white relative">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <div className="relative">
                    <div className="absolute -top-10 -left-10 w-40 h-40 border-t-8 border-l-8 border-pure-gold" />
                    <div className="bg-navy-deep aspect-[4/5] relative shadow-3d overflow-hidden">
                        {/* Replace with real founder photo */}
                        <img src="/images/founder.jpg" alt="Swarn Kumar Tripathi" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                    </div>
                </div>
                <div className="space-y-8">
                    <h4 className="text-pure-gold font-bold uppercase tracking-[0.3em] text-xs">The Visionary</h4>
                    <h2 className="font-serif text-5xl text-navy-deep leading-tight">Swarn Kumar Tripathi</h2>
                    <p className="text-lg text-gray-600 leading-relaxed italic">
                        "We aren't just selling properties; we are building the future of North India's skyline. My mission is to blend spiritual Vastu principles with startup agility to deliver homes that empower families."
                    </p>
                    <div className="flex gap-10">
                        <div><p className="text-3xl font-serif text-navy-deep">15+</p><p className="text-[10px] text-gray-400 uppercase tracking-widest">Years Experience</p></div>
                        <div><p className="text-3xl font-serif text-navy-deep">Lucknow</p><p className="text-[10px] text-gray-400 uppercase tracking-widest">Base of Operations</p></div>
                    </div>
                </div>
            </div>
        </section>
    );
}