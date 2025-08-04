'use client';
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner';
import axios from 'axios';
import { API_URL } from '@/server';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';
import { Loader } from 'lucide-react';

export default function VerifyPage() {
    const [otp,setOtp]=useState<string[]>(["","","",""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [loading,setLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const user = useSelector((state:RootState)=>state.auth.user);

    useEffect(()=>{
        if (!user) router.replace("/auth/signup");
    },[user,router]);

    const handleChange=(index:number,event:ChangeEvent<HTMLInputElement>):void =>{
        const { value } = event.target;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if(value.length ===1 && inputRefs.current[index+1]){
            inputRefs.current[index+1]?.focus();
        }
    }

    const handleKeyDown =(index:number,event:KeyboardEvent<HTMLInputElement>):void =>{
        if(event.key ==='Backspace' && !inputRefs.current[index]?.value && inputRefs.current[index-1]){
            inputRefs.current[index-1]?.focus();
        }
    }

    const handleSubmit = async()=>{
        setLoading(true);
        try {
            const otpValue = otp.join("")
            const response = await axios.post(`${API_URL}/users/verify`,{otp:otpValue},{withCredentials:true})

            const verifyUser = response.data.data.user;
            dispatch(setAuthUser(verifyUser))
            toast.success("Verification Successfull")
            router.push("/");

        } catch (error:any) {
            toast.error(error.response.data.message);
        }finally {
            setLoading(false)
        }
    }

    const handleResendOtp = async()=>{
        setLoading(true);
        try {
            await axios.post(`${API_URL}/users/resend-otp`,null,{withCredentials:true})
            toast.success('New Otp is send to your email')
        } catch (error:any) {
            toast.error(error.response.data.message);
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-2xl mb-4 font-semibold'>Enter your email to verify your account</h1>
            <div className='flex space-x-4'>
                {[1,2,3,4].map((index)=>{
                return <input type='number' key={index} maxLength={1} 
                value={otp[index]}
                onChange={(e) => handleChange(index,e)}
                ref={(el)=>{
                    inputRefs.current[index] = el;
                }}
                onKeyDown={(e)=>handleKeyDown(index,e)}
                className='w-20 h-20 rounded-lg bg-gray-200 text-3xl font-bold text-center no-spinner'/>
            })}</div>

            { !loading && <div className='flex items-center space-x-4 mt-6'>
                <Button onClick={handleSubmit} variant={"default"}>Submit</Button>
                <Button onClick={handleResendOtp} className='bg-orange-600'>Resend OTP</Button>
            </div>}

            {loading && (<Button className='mt-6'>
                <Loader className='animate-spin'/>
            </Button>)}

        </div>
    )
}
