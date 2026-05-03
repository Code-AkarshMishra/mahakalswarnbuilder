import { Phone, Mail, MapPin, MessageSquareText } from "lucide-react";

export default function Footer() {
    return (
        // FIX: Adjusted paddings for mobile (pt-16 pb-24) to give space for chat icon
        <footer className="bg-[#001F3F] pt-16 md:pt-24 pb-24 md:pb-12 text-white/80 px-6 md:px-8 border-t-[8px] border-[#D4AF37] relative">

            {/* FIX: grid-cols-1 on mobile, grid-cols-2 on tablet, grid-cols-4 on desktop. This prevents squishing. */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 border-b border-white/10 pb-12">

                {/* Branding Section */}
                <div className="col-span-1 sm:col-span-2 space-y-5">
                    <h2 className="font-serif text-3xl md:text-4xl text-[#D4AF37] font-black tracking-wide drop-shadow-md">
                        MAHAKAL SWARN <br className="hidden md:block" /> BUILDER
                    </h2>
                    <p className="max-w-md text-xs md:text-sm leading-relaxed font-medium text-gray-300">
                        Founded by <span className="text-white font-bold">Swarn Kumar Tripathi</span>. We are North India's premier construction startup, delivering 3D-precision luxury residencies and commercial hubs across Lucknow, Delhi, and Noida.
                    </p>
                </div>

                {/* Direct Contact Options */}
                <div className="space-y-5">
                    <h4 className="text-[#D4AF37] font-black uppercase text-xs md:text-sm tracking-[0.2em]">Direct Contact</h4>
                    <div className="flex flex-col gap-4 font-bold">
                        {/* FIX: whitespace-nowrap ensures numbers don't break into multiple lines */}
                        <a href="tel:+918707790653" className="flex items-center gap-3 hover:text-[#D4AF37] transition-colors w-fit">
                            <Phone size={18} className="text-[#D4AF37] flex-shrink-0" />
                            <span className="text-sm md:text-base whitespace-nowrap">+91 87077 90653</span>
                            <span className="text-[9px] md:text-[10px] bg-white/10 px-2 py-1 rounded whitespace-nowrap">(Call Builder)</span>
                        </a>
                        <a href="sms:+919519960824" className="flex items-center gap-3 hover:text-[#D4AF37] transition-colors w-fit">
                            <MessageSquareText size={18} className="text-[#D4AF37] flex-shrink-0" />
                            <span className="text-sm md:text-base whitespace-nowrap">+91 95199 60824</span>
                            <span className="text-[9px] md:text-[10px] bg-white/10 px-2 py-1 rounded whitespace-nowrap">(Text Builder)</span>
                        </a>
                        {/* FIX: break-all allows long email to wrap safely if needed on tiny screens */}
                        <a href="mailto:mahakalswarnbuilder@gmail.com" className="flex items-center gap-3 hover:text-[#D4AF37] transition-colors break-all md:break-normal w-full pr-4">
                            <Mail size={18} className="text-[#D4AF37] flex-shrink-0" />
                            <span className="text-xs md:text-sm">mahakalswarnbuilder@gmail.com</span>
                        </a>
                    </div>
                </div>

                {/* Corporate Address */}
                <div className="space-y-5">
                    <h4 className="text-[#D4AF37] font-black uppercase text-xs md:text-sm tracking-[0.2em]">Corporate H.O.</h4>
                    <div className="flex items-start gap-3 font-bold text-gray-300">
                        <MapPin size={24} className="text-[#D4AF37] flex-shrink-0 mt-1" />
                        <p className="leading-relaxed text-xs md:text-sm">
                            Vibhuti Khand, Gomti Nagar <br />
                            Lucknow, Uttar Pradesh <br />
                            Pin: 226010
                        </p>
                    </div>
                </div>

            </div>

            {/* Copyright Section (FIX: Centered on mobile so it doesn't collide with the chat bot button) */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mt-8 text-center md:text-left gap-4">
                <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.5em] font-black opacity-60">
                    © 2026 MAHAKAL SWARN | LEGACY OF ENGINEERING
                </p>
                <p className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-black text-[#D4AF37] md:opacity-80">
                    STARTUP EXCELLENCE
                </p>
            </div>
        </footer>
    );
}