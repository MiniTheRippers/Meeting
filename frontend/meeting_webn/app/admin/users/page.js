// frontend/meeting_webn/app/admin/users/page.js

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; // Use 'next/navigation' for App Router
import Sidebar from '@/components/Sidebar';
import Topbar from "@/components/Topbar";
import axios from 'axios';
import { useAuth } from '@/lib/authContext'; // Assuming authContext is in lib

export default function AdminUserPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [users, setUsers] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUsers(response.data);
        } catch (err) {
            setError("ไม่สามารถดึงข้อมูลผู้ใช้งานได้");
            console.error(err);
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        // Redirect if not an admin
        if (!loading && (!user || (user.role !== 'admin' && !user.is_admin))) {
            router.push('/');
        }
        // Fetch users once the user data is loaded and they are an admin
        if (user && (user.role === 'admin' || user.is_admin)) {
            fetchUsers();
        }
    }, [user, loading, router]);

    const handleEditClick = (user) => {
        setCurrentUser(user);
        setShowEditModal(true);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!currentUser || !newPassword) {
            alert("กรุณากรอกรหัสผ่านใหม่");
            return;
        }

        try {
            await axios.put(`http://localhost:8000/api/users/password/${currentUser._id}`, {
                password: newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert("แก้ไขรหัสผ่านสำเร็จ!");
            setShowEditModal(false);
            setNewPassword('');
            fetchUsers();
        } catch (err) {
            alert("แก้ไขรหัสผ่านไม่สำเร็จ");
            console.error(err);
        }
    };

    if (loading || (!user || !user.is_admin)) {
        return <div className="text-center mt-20">Loading...</div>;
    }

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Topbar />
            <Sidebar />
            <main className="flex-1 p-8 pt-[56px] pl-[80px]">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">ผู้ใช้งานระบบ</h1>
                
                {pageLoading && (
                    <div className="text-center text-gray-500">กำลังโหลดข้อมูล...</div>
                )}

                {error && (
                    <div className="text-center text-red-500">{error}</div>
                )}

                {!pageLoading && !error && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ลำดับ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ชื่อผู้ใช้งาน
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        อีเมล
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        สถานะ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        การจัดการ
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user, index) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {user.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                (user.role === 'admin' || user.is_admin) ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {(user.role === 'admin' || user.is_admin) ? 'Admin' : 'User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                แก้ไขรหัสผ่าน
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
            
            {/* Edit User Modal */}
            {showEditModal && currentUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl p-8 w-96 shadow-lg relative">
                        <h2 className="text-xl font-bold mb-4">แก้ไขรหัสผ่านสำหรับ {currentUser.username}</h2>
                        <form onSubmit={handlePasswordChange}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-password">
                                    รหัสผ่านใหม่
                                </label>
                                <input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg focus:outline-none hover:bg-gray-400"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none hover:bg-indigo-700"
                                >
                                    บันทึก
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}