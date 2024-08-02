'use client'
import React, { useEffect, useRef, useState } from 'react'
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { FormControlLabel, Grid, IconButton, Typography } from '@mui/material';
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
import { DateTime } from 'luxon';
import CameraModal from './CameraModal';

type props = {
  searchParams: any,
};

interface SubItem {
  name: string;
  dropdown: string;
}

interface ChecklistItem {
  point: string;
  dropdown?: string;
  images?: Record<string, string>;
  image?: string;
  inputValue?: string;
  dropdownHighlighted?: boolean;
  checked?: boolean;
  isAutomatic?: boolean;
  subItems?: SubItem[];
  validityDate?: string;
  validityEndDate?: string; 
  dropdownDisabled?: boolean;
}
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
  const [trackingMethod, setTrackingMethod] = useState('');
  const [lastLocation, setLastLocation] = useState('');
  const [lastLocationAt, setLastLocationAt] = useState('');
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

  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  const [currentImagePart, setCurrentImagePart] = useState<string | null>(null);
  const [currentChecklistIndex, setCurrentChecklistIndex] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [submittedImages, setSubmittedImages] = useState<Record<string, boolean>>({});

  const [checklists0, setChecklists0] = useState<ChecklistItem[]>([
    {
    point: 'Vehicle Body is in Good Condition or Not ?',
    dropdown: '',
    images: {
      'Floor Body': '',
      'Floor': '',
      'Left': '',
      'Right': '',
      'Rear': ''
    },
    dropdownDisabled: true,
  }, 
  {
    point: 'Vehicle is equipped with 3 Tarpaulins or not ?',
    dropdown: '',
    image: ''
  }, 
  {
    point: 'Tarpaulins are in Good Condition or Not ? (Only Stitchless Tarpaulins)',
    dropdown: '',
    image: ''
  },
  {
    point: 'Pollution Certificate is Valid ?',
    dropdown: '',
    image: '',
    inputValue: '',
    dropdownDisabled: true
  },
  {
    point: 'Fitness Certificate is Valid ?',
    dropdown: '',
    image: '',
    inputValue: '',
    dropdownDisabled: true
  },
  {
    point: 'Vehicle Carrying Capacity in Kgs',
    inputValue: '',
    image: ''
  },
  {
    point: 'Driver License No.',
    inputValue: ''
  },
  {
    point: 'Driver License Validity End Date',
    inputValue: ''
  }
]);
const [checklists1, setChecklists1] = useState<ChecklistItem[]>([
  {
    point: 'Time Stamp of gate In',
    checked: false,
    inputValue: new Date().toLocaleString(), 
  }
]);
const [checklists2, setChecklists2] = useState<ChecklistItem[]>([
  {
  point: 'Vehicle Body is in Good Condition or Not ?',
  dropdown: '',
  images: {
    'Floor Body': '',
    'Floor': '',
    'Left': '',
    'Right': '',
    'Rear': ''
  },
  dropdownDisabled: true
}, 
{
  point: 'Has the Tarpaulin covered the entire bottom surface of the Truck before loading commencement ?',
  dropdown: '',
  images: {
    'Photo 1': '',
    'Photo 2': ''
  },
  dropdownDisabled: true
}, 
{
  point: 'Pick Up Slip Weight and Vehicle Passing weight cross check done ? (In Kgs)',
  dropdown: '',
  inputValue: ''
}
]);
const [checklists3, setChecklists3] = useState<ChecklistItem[]>([
  {
  point: 'Layer Wise Loading and Stuffing done as per Stacking Plan ?',
  dropdown: '',
  images: {
    'First Layer': '',
    'Second Layer': '',
    'Third Layer': '',
    'Fourth Layer': '',
    'Post Loading': ''
  },
  dropdownDisabled: true
}, 
{
  point: 'Is the Quantity of Material loaded matching the Quantity in Pick up List ?',
  dropdown: ''
}, 
{
  point: 'Is truck Sealing done or not and Seal No. (If Available) ?',
  dropdown: '',
  image: '',
  inputValue: '',
  dropdownDisabled: true
},
{
  point: 'Material Loaded Weight entry in Kgs and Weigh Bridge Slip (If Available)',
  inputValue: '',
      image: ''
},
{
  point: "List of Documents Provided or not ?",
  subItems: [
    { name: "Invoice Document", dropdown: "" },
    { name: "Valid Eway Bill (Optional)", dropdown: "" },
    { name: "MTC (Optional)", dropdown: "" },
    { name: "LR Slip or Docket Slip", dropdown: "" }
  ],
},
]);
const [checklists4, setChecklists4] = useState([
  {
    point: 'Is truck Sealing done or not and Seal No. (If Available) ?',
    dropdown: '',
    image: '',
    inputValue: '',
    dropdownDisabled: true
  }, 
  {
    point: 'Commercial Invoices Nos (If more than one enter by Comma Separation)',
    inputValue: ''
  }, 
  {
    point: 'E way bill and Invoice has valid date or not ?',
    dropdown: ''
  }
]);

  const handleNext = () => {
    let incompleteItems: ChecklistItem[] = [];
  
    if (activeStep === 0) {
      incompleteItems = checklists0.filter(item => {
        const requiresInput = ['Vehicle Carrying Capacity', 'Driver License No.', 'Driver License Validity End Date'].includes(item.point);
        const requiresDropdown = item.dropdown !== undefined;
        const requiresImages = item.images !== undefined;
        
        if (requiresInput && !item.inputValue) return true;
        if (requiresDropdown && !item.dropdown) return true;
        if (requiresImages && Object.values(item.images || {}).some(img => !img)) return true;
        
        return false;
      });
    }else if (activeStep === 1) {
      incompleteItems = checklists1.filter(item => {
        const requiresDropdown = item.dropdown !== undefined;
        const requiresImages = item.images !== undefined;
        
        if (requiresDropdown && !item.dropdown) return true;
        if (requiresImages && Object.values(item.images || {}).some(img => !img)) return true;
        
        return false;
      });
    } else if (activeStep === 2){
      incompleteItems = checklists2.filter(item => {
        const requiresDropdown = item.dropdown !== undefined;
        const requiresImages = item.images !== undefined;

        if (requiresDropdown && !item.dropdown) return true;
        if (requiresImages && Object.values(item.images || {}).some(img => !img)) return true;
        
        return false;
      });
    } else if (activeStep === 3) {
      incompleteItems = checklists3.filter((item, index) => {
        const requiresDropdown = item.dropdown !== undefined;
        const requiresImages = item.images !== undefined;
        
        if (requiresDropdown && !item.dropdown) return true;
        if (requiresImages && Object.values(item.images || {}).some(img => !img)) return true;

        if (index === 4 && item.subItems) {
          return item.subItems.some((subItem, subIndex) => {
            const isMandatory = subItem.name !== "Valid Eway Bill (Optional)" && subItem.name !== "MTC (Optional)";
            return isMandatory && !subItem.dropdown;
          });
        }
        
        return false;
      });
    } else if (activeStep === 4) {
      incompleteItems = checklists4.filter((item, index) => {
        const requiresDropdown = item.dropdown !== undefined;
        const requiresImages = item.image !== undefined;
        
        if (requiresDropdown && !item.dropdown) return true;
        if (requiresImages && index !== 3) {
          return Object.values(item.image || {}).some(img => !img);
        }
        
        return false;
      });
    }
    if (incompleteItems.length > 0) {
      const missingFields = incompleteItems.map(item => {
        if (!item.image && item.image !== undefined) return `${item.point} (missing photo)`;
        if (!item.dropdown && item.dropdown !== undefined) return `${item.point} (missing selection)`;
        if (!item.inputValue && item.inputValue !== undefined) return `${item.point} (missing input)`;
        return item.point;
      }).join(', ');
      
      toast.error(`Please complete the following: ${missingFields}`);
      return;
    }
    if (activeStep === steps.length - 1) {
      router.push('/completed');
    }
    setActiveStep((prevActiveStep) => {
      const step = prevActiveStep;
      return prevActiveStep + 1;
    });
  };
  const handleNewVehicle = () => {
    router.push('/');
  }
  const allImagesUploaded = (item: ChecklistItem) => {
    if (!item.images && !item.image) return true;
    if (item.images) {
      return Object.values(item.images).every(image => image !== '');
    }
    return item.image !== '';
  };

  const handleImageCapture = (checklistIndex: number, index: number, part?: string) => {

    const imageKey = `${checklistIndex}-${index}-${part || 'main'}`;
    if (submittedImages[imageKey]) {
      toast.info('This image has already been submitted');
      return;
    }
    setCurrentChecklistIndex(checklistIndex);
    setCurrentImageIndex(index);
    setCurrentImagePart(part || null);
    setShowCamera(true);
  };
  
  const handleDropdownChange = async (checklistIndex: number,itemIndex: number, value: string, subItemIndex?:number) => {
    try {

      const setChecklist = [setChecklists0, setChecklists1, setChecklists2, setChecklists3, setChecklists4][checklistIndex];
      setChecklist((prevChecklists: any) => {
        const newChecklists = [...prevChecklists];
        if(subItemIndex !== undefined ){
          const item = newChecklists[itemIndex];
          if (item && item.subItems && Array.isArray(item.subItems)) {
            const subItem = item.subItems[subItemIndex];
            if (subItem) {
              item.subItems[subItemIndex] = { 
                ...subItem, 
                dropdown: value
              };
            }
          }   
        }
        else{
          newChecklists[itemIndex] = { 
            ...newChecklists[itemIndex], 
            dropdown: value,
          };
        }
        return newChecklists;
      });

      const response = await fetch('https://live-api.instavans.com/api/v1/security/update_checklist_item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${session?.user.data.accessToken} Shipper ${session?.user.data.default_unit}`,
        },
        body: JSON.stringify({
          _id: securityCheck._id,
          checklistIndex: 0,
          itemIndex,
          field: 'dropdown',
          value,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update dropdown');
      }

      const updatedSecurityCheck = await response.json();
      toast.success('Dropdown updated successfully');
    } catch (error) {
      console.error('Error updating dropdown:', error);
      toast.error('Failed to update dropdown');
    }
  };

  const handleCaptureComplete = async (imageSrc: string) => {
    try {
      setIsUploading(true);
  
      if (!session?.user?.data?.accessToken) {
        throw new Error('Authentication token is missing');
      }
  
      const uploadId = securityCheck?._id || vehicleNo;
      if (!uploadId) {
        throw new Error('No valid ID for upload');
      }
  
      const formData = new FormData();
      formData.append('images', dataURItoBlob(imageSrc), 'image.jpg');
      formData.append('stage', `stage${currentChecklistIndex + 1}`);
      formData.append('_id', uploadId);

      const headers = {
        'Authorization': `bearer ${session.user.data.accessToken} Shipper ${session.user.data.default_unit}`,
      };
  
  
      const url = 'https://live-api.instavans.com/api/thor/security/save_stage_images';
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: headers
      });
  
  
      const responseText = await response.text();
  
      if (!response.ok) {
        let errorMessage = 'Server error';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = JSON.stringify(errorData);
        } catch (e) {
          errorMessage = responseText;
        }
        throw new Error(`Server error: ${errorMessage}`);
      }
  
      const data = JSON.parse(responseText);
  
      const setChecklist = [setChecklists0, setChecklists1, setChecklists2, setChecklists3, setChecklists4][currentChecklistIndex];
      setChecklist((prevChecklists: any) => {
        const newChecklists = [...prevChecklists];
        if (currentImageIndex !== null) {
          if (currentImagePart) {
            newChecklists[currentImageIndex] = {
              ...newChecklists[currentImageIndex],
              images: {
                ...newChecklists[currentImageIndex].images,
                [currentImagePart]: imageSrc
              },
              dropdownDisabled: false
            };
          } else {
            newChecklists[currentImageIndex] = {
              ...newChecklists[currentImageIndex],
              image: imageSrc,
              dropdownDisabled: false
            };
          }
        }
        return newChecklists;
      });

    toast.success('Image uploaded successfully');
    }  catch (error) {
      console.error('Error uploading image:', error);
      toast.error(`Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      setShowCamera(false);
    }
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    setCurrentImageIndex(null);
    setCurrentImagePart(null);
  };

  const handleInputChange = async (checklistIndex: number, itemIndex: number, value: string, field: string) => {
    try {
      let formattedValue = value;
      if (checklistIndex === 4 && itemIndex === 1 && field === 'inputValue') {
        formattedValue = formattedValue.replace(/[^a-zA-Z0-9]/g, '');

        let result = '';
        for (let i = 0; i < formattedValue.length; i += 10) {
          if (result.length > 0) {
            result += ',';
          }
          result += formattedValue.substring(i, i + 10);
        }

        formattedValue = result.slice(0, 55);
      }
      const setChecklist = [setChecklists0, setChecklists1, setChecklists2, setChecklists3, setChecklists4][checklistIndex];
      setChecklist((prevChecklists: any) => {
        const newChecklists = [...prevChecklists];
        newChecklists[itemIndex] = { ...newChecklists[itemIndex], [field]: formattedValue };
        return newChecklists;
      });

      const response = await fetch('https://live-api.instavans.com/api/v1/security/update_checklist_item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${session?.user.data.accessToken} Shipper ${session?.user.data.default_unit}`,
        },
        body: JSON.stringify({
          _id: securityCheck._id,
          checklistIndex,
          itemIndex,
          field: 'inputValue',
          value: formattedValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update input');
      }

      const updatedSecurityCheck = await response.json();

      toast.success('Input updated successfully');
    } catch (error) {
      console.error('Error updating input:', error);
      toast.error('Failed to update input');
    }
  };

  const handleSave = async () => {
    let images = false;
    let formData:any = new FormData();
    const checklists = [checklists0, checklists1, checklists2, checklists3, checklists4];
    let payload: any;
  
    const appendImages = (files: { preview: string; name: string }[]) => {
      for (let i = 0; i < files.length; i++) {
        formData.append('images', dataURItoBlob(files[i].preview), files[i].name);
        images = true;
      }
    };
  
    const getChecklistForStage = (stage: number, checklist: any[]) => {
      switch (stage) {
        case 0: 
          return checklist.map(item => ({
            point: item.point,
            dropdown: item.dropdown,
            inputValue: item.inputValue,
            images: item.images,
            image: item.image,
            dropdownDisabled: item.dropdownDisabled,
            validityDate: item.validityDate,
            validityEndDate: item.validityEndDate
          }));
        case 1:
          return checklist.map(item => ({
            point: item.point,
            checked: item.checked,
            timestamp: new Date()
          }));
        case 2: 
          return checklist.map(item => ({
            point: item.point,
            dropdown: item.dropdown,
            inputValue: item.inputValue,
            images: item.images,
            dropdownDisabled: item.dropdownDisabled,
          }));
        case 3: 
          return checklist.map(item => ({
            point: item.point,
            dropdown: item.dropdown,
            inputValue: item.inputValue,
            images: item.images,
            dropdownDisabled: item.dropdownDisabled,
            image: item.image,
            subItems: item.subItems?.map((subItem: { name: any; dropdown: any; }) => ({
              name: subItem.name,
              dropdown: subItem.dropdown
            }))
          }));
        case 4: 
          return checklist.map(item => ({
            point: item.point,
            dropdown: item.dropdown,
            inputValue: item.inputValue,
            image: item.image,
            dropdownDisabled: item.dropdownDisabled
          }));
        default:
          return [];
      }
    };
  
    switch (activeStep) {
      case 0:
        appendImages(vehcileReportingFiles);
        formData.append('stage', 'stage1');
        formData.append('_id', securityCheck._id);
        payload = {
          _id: securityCheck._id,
          stage1: {
            name: 'Vehicle identity and reporting',
            checklist: getChecklistForStage(0, checklists0),
            completed: true,
            completed_at: new Date(),
            security: session?.user.data._id,
          },
          vehicle_reporting_date: reportingDate,
        };
        break;
  
      case 1:
        appendImages(vehcileGateInFiles);
        formData.append('stage', 'stage2');
        formData.append('_id', securityCheck._id);
        payload = {
          _id: securityCheck._id,
          stage2: {
            name: 'Vehicle gate in',
            checklist: getChecklistForStage(1, checklists1),
            completed: true,
            completed_at: new Date(),
            security: session?.user.data._id,
          },
          vehicle_gate_in_date: gateInDate,
        };
        break;
  
      case 2:
        appendImages(vehcileLoadInFiles);
        formData.append('stage', 'stage3');
        formData.append('_id', securityCheck._id);
        payload = {
          _id: securityCheck._id,
          stage3: {
            name: 'Loading in and billing activity',
            checklist: getChecklistForStage(2, checklists2),
            completed: true,
            completed_at: new Date(),
            security: session?.user.data._id,
          },
          load_in_date: loadInDate,
        };
        break;
  
      case 3:
        appendImages(vehcileLoadOutFiles);
        formData.append('stage', 'stage4');
        formData.append('_id', securityCheck._id);
        payload = {
          _id: securityCheck._id,
          stage4: {
            name: 'Loading out and billing activity',
            checklist: getChecklistForStage(3, checklists3),
            completed: true,
            completed_at: new Date(),
            security: session?.user.data._id,
          },
          load_out_date: loadOutDate,
        };
        break;
  
      case 4:
        appendImages(vehcileGateOutFiles);
        formData.append('stage', 'stage5');
        formData.append('_id', securityCheck._id);
        payload = {
          _id: securityCheck._id,
          stage5: {
            name: 'Vehicle gate out activity',
            checklist: getChecklistForStage(4, checklists4),
            completed: true,
            completed_at: new Date(),
            security: session?.user.data._id,
          },
          vehicle_gate_out_date: gateOutDate,
          finished_at: new Date(),
        };
        break;
    }
  
    if ((payload[`stage${activeStep + 1}`].checklist.length && payload[`stage${activeStep + 1}`].checklist.filter((c: any) => !c.checked).length === 0) || activeStep === 0) {
      const response = await fetch('https://live-api.instavans.com/api/thor/security/save_stage', {
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
      const imageResponse = await fetch('https://live-api.instavans.com/api/thor/security/save_stage_images', {
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
      const response = await fetch('https://live-api.instavans.com/api/thor/security/get_vehicle_details?' + new URLSearchParams({vehicle_no: vehicleNo}), {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${session?.user.data.accessToken} Shipper ${session?.user.data.default_unit}`,
            'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.statusCode === 200){
        const d = data.data.shipment;
        const trackingMethod = d.trip_tracker && d.trip_tracker.methods && d.trip_tracker.methods.length && d.trip_tracker.methods[0] || 'N/A';
        const lastLocation = d.trip_tracker && d.trip_tracker.last_location.address && d.trip_tracker.last_location.address || 'N/A';
        const lastLocationAttr = d.trip_tracker && d.trip_tracker.last_location_at && lastLocationAt;

        const security = data.data.securityCheck;
        if (security?.stage1?.completed === true) {
          const checks = security.stage1.checklist.map((c: { point: any; checked: any; }) => {
            return {
              point: c.point,
              checked: c.checked
            }
          });
          setChecklists0(checks.length > 0 ? checks : checklists0);
          setReportingDate(security.stage1.completed_at);
          setActiveStep(0);
          if (security.stage1.images?.length) {
            const newImages = security.stage1.images.map((i: any) => ({ name: i, preview: i }));
            setVehcileReportingFiles(newImages);
          }
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
          if (security.stage2.images?.length) {
              const newImages = security.stage2.images.map((i: any) => ({ name: i, preview: i }));
            setVehcileGateInFiles(newImages);
          }
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
          if (security.stage3.images?.length) {
            const newImages = security.stage3.images.map((i: any) => ({ name: i, preview: i }));
            setVehcileLoadInFiles(newImages);
          }
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
          if (security.stage4.images?.length) {
            const newImages = security.stage4.images.map((i: any) => ({ name: i, preview: i }));
            setVehcileLoadOutFiles(newImages);
          }
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
           if (security.stage5.images?.length) {
            const newImages = security.stage5.images.map((i: any) => ({ name: i, preview: i }));
            setVehcileLoadOutFiles(newImages);
          }
        }
        setShipment(d);
        setTrackingMethod(trackingMethod);
        setLastLocation(lastLocation);
        setLastLocationAt(lastLocationAt);
        setSecurityCheck(security);
        return d;
      } else if (data.statusCode === 401) {
        toast.error(data.error);
        // signOut();
      } else {
        toast.error('No Vehicle found, please logout and try again');
      }
    };
    getVehicleData();
  }, [vehicleNo]);


  const handleCheckboxChange = async (listIndex: number, itemIndex: number, checked: boolean) => {
    try {
      const setChecklist = [setChecklists0, setChecklists1, setChecklists2, setChecklists3, setChecklists4][listIndex];
      setChecklist((prev: any[]) => prev.map((item, i) =>
        i === itemIndex ? { ...item, checked, inputValue: checked ? new Date().toLocaleString() : '' } : item
      ));
  
      const response = await fetch('https://live-api.instavans.com/api/thor/security/update_checklist_item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${session?.user.data.accessToken} Shipper ${session?.user.data.default_unit}`,
        },
        body: JSON.stringify({
          _id: securityCheck._id,
          checklistIndex: listIndex,
          itemIndex,
          field: 'checked',
          value: checked,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update checkbox');
      }
  
      const updatedSecurityCheck = await response.json();
  
      toast.success('Checkbox updated successfully');
    } catch (error) {
      console.error('Error updating checkbox:', error);
      toast.error('Failed to update checkbox');
    }
  };
 
  const router = useRouter();
  const handleLogout = async () => {
    // await put('shipper_user/sign_out', { from: 'web' });
    await fetch('https://live-api.instavans.com/api/thor/shipper_user/sign_out?from=web', {
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
  const newFiles = [...vehcileGateInFiles];
  newFiles.splice(index, 1);
  setVehcileGateInFiles(newFiles);
};
const handleVehicleLoadInDeleteFile = (index: number) => {
  const newFiles = [...vehcileLoadInFiles];
  newFiles.splice(index, 1);
  setVehcileLoadInFiles(newFiles);
};
const handleVehicleLoadOutDeleteFile = (index: number) => {
  const newFiles = [...vehcileLoadOutFiles];
  newFiles.splice(index, 1);
  setVehcileLoadOutFiles(newFiles);
};
const handleVehicleGateOutDeleteFile = (index: number) => {
  const newFiles = [...vehcileGateOutFiles];
  newFiles.splice(index, 1);
  setVehcileGateOutFiles(newFiles);
};
  return (
    <><ToastContainer /><div className='flex flex-col w-full h-screen bg-[#F0F3F9]'>


      {shipment && <><div className='flex items-center justify-between bg-[#F0F3F9] h-[56px] w-full fixed z-[3] p-[10px] box-border'>
        <Button
          startIcon={<ArrowBackOutlinedIcon />}
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <div className="logout text-[#fafafa] text-[12px] w-[84px] h-[36px]
         flex items-center justify-center bg-[#E24D65] rounded
         cursor-pointer hover:bg-[#E45E74]
         transition duration-150 ease-out hover:ease-in
         "
          onClick={handleLogout}>
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
                <Step key={label} {...stepProps}
                sx={{
          '& .MuiStepLabel-root .Mui-completed': {
            color: '#18BE8A', // circle color (COMPLETED)
                  },
                  '& .css-z7uhs0-MuiStepConnector-line': {
                    ...(activeStep > 3 && { borderColor: '#18BE8A' })
                  },
          '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
            {
              color: '#131722', // Just text label (COMPLETED)
            },
          '& .MuiStepLabel-root .Mui-active': {
            color: '#18BE8A', // circle color (ACTIVE)
          },
          '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
            {
              color: '#71747A', // Just text label (ACTIVE)
            },
          '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
            fill: 'white', // circle's number (ACTIVE)
          },
        }}
                >
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

            <div className='flex flex-col gap-[12px] relative top-[156px] md:px-[80px] px-[24px]'>
              {activeStep == 0 &&
                <>
                  <div className="top md:flex md:flex-row-reverse gap-[24px]">
                  <div className="right w-full">
                  <div className="checkList bg-[#fcfcfc] p-[20px] h-full rounded-[12px]">
                    <div className="body flex flex-col gap-[16px]">
                      <div className="header">
                          <p className='text-[#131722] text-[18px] font-bold'>Checklist</p>
                        </div>
                        <div className="checkListSection" style={{height: "450px", overflow: "scroll"}}>
                        {checklists0.map((item, index) => (
                        <div key={index} className="flex py-[12px] border-b border-[#E6E8EC]">
                        <div className="left-side flex-grow">
                          <Typography className="text-[#71747A]" variant="caption">{item.point}</Typography>
                        </div>
                        <div className="right-side flex flex-col items-end gap-[8px] w-[200px]">
                            {index <= 4 && (
                              <div className="custom-select" style={{
                                marginBottom: '10px'
                              }}>
                                <select
                                  value={item.dropdown || ''}
                                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                    handleDropdownChange(0, index, event.target.value);
                                  }}
                                  disabled={!allImagesUploaded(item) || item.dropdownDisabled}
                                  style={{ 
                                    minWidth: '200px',
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    backgroundColor: !allImagesUploaded(item) || item.dropdownDisabled ? '#a9a9a9' : 'white', 
                                    color: !allImagesUploaded(item) || item.dropdownDisabled ? '#555' : 'black', 
                                    cursor: !allImagesUploaded(item) || item.dropdownDisabled ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  <option value="" disabled>{item.dropdown ? item.dropdown : 'Select'}</option>
                                  {index === 4 ? (
                                    <>
                                      <option value="Valid">Valid</option>
                                      <option value="Invalid">Invalid</option>
                                    </>
                                  ) : (
                                    <>
                                      <option value="Yes">Yes</option>
                                      <option value="No">No</option>
                                    </>
                                  )}
                                </select>
                              </div>
                            )}
                            {(index > 0 && index <= 5) && (
                              <Grid container justifyContent="center">
                                <Grid item>
                                  <IconButton 
                                    onClick={() => handleImageCapture(0, index)}
                                    disabled={Boolean(item.image)}
                                  >
                                    {item.image ? (
                                      <img src={item.image} alt="Captured" style={{width: '40px', height: '40px', borderRadius: '4px'}} />
                                    ) : (
                                      <CameraAltOutlinedIcon />
                                    )}
                                  </IconButton>
                                  <Typography variant="caption">Camera</Typography>
                                </Grid>
                              </Grid>
                            )}
                            {index === 0 && (
                              <Grid 
                                container 
                                spacing={1} 
                                className="camera-icons"
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  justifyContent: 'space-around',
                                  maxWidth: '100%',
                                  marginBottom: '16px',
                                  paddingRight: '20px'
                                }}
                              >
                                {['Floor Body', 'Floor', 'Left', 'Right', 'Rear'].map(part => (
                                  <Grid 
                                    item 
                                    xs={4} 
                                    sm={4} 
                                    key={part}
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      marginBottom: '8px'
                                    }}
                                  >
                                    <IconButton 
                                      onClick={() => handleImageCapture(0, index, part)}
                                      style={{
                                        padding: '4px',
                                        marginBottom: '4px'
                                      }}
                                      disabled={Boolean(item.images && item.images[part])}
                                    >
                                      {item.images && item.images[part] ? (
                                        <img 
                                          src={item.images[part]} 
                                          alt={part} 
                                          style={{
                                            width: '40px', 
                                            height: '40px', 
                                            objectFit: 'cover',
                                            borderRadius: '4px'
                                          }} 
                                        />
                                      ) : (
                                        <CameraAltOutlinedIcon style={{ fontSize: '24px' }} />
                                      )}
                                    </IconButton>
                                    <Typography 
                                      variant="caption" 
                                      style={{
                                        fontSize: '10px',
                                        textAlign: 'center',
                                        lineHeight: '1.1',
                                        maxWidth: '60px'
                                      }}
                                    >
                                      {part}
                                    </Typography>
                                  </Grid>
                                ))}
                              </Grid>
                            )}
                            {(index >= 3 && index <= 7) && (
                              <div style={{
                                marginTop: '10px',
                                width: '100%'
                              }}>
                                <input
                                  type="text"
                                  value={index === 3 ? item.validityDate : index === 4 ? item.validityEndDate : item.inputValue}
                                  onChange={(e) => 
                                    {
                                      handleInputChange(0, index, e.target.value, index === 3 ? 'validityDate' : index === 4 ? 'validityEndDate' : 'inputValue')
                                    }
                                  }
                                  placeholder={index === 3 ? "Validity Date" : index === 4 ? "Validity End Date" : item.point}
                                  required
                                  style={{
                                    width: '200px',
                                    paddingLeft: '10px',
                                    height: '35px',
                                    fontSize: '12px',
                                    border: '1px solid #ccc',
                                    padding: '5px',
                                    boxSizing: 'border-box',
                                    borderRadius: '4px'
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                        </div>

                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/3 flex flex-col gap-[16px]">
                  <VehicleIdentity vehicleNo={vehicleNo} sin={shipment.SIN} soNumber={shipment.sale_order} materials={shipment.materials?.map((m: { name: any; }) => m.name).join(', ')} carrier={shipment?.carrier?.name}  />
                  <div className="gateInDetails bg-[#fcfcfc] p-[20px]  rounded-[12px]">
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
                  <div className="vehicleImages bg-[#fcfcfc] p-[20px] rounded-[12px]">
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
                          <div key={index} className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative">
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
                  </div>
                  
                  </div>
                  <div className="bottom fixed bottom-4 w-[89%] h-[56px] px-[8px] bg-[#ffffff] flex items-center">
                    
                    <div className="buttons flex items-center justify-between w-full ">
                     <div className="left">
                      <div onClick={handleNewVehicle} className="button">
                      <button className='text-white'>NEW VEHICLE</button>
                    </div>
                      </div>
                      <div className="right flex items-center justify-end w-full">
                    <div onClick={handleSave} className="button">
                      <button className='text-white'>SAVE</button>
                    </div>
                    <div onClick={handleNext} className="button">
                      <button className='text-white'>{activeStep === steps.length - 1 ? 'FINISH' : 'NEXT'}</button>
                    </div>
                      </div>
                  </div>
                  </div>
                </>}
              {activeStep == 1 &&
                   <>
                  <div className="top md:flex md:flex-row-reverse gap-[24px]">
                    <div className="right w-full">
                      <div className="checkList bg-[#fcfcfc] p-[20px] h-full rounded-[12px]">
                    <div className="body flex flex-col gap-[16px]">
                      <div className="header">
                        <p className='text-[#131722] text-[18px] font-bold'>Checklist</p>
                      </div>
                      <div className="checkListSection">
                      {checklists1.map((item, index) => (
                        <Grid container spacing={2} key={index} className="checklist-item">
                          <Grid item xs={12} sm={6} md={4} className="right-side text-[#71747A] text-[12px]">
                            <Typography className="text-[#71747A]" variant="caption">{item.point}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={8} className="left-side" style={{ display: "flex", justifyContent: "end",height: "40px"}}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={item.isAutomatic}
                                  onChange={(event) => handleCheckboxChange(1, index, event.target.checked)}
                                />
                              }
                              label={<span className="text-[12px]">Automatic Date & Time</span>}
                            />
                          </Grid>
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
                        </Grid>
                      ))}
                      </div>
                    </div>
                  </div>
                    </div>
                    <div className="left flex flex-col gap-[16px]">
                      <VehicleGateIn vehicleNo={vehicleNo} driver={shipment.driver?.name} mobile={shipment.driver?.mobile} trackingMethod={trackingMethod} lastLocation={lastLocation} lastLocationAt={lastLocationAt} />
                      
                  {/* <DriverDetails /> */}
                  <div className="gateInDetails bg-[#fcfcfc] p-[20px] rounded-[12px]">
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
                  <div className="vehicleImages bg-[#fcfcfc] p-[20px] rounded-[12px]">
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
                          <div key={index} className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative">
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
                    </div>
                  </div>
                  
                  <div className="bottom fixed bottom-4 w-[89%] h-[56px] px-[8px] bg-[#ffffff] flex items-center">
                    
                    <div className="buttons flex items-center justify-between w-full ">
                     <div className="left">
                      <div onClick={handleNewVehicle} className="button">
                      <button className='text-white'>NEW VEHICLE</button>
                    </div>
                      </div>
                      <div className="right flex items-center justify-end w-full">
                    <div onClick={handleSave} className="button">
                      <button className='text-white'>SAVE</button>
                    </div>
                    <div onClick={handleNext} className="button">
                      <button className='text-white'>{activeStep === steps.length - 1 ? 'FINISH' : 'NEXT'}</button>
                    </div>
                      </div>
                  </div>
                  </div>
                </>}
              {activeStep == 2 &&
                <>
                  <div className="top md:flex md:flex-row-reverse gap-[24px]">
                    <div className="right w-full">
                      <div className="checkList bg-[#fcfcfc] p-[20px] h-full rounded-[12px]">
                    <div className="body flex flex-col gap-[16px]">
                      <div className="header">
                        <p className='text-[#131722] text-[18px] font-bold'>Checklist</p>
                      </div>
                      <div className="checkListSection" style={{height: "450px", overflow: "scroll"}}>
                      {checklists2.map((item, index) => (
                 <div key={index} className="flex py-[12px] border-b border-[#E6E8EC]">
                 <div className="left-side flex-grow">
                   <Typography className="text-[#71747A]" variant="caption">{item.point}</Typography>
                 </div>
                  <div className="right-side flex flex-col items-end gap-[8px] w-[200px]">
                    {index <= 4 && (
                    <select
                      value={item.dropdown || ''}
                      onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                        handleDropdownChange(2, index, event.target.value);
                      }}
                      disabled={!allImagesUploaded(item) || item.dropdownDisabled}
                      style={{
                        minWidth: '200px',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: !allImagesUploaded(item) || item.dropdownDisabled ? '#a9a9a9' : 'white', 
                        cursor: !allImagesUploaded(item) || item.dropdownDisabled ? 'not-allowed' : 'pointer',
                        color: !allImagesUploaded(item) || item.dropdownDisabled ? 'not-allowed' : 'pointer' 
                      }}
                    >
                      <option value="" disabled>{item.dropdown ? item.dropdown : 'Select'}</option>
                      {index === 1 ? (
                        <>
                          <option value="Covered">Covered</option>
                          <option value="Not Covered">Not Covered</option>
                        </>
                      ) : index === 2 ? (
                        <>
                          <option value="Done">Done</option>
                          <option value="Not Done">Not Done</option>
                        </>
                      ) : (
                        <>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </>
                      )}
                    </select>
                    )}
                    {index === 0 && (
                      <Grid 
                        container 
                        spacing={1} 
                        className="camera-icons"
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-around',
                          maxWidth: '100%',
                          marginBottom: '16px',
                          paddingRight: '20px'
                        }}
                      >
                      {['Floor Body', 'Floor', 'Left', 'Right', 'Rear'].map(part => (
                          <Grid 
                            item 
                            xs={4} 
                            sm={4} 
                            key={part}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              marginBottom: '8px'
                            }}
                          >
                            <IconButton 
                              onClick={() => handleImageCapture(2, index, part)}
                              style={{
                                padding: '4px',
                                marginBottom: '4px'
                              }}
                              disabled={Boolean(item.images && item.images[part])}
                            >
                              {item.images && item.images[part] ? (
                                <img 
                                  src={item.images[part]} 
                                  alt={part} 
                                  style={{
                                    width: '40px', 
                                    height: '40px', 
                                    objectFit: 'cover',
                                    borderRadius: '4px'
                                  }} 
                                />
                              ) : (
                                <CameraAltOutlinedIcon style={{ fontSize: '24px' }} />
                              )}
                            </IconButton>
                            <Typography 
                              variant="caption" 
                              style={{
                                fontSize: '10px',
                                textAlign: 'center',
                                lineHeight: '1.1',
                                maxWidth: '60px'
                              }}
                            >
                              {part}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                    {index === 1 && (
                    <Grid container spacing={1} className="camera-icons">
                      {['Photo 1', 'Photo 2'].map(part => (
                        <Grid item xs={6} key={part}>
                          <IconButton 
                            onClick={() => handleImageCapture(2, index, part)}
                            style={{
                              padding: '4px',
                              marginBottom: '4px'
                            }}
                            disabled={Boolean(item.images && item.images[part])}
                          >
                            {item.images && item.images[part] ? (
                              <img 
                                src={item.images[part]} 
                                alt={part} 
                                style={{width: '40px', height: '40px', objectFit: 'cover',
                                  borderRadius: '4px'}} 
                              />
                            ) : (
                              <CameraAltOutlinedIcon style={{ fontSize: '24px' }} />
                            )}
                          </IconButton>
                          <Typography variant="caption">
                            {part}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                    )}
                    {index === 2 && (
                      <div style={{ marginTop: '10px', width: '100%' }}>
                        <input
                          type="text"
                          value={item.inputValue}
                          onChange={(e) => handleInputChange(2, index, e.target.value, 'inputValue')}
                          placeholder="Entry of Weight in Pick up Slip"
                          required
                          style={{
                            width: '200px',
                            height: '35px',
                            paddingLeft: '10px',
                            fontSize: '12px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            padding: '5px',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
                      </div>
                    </div>
                  </div>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col gap-[16px]" >
                      <VehicleGateIn vehicleNo={vehicleNo} driver={shipment.driver?.name} mobile={shipment.driver?.mobile} trackingMethod={trackingMethod} lastLocation={lastLocation} lastLocationAt={lastLocationAt} />
                  <div className="gateInDetails bg-[#fcfcfc] p-[20px] rounded-[12px]">
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
                  <div className="vehicleImages bg-[#fcfcfc] p-[20px] rounded-[12px]">
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
                          <div key={index} className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative">
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
                    </div>
                  </div>
                  <div className="bottom fixed bottom-4 w-[89%] h-[56px] px-[8px] bg-[#ffffff] flex items-center">
                    
                    <div className="buttons flex items-center justify-between w-full ">
                     <div className="left">
                      <div onClick={handleNewVehicle} className="button">
                      <button className='text-white'>NEW VEHICLE</button>
                    </div>
                      </div>
                      <div className="right flex items-center justify-end w-full">
                    <div onClick={handleSave} className="button">
                      <button className='text-white'>SAVE</button>
                    </div>
                    <div onClick={handleNext} className="button">
                      <button className='text-white'>{activeStep === steps.length - 1 ? 'FINISH' : 'NEXT'}</button>
                    </div>
                      </div>
                  </div>
                  </div>
                  
                  
                </>}
              {activeStep == 3 &&
                <>
                  <div className="top md:flex md:flex-row-reverse gap-[24px]">
                    <div className="right w-full">
                      <div className="checkList bg-[#fcfcfc] p-[20px] h-full rounded-[12px]">
                    <div className="body flex flex-col gap-[16px]">
                      <div className="header">
                        <p className='text-[#131722] text-[18px] font-bold'>Checklist</p>
                      </div>
                      <div className="checkListSection" style={{height: "450px", overflow: "scroll"}}>
                      {checklists3.map((item, index) => (
                        <div key={index} className="flex py-[12px] border-b border-[#E6E8EC]">
                        <div className="left-side flex-grow">
                          <Typography className="text-[#71747A]" variant="caption">{item.point}</Typography>
                        </div>
                        <div className="right-side flex flex-col items-end gap-[8px] w-[200px]">
                            {index !== 3 && index !== 4 && (
                              <select
                                value={item.dropdown || ''}
                                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                  handleDropdownChange(3, index, event.target.value);
                                }}
                                disabled={item.dropdownDisabled}
                                style={{
                                  minWidth: '200px',
                                  padding: '8px',
                                  border: '1px solid #ccc',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  backgroundColor: item.dropdownDisabled ? '#a9a9a9' : 'white',
                                  color: item.dropdownDisabled ? '#555' : 'black',
                                  cursor: item.dropdownDisabled ? 'not-allowed' : 'pointer'
                                }}
                              >
                                <option value="" disabled>{item.dropdown ? item.dropdown : 'Select'}</option>
                                {index === 0 || index === 1 ? (
                                  <>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </>
                                ) : index === 2 ? (
                                  <>
                                    <option value="Done">Done</option>
                                    <option value="Not Done">Not Done</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="Provided">Provided</option>
                                    <option value="Not Provided">Not Provided</option>
                                  </>
                                )}
                              </select>
                            )}
                            {index === 0 && (
                              <Grid 
                                container 
                                spacing={1} 
                                className="camera-icons" 
                                style={{
                                  display: 'flex', 
                                  flexWrap: 'wrap',
                                  justifyContent: 'space-around', 
                                  maxWidth: "100%", 
                                  marginBottom: '16px'
                                }}
                                
                              >
                                {['First Layer', 'Second Layer', 'Third Layer', 'Fourth Layer', 'Post Loading'].map(part => (
                                  <Grid 
                                    item 
                                    xs={4} 
                                    sm={4} 
                                    key={part} 
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      marginBottom: '8px',
                                    }}
                                    
                                  >                                 
                                  <IconButton 
                                    onClick={() => handleImageCapture(3, index, part)}
                                    style={{
                                      padding: '4px',
                                      marginBottom: '4px'
                                    }}
                                    disabled={Boolean(item.images && item.images[part])}
                                  >
                                  {item.images && item.images[part] ? (
                                    <img 
                                      src={item.images[part]} 
                                      alt={part} 
                                      style={{
                                        width: '40px', 
                                        height: '40px', 
                                        objectFit: 'cover',
                                        borderRadius: '4px'
                                      }} 
                                    />
                                  ) : (
                                    <CameraAltOutlinedIcon style={{ fontSize: '24px' }} />
                                  )}
                                  </IconButton>  
                                    <Typography 
                                      variant="caption" 
                                      style={{
                                        textAlign: 'center',
                                        fontSize: '0.7rem',
                                        lineHeight: '1.1',
                                        maxWidth: '80px'
                                      }}
                                    >
                                      {part}
                                    </Typography>
                                  </Grid>
                                ))}
                              </Grid>
                            )}
                            {index === 2 && (
                              <>
                                <Grid container justifyContent="center">
                                                  <Grid item>
                                                    <IconButton 
                                                      onClick={() => handleImageCapture(3, index)}
                                                      disabled={Boolean(item.image)}
                                                    >
                                                      {item.image ? (
                                                        <img src={item.image} alt="Captured" style={{width: '40px', height: '40px', borderRadius: "4px"}} />
                                                      ) : (
                                                        <CameraAltOutlinedIcon />
                                                      )}
                                                    </IconButton>
                                                    <Typography variant="caption">Camera</Typography>
                                                  </Grid>
                                                </Grid>
                                <div style={{ marginTop: '10px', width: '100%' }}>
                                  <input
                                    type="text"
                                    value={item.inputValue}
                                    onChange={(e) => handleInputChange(3,index, e.target.value, 'inputValue')}
                                    placeholder="Seal No. (Optional)"
                                    style={{
                                      width: '200px',
                                      height: '35px',
                                      fontSize: '12px',
                                      border: '1px solid #ccc',
                                      borderRadius: '4px',
                                      padding: '5px',
                                      boxSizing: 'border-box',
                                      marginTop: '-5px'
                                    }}
                                  />
                                </div>
                              </>
                            )}
                            {index === 3 && (
                                <Grid container justifyContent="center">
                                                  <Grid item>
                                                    <IconButton 
                                                      onClick={() => handleImageCapture(3, index)}
                                                      disabled={Boolean(item.image)}
                                                    >
                                                      {item.image ? (
                                                        <img src={item.image} alt="Captured" style={{width: '50px', height: '50px'}} />
                                                      ) : (
                                                        <CameraAltOutlinedIcon />
                                                      )}
                                                    </IconButton>
                                                    <Typography variant="caption">Weighment Slip Photo(Optional)</Typography>
                                                  </Grid>
                                                </Grid>
                            )}
                            {index === 4 && item.subItems && (
                              <Grid container spacing={1}>
                                {item.subItems.map((subItem, subIndex) => (
                                  <Grid item xs={12} key={subIndex}>
                                    <Typography variant="caption">{subItem.name}</Typography>
                                    <select
                                      value={subItem.dropdown}
                                      onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                        handleDropdownChange(3, index, event.target.value, subIndex);
                                      }}
                                      style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        marginTop: '4px'
                                      }}
                                    >
                                      <option value="" disabled>Select</option>
                                      <option value="Provided">Provided</option>
                                      <option value="Not Provided">Not Provided</option>
                                    </select>
                                  </Grid>
                                ))}
                              </Grid>
                            )}
                          </div>
                        </div>
                      ))}
                      </div>
                    </div>
                  </div>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col gap-[16px]">
                      <VehicleGateIn vehicleNo={vehicleNo} driver={shipment.driver?.name} mobile={shipment.driver?.mobile} trackingMethod={trackingMethod} lastLocation={lastLocation} lastLocationAt={DateTime.fromISO(shipment.trip_tracker?.last_location_at).toFormat('dd-MMM-yyyy hh:mm a').toLocaleString()} />
                  <div className="gateInDetails bg-[#fcfcfc] p-[20px]  rounded-[12px]">
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
                  <div className="vehicleImages bg-[#fcfcfc] p-[20px] rounded-[12px]">
                    <div className="body flex flex-col gap-[16px]">
                      <div className="header">
                        <p className='text-[#131722] text-[18px] font-bold'>Vehicle and other images</p>
                      </div>
                      <div className="uploadSection flex gap-[16px]">
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
                        <div key={index} className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative">
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
                    </div>
                  </div>
                  <div className="bottom fixed bottom-4 w-[89%] h-[56px] px-[8px] bg-[#ffffff] flex items-center">
                    
                    <div className="buttons flex items-center justify-between w-full ">
                     <div className="left">
                      <div onClick={handleNewVehicle} className="button">
                      <button className='text-white'>NEW VEHICLE</button>
                    </div>
                      </div>
                      <div className="right flex items-center justify-end w-full">
                    <div onClick={handleSave} className="button">
                      <button className='text-white'>SAVE</button>
                    </div>
                    <div onClick={handleNext} className="button">
                      <button className='text-white'>{activeStep === steps.length - 1 ? 'FINISH' : 'NEXT'}</button>
                    </div>
                      </div>
                  </div>
                  </div>
                  
                  
                  
                </>}
              {activeStep == 4 &&
                <>
                  <div className="top md:flex md:flex-row-reverse gap-[24px]">
                    <div className="right w-full">
                      <div className="checkList bg-[#fcfcfc] p-[20px] h-full rounded-[12px]">
                        <div className="body flex flex-col gap-[16px]">
                          <div className="header">
                            <p className='text-[#131722] text-[18px] font-bold'>Checklist</p>
                          </div>
                          <div className="checkListSection" style={{height: "450px", overflow: "scroll"}}>
                            {checklists4.map((item, index) => (
                              <div key={index} className="flex py-[12px] border-b border-[#E6E8EC]">
                                <div className="left-side flex-grow">
                                  <Typography className="text-[#71747A]" variant="caption">{item.point}</Typography>
                                </div>
                                <div className="right-side flex flex-col items-end gap-[8px] w-[200px]">
                                  {index <= 2 && (
                                    <div className="custom-select" style={{
                                      marginBottom: '10px'
                                    }}>
                                      <select
                                        value={item.dropdown || ''}
                                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                          handleDropdownChange(4, index, event.target.value);
                                        }}
                                        disabled={!allImagesUploaded(item) || item.dropdownDisabled}
                                        style={{ 
                                          minWidth: '200px',
                                          padding: '8px',
                                          border: '1px solid #ccc',
                                          borderRadius: '4px',
                                          fontSize: '12px',
                                          backgroundColor: !allImagesUploaded(item) || item.dropdownDisabled ? '#a9a9a9' : 'white', 
                                          color: !allImagesUploaded(item) || item.dropdownDisabled ? '#555' : 'black', 
                                          cursor: !allImagesUploaded(item) || item.dropdownDisabled ? 'not-allowed' : 'pointer'
                                        }}
                                      >
                                        <option value="" >Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                      </select>
                                    </div>
                                  )}

                                  {index === 0 && (
                                    <Grid container justifyContent="center">
                                      <Grid item>
                                        <IconButton 
                                          onClick={() => handleImageCapture(4, index)}
                                          disabled={Boolean(item.image)}
                                        >
                                          {item.image ? (
                                            <img src={item.image} alt="Captured" style={{width: '40px', height: '40px',borderRadius: "4px"}} />
                                          ) : (
                                            <CameraAltOutlinedIcon />
                                          )}
                                        </IconButton>
                                        <Typography variant="caption">Camera</Typography>
                                      </Grid>
                                    </Grid>
                                  )}

                                  {index === 0  && (
                                    <div style={{
                                      marginTop: '10px',
                                      width: '100%'
                                    }}>
                                      <input
                                        type="text"
                                        value={item.inputValue}
                                        onChange={(e) => 
                                          handleInputChange(4, index, e.target.value, 'inputValue')
                                        }
                                        placeholder="Enter Seal No. (If Available)"
                                        style={{
                                          width: '200px',
                                          paddingLeft: '10px',
                                          height: '35px',
                                          fontSize: '12px',
                                          border: '1px solid #ccc',
                                          padding: '5px',
                                          boxSizing: 'border-box',
                                          borderRadius: '4px'
                                        }}
                                      />
                                    </div>
                                  )}
                                  { index === 1 && (
                                    <div style={{
                                      marginTop: '10px',
                                      width: '100%'
                                    }}>
                                      <input
                                        type="text"
                                        value={item.inputValue}
                                        onChange={(e) => 
                                          handleInputChange(4, index, e.target.value, 'inputValue')
                                        }
                                        placeholder="Enter Commercial Invoice Nos"
                                        required
                                        style={{
                                          width: '200px',
                                          paddingLeft: '10px',
                                          height: '35px',
                                          fontSize: '12px',
                                          border: '1px solid #ccc',
                                          padding: '5px',
                                          boxSizing: 'border-box',
                                          borderRadius: '4px'
                                        }}
                                      />
                                      <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>
                      Enter up to 5 seal numbers.
                    </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col gap-[16px]">
                      <VehicleGateIn vehicleNo={vehicleNo} driver={shipment.driver?.name} mobile={shipment.driver?.mobile} trackingMethod={trackingMethod} lastLocation={lastLocation} lastLocationAt={lastLocationAt} />
                      <div className="gateInDetails bg-[#fcfcfc] p-[20px] rounded-[12px]">
                        <div className="body">
                          <div className="detailsSection">
                            <div className="label">
                              Vehicle gate out time
                            </div>
                            <div className="value">
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MobileDateTimePicker className='w-full h-[48px] mt-[4px]'
                                  value={gateOutDate}
                                  onChange={(newValue) => {
                                    setGateOutDate(newValue);
                                  }}
                                  renderInput={(params) => <TextField {...params} />} />
                              </LocalizationProvider>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="vehicleImages bg-[#fcfcfc] p-[20px] rounded-[12px]">
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
                              <input type="file" multiple className='opacity-0 absolute w-full h-full z-2' onChange={handleVehicleGateOutFileChange} />
                              <CollectionsOutlinedIcon className='text-[#1A1A1A]' />
                              <p className='text-[#1A1A1A] text-[10px]'>Gallery</p>
                            </div>
                          </div>
                          <div className="uploadSection flex gap-[16px]">
                            {vehcileGateOutFiles.map((file, index) => (
                              <div key={index} className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative">
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
                      </div>
                    </div>
                  </div>
                  <div className="bottom fixed bottom-4 w-[89%] h-[56px] px-[8px] bg-[#ffffff] flex items-center">
                    <div className="buttons flex items-center justify-between w-full ">
                      <div className="left">
                        <div onClick={handleNewVehicle} className="button">
                          <button className='text-white'>NEW VEHICLE</button>
                        </div>
                      </div>
                      <div className="right flex items-center justify-end w-full">
                        <div onClick={handleSave} className="button">
                          <button className='text-white'>SAVE</button>
                        </div>
                        <div onClick={handleNext} className="button">
                          <button className='text-white'>{activeStep === steps.length - 1 ? 'FINISH' : 'NEXT'}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              }
              <CameraModal
                isOpen={showCamera && !submittedImages[`${currentChecklistIndex}-${currentImageIndex}-${currentImagePart || 'main'}`]}
                onClose={handleCloseCamera}
                onCapture={handleCaptureComplete}
              />

            </div>
          )}

        </div></>}


    </div></>
  );
}

export default SecurityForm
