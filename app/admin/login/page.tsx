"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, User, ArrowLeft, ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/admin";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Authentication failed. Please check credentials.");
                setLoading(false);
                return;
            }

            // Redirect to admin panel
            router.push(redirectUrl);
            router.refresh();
        } catch {
            setError("Network error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#001428] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
            {/* Background Decorative Rings */}
            <div className="absolute top-0 -left-40 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Back link */}
            <div className="w-full max-w-md mb-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#D4AF37] transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Mahakal Swarn Builder
                </Link>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-[#001F3F]/90 backdrop-blur-md border-2 border-[#D4AF37]/40 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] p-8 relative">
                <div className="text-center mb-8">
                    <div className="inline-block p-3 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-4 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                        <img
                            src="/logo/ms-shivling.png"
                            alt="Mahakal Swarn Builder"
                            className="h-12 w-auto mx-auto"
                        />
                    </div>
                    <h1 className="font-serif text-2xl font-bold text-[#D4AF37] tracking-wide">
                        MAHAKAL SWARN BUILDER
                    </h1>
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-400 font-semibold mt-1">
                        Owner & Admin Portal
                    </p>
                    <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-emerald-400/90 font-medium">
                        <ShieldCheck size={14} /> Authorized & Encrypted Session
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-3.5 bg-red-500/15 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
                        <span className="font-bold">Error:</span> {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                            Admin Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter admin username"
                                className="w-full pl-10 pr-4 py-3 bg-[#0a2342] border border-slate-700/80 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                className="w-full pl-10 pr-11 py-3 bg-[#0a2342] border border-slate-700/80 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#F1D77A] hover:from-[#c49f2b] hover:to-[#e1c563] text-[#001F3F] font-bold rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Verifying Access...
                            </>
                        ) : (
                            <>
                                <Lock size={18} />
                                Unlock Admin Dashboard
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
                        <ShieldCheck size={13} className="text-[#D4AF37]" />
                        <span>Protected by Multi-Layer Salted Hashing & Next.js Proxy</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#001428] flex items-center justify-center text-[#D4AF37]">Loading Portal...</div>}>
            <LoginForm />
        </Suspense>
    );
}
