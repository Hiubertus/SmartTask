import {CheckCircle} from "lucide-react";
import React from "react";

export default function Features() {
    const features = [
        {
            title: "Reusable Components",
            items: [
                "Table component and columns - two different tables created with one component",
                "Data slice - used to create two different slices"
            ]
        },
        {
            title: "Data Management",
            items: [
                "Manage selected rows with \"Selection\" button (pin or delete)",
                "Manage shown columns with \"View\" button",
                "Manage chosen filter input with \"Filter Columns\" button",
                "Reset table and all personalization with \"Reset Table\" button",
                "Edit Records by clicking on them"
            ]
        },
        {
            title: "Advanced Filtering",
            items: [
                "Choose filtering by column by clicking on header names (e.g., \"Id\")",
                "Debounce on all filters (with spinner to indicate loading)"
            ]
        },
        {
            title: "User Experience",
            items: [
                "Pagination",
                "Table skeleton"
            ]
        },
        {
            title: "Global State Management",
            items: [
                "All selected rows",
                "Filters",
                "Chosen filter input",
                "Pinned rows",
                "Deleted rows",
                "Edited records",
                "Shown columns",
                "Chosen rows per page",
                "Current pagination page"
            ]
        }
    ];
    return (
        <div className="w-full min-h-screen p-8">
            <main className="container mx-auto px-4 sm:px-8 lg:px-8 py-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">{feature.title}</h3>
                            <ul className="space-y-2">
                                {feature.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0"/>
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </main>
        </div>)
}