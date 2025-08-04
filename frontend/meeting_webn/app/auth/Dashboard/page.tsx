"use client";
import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function DashboardPage() {
    return (
        <div className="flex">
            {/* Sidebar ด้านซ้าย */}
            <Sidebar />
            {/* เนื้อหาหลัก */}
            <main className="flex-1 p-8 bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                {/* เนื้อหาอื่นๆ */}
            </main>
        </div>
    );
} 