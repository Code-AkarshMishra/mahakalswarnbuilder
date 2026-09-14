"use client";

import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DEFAULT_RATES_CONFIG, RatesConfig, getTierMaterialRates } from '@/lib/rates-types';
import { myLogoBase64 } from '@/lib/logo';

ChartJS.register(ArcElement, Tooltip, Legend);

// Custom Animated Number Component
const AnimatedNumber = ({ value }: { value: number }) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        let start = current;
        let end = value;
        if (start === end) return;

        let startTime: number | null = null;
        const duration = 1000; // Animation duration in ms

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 5);

            setCurrent(Math.floor(start + (end - start) * ease));

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCurrent(end);
            }
        };
        requestAnimationFrame(animate);
    }, [value]);

    return <>{current.toLocaleString('en-IN')}</>;
};

export default function CostDashboard() {
    const [area, setArea] = useState<number>(1000);
    const [tier, setTier] = useState<'Basic' | 'Moderate' | 'Advance'>('Moderate');
    const [showCompare, setShowCompare] = useState<boolean>(false);
    const [mounted, setMounted] = useState(false);

    // Live Config State (defaults to reference, synchronized with server)
    const [ratesConfig, setRatesConfig] = useState<RatesConfig>(DEFAULT_RATES_CONFIG);

    // Custom Bill Toggle & States
    const [isCustomBill, setIsCustomBill] = useState<boolean>(false);
    const [clientName, setClientName] = useState<string>("");
    const [clientPhone, setClientPhone] = useState<string>("");
    const [clientAddress, setClientAddress] = useState<string>("");
    const [gstNo, setGstNo] = useState<string>("");
    const [billNo, setBillNo] = useState<string>("");

    useEffect(() => {
        setMounted(true);
        fetch("/api/rates")
            .then(res => res.json())
            .then(data => {
                if (data && data.basicRatePerSqFt) {
                    setRatesConfig(data);
                }
            })
            .catch(err => console.error("Error fetching live rates:", err));
    }, []);

    // Dynamic Rates scaled to exact tier package rate
    const activeRates = getTierMaterialRates(tier, ratesConfig);

    // Headline Per Sq Ft Rates
    const basicRatePerSqFt = ratesConfig.basicRatePerSqFt;
    const moderateRatePerSqFt = ratesConfig.moderateRatePerSqFt;
    const advanceRatePerSqFt = ratesConfig.advanceRatePerSqFt;

    const currentRatePerSqFt =
        tier === 'Basic'
            ? basicRatePerSqFt
            : tier === 'Advance'
            ? advanceRatePerSqFt
            : moderateRatePerSqFt;

    // Subtotal = Area * Rate Per Sq.Ft.
    const subTotal = currentRatePerSqFt * area;
    const cgstRate = ratesConfig.taxSettings?.cgstRate ?? 5;
    const sgstRate = ratesConfig.taxSettings?.sgstRate ?? 5;
    const taxEnabled = ratesConfig.taxSettings?.enabled ?? true;

    const cgstAmount = taxEnabled ? subTotal * (cgstRate / 100) : 0;
    const sgstAmount = taxEnabled ? subTotal * (sgstRate / 100) : 0;
    const totalCostWithTax = subTotal + cgstAmount + sgstAmount;

    // Dynamic Timeline Logic
    const getDynamicTimeline = () => {
        let tierTimeMultiplier = 1.0;
        if (tier === 'Basic') tierTimeMultiplier = 0.85;
        if (tier === 'Advance') tierTimeMultiplier = 1.35;
        const areaFactor = Math.sqrt(area / 1000);
        return (ratesConfig.timeline || DEFAULT_RATES_CONFIG.timeline).map(t => ({
            ...t,
            days: Math.max(1, Math.round(t.days * areaFactor * tierTimeMultiplier))
        }));
    };

    const activeTimeline = getDynamicTimeline();
    const totalDays = activeTimeline.reduce((sum, item) => sum + item.days, 0);

    // Chart Setup
    const chartData = {
        labels: activeRates.map(r => r.resource),
        datasets: [{
            data: activeRates.map(r => Math.round(r.rate * area)),
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                '#FF9F40', '#E7E9ED', '#8A2BE2', '#00FF7F', '#DC143C',
                '#00CED1', '#FFD700', '#2F4F4F'
            ],
            borderWidth: 0,
        }],
    };

    // Features list for cards
    const features = ratesConfig.packageFeatures || DEFAULT_RATES_CONFIG.packageFeatures;
    const company = ratesConfig.companyInfo || DEFAULT_RATES_CONFIG.companyInfo;

    // Professional PDF Generator
    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const headerBg: [number, number, number] = [26, 32, 44];
        const goldAccent: [number, number, number] = [212, 175, 55];

        // 1. BRANDING HEADER
        doc.setFillColor(...headerBg);
        doc.rect(0, 0, pageWidth, 48, 'F');

        doc.setFillColor(...goldAccent);
        doc.rect(0, 48, pageWidth, 2.5, 'F');

        try {
            doc.addImage(myLogoBase64, "PNG", 14, 12, 40, 22);
        } catch (e) {
            console.error("Logo render error:", e);
        }

        doc.setTextColor(212, 175, 55);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("MAHAKAL SWARN BUILDERS", 58, 22);

        doc.setTextColor(200, 200, 200);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`Official Construction Cost & Scope Estimate (${tier} Tier)`, 58, 28);

        doc.setTextColor(240, 240, 240);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.text(company.website || "www.mahakalswarnbuilder.in", pageWidth - 14, 16, { align: "right" });
        doc.text("Instagram: @ms_builder_", pageWidth - 14, 22, { align: "right" });
        doc.text(`GSTIN: ${company.gstin || "09CXUPT7007D1ZY"}`, pageWidth - 14, 28, { align: "right" });
        doc.text(`Contact: ${company.phone || "+91-8707790653"}`, pageWidth - 14, 34, { align: "right" });
        doc.text(company.address || "Vibhuti Khand, Gomti Nagar, Lucknow, UP", pageWidth - 14, 40, { align: "right" });

        // 2. CLIENT & INVOICE DETAILS
        doc.setFillColor(250, 250, 250);
        doc.rect(14, 55, pageWidth - 28, 38, 'F');
        doc.setDrawColor(220, 220, 220);
        doc.rect(14, 55, pageWidth - 28, 38, 'S');

        doc.setTextColor(40, 50, 60);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("INVOICE & ESTIMATE DETAILS:", 18, 62);

        const dispBillNo = isCustomBill && billNo ? billNo : "MSB/EST/" + Date.now().toString().slice(-6);
        const dispDate = new Date().toLocaleDateString('en-IN');
        const dispGst = isCustomBill && gstNo ? gstNo : "N/A";
        const dispName = isCustomBill && clientName ? clientName : "Prospective Client";
        const dispPhone = isCustomBill && clientPhone ? clientPhone : "+91-XXXXXXXXXX";
        const dispAddr = isCustomBill && clientAddress ? clientAddress : "Site Location";

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`Bill/Estimate No : ${dispBillNo}`, 18, 69);
        doc.text(`Date : ${dispDate}`, (pageWidth / 2) + 10, 69);

        doc.text(`Billed To (Name) : ${dispName}`, 18, 76);
        doc.text(`Client GST No : ${dispGst}`, (pageWidth / 2) + 10, 76);

        doc.text(`Contact Number   : ${dispPhone}`, 18, 83);
        doc.text(`Project Area : ${area} Sq.Ft. (@ Rs. ${currentRatePerSqFt}/Sq.Ft)`, (pageWidth / 2) + 10, 83);

        doc.text(`Site Address     : ${dispAddr}`, 18, 90);

        // 3. MATERIAL COST & TAX BREAKDOWN
        doc.setTextColor(...headerBg);
        doc.setFontSize(12).setFont("helvetica", "bold");
        doc.text(`Material Scope & Structural Cost Breakdown (${tier} Package)`, 14, 105);

        const tableRows = activeRates.map(item => [
            item.resource,
            `Rs. ${item.rate.toFixed(2)}`,
            `Rs. ${(item.rate * area).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
        ]);

        tableRows.push(["", `BASE ESTIMATE (@ Rs. ${currentRatePerSqFt}/Sq.Ft)`, `Rs. ${subTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`]);
        if (taxEnabled) {
            tableRows.push(["", `CGST (${cgstRate}%)`, `Rs. ${cgstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`]);
            tableRows.push(["", `SGST (${sgstRate}%)`, `Rs. ${sgstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`]);
        }

        autoTable(doc, {
            startY: 110,
            head: [["Construction Description", "Rate / Sq.Ft.", "Subtotal Amount"]],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: headerBg, textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 9, cellPadding: 4 },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 40, halign: 'right' },
                2: { cellWidth: 50, halign: 'right' }
            },
            foot: [["TOTAL PAYABLE ESTIMATE (INCL. TAXES)", "-", `Rs. ${Math.round(totalCostWithTax).toLocaleString('en-IN')}`]],
            footStyles: { fillColor: goldAccent, textColor: 0, fontStyle: 'bold', fontSize: 10, halign: 'right' },
            margin: { bottom: 65 }
        });

        // 4. TIMELINE PAGE
        doc.addPage();

        doc.setTextColor(...headerBg);
        doc.setFontSize(12).setFont("helvetica", "bold");
        doc.text(`Estimated Project Development Timeline (${totalDays} Days)`, 14, 25);

        const timelineRows = activeTimeline.map((item, index) => [`Phase 0${index + 1}`, item.phase, `${item.days} Days`]);

        autoTable(doc, {
            startY: 32,
            head: [["Milestone Code", "Construction Phase / Deployment Stage", "Target Duration"]],
            body: timelineRows,
            theme: 'striped',
            headStyles: { fillColor: [74, 85, 104], textColor: 255 },
            styles: { fontSize: 9, cellPadding: 4 },
            margin: { bottom: 65 }
        });

        // Terms & Conditions Block
        let termsY = (doc as any).lastAutoTable.finalY + 15;
        if (termsY > pageHeight - 85) {
            doc.addPage();
            termsY = 25;
        }

        doc.setFontSize(10).setFont("helvetica", "bold");
        doc.setTextColor(40, 50, 60);
        doc.text("TERMS & CONDITIONS REGARDING ESTIMATE:", 14, termsY);

        doc.setFontSize(8.5).setFont("helvetica", "normal");
        doc.setTextColor(100, 110, 120);
        doc.text("1. This is an official computer-generated dynamic estimation report based on current raw material market rates.", 14, termsY + 6);
        doc.text("2. The timeline mentioned above is subject to change depending upon unpredictable weather or site conditions.", 14, termsY + 11);
        doc.text("3. This quotation/estimate is strictly invalid without an official company stamp and an authorized signature.", 14, termsY + 16);
        doc.text("4. All legal disputes are subject to the exclusive jurisdiction of courts located in Lucknow only.", 14, termsY + 21);
        doc.text("Any work or services not specifically mentioned in the estimate or contract shall be considered additional work.", 14, termsY + 26);

        // 5. STAMP & SIGNATURE ON EVERY PAGE
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);

            const sigY = pageHeight - 55;
            const sigX = pageWidth - 76;

            doc.setDrawColor(200, 200, 200);
            doc.line(sigX, sigY + 28, pageWidth - 14, sigY + 28);

            doc.setFontSize(9).setFont("helvetica", "bold");
            doc.setTextColor(...headerBg);
            doc.text("For MAHAKAL SWARN BUILDERS", sigX, sigY);

            doc.setFontSize(9).setFont("helvetica", "bold");
            doc.setTextColor(40, 50, 60);
            doc.text("Swarn Kumar Tripathi", sigX, sigY + 34);
            doc.setFontSize(8).setFont("helvetica", "normal");
            doc.setTextColor(100, 110, 120);
            doc.text("Founder & Managing Director", sigX, sigY + 38);

            doc.setDrawColor(220, 220, 220);
            doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);
            doc.setTextColor(150, 160, 170);
            doc.setFontSize(8).setFont("helvetica", "normal");
            doc.text(`Corporate Addr: ${company.address || "Mahakal Swarn Builder, Vibhuti Khand, Gomti Nagar, Lucknow, UP"}`, 14, pageHeight - 6);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 6, { align: "right" });
        }

        doc.save(`Mahakal_Swarn_${tier}_Estimate_${area}sqft.pdf`);
    };

    if (!mounted) return null;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">

            {/* DARK HEADER */}
            <div className="bg-[#1a202c] rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8 flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700/60 pb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl md:text-3xl font-bold">Cost & Rate Analyzer</h2>
                            <span className="bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                                Real-time Pricing
                            </span>
                        </div>
                        <p className="text-slate-400 text-xs md:text-sm mt-1">
                            Interactive professional billing engine & transparency calculator
                        </p>
                    </div>

                    <div className="bg-[#262f3d] p-4 rounded-xl border border-slate-600/50 w-full md:w-64 flex flex-col justify-center">
                        <label className="text-xs text-slate-400 block mb-1">Built-up Area (Sq. Ft.)</label>
                        <div className="flex items-baseline gap-1 border-b border-[#D4AF37]/50 pb-1">
                            <input
                                type="number"
                                min={100}
                                value={area}
                                onChange={(e) => setArea(Math.max(1, Number(e.target.value)))}
                                className="bg-transparent text-3xl font-bold text-white w-full outline-none"
                            />
                            <span className="text-sm text-slate-400 font-semibold">Sq.Ft.</span>
                        </div>
                    </div>
                </div>

                {/* Custom Bill Toggle */}
                <div className="flex items-center gap-3">
                    <label className="flex items-center cursor-pointer gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                        <input
                            type="checkbox"
                            checked={isCustomBill}
                            onChange={(e) => setIsCustomBill(e.target.checked)}
                            className="w-4 h-4 rounded accent-[#D4AF37] cursor-pointer"
                        />
                        Generate Custom Client Bill / Invoice (Add Client Details)
                    </label>
                </div>

                {/* Conditional Client Fields */}
                {isCustomBill && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#262f3d]/50 p-4 rounded-lg border border-slate-600/30 animate-fade-in-down">
                        <div>
                            <label className="text-xs text-slate-400 block mb-1.5">Client Full Name</label>
                            <input type="text" placeholder="e.g. Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full bg-[#262f3d] border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-[#D4AF37]" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1.5">Contact No.</label>
                            <input type="text" placeholder="+91 9682043203" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="w-full bg-[#262f3d] border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-[#D4AF37]" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1.5">Site Address</label>
                            <input type="text" placeholder="Gomti Nagar, Lucknow" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} className="w-full bg-[#262f3d] border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-[#D4AF37]" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1.5">GST Number (Optional)</label>
                            <input type="text" placeholder="e.g. 09AABCU9603R1Z..." value={gstNo} onChange={(e) => setGstNo(e.target.value)} className="w-full bg-[#262f3d] border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-[#D4AF37]" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1.5">Bill/Invoice Number</label>
                            <input type="text" placeholder="e.g. MSB/2026/001" value={billNo} onChange={(e) => setBillNo(e.target.value)} className="w-full bg-[#262f3d] border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-[#D4AF37]" />
                        </div>
                    </div>
                )}

                {/* Tier Controls */}
                <div className="pt-2">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs text-slate-400 block">Select Construction Quality Tier</label>
                        <span className="text-xs text-[#D4AF37] font-semibold">
                            Active Rate: ₹{currentRatePerSqFt}/Sq.Ft.
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {/* BASIC BUTTON */}
                        <label className={`cursor-pointer flex items-center gap-2.5 px-5 py-3 rounded-lg border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${tier === 'Basic' ? 'border-blue-400 bg-blue-500/15 text-blue-300 shadow-blue-500/20 font-bold' : 'border-slate-600 text-slate-400 hover:border-slate-400'}`}>
                            <input type="radio" name="tier" value="Basic" checked={tier === 'Basic'} onChange={() => setTier('Basic')} className="hidden" />
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            <div className="text-left">
                                <span className="text-sm block leading-tight">Basic</span>
                                <span className="text-[11px] opacity-80">₹{basicRatePerSqFt}/Sq.Ft</span>
                            </div>
                        </label>

                        {/* MODERATE BUTTON */}
                        <label className={`cursor-pointer flex items-center gap-2.5 px-5 py-3 rounded-lg border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${tier === 'Moderate' ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-emerald-500/20 font-bold' : 'border-slate-600 text-slate-400 hover:border-slate-400'}`}>
                            <input type="radio" name="tier" value="Moderate" checked={tier === 'Moderate'} onChange={() => setTier('Moderate')} className="hidden" />
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                            <div className="text-left">
                                <span className="text-sm block leading-tight">Moderate</span>
                                <span className="text-[11px] opacity-80">₹{moderateRatePerSqFt}/Sq.Ft</span>
                            </div>
                        </label>

                        {/* ADVANCE BUTTON */}
                        <label className={`cursor-pointer flex items-center gap-2.5 px-5 py-3 rounded-lg border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${tier === 'Advance' ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)] font-bold' : 'border-slate-600 text-slate-400 hover:border-slate-400'}`}>
                            <input type="radio" name="tier" value="Advance" checked={tier === 'Advance'} onChange={() => setTier('Advance')} className="hidden" />
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                            <div className="text-left">
                                <span className="text-sm block leading-tight">Advance</span>
                                <span className="text-[11px] opacity-80">₹{advanceRatePerSqFt}/Sq.Ft</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Charts & Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                {/* Animated Chart View */}
                <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center border border-slate-100">
                    <div className="flex justify-between items-center w-full mb-4">
                        <h3 className="text-xl font-bold text-slate-800">Cost Distribution ({tier})</h3>
                        <span className="text-xs font-bold text-[#D4AF37] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            ₹{currentRatePerSqFt}/Sq.Ft
                        </span>
                    </div>

                    <div className="w-full h-[320px] relative">
                        <Doughnut data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} />
                    </div>

                    <div className="mt-8 text-center w-full pt-4 border-t border-slate-100">
                        <div className="flex justify-around items-center mb-2">
                            <div>
                                <p className="text-[11px] text-gray-400 font-semibold uppercase">Base Construction Cost</p>
                                <p className="text-xl font-bold text-slate-800">₹<AnimatedNumber value={Math.round(subTotal)} /></p>
                            </div>
                            <div className="h-8 w-px bg-slate-200" />
                            <div>
                                <p className="text-[11px] text-gray-400 font-semibold uppercase">Govt Taxes (GST {cgstRate + sgstRate}%)</p>
                                <p className="text-xl font-bold text-slate-600">₹<AnimatedNumber value={Math.round(cgstAmount + sgstAmount)} /></p>
                            </div>
                        </div>

                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1 mt-3">Estimated Grand Total (Incl. Taxes)</p>
                        <p className="text-4xl font-extrabold text-emerald-600">
                            ₹<AnimatedNumber value={Math.round(totalCostWithTax)} />
                        </p>
                    </div>
                </div>

                {/* Dynamic Timeline Tracker */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Dynamic Timeline</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Execution milestones calibrated for {area} Sq.Ft.</p>
                        </div>
                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                            Total: <AnimatedNumber value={totalDays} /> Days
                        </span>
                    </div>

                    <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                        {activeTimeline.map((phase, index) => {
                            const maxDays = Math.max(...activeTimeline.map(t => t.days));
                            const widthPct = Math.max((phase.days / maxDays) * 100, 10);
                            return (
                                <div key={index} className="relative">
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="font-medium text-slate-700">{phase.phase}</span>
                                        <span className="text-slate-500 font-medium">{phase.days} Days</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-3">
                                        <div className={`h-3 rounded-full ${phase.color} shadow-sm transition-all duration-500`} style={{ width: `${widthPct}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ACTION SECTION: Download & Compare Stack */}
            <div className="flex flex-col items-center justify-center mb-8 gap-3">
                <button onClick={generatePDF} className="bg-slate-900 hover:bg-black text-white font-bold py-4 px-10 rounded-xl shadow-xl transition-all hover:scale-105 flex items-center gap-2 text-lg cursor-pointer">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download Official {tier} Estimate Report
                </button>

                <button
                    onClick={() => setShowCompare(!showCompare)}
                    className="w-auto px-6 py-2.5 rounded-full border-2 border-slate-200 text-slate-600 font-semibold hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 transition-all flex items-center gap-2 mt-2 cursor-pointer"
                >
                    {showCompare ? "Hide Material Specifications" : "Compare Package Rates & Specifications"}
                    <svg className={`w-4 h-4 transition-transform duration-300 ${showCompare ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
            </div>

            {/* COMPARISON CARDS */}
            {showCompare && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-down border-t border-gray-200 pt-8 mt-2 pb-8">

                    {/* Basic Card */}
                    <div className="bg-white p-6 rounded-xl border-t-4 border-blue-400 shadow-md transition-all hover:shadow-lg mt-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-lg text-slate-800">Basic</h4>
                            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                                ₹{basicRatePerSqFt}/Sq.Ft.
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mb-4">
                            1,000 Sq.Ft Cost: <strong className="text-slate-800">₹{(basicRatePerSqFt * 1000).toLocaleString('en-IN')}/-</strong>
                        </p>
                        <ul className="text-sm text-slate-600 space-y-3">
                            {(features.basic || []).map((feat, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Moderate Card (Recommended) */}
                    <div className="bg-white p-6 rounded-xl border-t-4 border-emerald-500 shadow-xl shadow-emerald-100 scale-100 md:scale-105 z-10 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-emerald-500 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            Recommended
                        </div>

                        <div className="flex justify-between items-center mb-2 mt-2">
                            <h4 className="font-bold text-lg text-slate-800">Moderate</h4>
                            <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                                ₹{moderateRatePerSqFt}/Sq.Ft.
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mb-4">
                            1,000 Sq.Ft Cost: <strong className="text-slate-800">₹{(moderateRatePerSqFt * 1000).toLocaleString('en-IN')}/-</strong>
                        </p>
                        <ul className="text-sm text-slate-600 space-y-3">
                            {(features.moderate || []).map((feat, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Advance Card */}
                    <div className="bg-white p-6 rounded-xl border-t-4 border-[#D4AF37] shadow-md transition-all hover:shadow-lg mt-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-lg text-slate-800">Advance</h4>
                            <span className="text-sm font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded">
                                ₹{advanceRatePerSqFt}/Sq.Ft.
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mb-4">
                            1,000 Sq.Ft Cost: <strong className="text-slate-800">₹{(advanceRatePerSqFt * 1000).toLocaleString('en-IN')}/-</strong>
                        </p>
                        <ul className="text-sm text-slate-600 space-y-3">
                            {(features.advance || []).map((feat, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

        </div>
    );
}