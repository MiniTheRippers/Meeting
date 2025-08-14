"use client";
import React, { useState, useEffect } from "react";
import Sidebar from '@/components/Sidebar';
import Topbar from "@/components/Topbar";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from "axios";

const mockRooms = [
  {
    id: "MR-0001",
    name: "ห้องประชุม1",
    registered: 5,
    capacity: 10,
    image: "/room1.png",
    status: "ลงทะเบียนแล้ว 5/10",
    timeLeft: "เหลือเวลา 1 วัน 11 ชั่วโมง",
  },
  {
    id: "MR-0002",
    name: "ห้องประชุม2",
    registered: 1,
    capacity: 8,
    image: "/room2.png",
    status: "ลงทะเบียนแล้ว 1/8",
    timeLeft: "เหลือเวลา 3 ชั่วโมง 20 นาที",
  },
  {
    id: "MR-0003",
    name: "ห้องประชุม3",
    registered: 8,
    capacity: 12,
    image: "/room3.png",
    status: "ลงทะเบียนแล้ว 8/12",
    timeLeft: "เหลือเวลา 2 วัน 5 ชั่วโมง",
  },
  {
    id: "MR-0004",
    name: "ห้องประชุม4",
    registered: 0,
    capacity: 15,
    image: "/room4.png",
    status: "ว่าง",
    timeLeft: "ไม่จำกัด",
  },
];

export default function MeetingDashboard() {
  const [rooms, setRooms] = useState(mockRooms);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/meeting-requests")
      .then(res => {
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

  function getRoomColor(roomName) {
    if (roomName === "ห้องประชุม1") return "#3B82F6"; // Blue
    if (roomName === "ห้องประชุม2") return "#10B981"; // Green
    if (roomName === "ห้องประชุม3") return "#F59E0B"; // Yellow
    if (roomName === "ห้องประชุม4") return "#EF4444"; // Red
    return "#6366F1"; // Indigo (default)
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Topbar/>
      <Sidebar />
      <main className="flex-1 p-8 pt-[56px] pl-[80px] bg-indigo-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ซ้าย: รายการห้องประชุม */}
          <div className="flex-1 lg:w-1/3">
            <div className="flex flex-wrap gap-2 mb-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-full font-medium text-sm shadow-md">ทั้งหมด 8</button>
              <button className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-medium text-sm shadow-md">รอยืนยัน 0</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-full font-medium text-sm shadow-md">ยืนยัน 3</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-full font-medium text-sm shadow-md">ยกเลิก 2</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.map((room, idx) => (
                <div key={room.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <img src={room.image} alt={room.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <div className="font-bold text-lg text-blue-700">{room.name}</div>
                      <div className="text-sm text-gray-500">{room.id}</div>
                      <div className="text-sm font-medium mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs ${room.status.includes("ว่าง") ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {room.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    <p className="font-medium">เวลาที่เหลือ:</p>
                    <p className="text-blue-500 font-semibold">{room.timeLeft}</p>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${(room.registered / room.capacity) * 100}%`, backgroundColor: getRoomColor(room.name) }}
                    ></div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-blue-700 transition">
                      ดูรายละเอียด
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ขวา: ปฏิทิน */}
          <div className="lg:w-2/3 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              height="auto"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,dayGridDay'
              }}
              locale="th"
              dayCellClassNames="text-sm"
              eventClassNames="text-xs"
              
            />
          </div>
        </div>
      </main>
    </div>
  );
}