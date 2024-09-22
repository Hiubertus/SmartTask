import React from 'react';
import { UserTable } from "@/components/UserTable/UserTable";
import {PeriodicElementsTable} from "@/components/UserTable/PeriodicElementsTable";

export default function Home() {
    return (
        <div className="w-full min-h-screen p-8">
            <header className="container mx-auto px-4 sm:px-8 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    User Managment Table
                </h1>
                <p className="text-lg text-gray-600">
                    Fully cutomize filters, columns and rows. All options have global state that persists after changing
                    pages.
                </p>
            </header>
            <main>
                <UserTable/>
                <PeriodicElementsTable/>
            </main>
        </div>
    );
}