"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { API_URL } from '@/server'
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setAuthUser } from '@/store/authSlice';
import { toast } from 'sonner';

const Login = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/users/login`, {
                email: formData.email,
                password: formData.password
            }, { withCredentials: true });
            dispatch(setAuthUser(res.data.user));
            toast.success("เข้าสู่ระบบสำเร็จ");
            router.push("/");
        } catch (error) {
            toast.error(error?.response?.data?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={submitHandler} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">LOGO</h2>
                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : "เข้าสู่ระบบ"}
                </Button>
                <div className="flex justify-between mt-4">
                    <Link href="/auth/forgetpassword" className="text-sm text-red-500">Forget password</Link>
                    <Link href="/auth/signup" className="text-sm text-blue-500">สมัครสมาชิก</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
