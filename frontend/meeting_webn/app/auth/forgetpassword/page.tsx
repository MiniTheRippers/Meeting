"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import { API_URL } from '@/server';

const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/users/forget-password`, { email }, { withCredentials: true });
            toast.success('รหัส OTP สำหรับรีเซ็ตรหัสผ่านถูกส่งไปที่อีเมลของคุณแล้ว');
            router.push(`/auth/resetpassword?email=${encodeURIComponent(email)}`);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "เกิดข้อผิดพลาด");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full h-screen flex items-center justify-center flex-col'>
            <h1 className='text-xl text-gray-900 mb-4 font-medium'>กรอกอีเมลเพื่อขอรหัส OTP สำหรับรีเซ็ตรหัสผ่าน</h1>
            <form onSubmit={handleSubmit} className='w-full flex flex-col items-center'>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='block w-[40%] mb-4 mx-auto rounded-lg bg-gray-300 px-4 py-3'
                    required
                />
                {!loading ? (
                    <Button type="submit">ขอรหัส OTP</Button>
                ) : (
                    <Button disabled>
                        <Loader className='animate-spin' />
                    </Button>
                )}
            </form>
        </div>
    );
};

export default ForgetPassword;
