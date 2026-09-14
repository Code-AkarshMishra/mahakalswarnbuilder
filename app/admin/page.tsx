"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Save, RotateCcw, LogOut, ExternalLink, ShieldCheck, CheckCircle2,
    AlertCircle, Sparkles, Building2, Calculator, Layers,
    Clock, KeyRound, Receipt, ListChecks, Phone, Plus, Trash2,
    Lock, Check, Eye, EyeOff
} from "lucide-react";
import { RatesConfig, DEFAULT_RATES_CONFIG } from "@/lib/rates-types";

type AdminTab = 'rates' | 'specs' | 'taxes' | 'company' | 'security';

export default function AdminDashboardPage() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<AdminTab>('rates');
    const [rates, setRates] = useState<RatesConfig>(DEFAULT_RATES_CONFIG);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Live Simulator Area
    const [testArea, setTestArea] = useState<number>(1000);

    // Security Form States
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [securityLoading, setSecurityLoading] = useState(false);
    const [securityMsg, setSecurityMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Fetch current rates on mount
    useEffect(() => {
        fetchRates();
    }, []);

    const fetchRates = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/rates");
            if (res.status === 401) {
                router.push("/admin/login");
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setRates(data);
            }
        } catch (err) {
            console.error("Failed to load rates:", err);
            setStatusMessage({ type: "error", text: "Failed to load live rates from server." });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setStatusMessage(null);

        try {
            const res = await fetch("/api/admin/rates", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rates)
            });

            const data = await res.json();
            if (!res.ok) {
                setStatusMessage({ type: "error", text: data.error || "Failed to update rates." });
                setSaving(false);
                return;
            }

            setRates(data.rates);
            setStatusMessage({ type: "success", text: "All settings and rates updated and published live successfully!" });
            setTimeout(() => setStatusMessage(null), 5000);
        } catch {
            setStatusMessage({ type: "error", text: "Network error occurred while saving." });
        } finally {
            setSaving(false);
        }
    };

    const handleResetDefaults = async () => {
        if (!confirm("Are you sure you want to reset rates and settings back to default values?")) {
            return;
        }

        setSaving(true);
        setStatusMessage(null);

        try {
            const res = await fetch("/api/admin/rates", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "reset" })
            });

            const data = await res.json();
            if (res.ok) {
                setRates(data.rates);
                setStatusMessage({ type: "success", text: "Rates reset to default values successfully!" });
                setTimeout(() => setStatusMessage(null), 5000);
            } else {
                setStatusMessage({ type: "error", text: data.error || "Failed to reset rates." });
            }
        } catch {
            setStatusMessage({ type: "error", text: "Network error while resetting rates." });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
    };

    // Auto-distribute materials to match Moderate rate
    const handleAutoDistributeMaterials = () => {
        const currentSum = rates.materials.reduce((sum, item) => sum + item.rate, 0);
        if (currentSum <= 0) return;

        const ratio = rates.moderateRatePerSqFt / currentSum;
        const newMaterials = rates.materials.map(m => ({
            ...m,
            rate: Math.round(m.rate * ratio * 100) / 100
        }));

        const newSum = newMaterials.reduce((sum, item) => sum + item.rate, 0);
        const diff = Math.round((rates.moderateRatePerSqFt - newSum) * 100) / 100;
        if (diff !== 0 && newMaterials.length > 0) {
            newMaterials[0].rate = Math.round((newMaterials[0].rate + diff) * 100) / 100;
        }

        setRates({ ...rates, materials: newMaterials });
        setStatusMessage({ type: "success", text: `Materials auto-distributed to equal ₹${rates.moderateRatePerSqFt}/sq.ft.` });
        setTimeout(() => setStatusMessage(null), 4000);
    };

    // Material update
    const handleMaterialRateChange = (index: number, newRate: number) => {
        const updated = [...rates.materials];
        updated[index] = { ...updated[index], rate: newRate };
        setRates({ ...rates, materials: updated });
    };

    // Timeline update
    const handleTimelineDaysChange = (index: number, newDays: number) => {
        const updated = [...rates.timeline];
        updated[index] = { ...updated[index], days: Math.max(1, newDays) };
        setRates({ ...rates, timeline: updated });
    };

    // Package feature items
    const handleAddFeature = (tierKey: 'basic' | 'moderate' | 'advance') => {
        const current = rates.packageFeatures?.[tierKey] || [];
        setRates({
            ...rates,
            packageFeatures: {
                ...rates.packageFeatures,
                [tierKey]: [...current, "New Specification Feature"]
            }
        });
    };

    const handleUpdateFeature = (tierKey: 'basic' | 'moderate' | 'advance', index: number, value: string) => {
        const current = [...(rates.packageFeatures?.[tierKey] || [])];
        current[index] = value;
        setRates({
            ...rates,
            packageFeatures: {
                ...rates.packageFeatures,
                [tierKey]: current
            }
        });
    };

    const handleRemoveFeature = (tierKey: 'basic' | 'moderate' | 'advance', index: number) => {
        const current = [...(rates.packageFeatures?.[tierKey] || [])];
        current.splice(index, 1);
        setRates({
            ...rates,
            packageFeatures: {
                ...rates.packageFeatures,
                [tierKey]: current
            }
        });
    };

    // Security form submission
    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSecurityMsg(null);

        if (!currentPassword) {
            setSecurityMsg({ type: "error", text: "Please enter your current password to confirm identity." });
            return;
        }

        if (newPassword.length < 8) {
            setSecurityMsg({ type: "error", text: "New password must be at least 8 characters long." });
            return;
        }

        if (newPassword !== confirmPassword) {
            setSecurityMsg({ type: "error", text: "New passwords do not match." });
            return;
        }

        setSecurityLoading(true);
        try {
            const res = await fetch("/api/admin/credentials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    newUsername: newUsername ? newUsername.trim() : undefined
                })
            });

            const data = await res.json();
            if (res.ok) {
                setSecurityMsg({ type: "success", text: "Password securely updated and salted PBKDF2 hash stored!" });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setTimeout(() => setSecurityMsg(null), 5000);
            } else {
                setSecurityMsg({ type: "error", text: data.error || "Failed to update password." });
            }
        } catch {
            setSecurityMsg({ type: "error", text: "Network error occurred." });
        } finally {
            setSecurityLoading(false);
        }
    };

    const materialSum = (rates.materials || []).reduce((sum, item) => sum + item.rate, 0);

    return (
        <div className="min-h-screen bg-[#071322] text-slate-100 font-sans pb-24">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-[#001F3F]/90 backdrop-blur-md border-b-2 border-[#D4AF37]/30 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <img src="/logo/ms-shivling.png" alt="MS Logo" className="h-10 w-auto" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-serif text-lg md:text-xl font-black text-[#D4AF37] tracking-wider leading-none">
                                    MAHAKAL SWARN BUILDER
                                </h1>
                                <span className="bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                                    Admin Control Panel
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                                Enterprise Pricing & Operations Engine
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href="/"
                            target="_blank"
                            className="text-xs font-semibold px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 border border-slate-700"
                        >
                            <ExternalLink size={14} /> View Live Site
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="text-xs font-semibold px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 transition-all flex items-center gap-1.5"
                        >
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Notification Banner */}
            {statusMessage && (
                <div className="max-w-7xl mx-auto mt-4 px-4">
                    <div className={`p-4 rounded-xl flex items-center gap-3 border shadow-lg ${
                        statusMessage.type === 'success'
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                            : 'bg-red-950/60 border-red-500/50 text-red-200'
                    }`}>
                        {statusMessage.type === 'success' ? <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" /> : <AlertCircle size={20} className="text-red-400 flex-shrink-0" />}
                        <span className="text-sm font-medium">{statusMessage.text}</span>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
                {/* Floating Top Bar with Save & Reset */}
                <div className="bg-gradient-to-r from-[#001F3F] to-[#0a2f58] p-5 rounded-2xl border border-[#D4AF37]/30 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                            <h2 className="text-xl md:text-2xl font-bold text-white">System Controls</h2>
                        </div>
                        <p className="text-xs text-gray-300 mt-0.5">
                            Last Updated: {rates.lastUpdated ? new Date(rates.lastUpdated).toLocaleString('en-IN') : 'Active'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={handleResetDefaults}
                            disabled={saving}
                            className="flex-1 md:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <RotateCcw size={14} /> Reset Defaults
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 md:flex-none px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F1D77A] hover:from-[#c49f2b] hover:to-[#e1c563] text-[#001F3F] rounded-xl text-xs font-extrabold shadow-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                        >
                            <Save size={16} /> {saving ? "Saving Changes..." : "Publish All Changes"}
                        </button>
                    </div>
                </div>

                {/* NAVIGATION TABS */}
                <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-3">
                    <button
                        onClick={() => setActiveTab('rates')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            activeTab === 'rates'
                                ? 'bg-[#D4AF37] text-[#001F3F] shadow-md'
                                : 'bg-[#001F3F]/60 text-slate-300 hover:bg-[#001F3F] hover:text-white border border-slate-700'
                        }`}
                    >
                        <Building2 size={15} /> Rates & 13 Materials
                    </button>

                    <button
                        onClick={() => setActiveTab('specs')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            activeTab === 'specs'
                                ? 'bg-[#D4AF37] text-[#001F3F] shadow-md'
                                : 'bg-[#001F3F]/60 text-slate-300 hover:bg-[#001F3F] hover:text-white border border-slate-700'
                        }`}
                    >
                        <ListChecks size={15} /> Package Specifications
                    </button>

                    <button
                        onClick={() => setActiveTab('taxes')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            activeTab === 'taxes'
                                ? 'bg-[#D4AF37] text-[#001F3F] shadow-md'
                                : 'bg-[#001F3F]/60 text-slate-300 hover:bg-[#001F3F] hover:text-white border border-slate-700'
                        }`}
                    >
                        <Receipt size={15} /> Taxes & Timeline
                    </button>

                    <button
                        onClick={() => setActiveTab('company')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            activeTab === 'company'
                                ? 'bg-[#D4AF37] text-[#001F3F] shadow-md'
                                : 'bg-[#001F3F]/60 text-slate-300 hover:bg-[#001F3F] hover:text-white border border-slate-700'
                        }`}
                    >
                        <Phone size={15} /> Company & Bill Details
                    </button>

                    <button
                        onClick={() => setActiveTab('security')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            activeTab === 'security'
                                ? 'bg-[#D4AF37] text-[#001F3F] shadow-md'
                                : 'bg-[#001F3F]/60 text-slate-300 hover:bg-[#001F3F] hover:text-white border border-slate-700'
                        }`}
                    >
                        <ShieldCheck size={15} /> Security & Password
                    </button>
                </div>

                {/* TAB 1: RATES & 13 MATERIALS */}
                {activeTab === 'rates' && (
                    <div className="space-y-6 animate-fade-in-down">
                        {/* 3 HEADLINE TIER CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* BASIC TIER CARD */}
                            <div className="bg-[#0e2137] rounded-2xl p-6 border-t-4 border-blue-400 border-x border-b border-slate-700/60 shadow-lg relative">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                                            Tier 1
                                        </span>
                                        <h4 className="text-xl font-bold text-white mt-2">Basic Package</h4>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 uppercase font-semibold">1,000 Sq.Ft Base</p>
                                        <p className="text-lg font-extrabold text-blue-400">
                                            ₹{(rates.basicRatePerSqFt * 1000).toLocaleString('en-IN')}/-
                                        </p>
                                        <span className="text-[10px] text-gray-400 font-medium">₹{(rates.basicRatePerSqFt * 0.01).toFixed(2)} Lakhs</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-700/60">
                                    <label className="block text-xs text-gray-300 font-semibold mb-1.5">
                                        Rate Per Sq. Ft. (INR)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            value={rates.basicRatePerSqFt}
                                            onChange={(e) => setRates({ ...rates, basicRatePerSqFt: Number(e.target.value) })}
                                            className="w-full pl-8 pr-4 py-2.5 bg-[#071322] border border-blue-500/40 rounded-xl text-lg font-bold text-white focus:outline-none focus:border-blue-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* MODERATE TIER CARD */}
                            <div className="bg-[#0e2137] rounded-2xl p-6 border-t-4 border-emerald-400 border-x border-b border-slate-700/60 shadow-xl relative ring-2 ring-emerald-500/30">
                                <div className="absolute top-2 right-2 bg-emerald-500 text-[#001F3F] text-[9px] uppercase font-black px-2 py-0.5 rounded-full">
                                    Recommended
                                </div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                            Tier 2 (Core)
                                        </span>
                                        <h4 className="text-xl font-bold text-white mt-2">Moderate Package</h4>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 uppercase font-semibold">1,000 Sq.Ft Base</p>
                                        <p className="text-lg font-extrabold text-emerald-400">
                                            ₹{(rates.moderateRatePerSqFt * 1000).toLocaleString('en-IN')}/-
                                        </p>
                                        <span className="text-[10px] text-gray-400 font-medium">₹{(rates.moderateRatePerSqFt * 0.01).toFixed(2)} Lakhs</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-700/60">
                                    <label className="block text-xs text-gray-300 font-semibold mb-1.5">
                                        Rate Per Sq. Ft. (INR)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            value={rates.moderateRatePerSqFt}
                                            onChange={(e) => setRates({ ...rates, moderateRatePerSqFt: Number(e.target.value) })}
                                            className="w-full pl-8 pr-4 py-2.5 bg-[#071322] border border-emerald-500/40 rounded-xl text-lg font-bold text-white focus:outline-none focus:border-emerald-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ADVANCE TIER CARD */}
                            <div className="bg-[#0e2137] rounded-2xl p-6 border-t-4 border-[#D4AF37] border-x border-b border-slate-700/60 shadow-lg relative">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-full border border-[#D4AF37]/20">
                                            Tier 3 (Luxury)
                                        </span>
                                        <h4 className="text-xl font-bold text-white mt-2">Advance Package</h4>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 uppercase font-semibold">1,000 Sq.Ft Base</p>
                                        <p className="text-lg font-extrabold text-[#D4AF37]">
                                            ₹{(rates.advanceRatePerSqFt * 1000).toLocaleString('en-IN')}/-
                                        </p>
                                        <span className="text-[10px] text-gray-400 font-medium">₹{(rates.advanceRatePerSqFt * 0.01).toFixed(2)} Lakhs</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-700/60">
                                    <label className="block text-xs text-gray-300 font-semibold mb-1.5">
                                        Rate Per Sq. Ft. (INR)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            value={rates.advanceRatePerSqFt}
                                            onChange={(e) => setRates({ ...rates, advanceRatePerSqFt: Number(e.target.value) })}
                                            className="w-full pl-8 pr-4 py-2.5 bg-[#071322] border border-[#D4AF37]/40 rounded-xl text-lg font-bold text-white focus:outline-none focus:border-[#D4AF37]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LIVE SIMULATOR */}
                        <div className="bg-[#0b1c2f] p-6 rounded-2xl border border-slate-700/80 shadow-lg">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Calculator className="text-[#D4AF37]" size={20} />
                                        Interactive Live Calculator Preview
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        Preview client cost estimates for any plot area before publishing
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-300 font-semibold">Test Plot Area:</span>
                                    <div className="flex items-center gap-1.5 bg-[#071322] border border-slate-600 px-3 py-1.5 rounded-lg">
                                        <input
                                            type="number"
                                            min={100}
                                            value={testArea}
                                            onChange={(e) => setTestArea(Math.max(1, Number(e.target.value)))}
                                            className="w-20 bg-transparent text-sm font-bold text-white text-right focus:outline-none"
                                        />
                                        <span className="text-xs text-gray-400">Sq.Ft</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-[#071322] p-4 rounded-xl border border-blue-500/30">
                                    <p className="text-xs text-blue-400 font-bold uppercase">Basic ({testArea} Sq.Ft)</p>
                                    <p className="text-2xl font-black text-white mt-1">
                                        ₹{(rates.basicRatePerSqFt * testArea).toLocaleString('en-IN')}
                                    </p>
                                    <p className="text-[11px] text-gray-400 mt-1">
                                        @ ₹{rates.basicRatePerSqFt}/Sq.Ft
                                    </p>
                                </div>

                                <div className="bg-[#071322] p-4 rounded-xl border border-emerald-500/30">
                                    <p className="text-xs text-emerald-400 font-bold uppercase">Moderate ({testArea} Sq.Ft)</p>
                                    <p className="text-2xl font-black text-white mt-1">
                                        ₹{(rates.moderateRatePerSqFt * testArea).toLocaleString('en-IN')}
                                    </p>
                                    <p className="text-[11px] text-gray-400 mt-1">
                                        @ ₹{rates.moderateRatePerSqFt}/Sq.Ft
                                    </p>
                                </div>

                                <div className="bg-[#071322] p-4 rounded-xl border border-[#D4AF37]/30">
                                    <p className="text-xs text-[#D4AF37] font-bold uppercase">Advance ({testArea} Sq.Ft)</p>
                                    <p className="text-2xl font-black text-white mt-1">
                                        ₹{(rates.advanceRatePerSqFt * testArea).toLocaleString('en-IN')}
                                    </p>
                                    <p className="text-[11px] text-gray-400 mt-1">
                                        @ ₹{rates.advanceRatePerSqFt}/Sq.Ft
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 13 MATERIAL BREAKDOWN */}
                        <div className="bg-[#0b1c2f] p-6 rounded-2xl border border-slate-700/80 shadow-lg">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Layers className="text-[#D4AF37]" size={20} />
                                        13 Material Category Breakdown
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        Detailed unit rates for official itemized billing (Calibrated to Moderate Rate)
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <span className="text-[10px] uppercase text-gray-400 block font-semibold">Total Category Sum</span>
                                        <span className={`text-sm font-bold ${Math.round(materialSum) === rates.moderateRatePerSqFt ? 'text-emerald-400' : 'text-yellow-400'}`}>
                                            ₹{materialSum.toFixed(2)} / ₹{rates.moderateRatePerSqFt}
                                        </span>
                                    </div>

                                    <button
                                        onClick={handleAutoDistributeMaterials}
                                        className="px-3.5 py-2 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <Sparkles size={14} /> Auto-Distribute
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="text-xs uppercase bg-[#071322] text-gray-400 border-b border-slate-700">
                                        <tr>
                                            <th className="py-3 px-4">#</th>
                                            <th className="py-3 px-4">Resource Category</th>
                                            <th className="py-3 px-4">Rate / Sq.Ft (INR)</th>
                                            <th className="py-3 px-4">1,000 Sq.Ft Cost</th>
                                            <th className="py-3 px-4 text-right">Share (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {rates.materials.map((mat, idx) => {
                                            const pct = materialSum > 0 ? ((mat.rate / materialSum) * 100).toFixed(1) : '0';
                                            return (
                                                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                                                    <td className="py-2.5 px-4 text-xs text-gray-500 font-mono">{idx + 1}</td>
                                                    <td className="py-2.5 px-4 font-semibold text-white">{mat.resource}</td>
                                                    <td className="py-2.5 px-4">
                                                        <div className="relative w-36">
                                                            <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-xs text-gray-400">₹</span>
                                                            <input
                                                                type="number"
                                                                step="0.5"
                                                                value={mat.rate}
                                                                onChange={(e) => handleMaterialRateChange(idx, Number(e.target.value))}
                                                                className="w-full pl-6 pr-2 py-1.5 bg-[#071322] border border-slate-700 rounded-lg text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37]"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="py-2.5 px-4 text-gray-300 font-medium">
                                                        ₹{(mat.rate * 1000).toLocaleString('en-IN')}
                                                    </td>
                                                    <td className="py-2.5 px-4 text-right text-xs text-[#D4AF37] font-semibold">
                                                        {pct}%
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: PACKAGE SPECIFICATIONS (NEW ADMIN CONTROL) */}
                {activeTab === 'specs' && (
                    <div className="space-y-6 animate-fade-in-down">
                        <div className="bg-[#0b1c2f] p-6 rounded-2xl border border-slate-700/80 shadow-lg">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                                <ListChecks className="text-[#D4AF37]" size={20} />
                                Package Feature Bullet Points
                            </h3>
                            <p className="text-xs text-gray-400 mb-6">
                                Customize the exact specifications shown to clients in the website comparison cards for each tier.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Basic Specs */}
                                <div className="bg-[#071322] p-5 rounded-xl border border-blue-500/40 space-y-4">
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                                        <h4 className="font-bold text-blue-400 text-sm uppercase">Basic Features</h4>
                                        <button
                                            type="button"
                                            onClick={() => handleAddFeature('basic')}
                                            className="text-xs text-blue-400 hover:text-white bg-blue-500/20 px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer"
                                        >
                                            <Plus size={13} /> Add
                                        </button>
                                    </div>
                                    <div className="space-y-2.5">
                                        {(rates.packageFeatures?.basic || []).map((feat, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={feat}
                                                    onChange={(e) => handleUpdateFeature('basic', i, e.target.value)}
                                                    className="w-full px-3 py-1.5 bg-[#0b1c2f] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-400"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFeature('basic', i)}
                                                    className="text-gray-400 hover:text-red-400 p-1.5"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Moderate Specs */}
                                <div className="bg-[#071322] p-5 rounded-xl border border-emerald-500/40 space-y-4">
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                                        <h4 className="font-bold text-emerald-400 text-sm uppercase">Moderate Features</h4>
                                        <button
                                            type="button"
                                            onClick={() => handleAddFeature('moderate')}
                                            className="text-xs text-emerald-400 hover:text-white bg-emerald-500/20 px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer"
                                        >
                                            <Plus size={13} /> Add
                                        </button>
                                    </div>
                                    <div className="space-y-2.5">
                                        {(rates.packageFeatures?.moderate || []).map((feat, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={feat}
                                                    onChange={(e) => handleUpdateFeature('moderate', i, e.target.value)}
                                                    className="w-full px-3 py-1.5 bg-[#0b1c2f] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-400"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFeature('moderate', i)}
                                                    className="text-gray-400 hover:text-red-400 p-1.5"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Advance Specs */}
                                <div className="bg-[#071322] p-5 rounded-xl border border-[#D4AF37]/40 space-y-4">
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                                        <h4 className="font-bold text-[#D4AF37] text-sm uppercase">Advance Features</h4>
                                        <button
                                            type="button"
                                            onClick={() => handleAddFeature('advance')}
                                            className="text-xs text-[#D4AF37] hover:text-white bg-[#D4AF37]/20 px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer"
                                        >
                                            <Plus size={13} /> Add
                                        </button>
                                    </div>
                                    <div className="space-y-2.5">
                                        {(rates.packageFeatures?.advance || []).map((feat, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={feat}
                                                    onChange={(e) => handleUpdateFeature('advance', i, e.target.value)}
                                                    className="w-full px-3 py-1.5 bg-[#0b1c2f] border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFeature('advance', i)}
                                                    className="text-gray-400 hover:text-red-400 p-1.5"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: TAXES & TIMELINE (NEW ADMIN CONTROL) */}
                {activeTab === 'taxes' && (
                    <div className="space-y-6 animate-fade-in-down">
                        {/* Tax Settings */}
                        <div className="bg-[#0b1c2f] p-6 rounded-2xl border border-slate-700/80 shadow-lg">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                <Receipt className="text-[#D4AF37]" size={20} />
                                Government Taxes & GST Policy
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                                        CGST Rate (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.5"
                                            value={rates.taxSettings?.cgstRate ?? 5}
                                            onChange={(e) => setRates({
                                                ...rates,
                                                taxSettings: { ...rates.taxSettings, cgstRate: Number(e.target.value) }
                                            })}
                                            className="w-full px-4 py-2.5 bg-[#071322] border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37]"
                                        />
                                        <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400">%</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                                        SGST Rate (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.5"
                                            value={rates.taxSettings?.sgstRate ?? 5}
                                            onChange={(e) => setRates({
                                                ...rates,
                                                taxSettings: { ...rates.taxSettings, sgstRate: Number(e.target.value) }
                                            })}
                                            className="w-full px-4 py-2.5 bg-[#071322] border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#D4AF37]"
                                        />
                                        <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400">%</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                                        Tax Calculation Status
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setRates({
                                            ...rates,
                                            taxSettings: { ...rates.taxSettings, enabled: !rates.taxSettings?.enabled }
                                        })}
                                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                            rates.taxSettings?.enabled !== false
                                                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                                                : 'bg-slate-800 border-slate-700 text-slate-400'
                                        }`}
                                    >
                                        <Check size={14} />
                                        {rates.taxSettings?.enabled !== false ? "Taxes Enabled (10% Combined)" : "Taxes Disabled"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Phases */}
                        <div className="bg-[#0b1c2f] p-6 rounded-2xl border border-slate-700/80 shadow-lg">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                <Clock className="text-[#D4AF37]" size={20} />
                                Construction Milestones Duration (Days)
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                {rates.timeline.map((phase, idx) => (
                                    <div key={idx} className="bg-[#071322] p-3.5 rounded-xl border border-slate-800">
                                        <span className="text-[10px] text-gray-400 font-mono">Phase {idx + 1}</span>
                                        <p className="text-xs font-semibold text-white mt-0.5 line-clamp-1" title={phase.phase}>
                                            {phase.phase}
                                        </p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <input
                                                type="number"
                                                min={1}
                                                value={phase.days}
                                                onChange={(e) => handleTimelineDaysChange(idx, Number(e.target.value))}
                                                className="w-20 px-2 py-1 bg-[#0b1c2f] border border-slate-700 rounded-lg text-xs font-bold text-white text-center focus:outline-none focus:border-[#D4AF37]"
                                            />
                                            <span className="text-xs text-gray-400">Days</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 4: COMPANY & BILL DETAILS (NEW ADMIN CONTROL) */}
                {activeTab === 'company' && (
                    <div className="space-y-6 animate-fade-in-down">
                        <div className="bg-[#0b1c2f] p-6 rounded-2xl border border-slate-700/80 shadow-lg">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                                <Phone className="text-[#D4AF37]" size={20} />
                                Company Information & Bill Header Settings
                            </h3>
                            <p className="text-xs text-gray-400 mb-6">
                                These official details are automatically stamped on client estimates and downloadable PDF reports.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                                        Official Contact Number
                                    </label>
                                    <input
                                        type="text"
                                        value={rates.companyInfo?.phone || ""}
                                        onChange={(e) => setRates({
                                            ...rates,
                                            companyInfo: { ...rates.companyInfo, phone: e.target.value }
                                        })}
                                        placeholder="+91 87077 90653"
                                        className="w-full px-4 py-2.5 bg-[#071322] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                                        Official Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={rates.companyInfo?.email || ""}
                                        onChange={(e) => setRates({
                                            ...rates,
                                            companyInfo: { ...rates.companyInfo, email: e.target.value }
                                        })}
                                        placeholder="mahakalswarnbuilder@gmail.com"
                                        className="w-full px-4 py-2.5 bg-[#071322] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                                        Company GSTIN
                                    </label>
                                    <input
                                        type="text"
                                        value={rates.companyInfo?.gstin || ""}
                                        onChange={(e) => setRates({
                                            ...rates,
                                            companyInfo: { ...rates.companyInfo, gstin: e.target.value }
                                        })}
                                        placeholder="09CXUPT7007D1ZY"
                                        className="w-full px-4 py-2.5 bg-[#071322] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                                        Official Website URL
                                    </label>
                                    <input
                                        type="text"
                                        value={rates.companyInfo?.website || ""}
                                        onChange={(e) => setRates({
                                            ...rates,
                                            companyInfo: { ...rates.companyInfo, website: e.target.value }
                                        })}
                                        placeholder="www.mahakalswarnbuilder.in"
                                        className="w-full px-4 py-2.5 bg-[#071322] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                                        Corporate Office Address
                                    </label>
                                    <input
                                        type="text"
                                        value={rates.companyInfo?.address || ""}
                                        onChange={(e) => setRates({
                                            ...rates,
                                            companyInfo: { ...rates.companyInfo, address: e.target.value }
                                        })}
                                        placeholder="Vibhuti Khand, Gomti Nagar, Lucknow, UP"
                                        className="w-full px-4 py-2.5 bg-[#071322] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 5: SECURITY & PASSWORD (NEW PASSWORD HASHING CONTROLS) */}
                {activeTab === 'security' && (
                    <div className="space-y-6 animate-fade-in-down">
                        <div className="bg-[#0b1c2f] p-6 rounded-2xl border border-slate-700/80 shadow-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <KeyRound className="text-[#D4AF37]" size={20} />
                                <h3 className="text-lg font-bold text-white">Owner Security & Password Management</h3>
                            </div>
                            <p className="text-xs text-gray-400 mb-6">
                                Update credentials with military-grade PBKDF2 salted hashing (100,000 rounds) and timing-attack protection.
                            </p>

                            {securityMsg && (
                                <div className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-2.5 border ${
                                    securityMsg.type === 'success'
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                        : 'bg-red-500/20 text-red-300 border-red-500/40'
                                }`}>
                                    {securityMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                    <span>{securityMsg.text}</span>
                                </div>
                            )}

                            <form onSubmit={handlePasswordUpdate} className="max-w-xl space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                                        New Admin Username (Optional - leave empty to keep current)
                                    </label>
                                    <input
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        placeholder="Leave blank or enter new username"
                                        className="w-full px-3.5 py-2.5 bg-[#071322] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                                        Current Password <span className="text-red-400">* (Identity verification)</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPass ? "text" : "password"}
                                            required
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter your current password"
                                            className="w-full px-3.5 py-2.5 bg-[#071322] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white"
                                        >
                                            {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                                        New Password (Minimum 8 characters) <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPass ? "text" : "password"}
                                            required
                                            minLength={8}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter strong new password"
                                            className="w-full px-3.5 py-2.5 bg-[#071322] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPass(!showNewPass)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white"
                                        >
                                            {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                                        Confirm New Password <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        minLength={8}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter new password"
                                        className="w-full px-3.5 py-2.5 bg-[#071322] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={securityLoading}
                                        className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F1D77A] text-[#001F3F] text-xs font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        {securityLoading ? "Securing & Hashing Password..." : "Update & Hash Password"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Deployment Best Practice Card */}
                        <div className="bg-[#0b1c2f] p-6 rounded-2xl border border-slate-700/80 shadow-lg">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                                <Lock className="text-[#D4AF37]" size={16} />
                                Production Deployment Guidelines (Vercel / VPS)
                            </h4>
                            <p className="text-xs text-gray-400 mb-3">
                                When deploying your app to Vercel or any hosting platform, you can configure your secret credentials in your hosting provider's <strong>Environment Variables</strong>:
                            </p>
                            <div className="bg-[#071322] p-3 rounded-lg border border-slate-800 text-xs font-mono text-[#D4AF37] space-y-1">
                                <div>ADMIN_USERNAME=your_username</div>
                                <div>ADMIN_PASSWORD=your_super_secret_password</div>
                                <div>ADMIN_SESSION_SECRET=your_32_character_random_hex_key</div>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-2">
                                Passwords are automatically hashed and never stored in plaintext. Credentials cannot be leaked via GitHub repository commits.
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
