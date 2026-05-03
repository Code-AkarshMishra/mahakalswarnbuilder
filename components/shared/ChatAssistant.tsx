"use client";
import { useState } from "react";
import { MessageSquare, Phone, X, MapPin, Calculator, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="w-80 bg-white rounded-2xl shadow-3d border-2 border-pure-gold overflow-hidden">
                        <div className="bg-navy-deep p-5 text-white flex justify-between items-center">
                            <div>
                                <p className="font-serif text-sm font-black">MS Royal Assistant</p>
                                <p className="text-[9px] text-pure-gold uppercase tracking-[0.2em] font-bold flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Support
                                </p>
                            </div>
                            <X size={20} className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={() => setIsOpen(false)} />
                        </div>
                        <div className="p-5 bg-heritage-dark space-y-3">
                            <button className="w-full text-left p-3 text-xs font-bold text-navy-deep bg-white border-l-4 border-pure-gold shadow-sm flex items-center gap-3">
                                <MapPin className="text-pure-gold" size={16} /> Schedule Site Visit
                            </button>
                            <button className="w-full text-left p-3 text-xs font-bold text-navy-deep bg-white border-l-4 border-pure-gold shadow-sm flex items-center gap-3">
                                <Calculator className="text-pure-gold" size={16} /> Request Price List
                            </button>
                            <a href="https://wa.me/918707790653" target="_blank" rel="noopener noreferrer" className="block text-center py-4 bg-[#25D366] text-white rounded-lg font-black text-sm uppercase shadow-lg hover:bg-green-600 transition-colors mt-2">
                                Chat on WhatsApp
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI Bot Toggle */}
            <button onClick={() => setIsOpen(!isOpen)} className="p-5 bg-navy-deep text-pure-gold rounded-full shadow-3d border border-pure-gold/50 hover:bg-pure-gold hover:text-navy-deep transition-all duration-300">
                <MessageSquare size={32} />
            </button>
        </div>
    );
}