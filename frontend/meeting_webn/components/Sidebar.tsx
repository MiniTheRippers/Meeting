"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeftCircle,
    Home,
    PlusCircle,
    Calendar,
    List,
    FileText,
    User,
    Settings,
    LogOut,
} from "lucide-react";
import React, { useState } from "react";

export default function Sidebar() {
    const router = useRouter();
    const [settingOpen, setSettingOpen] = useState(false);

    return (
        <aside className="group fixed top-0 left-0 h-screen w-20 hover:w-64 bg-white flex flex-col items-center justify-between py-4 shadow z-40 transition-all duration-300 overflow-hidden">
            <div className="flex flex-col items-start gap-4 ">
                {/* Top: Back button */}
                <button className="relative w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition ml-1.5 mt-2">
                    <ArrowLeftCircle size={32} className="text-blue-500" />
                </button>
                {/* Main menu */}
                <div className="flex flex-col gap-1 w-full mt-2">
                    <Link href="/dashboard">
                        <div className="flex items-center w-14 h-12 rounded-xl bg-blue-500 text-white shadow-md mb-1 group-hover:w-full group-hover:bg-blue-500 transition-all cursor-pointer hover:shadow-lg">
                            <Home size={40} className="pl-4" />
                            <span className="ml-3 text-base font-semibold px-3 py-1 rounded bg-white text-blue-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap hidden group-hover:inline">
                                หน้าหลัก
                            </span>
                        </div>
                    </Link>
                    <span className="pl-4 mt-3 mb-1 text-xs font-bold text-gray-400 tracking-wider opacity-0 group-hover:opacity-100 transition-all hidden group-hover:inline">จัดการข้อมูลหลัก</span>
                    <Link href="/request-room">
                        <div className="flex items-center w-12 h-12 rounded-xl hover:bg-gray-100 transition-all group-hover:w-full cursor-pointer">
                            <PlusCircle size={40} className="pl-4" />
                            <span className="ml-3 text-base font-medium px-3 py-1 rounded bg-white text-blue-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap hidden group-hover:inline">
                                ขอใช้ห้องประชุม
                            </span>
                        </div>
                    </Link>
                    <Link href="/room-schedule">
                        <div className="flex items-center w-12 h-12 rounded-xl hover:bg-gray-100 transition-all group-hover:w-full cursor-pointer">
                            <Calendar size={40} className="pl-4" />
                            <span className="ml-3 text-base font-medium px-3 py-1 rounded bg-white text-blue-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap hidden group-hover:inline">
                                ตารางขอใช้ห้องประชุม
                            </span>
                        </div>
                    </Link>
                    <Link href="/room-summary">
                        <div className="flex items-center w-12 h-12 rounded-xl hover:bg-gray-100 transition-all group-hover:w-full cursor-pointer">
                            <List size={40} className="pl-4" />
                            <span className="ml-3 text-base font-medium px-3 py-1 rounded bg-white text-blue-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap hidden group-hover:inline">
                                สรุปการใช้ห้องประชุม
                            </span>
                        </div>
                    </Link>
                    <Link href="/room-manage">
                        <div className="flex items-center w-12 h-12 rounded-xl hover:bg-gray-100 transition-all group-hover:w-full cursor-pointer">
                            <FileText size={40} className="pl-4" />
                            <span className="ml-3 text-base font-medium px-3 py-1 rounded bg-white text-blue-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap hidden group-hover:inline">
                                จัดการใช้ห้องประชุม
                            </span>
                        </div>
                    </Link>
                    <span className="pl-4 mt-4 mb-1 text-xs font-bold text-gray-400 tracking-wider opacity-0 group-hover:opacity-100 transition-all hidden group-hover:inline">USER</span>
                    {/* คลิกแล้วไปหน้าผู้ใช้งานระบบ */}
                    <button
                        className="flex items-center w-12 h-12 rounded-xl hover:bg-gray-100 transition-all group-hover:w-full cursor-pointer"
                        onClick={() => router.push("/user")}
                    >
                        <User size={40} className="pl-4" />
                        <span className="ml-3 text-base font-medium px-3 py-1 rounded bg-white text-blue-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap hidden group-hover:inline">
                            ผู้ใช้งานระบบ
                        </span>
                    </button>
                    <span className="pl-4 mt-4 mb-1 text-xs font-bold text-gray-400 tracking-wider opacity-0 group-hover:opacity-100 transition-all hidden group-hover:inline">SETTING</span>
                    {/* Dropdown Setting */}
                    <div className="w-full">
                        <button
                            className="flex items-center w-14 h-12 rounded-xl bg-emerald-500 text-white shadow-md mb-1 transition-all group-hover:w-full cursor-pointer hover:shadow-lg"
                            onClick={() => setSettingOpen((prev) => !prev)}
                        >
                            <Settings size={40} className="pl-4" />
                            <span className="ml-3 text-base font-semibold px-3 py-1 rounded bg-white text-emerald-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap hidden group-hover:inline">
                                ตั้งค่าระบบ
                            </span>
                            <svg
                                className={`ml-auto mr-4 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all hidden group-hover:inline ${settingOpen ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {/* เมนูย่อย Dropdown */}
                        {settingOpen && (
                            <div className="ml-16 mt-1 group-hover:block">
                                <button
                                    className="flex items-center h-8 text-sm text-gray-700 bg-gray-50 rounded px-3 mb-1 w-full text-left"
                                    onClick={() => router.push("/setting")}
                                >
                                    ตั้งค่าระบบ
                                </button>
                                <button
                                    className="flex items-center h-8 text-sm text-gray-700 bg-gray-50 rounded px-3 w-full text-left"
                                    onClick={() => alert("ตั้งค่าอื่น ๆ")}
                                >
                                    ตั้งค่าอื่น ๆ
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Bottom: Logout */}
            <button className="flex items-center w-14 h-12 rounded-xl bg-red-500 text-white shadow-md mt-auto mb-2 hover:bg-red-600 transition-all group-hover:w-full cursor-pointer">
                <LogOut size={40} className="pl-4" />
                <span className="ml-3 text-base font-medium px-3 py-1 rounded bg-white text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap hidden group-hover:inline">
                    ออกจากระบบ
                </span>
            </button>
        </aside>
    );
}