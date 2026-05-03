// components/home/Services.tsx
import { Home, Building2, HardHat, ShieldCheck } from "lucide-react";

const services = [
    { icon: <Home />, title: "Residential", desc: "Vastu-compliant luxury villas in Lucknow and Noida." },
    { icon: <Building2 />, title: "Commercial", desc: "Modern retail spaces and corporate hubs in Delhi-NCR." },
    { icon: <HardHat />, title: "Consultancy", desc: "Structural auditing and premium material sourcing." },
    { icon: <ShieldCheck />, title: "Quality", desc: "Grade-A steel and seismic-zone compliant architecture." }
];

export default function Services() {
    return (
        <section id="services" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="font-serif text-4xl text-navy-premium mb-12">Startup Excellence in Construction</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {services.map((s, i) => (
                        <div key={i} className="p-8 border border-gold-soft/30 bg-premium-silk/20 hover:border-gold-prime transition-all">
                            <div className="text-gold-prime mb-6">{s.icon}</div>
                            <h3 className="font-serif text-xl text-navy-premium mb-4">{s.title}</h3>
                            <p className="text-gray-500 text-sm">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}