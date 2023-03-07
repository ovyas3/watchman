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
}
const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    backgroundColor: '#FCFCFC'
  }));
  

function VehicleGateIn({ vehicleNo, driver, mobile }: props) {
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
                    {showVehicle && <p className='text-[12px]'> - {vehicleNo}</p>}
                </div>
        </AccordionSummary>
        <AccordionDetails>
            <div className="flex flex-col gap-[16px]">
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
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default VehicleGateIn
