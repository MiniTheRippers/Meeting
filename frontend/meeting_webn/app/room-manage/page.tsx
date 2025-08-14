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
    const [search, setSearch] = useState("");
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/rooms");
            setRooms(res.data);
        } catch (err) {
            setAlert({ type: "error", message: "ไม่สามารถดึงข้อมูลห้องประชุมได้" });
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
            if (file && file.size > 2 * 1024 * 1024) { // 2MB
                alert("ไฟล์ภาพต้องไม่เกิน 2MB");
                return;
            }
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
            if (editRoom && editRoom._id) {
                await axios.put(`http://localhost:8000/api/rooms/${editRoom._id}`, data);
                setAlert({ type: "success", message: "แก้ไขข้อมูลสำเร็จ" });
            } else {
                await axios.post("http://localhost:8000/api/rooms", data);
                setAlert({ type: "success", message: "เพิ่มห้องประชุมสำเร็จ" });
            }
            fetchRooms();
            handleCloseModal();
        } catch (err) {
            setAlert({ type: "error", message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("ยืนยันการลบห้องประชุมนี้?")) {
            try {
                await axios.delete(`http://localhost:8000/api/rooms/${id}`);
                setAlert({ type: "success", message: "ลบห้องประชุมสำเร็จ" });
                fetchRooms();
            } catch {
                setAlert({ type: "error", message: "เกิดข้อผิดพลาดในการลบข้อมูล" });
            }
        }
    };

    // Filter rooms by search
    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(search.toLowerCase()) ||
        room.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100">
            <Topbar />
            <Sidebar />
            <main className="flex-1 p-8 pt-[56px] pl-[80px]">
                <div className="p-4">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                        <h2 className="text-2xl font-bold text-indigo-900">จัดการห้องประชุม</h2>
                        <button
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:scale-105 transition-transform"
                            onClick={() => handleOpenModal()}
                        >
                            + เพิ่มห้องประชุม
                        </button>
                    </div>
                    {alert && (
                        <div className={`mb-4 px-4 py-2 rounded text-white ${alert.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
                            {alert.message}
                        </div>
                    )}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        {/* Filter/Search */}
                        <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
                            <input
                                className="border rounded px-3 py-2 w-full md:w-1/3"
                                placeholder="ค้นหาชื่อห้องหรือสถานที่..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-center border-collapse">
                                <thead>
                                    <tr className="bg-indigo-100 text-indigo-800">
                                        <th className="py-2">#</th>
                                        <th>ชื่อห้อง</th>
                                        <th>สถานที่ตั้ง</th>
                                        <th>จำนวนจุ</th>
                                        <th>อุปกรณ์</th>
                                        <th>รูปภาพ</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRooms.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-4 text-gray-400">ไม่พบข้อมูลห้องประชุม</td>
                                        </tr>
                                    ) : (
                                        filteredRooms.map((room, idx) => (
                                            <tr key={room._id} className="border-b hover:bg-indigo-50 transition">
                                                <td>{idx + 1}</td>
                                                <td className="font-semibold">{room.name}</td>
                                                <td>{room.location}</td>
                                                <td>{room.capacity}</td>
                                                <td>
                                                    <span className="text-xs text-gray-700">{room.equipment?.join(", ")}</span>
                                                </td>
                                                <td>
                                                    {room.image ? (
                                                        <img src={room.image} alt="room" className="w-16 h-16 object-cover rounded-lg mx-auto" />
                                                    ) : (
                                                        <span className="text-gray-400">ไม่มีรูป</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <button
                                                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2 transition"
                                                        onClick={() => handleOpenModal(room)}
                                                    >
                                                        แก้ไข
                                                    </button>
                                                    <button
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
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
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                            แสดง 1 ถึง {filteredRooms.length} จาก {rooms.length} แถว
                        </div>
                    </div>
                    {/* Modal */}
                    {modalOpen && (
                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl shadow-2xl p-8 w-[95vw] max-w-md relative">
                                <button
                                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl"
                                    onClick={handleCloseModal}
                                    type="button"
                                    title="ปิด"
                                >×</button>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">📝 ฟอร์มห้องประชุม</h3>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                    {/* รูปภาพ */}
                                    <div className="flex justify-center mb-2">
                                        <div
                                            className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden border-2 border-indigo-200"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {form.image ? (
                                                <img src={form.image} alt="room" className="w-full h-full object-cover" />
                                            ) : (
                                                <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                                                    <rect width="24" height="24" rx="8" fill="#e5e7eb" />
                                                    <path d="M8 17l4-4 4 4M12 13V7" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                                    <label className="font-semibold text-indigo-700">ชื่อห้องประชุม</label>
                                    <input
                                        className="border rounded px-3 py-2 focus:outline-indigo-400"
                                        name="name"
                                        placeholder="กรุณากรอกชื่อห้องประชุมที่นี่"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    {/* สถานที่ตั้ง */}
                                    <label className="font-semibold text-indigo-700">สถานที่ตั้ง</label>
                                    <input
                                        className="border rounded px-3 py-2 focus:outline-indigo-400"
                                        name="location"
                                        placeholder="กรุณากรอกสถานที่ตั้งที่นี่"
                                        value={form.location}
                                        onChange={handleChange}
                                        required
                                    />
                                    {/* ความจุ */}
                                    <label className="font-semibold text-indigo-700">ความจุ</label>
                                    <input
                                        className="border rounded px-3 py-2 focus:outline-indigo-400"
                                        name="capacity"
                                        placeholder="กรุณากรอกความจุที่นี่"
                                        type="number"
                                        min={1}
                                        value={form.capacity}
                                        onChange={handleChange}
                                        required
                                    />
                                    {/* อุปกรณ์ */}
                                    <label className="font-semibold text-indigo-700">อุปกรณ์</label>
                                    <div className="grid grid-cols-2 gap-2 my-2">
                                        {equipmentList.map(eq => (
                                            <label key={eq.value} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={form.equipment.includes(eq.value)}
                                                    onChange={() => handleEquipmentChange(eq.value)}
                                                    className="accent-indigo-500"
                                                />
                                                {eq.label}
                                            </label>
                                        ))}
                                    </div>
                                    {/* ปุ่ม */}
                                    <div className="flex gap-2 mt-2">
                                        <button type="submit" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded font-bold flex-1 shadow hover:scale-105 transition-transform">
                                            {editRoom ? "บันทึกข้อมูล" : "เพิ่ม"}
                                        </button>
                                        <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded font-bold flex-1 shadow hover:bg-gray-400 transition" onClick={handleCloseModal}>
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
