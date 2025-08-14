"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from '@/components/Sidebar';
import Topbar from "@/components/Topbar";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';


type Room = {
    _id: string;
    name: string;
    location: string;
    capacity: number;
    equipment: string[];
    image: string;
};

type CalendarEvent = {
    title: string;
    start: string;
    end: string;
    extendedProps?: {
        location?: string;
        equipment?: string;
        detail?: string;
        capacity?: string | number;
    };
};

export default function RoomSchedulePage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<string>("");
    const [form, setForm] = useState({
        roomName: "",
        location: "",
        capacity: "",
        equipment: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        detail: "",
    });
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/rooms")
            .then(res => {
                setRooms(res.data);
            })
            .catch(err => {
                setRooms([]);
                console.error("ดึงข้อมูลห้องประชุมไม่สำเร็จ", err);
            });
    }, []);

    const handleSelectRoom = (room: Room) => {
        setSelectedRoom(room._id);
        setForm({
            ...form,
            roomName: room.name,
            location: room.location,
            capacity: room.capacity.toString(),
            equipment: room.equipment.join(", "),
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = {
            roomName: form.roomName,
            location: form.location,
            capacity: form.capacity,
            equipment: form.equipment,
            startDate: form.startDate,
            startTime: form.startTime,
            endDate: form.endDate,
            endTime: form.endTime,
            detail: form.detail,
        };
        try {
            await axios.post("http://localhost:8000/api/meeting-requests", data);
            alert("บันทึกข้อมูลสำเร็จ!");
            setForm({
                roomName: "",
                location: "",
                capacity: "",
                equipment: "",
                startDate: "",
                startTime: "",
                endDate: "",
                endTime: "",
                detail: "",
            });
        } catch (err) {
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col pt-16 ml-16 md:ml-64 transition-all duration-300">
                <Topbar />
                <main className="flex-1 p-6 md:p-8 bg-indigo-50">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-6">ตารางขอใช้ห้องประชุม</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
                        {/* ฟอร์มจองห้องประชุม */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 flex flex-col">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200 flex items-center">
                                <span className="mr-2 text-blue-500">📝</span> ฟอร์มขอใช้ห้องประชุม
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* ห้องประชุม */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ห้องประชุม <span className="text-red-500">*</span></label>
                                        <input
                                            name="roomName"
                                            value={form.roomName}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="กรุณากรอกห้องประชุมที่นี่"
                                        />
                                    </div>
                                    {/* สถานที่ตั้ง */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">สถานที่ตั้ง <span className="text-red-500">*</span></label>
                                        <input
                                            name="location"
                                            value={form.location}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="กรุณากรอกสถานที่ตั้งที่นี่"
                                        />
                                    </div>
                                    {/* จำนวนความจุ */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนความจุ <span className="text-red-500">*</span></label>
                                        <input
                                            name="capacity"
                                            value={form.capacity}
                                            onChange={handleChange}
                                            type="number"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="กรุณากรอกความจุที่นี่"
                                        />
                                    </div>
                                    {/* อุปกรณ์ */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">อุปกรณ์ <span className="text-red-500">*</span></label>
                                        <input
                                            name="equipment"
                                            value={form.equipment}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="กรุณากรอกอุปกรณ์ที่นี่"
                                        />
                                    </div>
                                    {/* ตั้งแต่วันที่ */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ตั้งแต่วันที่ <span className="text-red-500">*</span></label>
                                        <input
                                            name="startDate"
                                            type="date"
                                            value={form.startDate}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    {/* เวลา */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">เวลา <span className="text-red-500">*</span></label>
                                        <input
                                            name="startTime"
                                            type="time"
                                            value={form.startTime}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    {/* ถึงวันที่ */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ถึงวันที่ <span className="text-red-500">*</span></label>
                                        <input
                                            name="endDate"
                                            type="date"
                                            value={form.endDate}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    {/* เวลา */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">เวลา <span className="text-red-500">*</span></label>
                                        <input
                                            name="endTime"
                                            type="time"
                                            value={form.endTime}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                {/* รายละเอียดเพิ่มเติม */}
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดเพิ่มเติม <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="detail"
                                        value={form.detail}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        rows={3}
                                        placeholder="กรุณากรอกรายละเอียดเพิ่มเติมที่นี่"
                                    />
                                </div>
                                {/* ปุ่ม */}
                                <div className="flex gap-4 mt-6 pt-4 border-t border-gray-200">
                                    <button type="submit" className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">บันทึกข้อมูล</button>
                                    <button type="button" className="flex-1 bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">ยกเลิก</button>
                                </div>
                            </form>
                        </div>
                        {/* รายการห้องประชุม */}
                        <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200 flex items-center">
                                <span className="mr-2 text-green-500">🏢</span> เลือกห้องประชุม
                            </h3>
                            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                                {rooms.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">ไม่มีข้อมูลห้องประชุม</div>
                                ) : (
                                    rooms.map(room => (
                                        <div
                                            key={room._id}
                                            onClick={() => handleSelectRoom(room)}
                                            className={`
                                                p-4 rounded-lg shadow-sm cursor-pointer
                                                transition-all duration-200
                                                border-2 ${selectedRoom === room._id ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-300'}
                                            `}
                                        >
                                            <div className="flex items-start gap-4">
                                                <img src={room.image || "/room1.png"} alt={room.name} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                                                <div className="flex-1">
                                                    <div className="font-extrabold text-lg text-blue-600 mb-1">{room.name}</div>
                                                    <div className="text-sm text-gray-600">
                                                        <span className="font-semibold">ความจุ:</span> {room.capacity} คน
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        <span className="font-semibold">สถานที่ตั้ง:</span> {room.location}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        <span className="font-semibold">อุปกรณ์:</span> {room.equipment.join(", ")}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    {/* ตารางการจองห้องประชุม */}
                    <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-4 border-b border-gray-200 flex items-center">
                            <span className="mr-2 text-orange-500">📅</span> ตารางการจองห้องประชุม
                        </h2>
                        {selectedRoom ? (
                            <FullCalendar
                                plugins={[dayGridPlugin]}
                                initialView="dayGridMonth"
                                events={events}
                                eventColor="#3b82f6" // สีน้ำเงินของ Tailwind
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,dayGridWeek,dayGridDay'
                                }}
                            />
                        ) : (
                            <div className="text-center text-gray-500 py-12 text-lg">
                                โปรดเลือกห้องประชุมจากรายการทางด้านขวาเพื่อดูตารางการจอง
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}