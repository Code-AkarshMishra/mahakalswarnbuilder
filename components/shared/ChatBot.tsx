// components/shared/ChatBot.tsx
"use client";
import { useState } from "react";
import { MessageSquare, Phone, X, MapPin, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="w-80 bg-white rounded-2xl shadow-3d border border-gold-soft overflow-hidden">
                        <div className="bg-navy-deep p-5 text-white flex justify-between items-center">
                            <div><p className="font-serif text-sm">MS AI Assistant</p><p className="text-[8px] text-pure-gold uppercase tracking-[0.2em]">Live Support</p></div>
                            <X size={18} className="cursor-pointer opacity-50" onClick={() => setIsOpen(false)} />
                        </div>
                        <div className="p-4 bg-cream-silk/40 space-y-3">
                            <button className="w-full text-left p-3 text-xs bg-white border border-gold-soft/30 rounded flex items-center gap-3 hover:border-pure-gold transition-all">
                                <MapPin size={14} className="text-pure-gold" /> Schedule Site Visit
                            </button>
                            <a href="https://wa.me/918707790653" className="block text-center py-4 bg-[#25D366] text-white rounded-lg font-bold text-xs uppercase shadow-lg">Chat on WhatsApp</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Call Button */}
            <a href="tel:+918707790653" className="p-4 bg-white text-navy-deep rounded-full shadow-xl border border-gold-prime group hover:bg-navy-deep hover:text-white transition-all">
                <Phone size={24} />
            </a>

            {/* AI Bot Toggle */}
            <button onClick={() => setIsOpen(!isOpen)} className="p-6 bg-navy-deep text-pure-gold rounded-full shadow-3d border border-pure-gold/50 animate-pulse">
                <MessageSquare size={32} />
            </button>
        </div>
    );
}