"use client";
import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function RequestRoomPage() {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-8 bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-bold mb-4">ขอใช้ห้องประชุม</h1>
                {/* เนื้อหาสำหรับหน้าขอใช้ห้องประชุม */}
            </main>
        </div>
    );
}
