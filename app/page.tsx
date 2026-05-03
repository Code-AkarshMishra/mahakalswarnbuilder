import Preloader from "@/components/shared/Preloader";
import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Projects from "@/components/home/Projects";
import ChatAssistant from "@/components/shared/ChatAssistant";
import Footer from "@/components/shared/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />

      {/* STARTUP-READY TRUST SIGNALS */}
      <section className="py-16 bg-[#FDFBF7] border-y border-gray-200 shadow-sm z-10 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBox val="03+" label="Upcoming Projects" />
          <StatBox val="100%" label="Transparent Process" />
          <StatBox val="Modern" label="AI & Vastu Design" />
          <StatBox val="RERA" label="Compliance Ready" />
        </div>
      </section>

      <Features />
      <Projects />

      {/* FOUNDER'S VISION SECTION */}
      <section id="about" className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="h-[3px] w-24 bg-[#D4AF37] mx-auto mb-10 shadow-[0_0_10px_rgba(212,175,55,0.6)]" />
          <p className="text-3xl md:text-4xl font-serif text-[#001F3F] italic leading-relaxed mb-10">
            "As a new-age developer, we don't just build homes; we curate sanctuaries. By blending modern AI tracking with ancient Vastu principles, we ensure zero compromise on quality."
          </p>
          <p className="font-black text-black uppercase tracking-widest text-lg">Swarn kumar Tripathi</p>
          <p className="text-xs text-[#D4AF37] mt-2 font-bold uppercase tracking-[0.3em]">Founder & Managing Director</p>
        </div>
      </section>

      <ChatAssistant />
      <Footer />
    </main>
  );
}

// Reusable StatBox Component
function StatBox({ val, label }: { val: string, label: string }) {
  return (
    <div className="text-center group">
      <p className="text-4xl md:text-5xl font-serif text-[#001F3F] font-black drop-shadow-sm group-hover:scale-105 transition-transform duration-300">
        {val}
      </p>
      <p className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500 mt-3 font-bold group-hover:text-[#D4AF37] transition-colors">
        {label}
      </p>
    </div>
  );
}