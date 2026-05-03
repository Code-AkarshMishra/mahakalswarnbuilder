import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function Contact() {
    return (
        <section id="contact" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="font-serif text-4xl text-premium-black mb-8">Contact Our Office</h2>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-premium-goldLight rounded-full text-premium-gold">
                                <Phone size={24} />
                            </div>
                            <p className="text-lg font-medium">+91 87077 90653 | +91 95199 60824</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-premium-goldLight rounded-full text-premium-gold">
                                <MapPin size={24} />
                            </div>
                            <p className="text-lg">Gomti Nagar, Viraj Khand - 5, 6/58, Lucknow</p>
                        </div>
                        <div className="flex gap-4 pt-6">
                            <a href="https://wa.me/918707790653" className="btn-premium flex items-center gap-2">
                                <MessageCircle size={20} /> WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 shadow-2xl border-t-4 border-premium-gold">
                    <form className="space-y-4">
                        <input type="text" placeholder="Your Name" className="w-full p-3 border-b outline-none focus:border-premium-gold" />
                        <input type="email" placeholder="Email Address" className="w-full p-3 border-b outline-none focus:border-premium-gold" />
                        <textarea placeholder="Message" rows={4} className="w-full p-3 border-b outline-none focus:border-premium-gold"></textarea>
                        <button className="w-full btn-premium">Send Inquiry</button>
                    </form>
                </div>
            </div>
        </section>
    );
}