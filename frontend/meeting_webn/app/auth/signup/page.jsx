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

const Signup = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    const[loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username:"",
        email:"",
        password:"",
        passwordConfirm:"",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        // เช็ค password กับ confirm password
        if (formData.password !== formData.passwordConfirm) {
            alert("รหัสผ่านไม่ตรงกัน");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/users/signup`,
                {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    passwordConfirm: formData.passwordConfirm,
                },
                { withCredentials: true },
            );
            dispatch(setAuthUser(response.data.data.user));
            handleSignupSuccess();
        } catch (error) {
            if (error.response) {
                alert("Error: " + (error.response.data.message || JSON.stringify(error.response.data)));
            } else if (error.request) {
                alert("No response from server. Please check your API server.");
            } else {
                alert("Error: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignupSuccess = () => {
        setMessage("สมัครสมาชิกสำเร็จ กรุณาตรวจสอบอีเมลของคุณ");
        setTimeout(() => {
            setMessage("");
            router.push("/auth/verify");
        }, 2000);
    };

    return (
        <div className='flex items-center justify-center h-screen bg-gray-100'>
            <div className='shadow-md rounded-lg w-[80%] sm:w-[350px] md:w-[350px] lg:w-[450px] p-8 bg-white'>
                <h1 className='text-center font-bold text-3xl mb-4 mt-4'>LOGO</h1>
                <form onSubmit={submitHandler}>
                    <div>
                        <label htmlFor="username" className='block mb-2 text-sm font-bold'>Username</label>
                        <input type="text" name='username' placeholder='Username' value={formData.username} onChange={handleChange} className='px-4 py-2 bg-gray-200 rounded-mb outline-none w-full'/>
                    </div>
                    <div className='mt-4'>
                        <label htmlFor="email" className='block mb-2 text-sm font-bold'>Email</label>
                        <input type="email" name='email' placeholder='Email' value={formData.email} onChange={handleChange} className='px-4 py-2 bg-gray-200 rounded-mb outline-none w-full'/>
                    </div>
                    <div className='mt-4'>
                        <label htmlFor="password" className='block mb-2 text-sm font-bold'>Password</label>
                        <input type="password" name='password' placeholder='Password' value={formData.password} onChange={handleChange} className='px-4 py-2 bg-gray-200 rounded-mb outline-none w-full'/>
                    </div>
                    <div className='mt-4'>
                        <label htmlFor="passwordconfirm" className='block mb-2 text-sm font-bold'>Confirm Password</label>
                        <input type="password" name='passwordConfirm' placeholder='Confirm Password' value={formData.passwordConfirm} onChange={handleChange} className='px-4 py-2 bg-gray-200 rounded-mb outline-none w-full'/>
                    </div>
                    {!loading ? (
                        <button type='submit' className='mt-6 w-full' size={'lg'}>Submit</button>
                    ) : (
                        <button className='mt-6 w-full' disabled>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading...
                        </button>
                    )}
                </form>
                {message && (
                    <div style={{ color: "green", marginBottom: 10 }}>{message}</div>
                )}
                <h1 className='mt-6 text-center'>Already have account?{" "}
                    <Link href='/auth/login'>
                    <span className='text-blue-600 cursor-pointer'>Login
                </span>
                </Link>
                </h1>
            </div>
        </div>
    )
}

export default Signup
