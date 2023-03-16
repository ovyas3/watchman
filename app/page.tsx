'use client'

// import '../styles/globals.css'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import logo from '../assets/factoryLogo.png';
import { useRouter } from 'next/router';
import Link from 'next/link'
import { useSession } from 'next-auth/react';
import { useSnackbar, SnackbarComponent } from './hooks/snackBar';
function HomePage() {
    const { data: session } = useSession();
    const { showSnackbar, snackbarState } = useSnackbar();
    
  
    const [parent, setParent] = useState<any>('');
    const [unit, setUnit] = useState<any>('');
    const [validVehicle, setValidVehicle] = useState(false);
    // const router = useRouter();
    const [vehicleNo, setVehicleNo] = useState('');
const handleClick = () => {
    
    if (!vehicleNo){
    //  setValidVehicle(false);
        showSnackbar('Enter a vehicle number!', 'error');
    } else {
        // setValidVehicle(true);
    }
  };

  const handleOnChange = (event: any) => {
    const vehicle = event.target.value;
    setVehicleNo(vehicle);
    if (!vehicle) setValidVehicle(false);
    else setValidVehicle(true);
  }
    useEffect(() => {
        let units: { parent_name: string, name: string }[] | undefined = session?.user?.data.shippers.filter((s: any) => s._id === session.user.data.default_unit);
        if (units && units.length > 0) {
            setParent(units[0].parent_name);
            setUnit(units[0].name);
        }
    })






    return (
        <div className='flex flex-col justify-between p-[20px] h-screen w-screen bg-[#fcfcfc]'>
            <SnackbarComponent {...snackbarState} />
            <div className="top flex items-center justify-between w-full">
                <div className="left">
                    <p className='font-bold text-[14px] text-[#131722] '>{parent}</p>
                    <p className='font-normal text-[18px] text-[#131722] '>{unit}</p>
                </div>
                <div className="right">
                    <Image
                        src={logo}
                        alt=""
                        width={96}
                        height={96}
                    />
                </div>
            </div>
            <div className="bottom flex flex-col items-left justify-center w-full gap-[64px] mb-[56px]">
                <div className="vehicleDetails flex flex-col gap-[4px]">
                    <div className="label">
                        Vehicle number
                    </div>
                    <div className="input w-full h-[48px]">
                        <input className='w-full h-full pl-[16px] border rounded-[6px] border-[#DFE3EB] outline-none' type="text" placeholder='KA 22 EP 9990'
                            value={vehicleNo} onChange={handleOnChange}
                        />
                    </div>
                </div>
                {validVehicle ? (<Link
                    href={{
                        pathname: '/securityForm',
                        query: { vehicleNo }
                    }}
                >
                    <div className="button flex items-center justify-center bg-[#2962FF] border rounded-[6px] w-full h-[48px]" onClick={handleClick}>
                        <button className='text-white'>CONTINUE</button>
                    </div>
                    </Link>) : (
                        <div className="button flex items-center justify-center bg-[#2962FF] border rounded-[6px] w-full h-[48px]" onClick={handleClick}>
                        <button className='text-white'>CONTINUE</button>
                    </div>
                    )}
            </div>
        </div>
    )
}

export default HomePage
