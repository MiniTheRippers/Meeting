"use client"
import React, { useState, useRef, useEffect } from 'react';
import ProfileEditModal from "./ProfileEditModal";
import axios from 'axios';

const user = {
    name: 'ผู้ดูแลระบบ',
    position: 'IT Management',
    role: 'SuperAdmin',
    avatar: '/avatar.png', // เปลี่ยนเป็น path รูปจริง
};

export default function Topbar() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [user, setUser] = useState({
        name: "ผู้ดูแลระบบ",
        position: "IT Management",
        avatar: "/avatar.png",
        role: "SuperAdmin" // เพิ่มบรรทัดนี้
    });

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const savedUser = localStorage.getItem("userProfile");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleSaveProfile = (newUser: any) => {
        setUser(newUser);
        localStorage.setItem("userProfile", JSON.stringify(newUser));
    };

    return (
        <header className="w-full ml-21 bg-white shadow flex items-center justify-between px-6 py-2 fixed top-0 left-1 z-40" style={{ height: '56px' }}>
            {/* Logo/Title */}
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                Meeting Room | 
            </div>
            {/* User Avatar */}
            <div className="relative right-21">
                <button
                    className="w-10 h-10 rounded-full border-2 border-blue-300 overflow-hidden focus:outline-none"
                    onClick={() => setOpen((v) => !v)}
                >
                    <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                </button>
                {/* Dropdown */}
                {open && (
                    <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border z-50"
                    >
                        <div className="flex flex-col items-center py-4 border-b">
                            <img src={user.avatar} alt="avatar" className="w-16 h-16 rounded-full border-2 border-blue-300 mb-2" />
                            <div className="font-bold text-lg">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.position}</div>
                            <div className="text-xs text-gray-400">{user.role}</div>
                        </div>
                        <div className="flex flex-col py-2">
                            <button className="flex items-center gap-2 px-6 py-2 hover:bg-gray-100" onClick={() => setEditOpen(true)}>
                                <span>เปลี่ยนรูปโปรไฟล์</span>
                            </button>
                            <button className="flex items-center gap-2 px-6 py-2 hover:bg-gray-100">
                                <span>เปลี่ยนรหัสผ่าน</span>
                            </button>
                            <button className="flex items-center gap-2 px-6 py-2 hover:bg-gray-100">
                                <span>เปลี่ยนลายเซ็น</span>
                            </button>
                            <button className="flex items-center gap-2 px-6 py-2 hover:bg-gray-100">
                                <span>ยกเลิกการแจ้งเตือนผ่านไลน์</span>
                            </button>
                        </div>
                        <button
                            className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-b-xl hover:bg-red-600 transition"
                        >
                            ออกจากระบบ
                        </button>
                    </div>
                )}
            </div>
            {/* Profile Edit Modal */}
            <ProfileEditModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                user={user}
                onSave={handleSaveProfile}
            />
        </header>
    );
}
