'use client'

// import '../styles/globals.css'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import logo from '../assets/factoryLogo.png';
import factory from '../assets/factory_illustration.svg';
import factoryIcon from '../assets/factory_icon.svg';
import { useRouter } from 'next/router';
import Link from 'next/link'
import { useSession } from 'next-auth/react';
import { useSnackbar, SnackbarComponent } from './hooks/snackBar';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function HomePage() {
    const { data: session } = useSession();
    const { showSnackbar, snackbarState } = useSnackbar();
    
  
    const [parent, setParent] = useState<any>('');
    const [unit, setUnit] = useState<any>('');
    const [validVehicle, setValidVehicle] = useState(false);
    // const router = useRouter();
    const [vehicleNo, setVehicleNo] = useState('');
const handleClick = async () => {
    
    if (!vehicleNo){
    //  setValidVehicle(false);
        toast.error('Please enter a valid vehicle number', { hideProgressBar: true, autoClose: 2000, type: 'error' });
        // toast.error('Please enter a valid vehicle number', { hideProgressBar: true, autoClose: 2000, type: 'error' });
    } else {
        const response = await fetch('https://dev-api.instavans.com/api/thor/security/get_vehicle_details?' + new URLSearchParams({vehicle_no: vehicleNo}), {
      method: 'GET',
      headers: {
          'Authorization': `bearer ${session?.user.data.accessToken} Shipper ${session?.user.data.default_unit}`,
          'Content-Type': 'application/json',
      },
      });
        const data = await response.json();
        if (data.statusCode == 500) { 
            toast.error('Vehicle not found', { hideProgressBar: true, autoClose: 2000, type: 'error' });
            setValidVehicle(false);
        }
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
        <><ToastContainer />
            <div className='md:flex md:flex-row-reverse justify-between gap-[80px] p-[20px] h-screen w-screen bg-[#fcfcfc]'>
                <SnackbarComponent {...snackbarState} />
                <div className="bodyRight flex items-center justify-center flex-[0.6] bg-[#F0F3F9]">
                    <Image
                        src={factory}
                        alt=""
                        // width={96}
                        // height={96}
                    />
                </div>
                <div className="bodyLeft flex flex-col gap-[80px] flex-[0.4]">
            {/* <div className="top flex items-center justify-between w-full">
                
            </div> */}
            <div className="bottom md:mt-[64px] flex flex-col items-left justify-center w-full gap-[56px]">
                <div className="vehicleDetails flex flex-col gap-[64px]">
                    <div className="label text-[#131722] text-[32px] font-bold">
                        Vehicle security check
                    </div>
                            <div className="inputContainer flex flex-col gap-[24px]">
                                <div className="containerTop flex gap-2">
                                    <div className="right">
                    <Image
                        src={factoryIcon}
                        alt=""
                        width={24}
                        height={24} />
                </div>
                                     <div className="left">
                    <p className='font-bold text-[12px] text-[#71747A] '>{parent}</p>
                    <p className='font-normal text-[16px] text-[#131722] '>{unit}</p>
                </div>
                
                                </div>
                                <div className="containerBottom">
                                    <div className="input w-full h-[56px]">
                        <input className='w-full h-full pl-[16px] border rounded-[6px] border-[#DFE3EB] outline-none' type="text" placeholder='KA 22 EP 9990'
                            value={vehicleNo} onChange={handleOnChange} />
                    </div>
                                </div>
                               
                            </div>
                    
                </div>
                {validVehicle ? (<Link
                    href={{
                        pathname: '/securityForm',
                        query: { vehicleNo }
                    }}
                >
                    <div className="button flex items-center justify-center bg-[#2962FF] border rounded-[6px] w-[152px] h-[56px]" onClick={handleClick}>
                        <button className='text-white'>CONTINUE</button>
                    </div>
                </Link>) : (
                    <div className="button flex items-center justify-center bg-[#2962FF] border rounded-[6px] w-[152px] h-[56px]" onClick={handleClick}>
                        <button className='text-white'>CONTINUE</button>
                    </div>
                )}
                    </div>
                </div>
                
        </div></>
    )
}

export default HomePage
