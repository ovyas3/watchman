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
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Checkbox from '@mui/material/Checkbox';
import VehicleGateIn from '../components/vehicleGateIn';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import closeIcon from '../../assets/popup_close_icon.svg';
import Image from 'next/image'
import { useSnackbar } from "../../lib/context/SnackbarProvider";
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
  const addSnackbar = useSnackbar();
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
  const [vehcileReportingFiles, setVehcileReportingFiles] = useState<{ name: string; preview: string }[]>([]);
  const [vehcileGateInFiles, setVehcileGateInFiles] = useState<{ name: string; preview: string }[]>([]);
  const [vehcileLoadInFiles, setVehcileLoadInFiles] = useState<{ name: string; preview: string }[]>([]);
  const [vehcileLoadOutFiles, setVehcileLoadOutFiles] = useState<{ name: string; preview: string }[]>([]);
  const [vehcileGateOutFiles, setVehcileGateOutFiles] = useState<{ name: string; preview: string }[]>([]);

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

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      router.push('/completed');
    }
    setActiveStep((prevActiveStep) => {
      
      return prevActiveStep + 1;
    });
  };
  const handleSave = async () => {
    let images = false;
    let formData:any = new FormData();
    let payload: any = {};
    if (activeStep === 0) {
      for (let i = 0; i < vehcileReportingFiles.length; i++) {
        formData.append('images', dataURItoBlob(vehcileReportingFiles[i].preview), vehcileReportingFiles[i].name);
        images = true;
      }
      formData.append('stage', 'stage1');
      formData.append('_id', securityCheck._id);
      payload = {
        _id: securityCheck._id,
      stage: 'stage1',
      stageName: 'Vehicle identity and reporting',
      finish: false,
      stageDateName: 'vehicle_reporting_date',
      stageDateTime: reportingDate,
      }
    } else if (activeStep === 1) {
      for (let i = 0; i < vehcileGateInFiles.length; i++) {
        formData.append('images', dataURItoBlob(vehcileGateInFiles[i].preview), vehcileGateInFiles[i].name);
        images = true;
      }
      formData.append('stage', 'stage2');
      formData.append('_id', securityCheck._id);
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
      for (let i = 0; i < vehcileLoadInFiles.length; i++) {
        formData.append('images', dataURItoBlob(vehcileLoadInFiles[i].preview), vehcileLoadInFiles[i].name);
        images = true;
      }
      formData.append('stage', 'stage3');
      formData.append('_id', securityCheck._id);
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
      for (let i = 0; i < vehcileLoadOutFiles.length; i++) {
        formData.append('images', dataURItoBlob(vehcileLoadOutFiles[i].preview), vehcileLoadOutFiles[i].name);
        images = true;
      }
      formData.append('stage', 'stage4');
      formData.append('_id', securityCheck._id);
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
      for (let i = 0; i < vehcileGateOutFiles.length; i++) {
        formData.append('images', dataURItoBlob(vehcileGateOutFiles[i].preview), vehcileGateOutFiles[i].name);
        images = true;
      }
      formData.append('stage', 'stage5');
      formData.append('_id', securityCheck._id);
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
    if (payload.checklist.filter(c => !c.checked).length === 0) {
      const response = await fetch('https://dev-api.instavans.com/api/thor/security/save_stage', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${session?.user.data.accessToken} Shipper ${session?.user.data.default_unit}`,
        }
      });
      const data = await response.json();
      if (data.statusCode === 200) {
        toast.success('🦄 Data saved!', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
      
      } else {
        toast.error(data.error.message, { hideProgressBar: true, autoClose: 2000, type: 'error' });
      }
    } else {
      toast.error('Please check all checkpoints', { hideProgressBar: true, autoClose: 2000, type: 'error' });
    }
    if (images) {
      const imageResponse = await fetch('https://dev-api.instavans.com/api/thor/security/save_stage_images', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `bearer ${session?.user.data.accessToken} Shipper ${session?.user.data.default_unit}`,
        }
      });
      const imageData = await imageResponse.json();
      if (imageData.statusCode === 200) {
        toast.success('Data Saved', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
      
      } else {
        toast.error(imageData.message, { hideProgressBar: true, autoClose: 2000, type: 'error' });
      }
    }
  }
  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

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
      if (data.statusCode === 200){
      const d = data.data.shipment;
      const security = data.data.securityCheck;
      if (security?.stage1?.completed === true) {
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
      if (security?.stage2?.completed === true) {
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
      if (security?.stage3?.completed === true) {
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
      if (security?.stage4?.completed === true) {
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
      if (security?.stage5?.completed === true) {
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
    } else if (data.statusCode === 401) {
        toast.error(data.error);
        // signOut();
    }
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
  const handleLogout = async () => {
    // await put('shipper_user/sign_out', { from: 'web' });
    await fetch('https://dev-api.instavans.com/api/thor/shipper_user/sign_out?from=web', {
    method: 'PUT',
    headers: {
        'Authorization': `bearer ${session?.user.data.accessToken} Shipper ${session?.user.data.default_unit}`,
        'Content-Type': 'application/json',
    }
});
    await signOut({ redirect: true, callbackUrl: '/' });
    
    window.localStorage.removeItem('nextauth.session-token');
}

const handleVehicleReportFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const fileList = event.target.files;
  const fileArray: { name: string; preview: string }[] = [];

  for (let i = 0; i < fileList!.length; i++) {
    const file = fileList![i];
    const reader = new FileReader();

    reader.onload = (e) => {
      fileArray.push({ name: file.name, preview: e.target!.result as string });
      if (fileArray.length === fileList!.length) {
        setVehcileReportingFiles(fileArray);
      }
    };

    reader.readAsDataURL(file);
  }
};
const handleVehicleGateInFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const fileList = event.target.files;
  const fileArray: { name: string; preview: string }[] = [];

  for (let i = 0; i < fileList!.length; i++) {
    const file = fileList![i];
    const reader = new FileReader();

    reader.onload = (e) => {
      fileArray.push({ name: file.name, preview: e.target!.result as string });
      if (fileArray.length === fileList!.length) {
        setVehcileGateInFiles(fileArray);
      }
    };

    reader.readAsDataURL(file);
  }
};
const handleVehicleLoadInFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const fileList = event.target.files;
  const fileArray: { name: string; preview: string }[] = [];

  for (let i = 0; i < fileList!.length; i++) {
    const file = fileList![i];
    const reader = new FileReader();

    reader.onload = (e) => {
      fileArray.push({ name: file.name, preview: e.target!.result as string });
      if (fileArray.length === fileList!.length) {
        setVehcileLoadInFiles(fileArray);
      }
    };

    reader.readAsDataURL(file);
  }
};
const handleVehicleLoadOutFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const fileList = event.target.files;
  const fileArray: { name: string; preview: string }[] = [];

  for (let i = 0; i < fileList!.length; i++) {
    const file = fileList![i];
    const reader = new FileReader();

    reader.onload = (e) => {
      fileArray.push({ name: file.name, preview: e.target!.result as string });
      if (fileArray.length === fileList!.length) {
        setVehcileLoadOutFiles(fileArray);
      }
    };

    reader.readAsDataURL(file);
  }
};
const handleVehicleGateOutFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const fileList = event.target.files;
  const fileArray: { name: string; preview: string }[] = [];

  for (let i = 0; i < fileList!.length; i++) {
    const file = fileList![i];
    const reader = new FileReader();

    reader.onload = (e) => {
      fileArray.push({ name: file.name, preview: e.target!.result as string });
      if (fileArray.length === fileList!.length) {
        setVehcileGateOutFiles(fileArray);
      }
    };

    reader.readAsDataURL(file);
  }
};
const handleVehicleReportDeleteFile = (index: number) => {
  const newFiles = [...vehcileReportingFiles];
  newFiles.splice(index, 1);
  setVehcileReportingFiles(newFiles);
};
const handleVehicleGateInDeleteFile = (index: number) => {
  const newFiles = [...vehcileReportingFiles];
  newFiles.splice(index, 1);
  setVehcileReportingFiles(newFiles);
};
const handleVehicleLoadInDeleteFile = (index: number) => {
  const newFiles = [...vehcileReportingFiles];
  newFiles.splice(index, 1);
  setVehcileReportingFiles(newFiles);
};
const handleVehicleLoadOutDeleteFile = (index: number) => {
  const newFiles = [...vehcileReportingFiles];
  newFiles.splice(index, 1);
  setVehcileReportingFiles(newFiles);
};
const handleVehicleGateOutDeleteFile = (index: number) => {
  const newFiles = [...vehcileReportingFiles];
  newFiles.splice(index, 1);
  setVehcileReportingFiles(newFiles);
};
  return (
    <><ToastContainer /><div className='flex flex-col w-full h-screen'>


      {shipment && <><div className='flex items-center justify-between bg-[#fcfcfc] h-[56px] w-full fixed z-[3]'>
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
                  <VehicleIdentity vehicleNo={vehicleNo} sin={shipment.SIN} soNumber={shipment.sale_order} materials={shipment.materials?.map((m: { name: any; }) => m.name).join(', ')} carrier={shipment?.carrier?.name} />
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
                        <p className='text-[#131722] text-[18px] font-bold'>Vehicle and other images</p>
                      </div>
                      <div className="uploadSection flex gap-[16px]">
                        <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative">

                          <CameraAltOutlinedIcon className='text-[#1A1A1A]' />
                          <p className='text-[#1A1A1A] text-[10px]'>Camera</p>
                        </div>
                        <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative">
                          <input type="file" multiple className='opacity-0 absolute w-full h-full z-2' onChange={handleVehicleReportFileChange} />
                          <CollectionsOutlinedIcon className='text-[#1A1A1A]' />
                          <p className='text-[#1A1A1A] text-[10px]'>Gallery</p>
                        </div>
                      </div>
                      <div className="uploadSection flex gap-[16px]">


                        {vehcileReportingFiles.map((file, index) => (
                          <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative">
                            {/* <img src={closeIcon} /> */}
                            <Image
                              src={closeIcon}
                              alt=""
                              width={24}
                              height={24}
                              className='absolute top-[-10px] right-[-9px] text-[#131722] '
                              onClick={() => handleVehicleReportDeleteFile(index)} />
                            <img key={file.name} src={file.preview} alt={file.name} />
                          </div>
                        ))}

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
                        <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative">
                          <input type="file" multiple className='opacity-0 absolute w-full h-full z-2' onChange={handleVehicleGateInFileChange} />
                          <CollectionsOutlinedIcon className='text-[#1A1A1A]' />
                          <p className='text-[#1A1A1A] text-[10px]'>Gallery</p>
                        </div>
                      </div>
                      <div className="uploadSection flex gap-[16px]">


                        {vehcileGateInFiles.map((file, index) => (
                          <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative">
                            {/* <img src={closeIcon} /> */}
                            <Image
                              src={closeIcon}
                              alt=""
                              width={24}
                              height={24}
                              className='absolute top-[-10px] right-[-9px] text-[#131722] '
                              onClick={() => handleVehicleGateInDeleteFile(index)} />
                            <img key={file.name} src={file.preview} alt={file.name} />
                          </div>
                        ))}

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
                        <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative">
                          <input type="file" multiple className='opacity-0 absolute w-full h-full z-2' onChange={handleVehicleLoadInFileChange} />
                          <CollectionsOutlinedIcon className='text-[#1A1A1A]' />
                          <p className='text-[#1A1A1A] text-[10px]'>Gallery</p>
                        </div>
                      </div>
                      <div className="uploadSection flex gap-[16px]">


                        {vehcileLoadInFiles.map((file, index) => (
                          <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative">
                            {/* <img src={closeIcon} /> */}
                            <Image
                              src={closeIcon}
                              alt=""
                              width={24}
                              height={24}
                              className='absolute top-[-10px] right-[-9px] text-[#131722] '
                              onClick={() => handleVehicleLoadInDeleteFile(index)} />
                            <img key={file.name} src={file.preview} alt={file.name} />
                          </div>
                        ))}

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
                        <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative">
                          <input type="file" multiple className='opacity-0 absolute w-full h-full z-2' onChange={handleVehicleLoadOutFileChange} />
                          <CollectionsOutlinedIcon className='text-[#1A1A1A]' />
                          <p className='text-[#1A1A1A] text-[10px]'>Gallery</p>
                        </div>
                        {/* <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer">
                      <canvas className="container" ref={photoRef}></canvas>
                    </div> */}
                      </div>
                      {vehcileLoadOutFiles.map((file, index) => (
                        <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative">
                          {/* <img src={closeIcon} /> */}
                          <Image
                            src={closeIcon}
                            alt=""
                            width={24}
                            height={24}
                            className='absolute top-[-10px] right-[-9px] text-[#131722] '
                            onClick={() => handleVehicleLoadOutDeleteFile(index)} />
                          <img key={file.name} src={file.preview} alt={file.name} />
                        </div>
                      ))}
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
                        <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative">
                          <input type="file" multiple className='opacity-0 absolute w-full h-full z-2' onChange={handleVehicleGateOutFileChange} />
                          <CollectionsOutlinedIcon className='text-[#1A1A1A]' />
                          <p className='text-[#1A1A1A] text-[10px]'>Gallery</p>
                        </div>
                        {/* <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer">
                      <canvas className="container" ref={photoRef}></canvas>
                    </div> */}
                      </div>
                      {vehcileGateOutFiles.map((file, index) => (
                        <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative">
                          {/* <img src={closeIcon} /> */}
                          <Image
                            src={closeIcon}
                            alt=""
                            width={24}
                            height={24}
                            className='absolute top-[-10px] right-[-9px] text-[#131722] '
                            onClick={() => handleVehicleGateOutDeleteFile(index)} />
                          <img key={file.name} src={file.preview} alt={file.name} />
                        </div>
                      ))}
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


    </div></>
  );
}

export default SecurityForm
