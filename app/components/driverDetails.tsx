// import '../../styles/globals.css'

import Image from 'next/image'
import React, { useState } from 'react'
import notVerifiedIcon from '../../assets/not_verified_icon.svg';


function DriverDetails() {

    const [verified, setVerified] = useState(false);
    const handleVerification = () => {
        // handle verification
    }
    return (
        <div className="bg-[#fcfcfc]">
            <div className="body p-[20px] bg-[#fcfcfc] flex flex-col gap-[16px]">
                <div className="header">
                    <p className='text-[#131722] text-[18px] font-bold'>Driver details</p>
                </div>
                <div className="detailsSection">
                    <div className="label">
                        Driver Name
                    </div>
                    <div className="value flex gap-[8px] items-center ">
                        <p>
                            Ramesh
                        </p>
                        {!verified ? ( <>
                        <Image
                            src={notVerifiedIcon}
                            alt=""
                            width={16}
                            height={16} /><p className='text-[10px] text-[#E24D65] font-normal cursor-pointer' onClick={handleVerification}>
                                Verify driver details
                            </p>
                            </>): (
                             <>
                             <Image
                                    src={notVerifiedIcon}
                                    alt=""
                                    width={16}
                                    height={16} /><p className='text-[10px] text-[#2962FF] font-normal cursor-pointer' onClick={handleVerification}>
                                       Verify driver details
                                    </p>
                                    </>
                        )}
                    </div>
                </div>
                <div className="detailsSection">
                    <div className="label">
                        Driver number
                    </div>
                    <div className="value">
                        8123475404
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DriverDetails
