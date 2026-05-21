"use client";

import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

// 1. Updated Rates (+100 INR per category)
const rates = [
    { resource: "Cement", rate: 271.90 },
    { resource: "Steel", rate: 257.50 },
    { resource: "Bricks", rate: 233.00 },
    { resource: "Aggregate", rate: 158.90 },
    { resource: "Sand", rate: 178.00 },
    { resource: "Flooring", rate: 189.00 },
    { resource: "Windows", rate: 137.57 },
    { resource: "Doors", rate: 157.24 },
    { resource: "Electrical", rate: 108.70 },
    { resource: "Painting", rate: 244.00 },
    { resource: "Sanitary", rate: 162.00 },
    { resource: "Kitchen Work", rate: 150.65 },
    { resource: "Contractor (RCC/Civil)", rate: 310.00 }
];

// 2. Timeline Data (Based on UltraTech Report structure)
const timelineData = [
    { phase: "Home Design & Approval", days: 46, color: "bg-yellow-300" },
    { phase: "Excavation", days: 14, color: "bg-green-700" },
    { phase: "Footing & Foundation", days: 41, color: "bg-black" },
    { phase: "RCC Work - Slabs", days: 17, color: "bg-blue-600" },
    { phase: "Roof Slab", days: 37, color: "bg-red-600" },
    { phase: "Brickwork & Plaster", days: 8, color: "bg-pink-300" },
    { phase: "Flooring & Tiling", days: 25, color: "bg-purple-800" },
    { phase: "Electric Wiring", days: 14, color: "bg-yellow-500" },
    { phase: "Plumbing", days: 30, color: "bg-gray-500" },
    { phase: "Doors & Finishing", days: 15, color: "bg-red-800" },
];

export default function CostDashboard() {
    const [area, setArea] = useState<number>(1000);

    // Math Calculations
    const totalCost = rates.reduce((sum, item) => sum + (item.rate * area), 0);
    const totalDays = timelineData.reduce((sum, item) => sum + item.days, 0);

    // Chart Data Configuration
    const chartData = {
        labels: rates.map(r => r.resource),
        datasets: [
            {
                data: rates.map(r => r.rate * area),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#E7E9ED', '#8A2BE2', '#00FF7F', '#DC143C',
                    '#00CED1', '#FFD700', '#2F4F4F'
                ],
                borderWidth: 0,
            },
        ],
    };

    // PDF Generation Logic
    // const generatePDF = () => {
    //     const doc = new jsPDF();
    //     doc.setFontSize(22);
    //     doc.text("MAHAKAL SWARN BUILDERS", 14, 20);
    //     doc.setFontSize(12);
    //     doc.text(`Estimated Construction Report - ${area} Sq. Ft.`, 14, 30);

    //     const tableRows = rates.map(item => [
    //         item.resource,
    //         `Rs. ${item.rate.toFixed(2)}`,
    //         `Rs. ${(item.rate * area).toLocaleString('en-IN')}`
    //     ]);
    //     tableRows.push(["TOTAL", "-", `Rs. ${totalCost.toLocaleString('en-IN')}`]);

    //     // CHANGE THIS SECTION:
    //     autoTable(doc, {
    //         startY: 40,
    //         head: [["Resource Category", "Rate/Sq Ft", "Total Cost (INR)"]],
    //         body: tableRows,
    //         theme: 'grid',
    //         headStyles: { fillColor: [0, 0, 0] }
    //     });

    //     doc.save(`Mahakal_Swarn_Estimate_${area}sqft.pdf`);
    // };
    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        // --- BRAND COLORS ---
        const primaryColor: [number, number, number] = [17, 24, 39]; // Dark Slate / Black
        const accentColor: [number, number, number] = [16, 185, 129]; // Emerald Green
        const timelineColor: [number, number, number] = [37, 99, 235]; // Royal Blue

        // ==========================================
        // 1. BRANDED HEADER (Dark Background)
        // ==========================================
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, pageWidth, 45, 'F'); // Draw a filled rectangle at the top

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(26);
        doc.text("MAHAKAL SWARN BUILDERS", 14, 24);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Official Construction Estimate Report | Total Plot Area: ${area} Sq. Ft.`, 14, 36);

        // ==========================================
        // 2. COST BREAKDOWN TABLE
        // ==========================================
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("1. Financial Cost Analysis", 14, 60);

        // Prepare table data
        const tableRows = rates.map(item => [
            item.resource,
            `Rs. ${item.rate.toFixed(2)}`,
            `Rs. ${(item.rate * area).toLocaleString('en-IN')}`
        ]);

        autoTable(doc, {
            startY: 68,
            head: [["Resource Category", "Rate (Per Sq Ft)", "Estimated Cost (INR)"]],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: accentColor, textColor: 255, fontStyle: 'bold', fontSize: 12 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            styles: { fontSize: 11, cellPadding: 6 },
            // Adds a bold total row at the bottom of the table automatically
            foot: [["GRAND TOTAL ESTIMATE", "-", `Rs. ${totalCost.toLocaleString('en-IN')}`]],
            footStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold', fontSize: 13 }
        });

        // ==========================================
        // 3. PROJECT TIMELINE TABLE
        // ==========================================
        // Get the Y position where the last table ended so they don't overlap
        const finalY = (doc as any).lastAutoTable.finalY;

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("2. Estimated Project Timeline", 14, finalY + 25);

        // Prepare timeline data
        const timelineRows = timelineData.map((item, index) => [
            `Phase 0${index + 1}`,
            item.phase,
            `${item.days} Days`
        ]);

        autoTable(doc, {
            startY: finalY + 32,
            head: [["Phase No.", "Construction Stage", "Estimated Duration"]],
            body: timelineRows,
            theme: 'striped',
            headStyles: { fillColor: timelineColor, textColor: 255, fontStyle: 'bold', fontSize: 12 },
            styles: { fontSize: 11, cellPadding: 6 },
        });

        // ==========================================
        // 4. DYNAMIC FOOTER (On every page)
        // ==========================================
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);

            // Draw dark rectangle at the bottom
            doc.setFillColor(...primaryColor);
            doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');

            // Footer Text
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");

            // UPDATE THESE DETAILS WITH YOUR ACTUAL CONTACT INFO
            doc.text("Contact Us: +918707790653 | mahakalswarnbuilders@gmail.com", 14, pageHeight - 14);
            doc.text("Website: https://mahakalswarnbuilder.vercel.app/", 14, pageHeight - 7);

            // Page numbers on the right side
            doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 10);
        }

        // ==========================================
        // 5. TRIGGER DOWNLOAD
        // ==========================================
        doc.save(`Mahakal_Swarn_Estimate_${area}sqft.pdf`);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-2xl mb-8 flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Cost & Rate Analyzer</h2>
                    <p className="text-gray-300">Interactive estimator for Mahakal Swarn Builders</p>
                </div>
                <div className="mt-6 md:mt-0 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-md">
                    <label className="text-sm text-gray-300 block mb-1">Built-up Area (Sq. Ft.)</label>
                    <input
                        type="number"
                        value={area}
                        onChange={(e) => setArea(Number(e.target.value))}
                        className="bg-transparent text-3xl font-bold text-white w-40 outline-none border-b-2 border-green-400 focus:border-green-300"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Left Column: Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 w-full text-left">Cost Distribution</h3>
                    <div className="w-full h-80 relative">
                        <Doughnut
                            data={chartData}
                            options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }}
                        />
                    </div>
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">Estimated Grand Total</p>
                        <p className="text-4xl font-extrabold text-green-600">₹{totalCost.toLocaleString('en-IN')}</p>
                    </div>
                </div>

                {/* Right Column: Timeline Tracker */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex justify-between items-end mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Project Timeline</h3>
                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Total: {totalDays} Days</span>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {timelineData.map((phase, index) => {
                            // Calculate width percentage based on max days (46 is the max in our dataset)
                            const widthPct = Math.max((phase.days / 46) * 100, 15);

                            return (
                                <div key={index} className="relative">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700">{phase.phase}</span>
                                        <span className="text-gray-500">{phase.days} Days</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full ${phase.color} shadow-sm transition-all duration-1000 ease-out`}
                                            style={{ width: `${widthPct}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
                <button
                    onClick={generatePDF}
                    className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-10 rounded-xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 text-lg"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download Detailed PDF Report
                </button>
            </div>
        </div>
    );
}