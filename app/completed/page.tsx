'use client'
import Link from 'next/link';
import React, { useState } from 'react'
import { useSpring, animated } from 'react-spring';

function completed() {
    const [completed, setCompleted] = useState(true);
    const handleComplete = () => {

    };




  return (
    <div className='flex items-center justify-center flex-col w-screen h-screen'>
    <div className='flex items-center justify-center text-[24px] text-blue-600 w-full h-screen'>Completed</div>
    <Link
                    href={{
                        pathname: '/',
                    }}
                    className="w-full px-[20px] py-[56px] "
                >
                    <div className="button flex items-center justify-center bg-[#2962FF] border rounded-[6px] w-full h-[48px]">
                        <button className='text-white'>Return to home</button>
                    </div>
                    </Link>
            </div>
  )
}

export default completed