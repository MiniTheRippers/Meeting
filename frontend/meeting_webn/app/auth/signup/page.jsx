"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button' // ต้องแน่ใจว่า component นี้ใช้งานได้
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setAuthUser } from '@/store/authSlice';

// กำหนด API_URL โดยตรงหรือในไฟล์ environment
const API_URL = "http://localhost:8000"; // แก้ไขตาม API จริงของคุณ

const Signup = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        passwordConfirm: "",
        role: "user", // เพิ่ม role default เป็น user
    });
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsError(false);

        if (formData.password !== formData.passwordConfirm) {
            setMessage("รหัสผ่านไม่ตรงกัน");
            setIsError(true);
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/api/v1/users/signup`,
                {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    passwordConfirm: formData.passwordConfirm,
                    role: formData.role, // ส่ง role ไป backend
                },
                { withCredentials: true },
            );
            dispatch(setAuthUser(response.data.data.user));
            handleSignupSuccess();
        } catch (error) {
            let errorMessage = "เกิดข้อผิดพลาดไม่ทราบสาเหตุ";
            if (error.response) {
                errorMessage = error.response.data.message || JSON.stringify(error.response.data);
            } else if (error.request) {
                errorMessage = "ไม่ได้รับการตอบกลับจากเซิร์ฟเวอร์ โปรดตรวจสอบ API Server ของคุณ";
            } else {
                errorMessage = error.message;
            }
            setMessage(errorMessage);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSignupSuccess = () => {
        setMessage("สมัครสมาชิกสำเร็จ กำลังนำไปยังหน้ายืนยัน...");
        setIsError(false);
        setTimeout(() => {
            setMessage("");
            router.push("/auth/verify");
        }, 2000);
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100 p-4'>
            <div className='shadow-xl rounded-xl w-full sm:w-[400px] p-8 bg-white'>
                <h1 className='text-center font-bold text-4xl mb-2 text-gray-800'>LOGO</h1>
                <p className="text-center text-gray-500 mb-6">สร้างบัญชีผู้ใช้ใหม่</p>

                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <label htmlFor="username" className='block mb-1 text-sm font-semibold text-gray-700'>Username</label>
                        <input
                            type="text"
                            name='username'
                            placeholder='กรุณากรอกชื่อผู้ใช้งาน'
                            value={formData.username}
                            onChange={handleChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className='block mb-1 text-sm font-semibold text-gray-700'>Email</label>
                        <input
                            type="email"
                            name='email'
                            placeholder='กรุณากรอกอีเมล'
                            value={formData.email}
                            onChange={handleChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className='block mb-1 text-sm font-semibold text-gray-700'>Password</label>
                        <input
                            type="password"
                            name='password'
                            placeholder='กรุณากรอกรหัสผ่าน'
                            value={formData.password}
                            onChange={handleChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
                        />
                    </div>
                    <div>
                        <label htmlFor="passwordConfirm" className='block mb-1 text-sm font-semibold text-gray-700'>Confirm Password</label>
                        <input
                            type="password"
                            name='passwordConfirm'
                            placeholder='กรุณายืนยันรหัสผ่าน'
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
                        />
                    </div>
                    <div>
                        <label htmlFor="role" className='block mb-1 text-sm font-semibold text-gray-700'>ประเภทผู้ใช้</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    {!loading ? (
                        <button
                            type='submit'
                            className='mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200'
                            size={'lg'}>
                            สมัครสมาชิก
                        </button>
                    ) : (
                        <button
                            className='mt-6 w-full bg-blue-500 text-white font-semibold py-2 rounded-lg shadow-md'
                            disabled>
                            <Loader2 className="h-5 w-5 animate-spin mx-auto text-white" />
                        </button>
                    )}
                </form>

                {message && (
                    <div className={`mt-4 p-3 rounded-lg text-center ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}
                
                <p className='mt-6 text-center text-sm text-gray-600'>
                    มีบัญชีอยู่แล้ว?{" "}
                    <Link href='/auth/login'>
                        <span className='text-blue-600 font-semibold hover:underline cursor-pointer'>
                            เข้าสู่ระบบที่นี่
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Signup