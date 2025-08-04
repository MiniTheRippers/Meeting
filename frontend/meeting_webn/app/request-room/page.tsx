"use client";
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import axios from 'axios';
import Topbar from "@/components/Topbar";

export default function RequestRoomPage() {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [meetings, setMeetings] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/users').then(res => setUsers(res.data));
    fetchMeetings();
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (e.target.value.length > 1) {
      const res = await axios.get('http://localhost:8000/api/users?search=' + e.target.value);
      setSuggestions(res.data);
    } else {
      setSuggestions([]);
    }
  };

  // เลือกผู้ใช้จาก suggestion
  const handleSelect = (user: any) => {
    if (!participants.find((p) => p._id === user._id)) {
      setParticipants([...participants, user]);
    }
    setInput('');
    setSuggestions([]);
  };

  // ลบผู้เข้าร่วม
  const handleRemove = (id: string) => {
    setParticipants(participants.filter((p) => p._id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("กรุณาเลือกไฟล์");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("startDate", startDate);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    formData.append("participants", JSON.stringify(participants));
    formData.append("file", file);

    const res = await axios.post("http://localhost:8000/api/meeting", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data && res.data.success) {
      alert("บันทึกสำเร็จ!");
      setShowForm(false); // ปิด modal
      setTitle("");
      setStartDate("");
      setStartTime("");
      setEndTime("");
      setParticipants([]);
      setFile(null);
      fetchMeetings(); // <--- ตรงนี้คือการดึงข้อมูลใหม่
    }
  };

  const fetchMeetings = async () => {
    const res = await axios.get("http://localhost:8000/api/meeting");
    console.log(res.data);
    setMeetings(res.data);
    console.log("meetings", res.data);
  };

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => {
        setRooms(data);
      });
  }, []);

  return (
    <div className="flex">
      <Topbar />
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50 min-h-screen pt-[56px] pl-[80px]">
        <h1 className="text-3xl font-bold mb-4">สร้างการประชุม</h1>
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-600 transition"
          onClick={() => setShowForm(true)}
        >
          สร้าง
        </button>

        {/* Modal ฟอร์มขอใช้การประชุม */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-[#e5e5e5] rounded-lg p-8 w-[600px] max-w-full shadow-lg relative">
              <h2 className="text-2xl font-bold text-center mb-6">การประชุม</h2>
              
              <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-gray-100 p-8 rounded-xl shadow">
                <div className="mb-4">
                  <label className="block font-bold mb-2">หัวข้อการประชุม</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="กรอกหัวข้อการประชุม"
                  />
                </div>

                {/* เวลาเริ่มประชุม */}
                <div className="mb-4 bg-gray-300 rounded-lg border border-gray-500 p-4">
                  <label className="block font-semibold mb-2">เวลาเริ่มประชุม</label>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="mr-2 p-1">เริ่มประชุม:</span>
                      <input type="date" className="rounded border border-gray-400 px-2 py-1" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                      <input type="time" className="rounded border border-gray-400 px-2 py-1 ml-3" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                    </div>
                  </div>
                  <div className='p-1'>
                      <span className="mr-2">เลิกประชุม:</span>
                      <input type="time" className="rounded border border-gray-400 px-3 py-1" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                    </div>
                </div>

                {/* กำหนดผู้เข้าร่วมประชุม */}
                <div className="mb-4 rounded-lg border border-gray-500 p-4">
                  <label className="block font-semibold mb-1">กำหนดผู้เข้าร่วมประชุม</label>
                  <div className="relative mb-2">
                    <input
                      type="text"
                      className="w-full rounded border border-gray-500 px-4 py-2 pr-10"
                      placeholder="ค้นหาชื่อหรืออีเมลผู้เข้าร่วม"
                      value={input}
                      onChange={handleInputChange}
                    />
                    {/* Suggestion dropdown */}
                    {suggestions.length > 0 && (
                      <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded shadow z-10 mt-1 max-h-40 overflow-y-auto">
                        {suggestions.map((user) => (
                          <li
                            key={user._id}
                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                            onClick={() => handleSelect(user)}
                          >
                            {user.username} ({user.email})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="bg-[#f5f5f5] rounded p-4 min-h-[40px]">
                    <div className="font-medium mb-1">รายชื่อผู้เข้าร่วม</div>
                    {participants.length === 0 && (
                      <div className="text-gray-400">ยังไม่มีผู้เข้าร่วม</div>
                    )}
                    <div> 
                      <ul>
                        {participants.map((user, idx) => (
                          <li key={user._id || idx} className="flex items-center gap-2">
                            {user.username} ({user.email})
                            <button
                              className="text-red-500"
                              onClick={() => handleRemove(user._id)}
                              type="button"
                            >
                              ลบ
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* เอกสารที่ประชุม */}
                <div className="mb-4">
                  <label className="block font-bold mb-2">เอกสารที่ประชุม</label>
                  <div
                    className="border-2 border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center cursor-pointer bg-white"
                    onClick={handleUploadClick}
                  >
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <span className="text-gray-500 flex items-center gap-2">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="4" y="16" width="16" height="4" rx="2" fill="#e5e7eb"/>
                      </svg>
                      {file ? file.name : "อัปโหลดเอกสารที่ประชุม"}
                    </span>
                  </div>
                </div>

                {/* ปุ่ม ยกเลิก/สร้าง */}
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    className="bg-gray-300 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                    onClick={() => setShowForm(false)}
                  >
                    ยกเลิก
                  </button>
                  <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-600 transition"
                    type="submit"
                  >
                    สร้าง
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">รายการการประชุม</h2>
          {meetings.length === 0 && (
            <div className="text-center text-gray-400">ยังไม่มีข้อมูลการประชุม</div>
          )}
          <div className="flex flex-col gap-6">
            {meetings.filter(m => m && m.title).map((m, idx) => (
              <div
                key={m?._id || idx}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                    <span>📝</span> {m?.title || "-"}
                  </div>
                  <span className="text-xs text-gray-400">#{idx + 1}</span>
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  <b>เริ่ม:</b> {m.startDate || "-"} {m.startTime || "-"}
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  <b>เลิก:</b> {m.endTime || "-"}
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  <b>ผู้เข้าร่วม:</b>{" "}
                  {Array.isArray(m.participants)
                    ? m.participants.map(u => u.username || u.name || u).join(", ")
                    : "-"}
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  <b>เอกสาร:</b>{" "}
                  {m.file
                    ? (
                        <a
                          href={`/uploads/${m.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          {m.file}
                        </a>
                      )
                    : "-"}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
              onClick={fetchMeetings}
            >
              รีเฟรชรายการ
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}