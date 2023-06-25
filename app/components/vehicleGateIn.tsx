import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';

type props = {
  vehicleNo: string,
  driver: string,
  mobile: string,
  trackingMethod: string,
  lastLocation: string,
  lastLocationAt: string,
}
const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    backgroundColor: '#FCFCFC',
    borderRadius: '12px'
  }));
  

function VehicleGateIn({ vehicleNo, driver, mobile, trackingMethod, lastLocation, lastLocationAt }: props) {
    const [showVehicle, setShowVehicle] = useState(true);
    const handleIconClick = () => {
        setShowVehicle(!showVehicle);
    };
  return (
    <div>
        <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          onClick={handleIconClick}
        >
         <div className="header flex items-center gap-[4px]">
                    <p className='text-[#131722] text-[18px] font-bold'>Vehicle/Driver </p>
                    {/* {showVehicle && <p className='text-[12px]'> - {vehicleNo}</p>} */}
                </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex gap-[16px]">
            <div className="left flex flex-col gap-[16px] w-[50%]">
              <div className="detailsSection">
                    <div className="label">
                        Vehicle Number
                    </div>
                    <div className="value flex gap-[8px] items-center ">
                        
                            {vehicleNo}
                        
                        
                    </div>
                </div>
                
                
                <div className="detailsSection">
                    <div className="label">
                        Driver
                    </div>
                    <div className="value">
                        {driver}
                    </div>
                </div>
                <div className="detailsSection">
                    <div className="label">
                        Mobile
                    </div>
                    <div className="value">
                        {mobile}
                    </div>
                </div>
            </div>
            <div className="right flex flex-col gap-[16px] w-[50%]">

        <div className="detailsSection">
                    <div className="label">
                        Tracking Method
                    </div>
                    <div className="value flex gap-[8px] items-center ">
                        
                            {trackingMethod}
                        
                        
                    </div>
                </div>
                
                
                <div className="detailsSection">
                    <div className="label">
                        Last Location At
                    </div>
                    <div className="value">
                        {lastLocationAt}
                    </div>
                </div>
                <div className="detailsSection">
                    <div className="label">
                        Last Location
                    </div>
                    <div className="value">
                        {lastLocation}
                    </div>
                </div>
            </div>
                </div>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default VehicleGateIn
