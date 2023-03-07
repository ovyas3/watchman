// import '../../styles/globals.css'

import Image from 'next/image'
import React, { useState } from 'react'
import notVerifiedIcon from '../../assets/not_verified_icon.svg';
type props = {
    vehicleNo: string,
    sin: string,
    soNumber: string,
    materials: string,
    carrier: string,
}

function VehicleIdentity({vehicleNo, sin, soNumber, materials, carrier}: props) {

    const [verified, setVerified] = useState(false);
    const handleVerification = () => {
        // handle verification
    }
    return (
        <div className="bg-[#fcfcfc]">
            <div className="body p-[20px] bg-[#fcfcfc] flex flex-col gap-[16px]">
                <div className="header  ">
                    <p className='text-[#131722] text-[18px] font-bold'>Vehicle identity and reporting</p>
                </div>
                <div className="detailsSection">
                    <div className="label">
                        Vehicle Number
                    </div>
                    <div className="value flex gap-[8px] items-center ">
                        <p>
                            {vehicleNo}
                        </p>
                        {!verified ? ( <>
                        <Image
                            src={notVerifiedIcon}
                            alt=""
                            width={16}
                            height={16} /><p className='text-[10px] text-[#E24D65] font-normal cursor-pointer' onClick={handleVerification}>
                                Verify Vehicle Details
                            </p>
                            </>): (
                             <>
                             <Image
                                    src={notVerifiedIcon}
                                    alt=""
                                    width={16}
                                    height={16} /><p className='text-[10px] text-[#2962FF] font-normal cursor-pointer' onClick={handleVerification}>
                                        Verify Vehicle Details
                                    </p>
                                    </>
                        )}
                    </div>
                </div>
                <div className="detailsSection">
                    <div className="label">
                        Transporter Name
                    </div>
                    <div className="value">
                        {carrier}
                    </div>
                </div>
                <div className="detailsSection">
                    <div className="label">
                        SIN No
                    </div>
                    <div className="value">
                        {sin}
                    </div>
                </div>
                <div className="detailsSection">
                    <div className="label">
                        SO No
                    </div>
                    <div className="value">
                        {soNumber}
                    </div>
                </div>
                <div className="detailsSection">
                    <div className="label">
                        Materials
                    </div>
                    <div className="value">
                        {materials}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VehicleIdentity
