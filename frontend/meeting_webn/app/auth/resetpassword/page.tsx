"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import { API_URL } from '@/server';

const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || "";

    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            toast.error("รหัสผ่านไม่ตรงกัน");
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_URL}/users/reset-password`, {
                email,
                otp,
                newPassword: password
            }, { withCredentials: true });
            toast.success("เปลี่ยนรหัสผ่านสำเร็จ! กรุณาเข้าสู่ระบบใหม่");
            router.push("/auth/login");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "เกิดข้อผิดพลาด");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full h-screen flex items-center justify-center flex-col'>
            <h1 className='text-xl text-gray-900 mb-4 font-medium'>รีเซ็ตรหัสผ่าน</h1>
            <form onSubmit={handleSubmit} className='w-full flex flex-col items-center'>
                <input
                    type="text"
                    placeholder="กรอกรหัส OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className='block w-[40%] mb-4 mx-auto rounded-lg bg-gray-300 px-4 py-3'
                    required
                />
                <input
                    type="password"
                    placeholder="รหัสผ่านใหม่"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='block w-[40%] mb-4 mx-auto rounded-lg bg-gray-300 px-4 py-3'
                    required
                />
                <input
                    type="password"
                    placeholder="ยืนยันรหัสผ่านใหม่"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className='block w-[40%] mb-4 mx-auto rounded-lg bg-gray-300 px-4 py-3'
                    required
                />
                {!loading ? (
                    <Button type="submit">รีเซ็ตรหัสผ่าน</Button>
                ) : (
                    <Button disabled>
                        <Loader className='animate-spin' />
                    </Button>
                )}
            </form>
        </div>
    );
};

export default ResetPassword;
