"use client"

import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Shield, UserCircle } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useContext } from 'react'
import Link from 'next/link'
import { CourseCountContext } from '@/app/_context/CourseCountContext'

function SideBar() {
  const MenuList = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      name: 'Upgrade',
      icon: Shield,
      path: '/dashboard/upgrade',
    },
    {
      name: 'Profile',
      icon: UserCircle,
      path: '/dashboard/profile',
    },
  ];

  const {totalCourse,setTotalCourse}=useContext(CourseCountContext);
  const path = usePathname();

  return (
    <div className='h-screen shadow-md p-5 relative'>
      {/* Logo */}
      <div className='flex gap-2 items-center'>
        <Image src={'/logo.svg'} alt='logo' width={40} height={40} />
        <h2 className="font-bold text-2xl">Learnify</h2>
      </div>

      {/* Create New Button */}
      <div className='mt-10'>
        <Link href={'/create'} className="w-full">
          <Button className="w-full">+ Create New</Button>
        </Link>
      </div>

      {/* Menu List */}
      <div className='mt-5'>
        {MenuList.map((menu, index) => (
          <Link
            key={index}
            href={menu.path}
            className={`flex gap-5 items-center p-3 hover:bg-slate-200 rounded-lg cursor-pointer mt-3
              ${path === menu.path ? 'bg-slate-200' : ''}`}
          >
            <menu.icon />
            <h2>{menu.name}</h2>
          </Link>
        ))}
      </div>

      {/* Credit Box */}
      <div className='border p-5 bg-slate-100 rounded-lg absolute bottom-10 w-[85%]'>
        <h2 className='text-lg'>Available Credits : {(5-totalCourse)}</h2>
        <Progress value={(totalCourse/5)*100} />
        <h2 className='mt-2'>{totalCourse} out of 5 Credits used</h2>

        <Link href={'/dashboard/upgrade'} className='text-primary text-xs mt-3 inline-block'>
          Upgrade to create more
        </Link>
      </div>
    </div>
  )
}

export default SideBar
