import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { DateTime } from 'luxon';

type props = {
  vehicleNo: string,
  driver: string,
  mobile: string,
  trackingMethod: string,
  lastLocation: string,
  lastLocationAt: string,
  SIN: string,
}
const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    backgroundColor: '#FCFCFC',
    borderRadius: '12px'
  }));


function VehicleGateIn({ vehicleNo, driver, mobile, trackingMethod, lastLocation, lastLocationAt, SIN }: props) {
    const [expanded, setExpanded] = useState(true);
    const handleIconClick = () => {
        setExpanded(!expanded);
    };

    const convertUTCToIST = (utcDateString: any) => {
        const date = DateTime.fromISO(utcDateString, { zone: 'utc' }).plus({ hours: 5, minutes: 30 });
        if (!date.isValid) {
          return 'Invalid date';
        }
        return date.toFormat('dd-MMM-yyyy hh:mm a');
    };
    
    const formattedLastLocationAt = lastLocationAt ? convertUTCToIST(lastLocationAt) : 'N/A';

  return (
    <div>
        <Accordion expanded={expanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          onClick={handleIconClick}
        >
         <div className="header flex items-center gap-[4px]">
                    <p className='text-[#3D3D3D] text-[14px] font-semibold'>Vehicle/Driver </p>
                    {/* {showVehicle && <p className='text-[12px]'> - {vehicleNo}</p>} */}
                </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex gap-[16px]">
            <div className="left flex flex-col gap-[16px] w-[50%]">
              <div className="detailsSection">
                    <div className="label" style={{color: '#71747A'}}>
                        Vehicle Number
                    </div>
                    <div className="value flex gap-[8px] items-center" style={{color: '#3D3D3D'}}>

                        {vehicleNo || 'N/A'}


                    </div>
                </div>

                
                <div className="detailsSection">
                    <div className="label" style={{color: '#71747A'}}>
                        Driver
                    </div>
                    <div className="value" style={{color: '#3D3D3D'}}>
                        {driver || 'N/A'}
                    </div>
                </div>
                <div className="detailsSection">
                    <div className="label" style={{color: '#71747A'}}>
                        Mobile
                    </div>
                    <div className="value" style={{color: '#3D3D3D'}}>
                        {mobile || 'N/A'}
                    </div>
                </div>
            </div>
            <div className="right flex flex-col gap-[16px] w-[50%]">

                <div className="detailsSection">
                    <div className="label" style={{color: '#71747A'}}>
                        Tracking Method
                    </div>
                    <div className="value flex gap-[8px] items-center " style={{color: '#3D3D3D'}}>
                        
                        {trackingMethod || 'N/A'}

                        
                    </div>
                </div>
                
                <div className="detailsSection">
                    <div className="label" style={{color: '#71747A'}}>
                        SIN Number
                    </div>
                    <div className="value" style={{color: '#3D3D3D'}}>
                        {SIN || 'N/A'}
                    </div>
                </div>
                
                <div className="detailsSection">
                    <div className="label" style={{color: '#71747A'}}>
                        Last Location At
                    </div>
                    <div className="value" style={{color: '#3D3D3D'}}>
                        {formattedLastLocationAt || 'N/A'}
                    </div>
                </div>
                <div className="detailsSection">
                    <div className="label" style={{color: '#71747A'}}>
                        Last Location
                    </div>
                    <div className="value" style={{color: '#3D3D3D'}}>
                        {lastLocation?.replace('Unnamed Road,', '') || 'N/A'}
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
