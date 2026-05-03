"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Percentage counter logic (0 se 100 tak jayega)
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2; // Speed of filling
            });
        }, 40); // 40ms * 50 = 2 seconds loading

        // Loading complete hone ke baad screen slide up hogi
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: "-100%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#001F3F]" // Deep Navy Background
                >
                    <div className="flex flex-col items-center w-full max-w-sm px-8">

                        {/* 1. LOGO WITH GLOW */}
                        <motion.img
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            src="/logo/ms-shivling.png"
                            alt="Mahakal Swarn"
                            className="h-24 mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                        />

                        {/* 2. TEXT: MAHAKAL SWARN BUILDER */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-center mb-10"
                        >
                            <h1 className="font-serif text-3xl md:text-4xl text-[#D4AF37] font-black tracking-widest leading-none drop-shadow-md">
                                MAHAKAL SWARN
                            </h1>
                            <p className="text-white text-xs tracking-[0.6em] font-light uppercase mt-3">
                                Builder & Developer
                            </p>
                        </motion.div>

                        {/* 3. LOADING BAR (FILL HONE WALI) */}
                        <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden relative">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,1)]"
                                style={{ width: `${progress}%` }}
                                layout
                            />
                        </div>

                        {/* 4. KUCH AUR CHEEZ (PERCENTAGE & STATUS) */}
                        <div className="flex justify-between w-full mt-4 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em]">
                            <span>{progress}%</span>
                            <span className="animate-pulse text-white/70">Engineering Legacy...</span>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}