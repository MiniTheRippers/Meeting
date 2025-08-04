"use client";
<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from "@/components/Topbar";
import axios from "axios";
=======
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from "@/components/Topbar";
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c

type UserRow = { 
    name: string; 
    position: string; 
    role: string; 
};

type Document = {
    id: number;
    type: 'agenda' | 'participants'; // เพิ่ม type เพื่อแยกประเภทเอกสาร
    date: string;
    title: string;
    location: string;
    // สำหรับเอกสารวาระการประชุม
    agenda1?: string;
    agenda2?: string;
    agenda3?: string;
    agenda4?: string;
    agenda5?: string;
    agenda6?: string;
    // สำหรับเอกสารผู้เข้าร่วมประชุม
    leaders?: UserRow[];
    absents?: UserRow[];
    participants?: UserRow[];
    createdAt: string;
};

export default function RoomSummaryPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [title, setTitle] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [agenda1, setAgenda1] = useState('');
    const [agenda2, setAgenda2] = useState('');
    const [agenda3, setAgenda3] = useState('');
    const [agenda4, setAgenda4] = useState('');
    const [agenda5, setAgenda5] = useState('');
    const [agenda6, setAgenda6] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);

    // สำหรับเอกสาร 2
    const [title2, setTitle2] = useState('');
    const [date2, setDate2] = useState('');
    const [location2, setLocation2] = useState('');
    const [leaders, setLeaders] = useState<UserRow[]>([{ name: '', position: '', role: '' }]);
    const [absents, setAbsents] = useState<UserRow[]>([{ name: '', position: '', role: '' }]);
    const [participants, setParticipants] = useState<UserRow[]>([{ name: '', position: '', role: '' }]);

    const handleAddRow = (groupSetter: React.Dispatch<React.SetStateAction<UserRow[]>>) => {
        groupSetter(rows => [...rows, { name: '', position: '', role: '' }]);
    };
    
    const handleRemoveRow = (groupSetter: React.Dispatch<React.SetStateAction<UserRow[]>>, idx: number) => {
        groupSetter(rows => rows.length > 1 ? rows.filter((_, i) => i !== idx) : rows);
    };
    
    const handleChangeRow = (
        groupSetter: React.Dispatch<React.SetStateAction<UserRow[]>>,
        idx: number,
        field: keyof UserRow,
        value: string
    ) => {
        groupSetter(rows => rows.map((row, i) => i === idx ? { ...row, [field]: value } : row));
    };

    const documentsPerPage = 5;
    const totalPages = Math.ceil(documents.length / documentsPerPage);

    // ฟังก์ชันสร้างเอกสารประเภทวาระการประชุม
<<<<<<< HEAD
    const handleCreateDocument = async (e: React.FormEvent) => {
=======
    const handleCreateDocument = (e: React.FormEvent) => {
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
        e.preventDefault();
        if (
            !date.trim() || !title.trim() || !location.trim() ||
            !agenda1.trim() || !agenda2.trim() || !agenda3.trim() ||
            !agenda4.trim() || !agenda5.trim() || !agenda6.trim()
        ) return;
<<<<<<< HEAD

=======
        
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
        const newDoc: Document = {
            id: Date.now(),
            type: 'agenda',
            date,
            title,
            location,
            agenda1,
            agenda2,
            agenda3,
            agenda4,
            agenda5,
            agenda6,
            createdAt: new Date().toLocaleString(),
        };
<<<<<<< HEAD

        setDocuments([newDoc, ...documents]);

        // ส่งข้อมูลไป backend
        try {
            await axios.post("http://localhost:8000/api/documents", newDoc);
        } catch (err) {
            alert("บันทึกข้อมูลลงฐานข้อมูลไม่สำเร็จ");
        }

=======
        
        setDocuments([newDoc, ...documents]);
        
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
        // รีเซ็ตฟอร์ม
        setDate('');
        setTitle('');
        setLocation('');
        setAgenda1('');
        setAgenda2('');
        setAgenda3('');
        setAgenda4('');
        setAgenda5('');
        setAgenda6('');
        setCurrentPage(1);
    };

    // ฟังก์ชันสร้างเอกสารประเภทผู้เข้าร่วมประชุม
<<<<<<< HEAD
    const handleCreateDocument2 = async () => {
=======
    const handleCreateDocument2 = () => {
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
        if (!date2.trim() || !title2.trim() || !location2.trim()) {
            alert('กรุณากรอกข้อมูลวันที่ หัวข้อ และสถานที่ให้ครบถ้วน');
            return;
        }

        const newDoc: Document = {
            id: Date.now(),
            type: 'participants',
            date: date2,
            title: title2,
            location: location2,
            leaders: leaders.filter(row => row.name.trim() !== ''),
            absents: absents.filter(row => row.name.trim() !== ''),
            participants: participants.filter(row => row.name.trim() !== ''),
            createdAt: new Date().toLocaleString(),
        };
<<<<<<< HEAD

        setDocuments([newDoc, ...documents]);

        // ส่งข้อมูลไป backend
        try {
            await axios.post("http://localhost:8000/api/documents", newDoc);
        } catch (err) {
            alert("บันทึกข้อมูลลงฐานข้อมูลไม่สำเร็จ");
        }

=======
        
        setDocuments([newDoc, ...documents]);
        
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
        // รีเซ็ตฟอร์ม
        setDate2('');
        setTitle2('');
        setLocation2('');
        setLeaders([{ name: '', position: '', role: '' }]);
        setAbsents([{ name: '', position: '', role: '' }]);
        setParticipants([{ name: '', position: '', role: '' }]);
        setCurrentPage(1);
    };

    // ฟังก์ชัน submit ฟอร์มเอกสาร 1
    const handleSubmit = (e: React.FormEvent) => {
        handleCreateDocument(e);
        setShowModal(false);
    };

    // ฟังก์ชัน submit ฟอร์มเอกสาร 2
    const handleSubmit2 = () => {
        handleCreateDocument2();
        setShowModal2(false);
    };

    // คำนวณเอกสารที่จะแสดงในหน้าปัจจุบัน
    const indexOfLastDoc = currentPage * documentsPerPage;
    const indexOfFirstDoc = indexOfLastDoc - documentsPerPage;
    const currentDocuments = documents.slice(indexOfFirstDoc, indexOfLastDoc);

<<<<<<< HEAD
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/documents");
                setDocuments(res.data);
            } catch (err) {
                console.error("โหลดเอกสารไม่สำเร็จ", err);
            }
        };
        fetchDocuments();
    }, []);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100">
            <Topbar/>
            <Sidebar />
            <main className="flex-1 p-8 pt-[56px] pl-[80px]">
                {/* ปุ่มสร้าง */}
                <div className="flex gap-12 mb-8 justify-center">
                    <button
                        className="w-72 h-40 rounded-2xl bg-gradient-to-br from-[#2d1767] via-[#3b1fa7] to-[#6e5cf7] flex flex-col items-center justify-center text-white text-2xl font-bold shadow-2xl transition-transform hover:scale-105 hover:shadow-indigo-400"
                        onClick={() => setShowModal(true)}
                        type="button"
                    >
                        <span className="mb-2 text-4xl">📝</span>
                        สร้างเอกสารวาระ
                    </button>
                    <button
                        className="w-72 h-40 rounded-2xl bg-gradient-to-br from-[#2d1767] via-[#3b1fa7] to-[#6e5cf7] flex flex-col items-center justify-center text-white text-2xl font-bold shadow-2xl transition-transform hover:scale-105 hover:shadow-indigo-400"
                        onClick={() => setShowModal2(true)}
                        type="button"
                    >
                        <span className="mb-2 text-4xl">👥</span>
                        สร้างเอกสารผู้เข้าร่วม
=======
    return (
        <div className="flex">
            <Topbar/>
            <Sidebar />
            <main className="flex-1 p-8 bg-gray-50 min-h-screen pt-[56px] pl-[80px]">
                {/* ปุ่มสร้าง */}
                <div className="flex gap-12 mb-8">
                    <button
                        className="w-72 h-40 rounded-2xl bg-gradient-to-r from-[#2d1767] to-[#3b1fa7] flex items-center justify-center text-white text-xl font-medium shadow-lg transition-transform hover:scale-105"
                        onClick={() => setShowModal(true)}
                        type="button"
                    >
                        สร้างเอกสาร1
                    </button>
                    <button
                        className="w-72 h-40 rounded-2xl bg-gradient-to-r from-[#2d1767] to-[#3b1fa7] flex items-center justify-center text-white text-xl font-medium shadow-lg transition-transform hover:scale-105"
                        onClick={() => setShowModal2(true)}
                        type="button"
                    >
                        สร้างเอกสาร2
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                    </button>
                </div>

                {/* Modal ฟอร์มสร้างเอกสาร 1 */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
<<<<<<< HEAD
                        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-xl w-full relative border-2 border-indigo-200">
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
=======
                        <div className="bg-white p-8 rounded shadow-lg max-w-xl w-full relative">
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                onClick={() => setShowModal(false)}
                                type="button"
                            >
                                ×
                            </button>
                            <form onSubmit={handleSubmit}>
<<<<<<< HEAD
                                <h2 className="text-2xl font-bold mb-6 text-indigo-700">สร้างเอกสารวาระการประชุม</h2>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <input
                                        type="date"
                                        className="w-full p-2 border rounded-lg shadow"
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="หัวข้อเอกสาร"
                                        className="w-full p-2 border rounded-lg shadow"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="สถานที่ประชุม"
                                        className="w-full p-2 border rounded-lg shadow col-span-2"
                                        value={location}
                                        onChange={e => setLocation(e.target.value)}
                                        required
                                    />
                                </div>
                                {[agenda1, agenda2, agenda3, agenda4, agenda5, agenda6].map((agenda, idx) => (
                                    <div className="mb-3" key={idx}>
                                        <h4 className="font-semibold mb-1 text-indigo-600">{`ระเบียบวาระที่ ${idx + 1}: ${[
                                            "ประธานแจ้งให้ทราบ",
                                            "รับรองรายงานการประชุม",
                                            "เรื่องสืบเนื่อง",
                                            "เรื่องแจ้งเพื่อทราบ",
                                            "เรื่องนำเสนอเพื่อพิจารณา",
                                            "เรื่องอื่นๆ"
                                        ][idx]}`}</h4>
                                        <textarea
                                            className="w-full p-2 border rounded-lg shadow"
                                            placeholder='กรุณากรอกเนื้อหา'
                                            value={[agenda1, agenda2, agenda3, agenda4, agenda5, agenda6][idx]}
                                            onChange={e => [
                                                setAgenda1,
                                                setAgenda2,
                                                setAgenda3,
                                                setAgenda4,
                                                setAgenda5,
                                                setAgenda6
                                            ][idx](e.target.value)}
                                            rows={2}
                                            required
                                        />
                                    </div>
                                ))}
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-6 py-2 rounded-lg font-bold mt-4 hover:bg-indigo-700 shadow-lg"
=======
                                <h2 className="text-xl font-semibold mb-4">สร้างเอกสารวาระการประชุม</h2>
                                <input
                                    type="date"
                                    className="w-full mb-3 p-2 border rounded"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="หัวข้อเอกสาร"
                                    className="w-full mb-3 p-2 border rounded"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="สถานที่ประชุม"
                                    className="w-full mb-3 p-2 border rounded"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    required
                                />
                                <div className="mb-3">
                                    <h4 className="font-semibold mb-1">ระเบียบวาระที่ 1: ประธานแจ้งให้ทราบ</h4>
                                    <textarea
                                        className="w-full p-2 border rounded"
                                        placeholder='กรุณากรอกเนื้อหา'
                                        value={agenda1}
                                        onChange={e => setAgenda1(e.target.value)}
                                        rows={2}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <h4 className="font-semibold mb-1">ระเบียบวาระที่ 2: รับรองรายงานการประชุม</h4>
                                    <textarea
                                        className="w-full p-2 border rounded"
                                        placeholder='กรุณากรอกเนื้อหา'
                                        value={agenda2}
                                        onChange={e => setAgenda2(e.target.value)}
                                        rows={2}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <h4 className="font-semibold mb-1">ระเบียบวาระที่ 3: เรื่องสืบเนื่อง</h4>
                                    <textarea
                                        className="w-full p-2 border rounded"
                                        placeholder='กรุณากรอกเนื้อหา'
                                        value={agenda3}
                                        onChange={e => setAgenda3(e.target.value)}
                                        rows={2}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <h4 className="font-semibold mb-1">ระเบียบวาระที่ 4: เรื่องแจ้งเพื่อทราบ</h4>
                                    <textarea
                                        className="w-full p-2 border rounded"
                                        placeholder='กรุณากรอกเนื้อหา'
                                        value={agenda4}
                                        onChange={e => setAgenda4(e.target.value)}
                                        rows={2}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <h4 className="font-semibold mb-1">ระเบียบวาระที่ 5: เรื่องนำเสนอเพื่อพิจารณา</h4>
                                    <textarea
                                        className="w-full p-2 border rounded"
                                        placeholder='กรุณากรอกเนื้อหา'
                                        value={agenda5}
                                        onChange={e => setAgenda5(e.target.value)}
                                        rows={2}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <h4 className="font-semibold mb-1">ระเบียบวาระที่ 6: เรื่องอื่นๆ</h4>
                                    <textarea
                                        className="w-full p-2 border rounded"
                                        placeholder='กรุณากรอกเนื้อหา'
                                        value={agenda6}
                                        onChange={e => setAgenda6(e.target.value)}
                                        rows={2}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                >
                                    สร้างเอกสาร
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal ฟอร์มสร้างเอกสาร 2 */}
                {showModal2 && (
<<<<<<< HEAD
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white p-7 rounded-2xl shadow-2xl max-w-2xl w-full relative border-2 border-blue-200 max-h-[90vh] overflow-y-auto">
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
=======
                    <div className="fixed inset-0 z-10 flex items-center justify-center bg-blue-200 bg-opacity-50">
                        <div className="bg-white p-7 rounded shadow-lg max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                onClick={() => setShowModal2(false)}
                                type="button"
                            >
                                ×
                            </button>
<<<<<<< HEAD
                            <h2 className="text-2xl font-bold mb-5 text-blue-700">สร้างเอกสารผู้เข้าร่วมประชุม</h2>
                            <div className="mb-6 grid grid-cols-2 gap-4">
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded-lg shadow"
=======
                            <h2 className="text-xl font-semibold mb-5">สร้างเอกสารผู้เข้าร่วมประชุม</h2>
                            
                            {/* ข้อมูลพื้นฐาน */}
                            <div className="mb-6">
                                <input
                                    type="date"
                                    className="w-full mb-3 p-2 border rounded"
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                    value={date2}
                                    onChange={e => setDate2(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="หัวข้อเอกสาร"
<<<<<<< HEAD
                                    className="w-full p-2 border rounded-lg shadow"
=======
                                    className="w-full mb-3 p-2 border rounded"
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                    value={title2}
                                    onChange={e => setTitle2(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="สถานที่ประชุม"
<<<<<<< HEAD
                                    className="w-full p-2 border rounded-lg shadow col-span-2"
=======
                                    className="w-full mb-3 p-2 border rounded"
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                    value={location2}
                                    onChange={e => setLocation2(e.target.value)}
                                    required
                                />
                            </div>
<<<<<<< HEAD
                            {/* ผู้นำประชุม */}
                            <div className="mb-6 border p-4 bg-indigo-50 rounded-xl shadow">
                                <div className="font-semibold mb-2 text-indigo-700">ผู้นำประชุม</div>
                                {leaders.map((row, idx) => (
                                    <div key={idx} className="flex gap-4 mb-2">
                                        <input
                                            className="flex-1 rounded-full p-2 border shadow"
=======

                            {/* ผู้นำประชุม */}
                            <div className="mb-6 border p-4 bg-gray-200">
                                <div className="font-semibold mb-2">ผู้นำประชุม</div>
                                {leaders.map((row, idx) => (
                                    <div key={idx} className="flex gap-4 mb-2">
                                        <input
                                            className="flex-1 rounded-full p-2"
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                            placeholder="รายชื่อ"
                                            value={row.name}
                                            onChange={e => handleChangeRow(setLeaders, idx, 'name', e.target.value)}
                                        />
                                        <input
<<<<<<< HEAD
                                            className="flex-1 rounded-full p-2 border shadow"
=======
                                            className="flex-1 rounded-full p-2"
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                            placeholder="ตำแหน่ง"
                                            value={row.position}
                                            onChange={e => handleChangeRow(setLeaders, idx, 'position', e.target.value)}
                                        />
                                        <input
<<<<<<< HEAD
                                            className="flex-1 rounded-full p-2 border shadow"
=======
                                            className="flex-1 rounded-full p-2"
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                            placeholder="บทบาท"
                                            value={row.role}
                                            onChange={e => handleChangeRow(setLeaders, idx, 'role', e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="flex items-center justify-center w-9 h-9 bg-red-100 hover:bg-red-300 text-red-600 rounded-full shadow transition-colors"
                                            onClick={() => handleRemoveRow(setLeaders, idx)}
                                            title="ลบรายชื่อ"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
<<<<<<< HEAD
                                    className="text-indigo-600 font-bold mt-1"
                                    onClick={() => handleAddRow(setLeaders)}
                                >+ เพิ่ม</button>
                            </div>
                            {/* ผู้ไม่มาประชุม */}
                            <div className="mb-6 border-2 border-black-400 p-4 bg-red-50 rounded-xl shadow">
                                <div className="font-semibold mb-2 text-red-700">ผู้ไม่มาประชุม</div>
                                {absents.map((row, idx) => (
                                    <div key={idx} className="flex gap-4 mb-2">
                                        <input
                                            className="flex-1 rounded-full p-2 border shadow"
=======
                                    className="text-blue-600 font-bold mt-1"
                                    onClick={() => handleAddRow(setLeaders)}
                                >+ เพิ่ม</button>
                            </div>

                            {/* ผู้ไม่มาประชุม */}
                            <div className="mb-6 border-2 border-black-400 p-4 bg-gray-100">
                                <div className="font-semibold mb-2">ผู้ไม่มาประชุม</div>
                                {absents.map((row, idx) => (
                                    <div key={idx} className="flex gap-4 mb-2">
                                        <input
                                            className="flex-1 rounded-full p-2"
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                            placeholder="รายชื่อ"
                                            value={row.name}
                                            onChange={e => handleChangeRow(setAbsents, idx, 'name', e.target.value)}
                                        />
                                        <input
<<<<<<< HEAD
                                            className="flex-1 rounded-full p-2 border shadow"
=======
                                            className="flex-1 rounded-full p-2"
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                            placeholder="ตำแหน่ง"
                                            value={row.position}
                                            onChange={e => handleChangeRow(setAbsents, idx, 'position', e.target.value)}
                                        />
                                        <input
<<<<<<< HEAD
                                            className="flex-1 rounded-full p-2 border shadow"
=======
                                            className="flex-1 rounded-full p-2"
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                            placeholder="บทบาท"
                                            value={row.role}
                                            onChange={e => handleChangeRow(setAbsents, idx, 'role', e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="flex items-center justify-center w-9 h-9 bg-red-100 hover:bg-red-300 text-red-600 rounded-full shadow transition-colors"
                                            onClick={() => handleRemoveRow(setAbsents, idx)}
                                            title="ลบรายชื่อ"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
<<<<<<< HEAD
                                    className="text-red-600 font-bold mt-1"
                                    onClick={() => handleAddRow(setAbsents)}
                                >+ เพิ่ม</button>
                            </div>
                            {/* ผู้ร่วมประชุม */}
                            <div className="mb-6 border p-4 bg-green-50 rounded-xl shadow">
                                <div className="font-semibold mb-2 text-green-700">ผู้ร่วมประชุม</div>
                                {participants.map((row, idx) => (
                                    <div key={idx} className="flex gap-4 mb-2">
                                        <input
                                            className="flex-1 rounded-full p-2 border shadow"
=======
                                    className="text-blue-600 font-bold mt-1"
                                    onClick={() => handleAddRow(setAbsents)}
                                >+ เพิ่ม</button>
                            </div>

                            {/* ผู้ร่วมประชุม */}
                            <div className="mb-6 border p-4 bg-gray-200">
                                <div className="font-semibold mb-2">ผู้ร่วมประชุม</div>
                                {participants.map((row, idx) => (
                                    <div key={idx} className="flex gap-4 mb-2">
                                        <input
                                            className="flex-1 rounded-full p-2"
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                            placeholder="รายชื่อ"
                                            value={row.name}
                                            onChange={e => handleChangeRow(setParticipants, idx, 'name', e.target.value)}
                                        />
                                        <input
<<<<<<< HEAD
                                            className="flex-1 rounded-full p-2 border shadow"
=======
                                            className="flex-1 rounded-full p-2"
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                            placeholder="ตำแหน่ง"
                                            value={row.position}
                                            onChange={e => handleChangeRow(setParticipants, idx, 'position', e.target.value)}
                                        />
                                        <input
<<<<<<< HEAD
                                            className="flex-1 rounded-full p-2 border shadow"
=======
                                            className="flex-1 rounded-full p-2"
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                            placeholder="บทบาท"
                                            value={row.role}
                                            onChange={e => handleChangeRow(setParticipants, idx, 'role', e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="flex items-center justify-center w-9 h-9 bg-red-100 hover:bg-red-300 text-red-600 rounded-full shadow transition-colors"
                                            onClick={() => handleRemoveRow(setParticipants, idx)}
                                            title="ลบรายชื่อ"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
<<<<<<< HEAD
                                    className="text-green-600 font-bold mt-1"
                                    onClick={() => handleAddRow(setParticipants)}
                                >+ เพิ่ม</button>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-lg"
=======
                                    className="text-blue-600 font-bold mt-1"
                                    onClick={() => handleAddRow(setParticipants)}
                                >+ เพิ่ม</button>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                    onClick={handleSubmit2}
                                    type="button"
                                >
                                    บันทึก
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* รายการเอกสาร */}
                <section>
<<<<<<< HEAD
                    <h2 className="text-2xl font-bold mb-4 text-indigo-700 text-center">รายการเอกสาร</h2>
                    {documents.length === 0 ? (
                        <p className="text-gray-500 text-center">ยังไม่มีเอกสาร</p>
                    ) : (
                        <>
                        <ul className="space-y-6">
                            {currentDocuments.map(doc => (
                                <li key={doc.id} className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100 hover:shadow-indigo-300 transition-shadow">
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <h3 className="font-bold text-xl text-indigo-800">{doc.title}</h3>
                                            <span className={`text-sm px-3 py-1 rounded-full font-semibold ${doc.type === 'agenda' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
=======
                    <h2 className="text-lg font-semibold mb-2">รายการเอกสาร</h2>
                    {documents.length === 0 ? (
                        <p className="text-gray-500">ยังไม่มีเอกสาร</p>
                    ) : (
                        <>
                        <ul className="space-y-4">
                            {currentDocuments.map(doc => (
                                <li key={doc.id} className="bg-white p-4 rounded shadow">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-lg">{doc.title}</h3>
                                            <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                                {doc.type === 'agenda' ? 'วาระการประชุม' : 'ผู้เข้าร่วมประชุม'}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">{doc.createdAt}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">
                                        <span>วันที่: {doc.date}</span> | <span>สถานที่: {doc.location}</span>
                                    </div>
<<<<<<< HEAD
                                    {/* แสดงเนื้อหาตามประเภทเอกสาร */}
                                    {doc.type === 'agenda' ? (
                                        <div className="mt-2 text-gray-700 whitespace-pre-line grid grid-cols-2 gap-4">
                                            {[doc.agenda1, doc.agenda2, doc.agenda3, doc.agenda4, doc.agenda5, doc.agenda6].map((agenda, idx) => (
                                                <div key={idx} className="mb-2">
                                                    <h4 className="font-semibold text-indigo-600">{`ระเบียบวาระที่ ${idx + 1}: ${[
                                                        "ประธานแจ้งให้ทราบ",
                                                        "รับรองรายงานการประชุม",
                                                        "เรื่องสืบเนื่อง",
                                                        "เรื่องแจ้งเพื่อทราบ",
                                                        "เรื่องนำเสนอเพื่อพิจารณา",
                                                        "เรื่องอื่นๆ"
                                                    ][idx]}`}</h4>
                                                    <div>{agenda}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="mt-2 text-gray-700 grid grid-cols-3 gap-4">
                                            {/* แสดงผู้นำประชุม */}
                                            {doc.leaders && doc.leaders.length > 0 && (
                                                <div className="mb-4 col-span-1">
                                                    <h4 className="font-semibold mb-2 text-indigo-700">ผู้นำประชุม:</h4>
                                                    <div className="grid gap-2">
                                                        {doc.leaders.map((leader, idx) => (
                                                            <div key={idx} className="bg-indigo-50 p-2 rounded shadow">
                                                                <span className="font-medium">{leader.name}</span>
                                                                {leader.position && <span className="text-gray-600"> - {leader.position}</span>}
                                                                {leader.role && <span className="text-indigo-600"> ({leader.role})</span>}
=======

                                    {/* แสดงเนื้อหาตามประเภทเอกสาร */}
                                    {doc.type === 'agenda' ? (
                                        <div className="mt-2 text-gray-700 whitespace-pre-line">
                                            <h4 className="font-semibold mt-2">ระเบียบวาระที่ 1: ประธานแจ้งให้ทราบ</h4>
                                            <div>{doc.agenda1}</div>
                                            <h4 className="font-semibold mt-2">ระเบียบวาระที่ 2: รับรองรายงานการประชุม</h4>
                                            <div>{doc.agenda2}</div>
                                            <h4 className="font-semibold mt-2">ระเบียบวาระที่ 3: เรื่องสืบเนื่อง</h4>
                                            <div>{doc.agenda3}</div>
                                            <h4 className="font-semibold mt-2">ระเบียบวาระที่ 4: เรื่องแจ้งเพื่อทราบ</h4>
                                            <div>{doc.agenda4}</div>
                                            <h4 className="font-semibold mt-2">ระเบียบวาระที่ 5: เรื่องนำเสนอเพื่อพิจารณา</h4>
                                            <div>{doc.agenda5}</div>
                                            <h4 className="font-semibold mt-2">ระเบียบวาระที่ 6: เรื่องอื่นๆ</h4>
                                            <div>{doc.agenda6}</div>
                                        </div>
                                    ) : (
                                        <div className="mt-2 text-gray-700">
                                            {/* แสดงผู้นำประชุม */}
                                            {doc.leaders && doc.leaders.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="font-semibold mb-2">ผู้นำประชุม:</h4>
                                                    <div className="grid gap-2">
                                                        {doc.leaders.map((leader, idx) => (
                                                            <div key={idx} className="bg-gray-100 p-2 rounded">
                                                                <span className="font-medium">{leader.name}</span>
                                                                {leader.position && <span className="text-gray-600"> - {leader.position}</span>}
                                                                {leader.role && <span className="text-blue-600"> ({leader.role})</span>}
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
<<<<<<< HEAD
                                            {/* แสดงผู้ไม่มาประชุม */}
                                            {doc.absents && doc.absents.length > 0 && (
                                                <div className="mb-4 col-span-1">
                                                    <h4 className="font-semibold mb-2 text-red-700">ผู้ไม่มาประชุม:</h4>
                                                    <div className="grid gap-2">
                                                        {doc.absents.map((absent, idx) => (
                                                            <div key={idx} className="bg-red-50 p-2 rounded shadow">
=======

                                            {/* แสดงผู้ไม่มาประชุม */}
                                            {doc.absents && doc.absents.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="font-semibold mb-2">ผู้ไม่มาประชุม:</h4>
                                                    <div className="grid gap-2">
                                                        {doc.absents.map((absent, idx) => (
                                                            <div key={idx} className="bg-red-50 p-2 rounded">
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                                                <span className="font-medium">{absent.name}</span>
                                                                {absent.position && <span className="text-gray-600"> - {absent.position}</span>}
                                                                {absent.role && <span className="text-red-600"> ({absent.role})</span>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
<<<<<<< HEAD
                                            {/* แสดงผู้ร่วมประชุม */}
                                            {doc.participants && doc.participants.length > 0 && (
                                                <div className="mb-4 col-span-1">
                                                    <h4 className="font-semibold mb-2 text-green-700">ผู้ร่วมประชุม:</h4>
                                                    <div className="grid gap-2">
                                                        {doc.participants.map((participant, idx) => (
                                                            <div key={idx} className="bg-green-50 p-2 rounded shadow">
=======

                                            {/* แสดงผู้ร่วมประชุม */}
                                            {doc.participants && doc.participants.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="font-semibold mb-2">ผู้ร่วมประชุม:</h4>
                                                    <div className="grid gap-2">
                                                        {doc.participants.map((participant, idx) => (
                                                            <div key={idx} className="bg-green-50 p-2 rounded">
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                                                <span className="font-medium">{participant.name}</span>
                                                                {participant.position && <span className="text-gray-600"> - {participant.position}</span>}
                                                                {participant.role && <span className="text-green-600"> ({participant.role})</span>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
<<<<<<< HEAD
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8 space-x-2">
=======
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6 space-x-2">
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
<<<<<<< HEAD
                                        className={`px-4 py-2 rounded-full font-bold shadow transition-colors ${
                                            currentPage === i + 1
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'
                                        }`}
=======
                                        className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
>>>>>>> 8e7eb8dffc68bbd36a79b141c1af865882ab880c
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                        </>
                    )}
                </section>
            </main>
        </div>
    );
}