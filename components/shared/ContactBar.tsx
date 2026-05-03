"use client";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactBar() {
    return (
        <div className="fixed bottom-6 right-6 md:right-10 flex flex-col gap-4 z-[99]">
            {/* WhatsApp Button */}
            <motion.a
                whileHover={{ scale: 1.1 }}
                href="https://wa.me/918707790653"
                className="p-4 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center"
            >
                <MessageCircle size={24} />
            </motion.a>

            {/* Call Button */}
            <motion.a
                whileHover={{ scale: 1.1 }}
                href="tel:+918707790653"
                className="p-4 bg-premium-gold text-white rounded-full shadow-2xl flex items-center justify-center"
            >
                <Phone size={24} />
            </motion.a>

            {/* Email Button */}
            <motion.a
                whileHover={{ scale: 1.1 }}
                href="mailto:info@mahakalswarn.com"
                className="p-4 bg-premium-black text-white rounded-full shadow-2xl flex items-center justify-center"
            >
                <Mail size={24} />
            </motion.a>
        </div>
    );
}