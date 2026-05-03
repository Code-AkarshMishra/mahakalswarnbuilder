import { Phone, Mail, MapPin, MessageSquareText } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[#001F3F] pt-24 pb-12 text-white/80 px-8 border-t-[8px] border-[#D4AF37]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 border-b border-white/10 pb-16">

                {/* Branding Section */}
                <div className="col-span-2 space-y-6">
                    <h2 className="font-serif text-4xl text-[#D4AF37] font-black tracking-wide drop-shadow-md">
                        MAHAKAL SWARN <br /> BUILDER
                    </h2>
                    <p className="max-w-md text-sm leading-relaxed font-medium text-gray-300">
                        Founded by <span className="text-white font-bold">Swarn Kumar Tripathi</span>. We are North India's premier construction startup, delivering 3D-precision luxury residencies and commercial hubs across Lucknow, Delhi, and Noida.
                    </p>
                </div>

                {/* Direct Contact Options */}
                <div className="space-y-6">
                    <h4 className="text-[#D4AF37] font-black uppercase text-xs tracking-[0.3em]">Direct Contact</h4>
                    <div className="space-y-4 font-bold text-sm">
                        <a href="tel:+918707790653" className="flex items-center gap-3 hover:text-[#D4AF37] transition-colors">
                            <Phone size={18} className="text-[#D4AF37]" /> +91 87077 90653 <span className="text-[10px] bg-white/10 px-2 py-1 rounded">(Call Builder)</span>
                        </a>
                        <a href="sms:+918707790653" className="flex items-center gap-3 hover:text-[#D4AF37] transition-colors">
                            <MessageSquareText size={18} className="text-[#D4AF37]" /> +91 9519960824 <span className="text-[10px] bg-white/10 px-2 py-1 rounded">(Text Builder)</span>
                        </a>
                        <a href="mailto:contact@mahakalswarn.com" className="flex items-center gap-3 hover:text-[#D4AF37] transition-colors">
                            <Mail size={18} className="text-[#D4AF37]" />mahakalswarnbuilder@gmail.com
                        </a>
                    </div>
                </div>

                {/* Corporate Address */}
                <div className="space-y-6">
                    <h4 className="text-[#D4AF37] font-black uppercase text-xs tracking-[0.3em]">Corporate H.O.</h4>
                    <div className="flex items-start gap-3 font-bold text-sm text-gray-300">
                        <MapPin size={24} className="text-[#D4AF37] flex-shrink-0 mt-1" />
                        <p className="leading-relaxed">
                            Vibhuti Khand, Gomti Nagar <br />
                            Lucknow, Uttar Pradesh <br />
                            Pin: 226010
                        </p>
                    </div>
                </div>

            </div>

            {/* Copyright */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mt-10 text-[10px] uppercase tracking-[0.5em] font-black opacity-60">
                <p>© 2026 MAHAKAL SWARN | LEGACY OF ENGINEERING</p>
                <p className="mt-4 md:mt-0 text-[#D4AF37]">STARTUP EXCELLENCE</p>
            </div>
        </footer>
    );
}