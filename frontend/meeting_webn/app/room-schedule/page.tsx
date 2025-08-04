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
                console.log("rooms data:", res.data);
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
        <div className="flex">
            <Topbar />
            <Sidebar />
            <main className="flex-1 p-8 bg-gray-50 min-h-screen pt-[56px] pl-[80px]">
                <h1 className="text-3xl font-bold mb-4">ตารางขอใช้ห้องประชุม</h1>
                <div className="flex gap-4 w-full p-4">
                    {/* ฟอร์มจองห้องประชุม */}
                    <div className="bg-white rounded-lg shadow p-6 flex-1 ">
                        <h2 className="font-bold mb-4 flex items-center gap-2 ">
                            <span>📝</span> ฟอร์มขอใช้ห้องประชุม
                        </h2>
                        <p className=" border-b border-solid border-back-600"></p>

                        <div className='m-2 mt-7'>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-4 ">
                                    {/* ห้องประชุม */}
                                    <div>
                                        <label>ห้องประชุม *</label>
                                        <pre />
                                        <input
                                            name="roomName"
                                            value={form.roomName}
                                            onChange={handleChange}
                                            className="input rounded-lg border-1 w-full h-8"
                                            placeholder=" กรุณากรอกห้องประชุมที่นี่"
                                        />
                                    </div>
                                    {/* สถานที่ตั้ง */}
                                    <div>
                                        <label>สถานที่ตั้ง *</label>
                                        <pre />
                                        <input
                                            name="location"
                                            value={form.location}
                                            onChange={handleChange}
                                            className="input rounded-lg border-1 w-full h-8"
                                            placeholder=" กรุณากรอกสถานที่ตั้งที่นี่"
                                        />
                                    </div>
                                    {/* จำนวนความจุ */}
                                    <div>
                                        <label>จำนวนความจุ *</label>
                                        <pre />
                                        <input
                                            name="capacity"
                                            value={form.capacity}
                                            onChange={handleChange}
                                            className="input rounded-lg border-1 w-full h-8"
                                            placeholder=" กรุณากรอกความจุที่นี่"
                                        />
                                    </div>
                                    {/* อุปกรณ์ */}
                                    <div>
                                        <label>อุปกรณ์ *</label>
                                        <pre />
                                        <input
                                            name="equipment"
                                            value={form.equipment}
                                            onChange={handleChange}
                                            className="input rounded-lg border-1 w-full h-8"
                                            placeholder=" กรุณากรอกอุปกรณ์ที่นี่"
                                        />
                                    </div>
                                    {/* ตั้งแต่วันที่ */}
                                    <div>
                                        <label>ตั้งแต่วันที่ *</label>
                                        <pre />
                                        <input
                                            name="startDate"
                                            type="date"
                                            value={form.startDate}
                                            onChange={handleChange}
                                            className="input rounded-lg border-1 w-full h-8"
                                        />
                                    </div>
                                    {/* เวลา */}
                                    <div>
                                        <label>เวลา *</label>
                                        <pre />
                                        <input
                                            name="startTime"
                                            type="time"
                                            value={form.startTime}
                                            onChange={handleChange}
                                            className="input rounded-lg border-1 w-full h-8"
                                        />
                                    </div>
                                    {/* ถึงวันที่ */}
                                    <div>
                                        <label>ถึงวันที่ *</label>
                                        <pre />
                                        <input
                                            name="endDate"
                                            type="date"
                                            value={form.endDate}
                                            onChange={handleChange}
                                            className="input rounded-lg border-1 w-full h-8"
                                        />
                                    </div>
                                    {/* เวลา */}
                                    <div>
                                        <label>เวลา *</label>
                                        <pre />
                                        <input
                                            name="endTime"
                                            type="time"
                                            value={form.endTime}
                                            onChange={handleChange}
                                            className="input rounded-lg border-1 w-full h-8"
                                        />
                                    </div>
                                </div>
                                {/* รายละเอียดเพิ่มเติม */}
                                <div className="mt-4 ">
                                    <label>รายละเอียดเพิ่มเติม *</label>
                                    <textarea
                                        name="detail"
                                        value={form.detail}
                                        onChange={handleChange}
                                        className="input rounded-lg border-1 w-full h-full"
                                        rows={3}
                                        placeholder="กรุณากรอกรายละเอียดเพิ่มเติมที่นี่"
                                    />
                                </div>
                                {/* ปุ่ม */}
                                <div className="flex gap-2 mt-4">
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">บันทึกข้อมูล</button>
                                    <button type="button" className="bg-red-500 text-white px-4 py-2 rounded">ยกเลิก</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* รายการห้องประชุม */}
                    <div className="w-[350px] bg-white rounded-lg shadow p-4">
                        <h3 className="font-bold mb-2 flex items-center gap-2">เลือกห้องประชุม</h3>
                        <div className="flex flex-col gap-2">
                            {rooms.length === 0 ? (
                                <li>ไม่มีข้อมูลห้องประชุม</li>
                            ) : (
                                rooms.map(room => (
                                    <div key={room._id} onClick={() => handleSelectRoom(room)} style={{cursor: "pointer"}} className="border rounded-lg p-2 flex gap-2 items-center cursor-pointer hover:border-blue-500">
                                        <img src={room.image || "/room1.png"} alt={room.name} className="w-12 h-12" />
                                        <div>
                                            <div className="font-bold text-blue-600">{room.name}</div>
                                            <div className="text-xs">ความจุ : {room.capacity} คน</div>
                                            <div className="text-xs">สถานที่ตั้ง : {room.location}</div>
                                            <div className="text-xs">อุปกรณ์ : {room.equipment.join(", ")}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    
                </div>
            </main>
        </div>
    );
}