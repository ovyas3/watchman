'use client'
import React, { useEffect, useRef, useState } from 'react'
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import VehicleIdentity from '../components/vehicleIdentity';
import DriverDetails from '../components/driverDetails';
import TextField from '@mui/material/TextField';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { signOut } from 'next-auth/react';

import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';

import Checkbox from '@mui/material/Checkbox';
import VehicleGateIn from '../components/vehicleGateIn';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
type props = {
  searchParams: any,
};
const steps = [
  'Vehicle Identity And Reporting',
  'Vehicle Gate In',
  'Loading In And Billing Activity',
  'Loading Out And Billing Activity',
  'Vehicle Gate Out Activity'
];
function SecurityForm({ searchParams }: props) {
  const { data: session } = useSession();
  const [vehicleNo, setVehicleNo] = useState(searchParams.vehicleNo);
  const [shipment, setShipment] = useState<any>({});
  const [securityCheck, setSecurityCheck] = useState<any>({});

  const [activeStep, setActiveStep] = React.useState(0);
  const [reportingDate, setReportingDate] = React.useState<Dayjs | null>(
    dayjs(),
  );
  const [gateInDate, setGateInDate] = React.useState<Dayjs | null>(
    dayjs(),
  );
  const [loadOutDate, setLoadOutDate] = React.useState<Dayjs | null>(
    dayjs(),
  );
  const [loadInDate, setLoadInDate] = React.useState<Dayjs | null>(
    dayjs(),
  );
  const [gateOutDate, setGateOutDate] = React.useState<Dayjs | null>(
    dayjs(),
  );
  const [isCameraAvailable, setIsCameraAvailable] = useState(false);
  const [checklists0, setChecklists0] = useState([
    {
    point: 'Pollution certificate is valid?',
    checked: false
  }, 
  {
    point: 'Tarpaulin in good Condition?',
    checked: false
  }, 
  {
    point: 'Vehicle Body in good Condition?',
    checked: false
  },
  {
    point: 'Fitness certificate is valid?',
    checked: false
  },
]);
const [checklists1, setChecklists1] = useState([
  {
  point: 'Pollution certificate is valid?',
  checked: false
}, 
{
  point: 'Tarpaulin in good Condition?',
  checked: false
}, 
{
  point: 'Vehicle Body in good Condition?',
  checked: false
},
{
  point: 'Fitness certificate is valid?',
  checked: false
},
]);
const [checklists2, setChecklists2] = useState([
  {
  point: 'Has the correct and valid material, which is not expired, been brought to the loading point as per the customer\'s requirement?',
  checked: false
}, 
{
  point: 'Has the vehicle\'s hygiene been checked, and has tarpaulin been laid inside the truck?',
  checked: false
}, 
{
  point: 'Has the tarpaulin covered the entire bottom surface of the truck before loading activity?',
  checked: false
},
{
  point: 'Is the quantity of material being loaded matching the quantity mentioned in the pick-up list?',
  checked: false
},
{
  point: 'Is the stacking of the material meeting the standard stacking plan?',
  checked: false
},
]);
const [checklists3, setChecklists3] = useState([
  {
  point: 'Is Hygiene Of the physical condition and appearance of the bags good during loading?',
  checked: false
}, 
{
  point: 'Is truck sealing done properly?',
  checked: false
}, 
{
  point: 'Is cross verification done for the required documents (with organization seal, Authorization sign,e-way bill etc) along with Vehicle?',
  checked: false
},
{
  point: 'Cross Check - Acceptance of Total Loading Quality & Quantity',
  checked: false
},
{
  point: 'Billed Quantity and Loading Quantity Cross Check responsibility',
  checked: false
},
]);
const [checklists4, setChecklists4] = useState([
  {
  point: 'No. of Invoices',
  checked: false
}, 
{
  point: 'No. of e-Way Bills',
  checked: false
}, 
{
  point: 'Checking Invoice and Waybill having valid date',
  checked: false
},
{
  point: 'Acceptance of Total Quantity and Quality',
  checked: false
},
{
  point: 'Vehicle complete check for any irregular materials apart from Invoiced ones',
  checked: false
},
]);

  // let videoRef = useRef(null);

  // let photoRef = useRef(null)

  // const getUserCamera = () => {
  //   navigator.mediaDevices.getUserMedia({ video: true })
  //     .then(stream => {
  //       if (videoRef.current) {
  //         setIsCameraAvailable(true);
  //         videoRef.current.srcObject = stream;
  //         videoRef.current.play();
  //       }
  //     });
  // }

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      router.push('/completed');
    }
    setActiveStep((prevActiveStep) => {
      
      return prevActiveStep + 1;
    });
  };
  const handleSave = async () => {
    let payload = {};
    if (activeStep === 0) {
      payload = {
        _id: securityCheck._id,
      stage: 'stage1',
      stageName: 'Vehicle identity and reporting',
      finish: false,
      stageDateName: 'vehicle_reporting_date',
      stageDateTime: reportingDate,
      }
    } else if (activeStep === 1) {
      payload = {
        _id: securityCheck._id,
        stage: 'stage2',
        stageName: 'Vehicle gate in',
        finish: false,
        stageDateName: 'vehicle_gate_in_date',
        stageDateTime: gateInDate,
        checklist: checklists1 
      }
    } else if (activeStep === 2) {
      payload = {
        _id: securityCheck._id,
        stage: 'stage3',
        stageName: 'Loading in and billing activity',
        finish: false,
        stageDateName: 'load_in_date',
        stageDateTime: loadInDate,
        checklist: checklists2
      }
    } else if (activeStep === 3) {
      payload = {
        _id: securityCheck._id,
        stage: 'stage4',
        stageName: 'Loading in and billing activity',
        finish: false,
        stageDateName: 'load_out_date',
        stageDateTime: loadOutDate,
        checklist: checklists3
      } 
    } else if (activeStep === 4) {
      payload = {
        _id: securityCheck._id,
        stage: 'stage5',
        stageName: 'Vehicle gate out activity',
        finish: true,
        stageDateName: 'vehicle_gate_out_date',
        stageDateTime: gateOutDate,
        checklist: checklists4
      }
    }
    const response = await fetch('https://dev-api.instavans.com/api/thor/security/save_stage', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${session?.user.data.accessToken} Shipper ${session?.user.data.default_unit}`,
        }
    });
    const data = await response.json();
    
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };



  const handleReset = () => {
    setActiveStep(0);
  };

  useEffect(() => {

    const getVehicleData = async () => {
    const response = await fetch('https://dev-api.instavans.com/api/thor/security/get_vehicle_details?' + new URLSearchParams({vehicle_no: vehicleNo}), {
      method: 'GET',
      headers: {
          'Authorization': `bearer ${session?.user.data.accessToken} Shipper ${session?.user.data.default_unit}`,
          'Content-Type': 'application/json',
      },
      });
      const data = await response.json();
      const d = data.data.shipment;
      const security = data.data.securityCheck;
      if (security.stage1.completed === true) {
        const checks = security.stage1.checklist.map((c: { point: any; checked: any; }) => {
          return {
            point: c.point,
            checked: c.checked
          }
        });
        setChecklists0(checks);
        setReportingDate(security.stage1.completed_at);
        setActiveStep(0);
      } 
      if (security.stage2.completed === true) {
        const checks = security.stage2.checklist.map((c: { point: any; checked: any; }) => {
          return {
            point: c.point,
            checked: c.checked
          }
        });
        setChecklists1(checks);
        setGateInDate(security.stage2.completed_at);
        setActiveStep(1);
      } 
      if (security.stage3.completed === true) {
        const checks = security.stage3.checklist.map((c: { point: any; checked: any; }) => {
          return {
            point: c.point,
            checked: c.checked
          }
        });
        setChecklists2(checks);
        setLoadInDate(security.stage3.completed_at);
        setActiveStep(2);
      } 
      if (security.stage4.completed === true) {
        const checks = security.stage4.checklist.map((c: { point: any; checked: any; }) => {
          return {
            point: c.point,
            checked: c.checked
          }
        });
        setChecklists3(checks);
        setLoadOutDate(security.stage4.completed_at);
        setActiveStep(3);
      } 
      if (security.stage5.completed === true) {
        const checks = security.stage5.checklist.map((c: { point: any; checked: any; }) => {
          return {
            point: c.point,
            checked: c.checked
          }
        });
        setChecklists4(checks);
        setGateOutDate(security.stage5.completed_at);
        setActiveStep(4);
      }
      setShipment(d);
      setSecurityCheck(security);
      return d;
    };
    getVehicleData();
  }, [vehicleNo]);


  const handleCheckboxChange0 = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecklists = [...checklists0];
    newChecklists[index].checked = event.target.checked;
    setChecklists0(newChecklists);
  };
  const handleCheckboxChange1 = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecklists = [...checklists1];
    newChecklists[index].checked = event.target.checked;
    setChecklists1(newChecklists);
  };
  const handleCheckboxChange2 = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecklists = [...checklists2];
    newChecklists[index].checked = event.target.checked;
    setChecklists2(newChecklists);
  };
  const handleCheckboxChange3 = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecklists = [...checklists3];
    newChecklists[index].checked = event.target.checked;
    setChecklists3(newChecklists);
  };
  const handleCheckboxChange4 = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecklists = [...checklists4];
    newChecklists[index].checked = event.target.checked;
    setChecklists4(newChecklists);
  };
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleLogout = async () => {
    // await put('shipper_user/sign_out', { from: 'web' });
    await fetch('https://dev-api.instavans.com/api/thor/shipper_user/sign_out', {
    method: 'PUT',
    body: JSON.stringify({from: 'web'}),
    headers: {
        'Authorization': `bearer ${session?.user.data.accessToken} Shipper ${session?.user.data.default_unit}`,
        'Content-Type': 'application/json',
    }
});
    await signOut({ redirect: true, callbackUrl: '/' });
    
    window.localStorage.removeItem('nextauth.session-token');
}
  return (
    <div className='flex flex-col w-full h-screen'>
      {/* <div className="w-screen h-[50%] z-10 absolute hidden " >

        <video ref={videoRef} style={{ visibility: isCameraAvailable ? undefined : 'hidden' }}> </video>
        {isCameraAvailable &&
          <>
            <Button onClick={handleStopClick}>Take Photo</Button>
            <Button onClick={stopCamera}>Done</Button>

          </>
        }
      </div> */}
      { shipment && <><div className='flex items-center justify-between bg-[#fcfcfc] h-[56px] w-full fixed z-[3]'>
        <Button
          startIcon={<ArrowBackOutlinedIcon />}
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <div className="logout text-[#42454E] text-[12px] pr-[12px]" onClick={handleLogout}>
          Log out
        </div>

      </div><div className='flex flex-col gap-[12px]'>
          <Stepper activeStep={activeStep} alternativeLabel className='bg-[#fcfcfc] py-[10px] fixed z-[3] top-[56px] w-full'>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean; } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>  <p className='text-[10px]'>{label}</p> </StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <div>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <div>
                <div />
                <Button onClick={handleReset}>Reset</Button>
              </div>
            </div>
          ) : (

            <div className=' flex flex-col gap-[12px] relative top-[156px] '>
              {activeStep == 0 &&
                <>
                  <VehicleIdentity vehicleNo={vehicleNo} sin={shipment.SIN} soNumber={shipment.sale_order} materials={shipment.materials?.map((m: { name: any; }) => m.name).join(', ')} carrier={shipment?.carrier?.name}/>
                  <div className="gateInDetails bg-[#fcfcfc] p-[20px]">
                    <div className="body">
                      <div className="detailsSection">
                        <div className="label">
                          Vehicle reporting date
                        </div>
                        <div className="value">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDateTimePicker className='w-full h-[48px] mt-[4px]'
                              // label="For mobile"
                              value={reportingDate}
                              onChange={(newValue) => {
                                setReportingDate(newValue);
                              } }
                              renderInput={(params) => <TextField {...params} />} />
                          </LocalizationProvider>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="vehicleImages bg-[#fcfcfc] p-[20px]">
                    <div className="body flex flex-col gap-[16px]">
                      <div className="header">
                        <p className='text-[#131722] text-[18px] font-bold'>{shipment.SIN}</p>
                      </div>
                      <div className="uploadSection flex gap-[32px]">
                        <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer">

                          <CameraAltOutlinedIcon className='text-[#1A1A1A]' />
                          <p className='text-[#1A1A1A] text-[10px]'>Camera</p>
                        </div>
                        <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer">
                          <CollectionsOutlinedIcon className='text-[#1A1A1A]' />
                          <p className='text-[#1A1A1A] text-[10px]'>Gallery</p>
                        </div>
                        {/* <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer">
                      <canvas className="container" ref={photoRef}></canvas>
                    </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="checkList bg-[#fcfcfc] p-[20px] hidden">
                    <div className="body flex flex-col gap-[16px]">
                      <div className="header">
                        <p className='text-[#131722] text-[18px] font-bold'>Checklist</p>
                      </div>
                      <div className="checkListSection">
                        {checklists0.map((ch, i) => {
                          return (<div className="row flex justify-between items-center" key={i}>
                            <div className="point">
                              <p className='text-[#71747A] text-[12px] '>{ch.point}</p>
                            </div>
                            <div className="checkbox">
                              <Checkbox
                                checked={ch.checked}
                                onChange={handleCheckboxChange0(i)} />
                            </div>
                          </div>);
                        })}
                      </div>

                    </div>
                  </div>
                  <div className="buttons flex items-center justify-center gap-[16px] px-[20px] pb-[20px] ">
                    <div onClick={handleSave} className="button">
                      <button className='text-white'>SAVE</button>
                    </div>
                    <div onClick={handleNext} className="button">
                    <button className='text-white'>{activeStep === steps.length - 1 ? 'FINISH' : 'NEXT'}</button>
                    </div>
                  </div>
                </>}
              {activeStep == 1 &&
                <>
                  <VehicleGateIn vehicleNo={vehicleNo} driver={shipment.driver?.name} mobile={shipment.driver?.mobile} />
                  {/* <DriverDetails /> */}
                  <div className="gateInDetails bg-[#fcfcfc] p-[20px]">
                    <div className="body">
                    <div className="header">
                        <p className='text-[#131722] text-[18px] font-bold'>Vehicle gate in </p>
                      </div>
                      <div className="detailsSection">
                        <div className="label">
                          Vehicle gate in date & time
                        </div>
                        <div className="value">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDateTimePicker className='w-full h-[48px] mt-[4px]'
                              // label="For mobile"
                              value={gateInDate}
                              onChange={(newValue) => {
                                setGateInDate(newValue);
                              } }
                              renderInput={(params) => <TextField {...params} />} />
                          </LocalizationProvider>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="vehicleImages bg-[#fcfcfc] p-[20px]">
                    <div className="body flex flex-col gap-[16px]">
                      <div className="header">
                        <p className='text-[#131722] text-[18px] font-bold'>Vehicle and other images</p>
                      </div>
                      <div className="uploadSection flex gap-[32px]">
                        <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer">

                          <CameraAltOutlinedIcon className='text-[#1A1A1A]' />
                          <p className='text-[#1A1A1A] text-[10px]'>Camera</p>
                        </div>
                        <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer">
                          <CollectionsOutlinedIcon className='text-[#1A1A1A]' />
                          <p className='text-[#1A1A1A] text-[10px]'>Gallery</p>
                        </div>
                        {/* <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer">
                      <canvas className="container" ref={photoRef}></canvas>
                    </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="checkList bg-[#fcfcfc] p-[20px]">
                    <div className="body flex flex-col gap-[16px]">
                      <div className="header">
                        <p className='text-[#131722] text-[18px] font-bold'>Checklist</p>
                      </div>
                      <div className="checkListSection">
                        {checklists1.map((ch, i) => {
                          return (<div className="row flex justify-between items-center" key={i}>
                            <div className="point">
                              <p className='text-[#71747A] text-[12px] '>{ch.point}</p>
                            </div>
                            <div className="checkbox">
                              <Checkbox
                                checked={ch.checked}
                                onChange={handleCheckboxChange1(i)} />
                            </div>
                          </div>);
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="buttons flex items-center justify-center gap-[16px] px-[20px] pb-[20px] ">
                    <div onClick={handleSave} className="button">
                      <button className='text-white'>SAVE</button>
                    </div>
                    <div onClick={handleNext} className="button">
                    <button className='text-white'>{activeStep === steps.length - 1 ? 'FINISH' : 'NEXT'}</button>
                    </div>
                  </div>
                </>}
              {activeStep == 2 &&
                <>
                  <VehicleGateIn vehicleNo={vehicleNo} driver={shipment.driver?.name} mobile={shipment.driver?.mobile} />
                  <div className="gateInDetails bg-[#fcfcfc] p-[20px]">
                    <div className="body">
                      <div className="header  ">
                        <p className='text-[#131722] text-[18px] font-bold'>Loading in and billing activity</p>
                      </div>
                      <div className="detailsSection">
                        <div className="label">
                          Load in time
                        </div>
                        <div className="value">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDateTimePicker className='w-full h-[48px] mt-[4px]'
                              // label="For mobile"
                              value={loadInDate}
                              onChange={(newValue) => {
                                setLoadInDate(newValue);
                              } }
                              renderInput={(params) => <TextField {...params} />} />
                          </LocalizationProvider>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="vehicleImages bg-[#fcfcfc] p-[20px]">
                    <div className="body flex flex-col gap-[16px]">
                      <div className="header">
                        <p className='text-[#131722] text-[18px] font-bold'>Vehicle and other images</p>
                      </div>
                      <div className="uploadSection flex gap-[32px]">
                        <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer">

                          <CameraAltOutlinedIcon className='text-[#1A1A1A]' />
                          <p className='text-[#1A1A1A] text-[10px]'>Camera</p>
                        </div>
                        <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer">
                          <CollectionsOutlinedIcon className='text-[#1A1A1A]' />
                          <p className='text-[#1A1A1A] text-[10px]'>Gallery</p>
                        </div>
                        {/* <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer">
                      <canvas className="container" ref={photoRef}></canvas>
                    </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="checkList bg-[#fcfcfc] p-[20px]">
                    <div className="body flex flex-col gap-[16px]">
                      <div className="header">
                        <p className='text-[#131722] text-[18px] font-bold'>Checklist</p>
                      </div>
                      <div className="checkListSection">
                        {checklists2.map((ch, i) => {
                          return (<div className="row flex justify-between items-center" key={i}>
                            <div className="point">
                              <p className='text-[#71747A] text-[12px] '>{ch.point}</p>
                            </div>
                            <div className="checkbox">
                              <Checkbox
                                checked={ch.checked}
                                onChange={handleCheckboxChange2(i)} />
                            </div>
                          </div>);
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="buttons flex items-center justify-center gap-[16px] px-[20px] pb-[20px] ">
                    <div onClick={handleSave} className="button">
                      <button className='text-white'>SAVE</button>
                    </div>
                    <div onClick={handleNext} className="button">
                    <button className='text-white'>{activeStep === steps.length - 1 ? 'FINISH' : 'NEXT'}</button>
                    </div>
                  </div>
                </>}
              {activeStep == 3 &&
                <>
                  <VehicleGateIn vehicleNo={vehicleNo} driver={shipment.driver?.name} mobile={shipment.driver?.mobile} />
                  <div className="gateInDetails bg-[#fcfcfc] p-[20px]">
                    <div className="body">
                      <div className="header  ">
                        <p className='text-[#131722] text-[18px] font-bold'>Loading out and billing activity</p>
                      </div>
                      <div className="detailsSection">
                        <div className="label">
                          Load out time
                        </div>
                        <div className="value">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDateTimePicker className='w-full h-[48px] mt-[4px]'
                              // label="For mobile"
                              value={loadOutDate}
                              onChange={(newValue) => {
                                setLoadOutDate(newValue);
                              } }
                              renderInput={(params) => <TextField {...params} />} />
                          </LocalizationProvider>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="vehicleImages bg-[#fcfcfc] p-[20px]">
                    <div className="body flex flex-col gap-[16px]">
                      <div className="header">
                        <p className='text-[#131722] text-[18px] font-bold'>Vehicle and other images</p>
                      </div>
                      <div className="uploadSection flex gap-[32px]">
                        <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer">

                          <CameraAltOutlinedIcon className='text-[#1A1A1A]' />
                          <p className='text-[#1A1A1A] text-[10px]'>Camera</p>
                        </div>
                        <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer">
                          <CollectionsOutlinedIcon className='text-[#1A1A1A]' />
                          <p className='text-[#1A1A1A] text-[10px]'>Gallery</p>
                        </div>
                        {/* <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer">
                      <canvas className="container" ref={photoRef}></canvas>
                    </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="checkList bg-[#fcfcfc] p-[20px]">
                    <div className="body flex flex-col gap-[16px]">
                      <div className="header">
                        <p className='text-[#131722] text-[18px] font-bold'>Checklist</p>
                      </div>
                      <div className="checkListSection">
                        {checklists3.map((ch, i) => {
                          return (<div className="row flex justify-between items-center" key={i}>
                            <div className="point">
                              <p className='text-[#71747A] text-[12px] '>{ch.point}</p>
                            </div>
                            <div className="checkbox">
                              <Checkbox
                                checked={ch.checked}
                                onChange={handleCheckboxChange3(i)} />
                            </div>
                          </div>);
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="buttons flex items-center justify-center gap-[16px] px-[20px] pb-[20px] ">
                    <div onClick={handleSave} className="button">
                      <button className='text-white'>SAVE</button>
                    </div>
                    <div onClick={handleNext} className="button">
                    <button className='text-white'>{activeStep === steps.length - 1 ? 'FINISH' : 'NEXT'}</button>
                    </div>
                  </div>
                </>}
              {activeStep == 4 &&
                <>
                  <VehicleGateIn vehicleNo={vehicleNo} driver={shipment.driver?.name} mobile={shipment.driver?.mobile} />
                  <div className="gateInDetails bg-[#fcfcfc] p-[20px]">
                    <div className="body">
                      <div className="header">
                        <p className='text-[#131722] text-[18px] font-bold'>Vehicle gate out activity</p>
                      </div>
                      <div className="detailsSection">
                        <div className="label">
                          Vehicle gate out time
                        </div>
                        <div className="value">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDateTimePicker className='w-full h-[48px] mt-[4px]'
                              // label="For mobile"
                              value={gateOutDate}
                              onChange={(newValue) => {
                                setGateOutDate(newValue);
                              } }
                              renderInput={(params) => <TextField {...params} />} />
                          </LocalizationProvider>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="vehicleImages bg-[#fcfcfc] p-[20px]">
                    <div className="body flex flex-col gap-[16px]">
                      <div className="header">
                        <p className='text-[#131722] text-[18px] font-bold'>Vehicle and other images</p>
                      </div>
                      <div className="uploadSection flex gap-[32px]">
                        <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer">

                          <CameraAltOutlinedIcon className='text-[#1A1A1A]' />
                          <p className='text-[#1A1A1A] text-[10px]'>Camera</p>
                        </div>
                        <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer">
                          <CollectionsOutlinedIcon className='text-[#1A1A1A]' />
                          <p className='text-[#1A1A1A] text-[10px]'>Gallery</p>
                        </div>
                        {/* <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer">
                      <canvas className="container" ref={photoRef}></canvas>
                    </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="checkList bg-[#fcfcfc] p-[20px]">
                    <div className="body flex flex-col gap-[16px]">
                      <div className="header">
                        <p className='text-[#131722] text-[18px] font-bold'>Checklist</p>
                      </div>
                      <div className="checkListSection">
                        {checklists4.map((ch, i) => {
                          return (<div className="row flex justify-between items-center" key={i}>
                            <div className="point">
                              <p className='text-[#71747A] text-[12px] '>{ch.point}</p>
                            </div>
                            <div className="checkbox">
                              <Checkbox
                                checked={ch.checked}
                                onChange={handleCheckboxChange4(i)} />
                            </div>
                          </div>);
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="buttons flex items-center justify-center gap-[16px] px-[20px] pb-[20px] ">
                    <div onClick={handleSave} className="button">
                      <button className='text-white'>SAVE</button>
                    </div>
                    <div onClick={handleNext} className="button">
                    <button className='text-white'>{activeStep === steps.length - 1 ? 'FINISH' : 'NEXT'}</button>
                    </div>
                  </div>
                </>}

            </div>
          )}

        </div></>}
      
      
    </div>
  );
}

export default SecurityForm
