'use client'
import React, { useState } from 'react'
import { useSpring, animated } from 'react-spring';

function completed() {
    const [completed, setCompleted] = useState(true);
    const completedSpring = useSpring({
        opacity: completed ? 1 : 0,
        transform: completed ? 'scale(1)' : 'scale(0.8)',
      });
  return (
    <div className='flex items-center justify-center text-[24px] text-blue-600 w-full h-screen'>Completed</div>
  )
}

export default completed