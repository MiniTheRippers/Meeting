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

  const handleSelect = (user: any) => {
    if (!participants.find((p) => p._id === user._id)) {
      setParticipants([...participants, user]);
    }
    setInput('');
    setSuggestions([]);
  };

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
      setShowForm(false);
      setTitle("");
      setStartDate("");
      setStartTime("");
      setEndTime("");
      setParticipants([]);
      setFile(null);
      fetchMeetings();
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
      <main className="flex-1 p-8 bg-gray-50 min-h-screen pt-[56px] pl-[80px]  bg-indigo-50">
        <h1 className="text-3xl font-bold mb-6">สร้างการประชุม</h1>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          onClick={() => setShowForm(true)}
        >
          สร้าง
        </button>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-8 w-[600px] max-w-full shadow-lg relative">
              <h2 className="text-2xl font-bold text-center mb-6">สร้างการประชุม</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mb-4">
                  <label className="block font-bold mb-2 text-gray-700">หัวข้อการประชุม</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="กรอกหัวข้อการประชุม"
                  />
                </div>

                <div className="bg-gray-100 rounded-xl border border-gray-300 p-4">
                  <label className="block font-semibold mb-2 text-gray-700">เวลาเริ่มประชุม</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block mb-1 text-sm text-gray-600">เริ่มประชุม</span>
                      <div className="flex gap-2">
                        <input type="date" className="flex-1 rounded-lg border border-gray-300 px-3 py-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <input type="time" className="flex-1 rounded-lg border border-gray-300 px-3 py-2" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <span className="block mb-1 text-sm text-gray-600">เลิกประชุม</span>
                      <input type="time" className="w-full rounded-lg border border-gray-300 px-3 py-2" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-xl border border-gray-300 p-4">
                  <label className="block font-semibold mb-2 text-gray-700">กำหนดผู้เข้าร่วมประชุม</label>
                  <div className="relative mb-3">
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="ค้นหาชื่อหรืออีเมลผู้เข้าร่วม"
                      value={input}
                      onChange={handleInputChange}
                    />
                    {suggestions.length > 0 && (
                      <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-md z-10 mt-1 max-h-40 overflow-y-auto">
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
                  <div className="bg-white rounded-lg border border-gray-300 p-4 min-h-[40px]">
                    <div className="font-medium mb-1 text-gray-600">รายชื่อผู้เข้าร่วม</div>
                    {participants.length === 0 && (
                      <div className="text-gray-400 text-sm">ยังไม่มีผู้เข้าร่วม</div>
                    )}
                    <ul className="flex flex-wrap gap-2">
                      {participants.map((user, idx) => (
                        <li key={user._id || idx} className="flex items-center gap-2 bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
                          {user.username}
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleRemove(user._id)}
                            type="button"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block font-bold mb-2 text-gray-700">เอกสารที่ประชุม</label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center cursor-pointer bg-white hover:border-blue-400 transition"
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

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    className="bg-gray-300 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                    onClick={() => setShowForm(false)}
                    type="button"
                  >
                    ยกเลิก
                  </button>
                  <button
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                    type="submit"
                  >
                    สร้าง
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">รายการการประชุม</h2>
          {meetings.length === 0 && (
            <div className="text-center text-gray-400 p-8 border border-gray-200 rounded-xl bg-white">ยังไม่มีข้อมูลการประชุม</div>
          )}
          <div className="grid grid-cols-1 gap-6">
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
                <div className="space-y-1 text-sm text-gray-700">
                  <p><b>เริ่ม:</b> {m.startDate || "-"} {m.startTime || "-"}</p>
                  <p><b>เลิก:</b> {m.endTime || "-"}</p>
                  <p><b>ผู้เข้าร่วม:</b>{" "}
                    {Array.isArray(m.participants)
                      ? m.participants.map(u => u.username || u.name || u).join(", ")
                      : "-"}
                  </p>
                  <p><b>เอกสาร:</b>{" "}
                    {m.file
                      ? (
                          <a
                            href={`/uploads/${m.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline hover:text-blue-700 transition"
                          >
                            {m.file}
                          </a>
                        )
                      : "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
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