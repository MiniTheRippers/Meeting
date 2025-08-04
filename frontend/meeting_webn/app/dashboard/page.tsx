"use client";
import React, { useState, useEffect } from "react";
import Sidebar from '@/components/Sidebar';
import Topbar from "@/components/Topbar";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from "axios";


const mockRooms = [
  {
    id: "MR-0001",
    name: "ห้องประชุม1",
    registered: 0,
    capacity: 10,
    image: "/room1.png",
    status: "ลงทะเบียนแล้ว 0/10",
    timeLeft: "เหลือเวลา 1 วัน 11 ชั่วโมง 58 นาที 0 วินาที",
  },
  // ...เพิ่ม mock data ตามต้องการ
];

export default function MeetingDashboard() {
  const [rooms, setRooms] = useState(mockRooms);
  const [events, setEvents] = useState([
    {
      title: "ทดสอบ",
      start: "2025-07-22T10:00",
      end: "2025-07-22T12:00",
      color: "#4ade80"
    }
  ]);

  const [form, setForm] = useState({
    roomName: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      title: form.roomName,
      start: `${form.startDate}T${form.startTime}`,
      end: `${form.endDate}T${form.endTime}`,
    };
    setEvents(prev => [...prev, newEvent]);
  };

  useEffect(() => {
    axios.get("http://localhost:8000/api/meeting-requests")
      .then(res => {
        console.log("meeting-requests:", res.data);
        const eventData = res.data.map(item => ({
          title: item.roomName,
          start: `${item.startDate}T${item.startTime}`,
          end: `${item.endDate}T${item.endTime}`,
          color: getRoomColor(item.roomName),
        }));
        setEvents(eventData);
      })
      .catch(err => {
        setEvents([]);
        console.error("ดึงข้อมูล event ไม่สำเร็จ", err);
      });
  }, []);

  // ฟังก์ชันกำหนดสีแต่ละห้อง
  function getRoomColor(roomName) {
    if (roomName === "ห้องประชุม1") return "#4ade80"; // เขียว
    if (roomName === "ห้องประชุม2") return "#60a5fa"; // ฟ้า
    if (roomName === "ห้องประชุม6") return "#f87171"; // แดง
    // เพิ่มตามต้องการ
    return "#a78bfa"; // ม่วง (default)
  }

  return (
    <div className="flex">
      <Topbar/>
      {/* Sidebar ด้านซ้าย */}
      <Sidebar />
      {/* เนื้อหาหลัก */}
      <main className="flex-1 p-8 bg-gray-50 min-h-screen pt-[56px] pl-[80px]">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="flex flex-row gap-4 p-4">
          {/* ซ้าย: รายการห้องประชุม */}
          <div className="flex-1">
            <div className="flex flex-row gap-2 mb-2">
              <button className="bg-blue-100 px-3 py-1 rounded">ทั้งหมด 8</button>
              <button className="bg-yellow-100 px-3 py-1 rounded">รอยืนยัน 0</button>
              <button className="bg-green-100 px-3 py-1 rounded">ยืนยัน 3</button>
              <button className="bg-red-100 px-3 py-1 rounded">ยกเลิก 2</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {rooms.map((room, idx) => (
                <div key={room.id} className={`rounded-lg shadow p-4 mb-2 ${idx === 1 ? "bg-indigo-200" : "bg-white"}`}>
                  <div className="flex items-center gap-2">
                    <img src={room.image} alt={room.name} className="w-10 h-10" />
                    <div>
                      <div className="font-bold text-blue-700">{room.id} {room.name}</div>
                      <div className="text-xs">{room.status}</div>
                      <div className="text-xs">{room.timeLeft}</div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(room.registered / room.capacity) * 100}%` }}></div>
                    </div>
                  </div>
                  <button className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">ลงทะเบียน</button>
                </div>
              ))}
            </div>
          </div>
          {/* ขวา: ปฏิทิน */}
          {/* ปฏิทิน */}
          <div className="w-1/2 bg-white p-4 rounded shadow">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              height={600}
            />
          </div>
        </div>
      </main>
    </div>
  );
} 