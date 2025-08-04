"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from '@/components/Sidebar';
import Topbar from "@/components/Topbar";

type Room = {
    _id?: string;
    name: string;
    location: string;
    capacity: number;
    equipment: string[];
    image: string;
};

export default function RoomManagePage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editRoom, setEditRoom] = useState<Room | null>(null);
    const [equipmentList] = useState([
        { label: "โทรทัศน์", value: "โทรทัศน์" },
        { label: "โปรเจคเตอร์", value: "โปรเจคเตอร์" },
        { label: "ไมค์", value: "ไมค์" },
        { label: "โน้ตบุ๊ค", value: "โน้ตบุ๊ค" },
        { label: "คอมพิวเตอร์", value: "คอมพิวเตอร์" },
    ]);
    const [form, setForm] = useState<any>({ name: "", location: "", capacity: 0, equipment: [], image: "" });
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // โหลดข้อมูลห้องประชุม
    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/rooms");
            setRooms(res.data);
        } catch (err) {
            console.error("ไม่สามารถดึงข้อมูลห้องประชุมได้", err);
        }
    };

    const handleOpenModal = (room?: Room) => {
        setEditRoom(room || null);
        setForm(room || { name: "", location: "", capacity: 0, equipment: [], image: "" });
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditRoom(null);
        setForm({ name: "", location: "", capacity: 0, equipment: [], image: "" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setForm({ ...form, image: ev.target?.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEquipmentChange = (value: string) => {
        setForm({
            ...form,
            equipment: form.equipment.includes(value)
                ? form.equipment.filter((e: string) => e !== value)
                : [...form.equipment, value],
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            name: form.name,
            location: form.location,
            capacity: Number(form.capacity),
            equipment: form.equipment,
            image: form.image
        };
        try {
            await axios.post("http://localhost:8000/api/rooms", data);
            fetchRooms();
            handleCloseModal();
        } catch (err) {
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("ยืนยันการลบห้องประชุมนี้?")) {
            await axios.delete(`http://localhost:8000/api/rooms/${id}`);
            fetchRooms();
        }
    };

    return (
        <div className="flex">
            <Topbar />
            <Sidebar />
            <main className="flex-1 p-8 bg-gray-50 min-h-screen pt-[56px] pl-[80px]">
                <h1 className="text-3xl font-bold mb-4">จัดการใช้ห้องประชุม</h1>
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">จัดการห้องประชุม</h2>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => handleOpenModal()}
                        >
                            + เพิ่มห้องประชุม
                        </button>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        {/* Filter/Search */}
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                className="border rounded px-2 py-1"
                                placeholder="กรุณาเลือกกรองข้อมูล"
                            />
                            <input
                                className="border rounded px-2 py-1 w-16"
                                placeholder="10"
                                type="number"
                            />
                        </div>
                        {/* Table */}
                        <table className="w-full text-center border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2">ID</th>
                                    <th>ชื่อห้อง</th>
                                    <th>สถานที่ตั้ง</th>
                                    <th>จำนวนจุ</th>
                                    <th>อุปกรณ์</th>
                                    <th>สถานะ</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-4 text-gray-400">ไม่พบข้อมูลห้องประชุม</td>
                                    </tr>
                                ) : (
                                    rooms.map((room, idx) => (
                                        <tr key={room._id} className="border-b">
                                            <td>{idx + 1}</td>
                                            <td>{room.name}</td>
                                            <td>{room.location}</td>
                                            <td>{room.capacity}</td>
                                            <td>{room.equipment?.join(", ")}</td>
                                            <td>พร้อมใช้งาน</td>
                                            <td>
                                                <button
                                                    className="bg-yellow-400 text-white px-2 py-1 rounded mr-2"
                                                    onClick={() => handleOpenModal(room)}
                                                >
                                                    แก้ไข
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                                    onClick={() => handleDelete(room._id!)}
                                                >
                                                    ลบ
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <div className="text-sm text-gray-500 mt-2">
                            แสดง 1 ถึง {rooms.length} จาก {rooms.length} แถว
                        </div>
                    </div>
                    {/* Modal */}
                    {modalOpen && (
                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl shadow-lg p-8 w-[400px]">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">📝 ฟอร์มห้องประชุม</h3>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                    {/* รูปภาพ */}
                                    <div className="flex justify-center mb-2">
                                        <div
                                            className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {form.image ? (
                                                <img src={form.image} alt="room" className="w-full h-full object-cover" />
                                            ) : (
                                                <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                                                    <rect width="24" height="24" rx="8" fill="#e5e7eb" />
                                                    <path d="M8 17l4-4 4 4M12 13V7" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                ref={fileInputRef}
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                    </div>
                                    {/* ชื่อห้อง */}
                                    <h3>ชื่อห้องประชุม</h3>
                                    <input
                                        className="border rounded px-3 py-2"
                                        name="name"
                                        placeholder="กรุณากรอกชื่อห้องประชุมที่นี่"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    {/* สถานที่ตั้ง */}
                                    <h3>สถานที่ตั้ง</h3>
                                    <input
                                        className="border rounded px-3 py-2"
                                        name="location"
                                        placeholder="กรุณากรอกสถานที่ตั้งที่นี่"
                                        value={form.location}
                                        onChange={handleChange}
                                        required
                                    />
                                    {/* ความจุ */}
                                    <h3>ความจุ</h3>
                                    <input
                                        className="border rounded px-3 py-2"
                                        name="capacity"
                                        placeholder="กรุณากรอกความจุที่นี่"
                                        type="number"
                                        value={form.capacity}
                                        onChange={handleChange}
                                        required
                                    />
                                    {/* อุปกรณ์ */}
                                    <div className="grid grid-cols-2 gap-2 my-2">
                                        {equipmentList.map(eq => (
                                            <label key={eq.value} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={form.equipment.includes(eq.value)}
                                                    onChange={() => handleEquipmentChange(eq.value)}
                                                    className="accent-blue-500"
                                                />
                                                {eq.label}
                                            </label>
                                        ))}
                                    </div>
                                    {/* ปุ่ม */}
                                    <div className="flex gap-2 mt-2">
                                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded flex-1">
                                            {editRoom ? "บันทึกข้อมูล" : "เพิ่ม"}
                                        </button>
                                        <button type="button" className="bg-red-500 text-white px-4 py-2 rounded flex-1" onClick={handleCloseModal}>
                                            ยกเลิก
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
} 