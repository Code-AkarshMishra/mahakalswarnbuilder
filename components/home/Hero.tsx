"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Hero() {
    const [loading, setLoading] = useState(false);

    const handleEnquiry = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("https://formsubmit.co/ajax/mahakalswarnbuilder@gmail.com", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    Name: data.name, Phone: data.phone,
                    ProjectType: data.projectType, Budget: data.budget,
                    _subject: " Alert !! New Client Enquiry at Mahakal Swarn Builder Website! Contact Now"
                })
            });

            if (response.ok) {
                alert("Enquiry Sent Successfully! Swarn Kumar Tripathi's office will contact you shortly.");
                e.target.reset();
            } else {
                alert("Transmission failed. Please try again or use the WhatsApp option.");
            }
        } catch (error) {
            alert("Network error. Please check your internet connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // FIX: min-h-[100dvh] ensures it stretches on mobile if content is larger. pt-32 adds space below navbar.
        <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-navy-deep pt-32 pb-16 lg:py-0">
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105">
                <source src="/videos/drone-site.mp4" type="video/mp4" />
            </video>

            {/* FIX: Reduced gap for mobile, added top margin so it doesn't touch navbar */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                <div className="space-y-4 md:space-y-6 text-center lg:text-left mt-4 lg:mt-0">
                    <motion.h1
                        initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
                        className="font-serif text-5xl sm:text-6xl md:text-8xl text-white font-black leading-tight drop-shadow-2xl"
                    >
                        Quality In <br /> <span className="gold-gradient-text">Affordable Price</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-pure-gold text-xs sm:text-sm md:text-xl tracking-[0.2em] md:tracking-[0.4em] font-black uppercase border-l-0 lg:border-l-8 border-pure-gold lg:pl-6"
                    >
                        North India's #1 Construction Startup
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
                        className="inline-block bg-white/10 backdrop-blur-md border border-pure-gold/50 px-4 md:px-6 py-2 md:py-3 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.2)] mt-2"
                    >
                        <p className="text-white text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em]">
                            <span className="text-pure-gold mr-2">✓</span> Available in Delhi, Noida & Lucknow
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
                    // FIX: Form paddings reduced for mobile, bg changed to cream #FDFBF7
                    className="bg-[#FDFBF7]/95 p-5 sm:p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-[10px] md:border-t-[20px] border-pure-gold w-full max-w-md mx-auto lg:max-w-full rounded-b-xl lg:rounded-none"
                >
                    <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-navy-deep mb-5 md:mb-8 font-black text-center lg:text-left">Startup Enquiry Portal</h3>
                    <form onSubmit={handleEnquiry} className="grid grid-cols-1 gap-4 md:gap-6">
                        <input name="name" required placeholder="Investor / Client Name" className="p-3 md:p-4 border-b-2 border-gold-soft outline-none focus:border-pure-gold bg-transparent text-sm md:text-lg font-bold text-navy-deep placeholder-gray-500" />
                        <input name="phone" required type="tel" placeholder="Primary Contact Number" className="p-3 md:p-4 border-b-2 border-gold-soft outline-none focus:border-pure-gold bg-transparent text-sm md:text-lg font-bold text-navy-deep placeholder-gray-500" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <select name="projectType" className="p-3 md:p-4 border-b-2 border-gold-soft outline-none bg-transparent font-bold text-navy-deep text-sm md:text-base">
                                <option>Commercial</option><option>Residential</option><option>Industrial</option>
                            </select>
                            <select name="budget" className="p-3 md:p-4 border-b-2 border-gold-soft outline-none bg-transparent font-bold text-navy-deep text-sm md:text-base">
                                <option>Budget: Less than 50L</option><option>Budget: ₹50L - ₹1Cr</option><option>Budget: ₹1Cr - ₹5Cr</option><option>Budget: ₹5Cr+</option>
                            </select>
                        </div>

                        <button type="submit" disabled={loading} className="py-4 md:py-6 bg-navy-deep text-pure-gold font-black text-base md:text-xl uppercase tracking-widest hover:bg-pure-gold hover:text-navy-deep transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] mt-2 rounded-sm">
                            {loading ? "TRANSMITTING..." : "SUBMIT TO BUILDER"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}