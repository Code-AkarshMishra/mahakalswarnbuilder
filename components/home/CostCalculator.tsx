"use client";

import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Rates updated with the ₹150 markup per category
const rates = [
    { resource: "Cement", rate: 321.90 },
    { resource: "Steel", rate: 307.50 },
    { resource: "Bricks", rate: 283.00 },
    { resource: "Aggregate", rate: 208.90 },
    { resource: "Sand", rate: 228.00 },
    { resource: "Flooring", rate: 239.00 },
    { resource: "Windows", rate: 187.57 },
    { resource: "Doors", rate: 207.24 },
    { resource: "Electrical fittings", rate: 158.70 },
    { resource: "Painting", rate: 294.00 },
    { resource: "Sanitary Fittings", rate: 212.00 },
    { resource: "Kitchen Work", rate: 200.65 },
    { resource: "Contractor (RCC, Brick, Plaster)", rate: 360.00 }
];

export default function CostCalculator() {
    const [area, setArea] = useState<number>(1000);

    const totalCost = rates.reduce((sum, item) => sum + (item.rate * area), 0);

    const generatePDF = () => {
        const doc = new jsPDF();

        // Branding Header
        doc.setFontSize(22);
        doc.text("MAHAKAL SWARN BUILDERS", 14, 20);
        doc.setFontSize(12);
        doc.text("Official Construction Estimate Report", 14, 30);
        doc.text(`Total Plot Area: ${area} Sq. Ft.`, 14, 40);

        // Table Data mapping
        const tableColumn = ["Resource Category", "Rate (Per Sq Ft)", `Estimated Cost (INR)`];
        const tableRows = rates.map(item => [
            item.resource,
            `Rs. ${item.rate.toFixed(2)}`,
            `Rs. ${(item.rate * area).toFixed(2)}`
        ]);

        // Push the total row
        tableRows.push(["TOTAL", "-", `Rs. ${totalCost.toFixed(2)}`]);

        // Generate Table
        (doc as any).autoTable({
            startY: 50,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] } // Customize with your brand colors
        });

        // Trigger Download
        doc.save(`Mahakal_Swarn_Builders_Estimate_${area}sqft.pdf`);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Cost & Rate Analyzer</h2>

            <div className="mb-8 flex flex-col items-center">
                <label className="text-lg font-medium text-gray-700 mb-2">
                    Enter Built-up Area (Sq. Ft.)
                </label>
                <input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="border-2 border-gray-300 p-3 rounded-md w-64 text-center text-xl focus:outline-none focus:border-green-600"
                />
            </div>

            <div className="bg-gray-50 p-6 rounded-md mb-8">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Estimated Total: ₹{totalCost.toLocaleString('en-IN')}</h3>
                <p className="text-sm text-gray-500">
                    *Rates include premium materials and Mahakal Swarn Builder standard markups.
                </p>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={generatePDF}
                    className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 rounded flex items-center gap-2 transition-all"
                >
                    Download Detailed PDF Report
                </button>
            </div>
        </div>
    );
}