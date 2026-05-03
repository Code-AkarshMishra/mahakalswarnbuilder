"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Hero() {
    const [loading, setLoading] = useState(false);

    const handleEnquiry = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        // Capture all form data
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            // Send data to your email via FormSubmit AJAX
            const response = await fetch("https://formsubmit.co/ajax/mahakalswarnbuilder@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Name: data.name,
                    Phone: data.phone,
                    ProjectType: data.projectType,
                    Budget: data.budget,
                    _subject: " Alert !! New Client Enquiry at Mahakal Swarn Builder Website! Contact Now"
                })
            });

            if (response.ok) {
                alert("Enquiry Sent Successfully! Swarn Kumar Tripathi's office will contact you shortly.");
                e.target.reset(); // Clear the form fields after successful submission
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
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-navy-deep">
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105">
                <source src="/videos/drone-site.mp4" type="video/mp4" />
            </video>

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mt-20">
                <div className="space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="font-serif text-6xl md:text-8xl text-white font-black leading-none drop-shadow-2xl"
                    >
                        Quality In <br /> <span className="gold-gradient-text">Affordable Price</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-pure-gold text-lg md:text-xl tracking-[0.4em] font-black uppercase border-l-8 border-pure-gold pl-6"
                    >
                        North India's #1 Construction Startup
                    </motion.p>

                    {/* PREMIUM AVAILABILITY BADGE */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="inline-block bg-white/10 backdrop-blur-md border border-pure-gold/50 px-6 py-3 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.2)] mt-4"
                    >
                        <p className="text-white text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
                            <span className="text-pure-gold mr-2">✓</span> Available in Delhi, Noida & Lucknow
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="bg-white/95 p-8 md:p-12 shadow-3d border-t-[20px] border-pure-gold"
                >
                    <h3 className="font-serif text-3xl md:text-4xl text-navy-deep mb-8 font-black">Startup Enquiry Portal</h3>
                    <form onSubmit={handleEnquiry} className="grid grid-cols-1 gap-6">
                        {/* Added name="name" */}
                        <input name="name" required placeholder="Investor / Client Name" className="p-4 border-b-2 border-gold-soft outline-none focus:border-pure-gold bg-transparent text-lg font-bold text-navy-deep placeholder-gray-400" />

                        {/* Added name="phone" */}
                        <input name="phone" required type="tel" placeholder="Primary Contact Number" className="p-4 border-b-2 border-gold-soft outline-none focus:border-pure-gold bg-transparent text-lg font-bold text-navy-deep placeholder-gray-400" />

                        <div className="grid grid-cols-2 gap-6">
                            {/* Added name="projectType" */}
                            <select name="projectType" className="p-4 border-b-2 border-gold-soft outline-none bg-transparent font-bold text-navy-deep">
                                <option>Commercial</option>
                                <option>Residential</option>
                                <option>Industrial</option>
                            </select>

                            {/* Added name="budget" */}
                            <select name="budget" className="p-4 border-b-2 border-gold-soft outline-none bg-transparent font-bold text-navy-deep">
                                <option>Budget: Less than 50L</option>
                                <option>Budget: ₹50L - ₹1Cr</option>
                                <option>Budget: ₹1Cr - ₹5Cr</option>
                                <option>Budget: ₹5Cr+</option>
                            </select>
                        </div>

                        {/* Disabled button while loading to prevent double-clicks */}
                        <button type="submit" disabled={loading} className="py-6 bg-navy-deep text-pure-gold font-black text-xl uppercase tracking-widest hover:bg-pure-gold hover:text-black transition-all shadow-gold-glow mt-4">
                            {loading ? "TRANSMITTING..." : "SUBMIT TO BUILDER"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}