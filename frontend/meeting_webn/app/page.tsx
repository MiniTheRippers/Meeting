"use client";
import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { API_URL } from '@/server';
import { setAuthUser } from '@/store/authSlice';
import axios from 'axios';
import { toast } from 'sonner';
import { Sidebar } from 'lucide-react';
import { useRouter } from 'next/navigation';


const HomePage = () => {

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const logoutHandler = async () =>{
    await axios.post(`${API_URL}/users/logout`);
    dispatch(setAuthUser(null));
    toast.success("Logged out successfully");
  }

  return (
    <div className='h-[12vh] shadow-md'>
      <div className='w-[80%] mx-auto flex items-center justify-between h-full'>
        <h1 className='text-3xl font-bold uppercase'>LoGo</h1>
        { !user && <Link href ='/auth/signup' >

        <Button size={'lg'}>Register</Button>
        </Link>}
        {user && <div className='flex items-center space-x-2'>

          <Avatar onClick={logoutHandler} className='cursor-pointer'>
            <AvatarFallback className='font-bold uppercase'>
              {user && user.username ? user.username.charAt(0).toUpperCase() : ""}
            </AvatarFallback>
          </Avatar>
          <Button onClick={() => router.push('/dashboard')}>Dashboard</Button>
          
          
          </div>}
      </div>
      <h1 className='flex items-center justify-center h-[80vh] text-5xl font-bold'>HomePage</h1>
      
    </div>
  );
};

export default HomePage
