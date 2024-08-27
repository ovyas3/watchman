'use client'
import React, { useEffect, useRef, useState } from 'react'
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { FormControlLabel, Grid, IconButton, Typography, debounce, RadioGroup, Radio, FormControl, FormLabel, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
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
import { DatePicker } from '@mui/x-date-pickers';
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '../../assets/cancel.svg';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

type props = {
  searchParams: any,
};


interface ChecklistItem {
  submitted?: any;
  subInputs?: any;
  subDropdowns?: any;
  previousDate?: any;
  previousInputValue?: string;
  option1?: string;
  option2?: string;
  date?: any;
  validate?: any;
  point: string;
  dropdown?: string;
  images?: { [key: string]: string };
  image?: string;
  inputValue?: string;
  checked?: boolean;
  isAutomatic?: boolean;
  subItems?: [
    {point: string; dropdown?: string ; inputValue?:string;},
    {point: string; dropdown?: string ; inputValue?:string;},
    {point: string; dropdown?: string ; inputValue?:string;},
    {point: string; dropdown?: string ; inputValue?:string;}
  ] | [];
  dropdownDisabled?: boolean;
  yesNo?: string | null;
}

interface ChecklistUpdatePayload {
  _id: string;
  checklistIndex: number;
  itemIndex: number;
  field: string;
  value: string | undefined;
  subItemIndex?: number;
}

interface ImageUrls {
  [key: string]: any | { [key: string]: any };
}

interface ImageUploadSlotProps {
  image: string;
  onCapture: () => void;
  onRemove: () => void;
  label: string;
  checklistIndex: number;
  index: number;
  part?: string;
}
interface RejectedVehicleInfo {
  vehicleNo: string;
  saleOrder: string;
  SIN: string;
  transporterName: string,
  photoEvidence: (string | undefined)[];
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
  const [saleOrder, setsaleOrder] = useState(searchParams.saleOrder);
  const [transporterName, settransporterName] = useState(searchParams.transporterName)
  const [SIN, setSIN] = useState(searchParams.SIN);
  const [shipment, setShipment] = useState<any>({});
  const [trackingMethod, setTrackingMethod] = useState('');
  const [lastLocation, setLastLocation] = useState('');
  const [lastLocationAt, setLastLocationAt] = useState('');
  const [securityCheck, setSecurityCheck] = useState<any>({});
  const addSnackbar = useSnackbar();
  const [imageUrls, setImageUrls] = useState<ImageUrls>({});
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
  const [vehicleReportingFiles, setVehicleReportingFiles] = useState<{ name: string; preview: string }[]>([]);
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
  const [savedStages, setSavedStages] = useState<Set<number>>(new Set());
  const [previousStageData, setPreviousStageData] = useState<any>({});
  const [isSaved, setIsSaved] = useState(false);
  const [showSaveReminder, setShowSaveReminder] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [isCurrentStageSaved, setIsCurrentStageSaved] = useState(false);
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const [currentUploadIndex, setCurrentUploadIndex] = useState<any>();
  const [localImages, setLocalImages] = useState<{ [key: string]: string }>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentImageParts, setCurrentImageParts] = useState<string[]>(['main']);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [localStageSaves, setLocalStageSaves] = useState<{ [key: string]: any }>({});
  const [rejectedVehicleInfo, setRejectedVehicleInfo] = useState<RejectedVehicleInfo>({
    vehicleNo: '',
    saleOrder: '',
    SIN: '',
    transporterName: '',
    photoEvidence: []
  });


  const [checklists0, setChecklists0] = useState<ChecklistItem[]>([
    {
      point: '1.Is the vehicle body in satisfactory condition for transport?',
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
      point: '2.Does the vehicle have the required 3 tarpaulins for cargo protection?',
      dropdown: '',
      image: ''
    },
    {
      point: '3.Are the tarpaulins in good condition and stitchless as per company standards?',
      dropdown: '',
      image: ''
    },
    {
      point: "4.Has the vehicle's Pollution Under Control (PUC) certificate been verified as valid?",
      dropdown: '',
      image: '',
      dropdownDisabled: true,
      date:''
    },
    {
      point: "5.Has the vehicle's Fitness Certificate been confirmed as current and valid?",
      dropdown: '',
      image: '',
      dropdownDisabled: true,
      date:''
    },
    {
      point: '6.What is the verified carrying capacity of the vehicle in kilograms?',
      inputValue: '',
      image: '',
    },
    {
      point: "7.What is the driver's license number and expiration date of the driver's license?",
      inputValue: '',
      date:'',
    },
    {
      point: "8.Screening Driver to check wheather the person is under alocohol influence or not ?",
      image: '',
      dropdown: '',
    }
  ]);
  
  const [checklists1, setChecklists1] = useState<ChecklistItem[]>([
    {
      point: "1.What is the exact timestamp of the vehicle's gate entry?",
      checked: false,
      inputValue: new Date().toLocaleString(),
    }
  ]);
  
  const [checklists2, setChecklists2] = useState<ChecklistItem[]>([
    {
      point: '1.Has the vehicle body been re-inspected and confirmed to be in good condition?',
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
      point: '2.Is the tarpaulin properly covering the entire bottom surface of the truck prior to loading?',
      dropdown: '',
      images: {
        'Photo 1': '',
        'Photo 2': ''
      },
      dropdownDisabled: true
    },
    {
      point: '3.Has the cross-check between Pick Up Slip weight and Vehicle Passing weight been completed? (In Kgs)',
      dropdown: '',
      inputValue: ''
    }
  ]);
  
  const [checklists3, setChecklists3] = useState<ChecklistItem[]>([
    {
      point: '1.Has the layer-wise loading and stuffing been executed according to the approved Stacking Plan?',
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
      point: '2.Does the quantity of loaded material correspond precisely with the quantity listed in the Pick up List?',
      dropdown: ''
    },
    {
      point: '3.Has the truck been properly sealed, and if so, what is the Seal Number?',
      dropdown: '',
      image: '',
      inputValue: '',
      dropdownDisabled: true
    },
    {
      point: '4.What is the final loaded weight in kilograms as shown in the provided image, and does the image include the Weigh Bridge Slip, if applicable?',
      image: ''
    },
    {
      point: "5.Have all required documents been provided and verified?",
      subItems: [
        {
          point: '1.Has the Invoice Document been provided?',
          dropdown: '',
          inputValue: ''
        },
        {
          point: '2.Has a valid E-way Bill been provided (if applicable)?',
          dropdown: '',
          inputValue: ''
        },
        {
          point: '3.Has the Material Test Certificate (MTC) been provided (if applicable)?',
          dropdown: '',
          inputValue: ''
        },
        {
          point: '4.Has the Lorry Receipt (LR) Slip or Docket Slip been provided?',
          dropdown: '',
          inputValue: ''
        },
    ]
    },
  ]);
  
  const [checklists4, setChecklists4] = useState<ChecklistItem[]>([
    {
      point: '1.Has the final truck sealing been completed, and what is the Seal Number (if applicable)?',
      dropdown: '',
      image: '',
      inputValue: '',
      dropdownDisabled: true
    },
    {
      point: '2.What are the Commercial Invoice Numbers associated with this shipment?',
      dropdown: '',
      inputValue: '',
    },
    {
      point: '3.Have the E-way bill and Invoice been verified to have valid and current dates?',
      dropdown: ''
    }
  ]);

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
    setIsUploadPopupOpen(true);
  };

  const handleRemoveImage = (checklistIndex: number, index: number, part?: string) => {
    const imageKey = `${checklistIndex}-${index}-${part || 'main'}`;
    if (submittedImages[imageKey]) {
      toast.info('This image has already been submitted and cannot be removed');
      return;
    }
    setLocalImages(prev => {
      const newLocalImages = { ...prev };
      delete newLocalImages[imageKey];
      return newLocalImages;
    });
    const setChecklistFunction = [setChecklists0, setChecklists1, setChecklists2, setChecklists3, setChecklists4][checklistIndex];
    setChecklistFunction((prevChecklists: any) => {
      return prevChecklists.map((item: any, i: number) => {
        if (i === index) {
          if (part && item.images) {
            const newImages = { ...item.images };
            delete newImages[part];
            return { ...item, images: newImages };
          } else if (item.image !== undefined) {
            return { ...item, image: '' };
          }
        }
        return item;
      });
    });
  };

  const ImageUploadSlot: React.FC<ImageUploadSlotProps> = ({ image, onCapture, onRemove, label, checklistIndex, index, part }) => {
    const imageKey = `${checklistIndex}-${index}-${part || 'main'}`;
    const isSubmitted = submittedImages[imageKey];
  
    return (
      <div 
        className="border p-2 text-center cursor-pointer h-[150px] w-[150px] flex items-center justify-center flex-col relative" 
        onClick={!image && !isSubmitted ? onCapture : undefined}
        style={{border: "1px solid #DFE3E8", borderRadius: "5px"}}
      >
        {image ? (
          <div className="relative w-full h-full">
            <img 
              src={image} 
              alt={label} 
              className="w-full h-full object-cover"
            />
          <div 
            className="absolute top-[-12px] right-[-10px] cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            style={{borderRadius: "50%"}}
          >
            <Image 
              src={CancelIcon}
              alt="cancelIcon"
              width={20}
              height={20}
              style={{width: '20px', height: '20px',border: '1px solid rgba(0,0,0,0.1)',backgroundColor: "white", borderRadius: "50%"}}
            />
          </div>
          </div>
        ) 
        : (
          <>
            <div className="mb-2">
              <CameraAltOutlinedIcon />
            </div>
            <p>Add <span style={{color : "#2962FF"}}>{label}</span> of the Vehicle</p>
          </>
        )}
      </div>
    );
  };




  const handleCloseCamera = () => {
    setShowCamera(false);
    setCurrentImageIndex(null);
    setCurrentImagePart(null);
  }; 
  
  const handleCameraCapture = (part: string) => {
    setShowCamera(true);
    setCurrentImagePart(part);
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
  
      const imageKey = `${currentChecklistIndex}-${currentImageIndex}-${currentImagePart || 'main'}`;

      setLocalImages(prev => ({ ...prev, [imageKey]: imageSrc }));
  
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
  
      toast.success('Image captured successfully');
    } catch (error) {
      console.error('Error capturing image:', error);
      toast.error(`Error capturing image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      setShowCamera(false);
    }
  };

  const YesNoSelection: React.FC<{
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    label?: string;
  }> = ({ value, onChange, disabled = false, label = "Select" }) => (
    <FormControl component="fieldset" disabled={disabled}>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup row value={value} onChange={(e) => onChange(e.target.value)}>
        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="No" control={<Radio />} label="No" />
      </RadioGroup>
    </FormControl>
  );

  function getYesNoValue(item: any, index: number): string {
    return item[`yesNo${index}`] || '';
  }
  
  
  const handleYesNoChange = (uploadIndex: number, value: string, field: string) => {
    setChecklists3((prevChecklists: any) => {
      const newChecklists = [...prevChecklists];
      newChecklists[uploadIndex] = { ...newChecklists[uploadIndex], [field]: value };
      if (value === "No" && (field === "yesNo2" || field === "yesNo3")) {
        newChecklists[uploadIndex][field.replace("yesNo", "input")] = "";
      }
      return newChecklists;
    });
  };
  
  const handleInputChange = (uploadIndex: number, value: string, field: string) => {
    setChecklists3((prevChecklists: any) => {
      const newChecklists = [...prevChecklists];
      newChecklists[uploadIndex] = { ...newChecklists[uploadIndex], [field]: value };
      return newChecklists;
    });
  };

  const saveImagesToServer = async (checklistIndex: number, itemIndex: number) => {
    try {
      setIsUploading(true);
  
      if (!session?.user?.data?.accessToken) {
        throw new Error('Authentication token is missing');
      }
  
      const uploadId = securityCheck?._id || vehicleNo;
      if (!uploadId) {
        throw new Error('No valid ID for upload');
      }
  
      const checklists = [checklists0, checklists1, checklists2, checklists3, checklists4];
      
      const currentChecklist = checklists[checklistIndex];
      
      if (!currentChecklist) {
        throw new Error('Invalid checklist index');
      }
  
      const currentItem: ChecklistItem = currentChecklist[itemIndex];
      let imagesToUpload: {[key: string]: string} = {};
  
      if ('images' in currentItem && currentItem.images !== undefined) {
        imagesToUpload = Object.entries(currentItem.images || {})
          .filter(([part, image]) => {
            const imageKey = `${checklistIndex}-${itemIndex}-${part}`;
            return localImages[imageKey] && !submittedImages[imageKey];
          })
          .reduce((acc, [part, image]) => ({ ...acc, [part]: image }), {});
      } else if (currentItem.image) {
        const imageKey = `${checklistIndex}-${itemIndex}-main`;
        if (localImages[imageKey] && !submittedImages[imageKey]) {
          imagesToUpload = { main: currentItem.image };
        }
      }

      for (let [part, image] of Object.entries(imagesToUpload)) {
        if (!image || image.startsWith('https://')) continue;

        const formData = new FormData();
        formData.append('images', dataURItoBlob(image), 'image.jpg');
        formData.append('stage', `stage${itemIndex + 1}`);
        formData.append('_id', uploadId);

        formData.append('pointName', currentItem.point);
        formData.append('imageSubname', part);
  
        const headers = {
          'Authorization': `bearer ${session.user.data.accessToken} Shipper ${session.user.data.default_unit}`,
        };

        const url = 'https://dev-api.instavans.com/api/thor/security/save_stage_images';
        const response = await fetch(url, {
          method: 'POST',
          body: formData,
          headers: headers
        });
        if (!response.ok) {
          throw new Error(`Server error: ${await response.text()}`);
        }

        const data = await response.json();

        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          const s3Link = data.data[0];
          if (!imageUrls[currentItem.point]) {
            imageUrls[currentItem.point] = {};
          }
          imageUrls[currentItem.point][part] = s3Link;
        } 
      else {
        console.error('Unexpected server response:', data);
        throw new Error('Unexpected server response format');
      }
      }
      setImageUrls({...imageUrls});

      const updatedChecklists = [...checklists];
      const updatedItem = { ...updatedChecklists[checklistIndex][itemIndex] };
      if ('images' in updatedItem) {
        updatedItem.images = imageUrls[currentItem.point];
      } else if ('image' in updatedItem) {
        updatedItem.image = imageUrls[currentItem.point].main;
      }
      updatedChecklists[checklistIndex][itemIndex] = updatedItem;

    switch(checklistIndex) {
      case 0: setChecklists0(updatedChecklists[0]); break;
      case 1: setChecklists1(updatedChecklists[1]); break;
      case 2: setChecklists2(updatedChecklists[2]); break;
      case 3: setChecklists3(updatedChecklists[3]); break;
      case 4: setChecklists4(updatedChecklists[4]); break;
    }

  
      const newSubmittedImages = { ...submittedImages };
      if ('images' in currentItem) {
        Object.keys(currentItem.images || {}).forEach(part => {
          const imageKey = `${checklistIndex}-${itemIndex}-${part}`;
          if (localImages[imageKey]) {
            newSubmittedImages[imageKey] = true;
          }
        });
      } else if (currentItem.image) {
        const imageKey = `${checklistIndex}-${itemIndex}-main`;
        if (localImages[imageKey]) {
          newSubmittedImages[imageKey] = true;
        }
      }
      setSubmittedImages(newSubmittedImages);
  
      setLocalImages({});
      return updatedItem;

      // toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
      if (error instanceof Error) {
        if (error.message === 'Unexpected server response format') {
          toast.warning('Image uploaded, but server response was unexpected. Using original image URL.');
        } else {
          toast.error(`Error uploading images: ${error.message}`);
        }
      } else {
        toast.error('An unknown error occurred while uploading images');
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  

  useEffect(() => {
    const stageKey = `stage${activeStep + 1}`;
    const currentChecklist = [checklists0, checklists1, checklists2, checklists3, checklists4][activeStep];
  
    if (!previousStageData[stageKey]) {
      const checklistData = getChecklistForStage(activeStep + 1, currentChecklist);
  
      setPreviousStageData((prev: any) => {
        const newData = {
          ...prev,
          [stageKey]: checklistData,
        };
        return newData;
      });
    }
  }, [activeStep, previousStageData]); 
  

  useEffect(() => {
    const checklists = [checklists0,checklists1, checklists2, checklists3, checklists4];
    const currentChecklist = checklists[2];
  }, [currentChecklistIndex, currentUploadIndex]);
  

  const getChecklistForStage = (stage: number, checklist: ChecklistItem[]): any[] => {
    switch (stage) {
      case 1:
        return checklist.map((item, index) => {
          const result: any = {
            point: item.point
          };
          if (item.dropdown !== undefined) result.dropdown = item.dropdown;
          if (item.inputValue !== undefined) result.inputValue = item.inputValue;
          if (item.images && Object.values(item.images).some(img => img)) result.images = item.images;
          if (item.image) result.image = item.image;
          if (item.dropdownDisabled !== undefined) result.dropdownDisabled = item.dropdownDisabled;
          if (item.date !== undefined) result.date = item.date;

          return result;
        });
      case 2:
        return checklist.map(item => {
          const result: any = {
            point: item.point
          };
          if (item.checked !== undefined) result.checked = item.checked;
          else result.checked = false;  
          result.timestamp = new Date();  
          return result;
        });
      case 3:
        return checklist.map(item => {
          const result: any = {
            point: item.point
          };
          if (item.dropdown !== undefined) result.dropdown = item.dropdown;
          if (item.inputValue !== undefined) result.inputValue = item.inputValue;
          if (item.images && Object.values(item.images).some(img => img)) result.images = item.images;
          if (item.dropdownDisabled !== undefined) result.dropdownDisabled = item.dropdownDisabled;


          return result;
        });
        case 4:
          return checklist.map((item, index) => {

            const result: any = {
              point: item.point
            };

            if (item.subItems) {
              result.subItems = item.subItems.map((subItem: { point: string }) => ({
                point: subItem.point
              }));
            }
          
            if (index === 0) {
              result.dropdown = item.dropdown;
              result.images = item.images;
            }

            if ( index === 1) {
              result.dropdown = item.dropdown;
            }
            
          
            if (index === 2) {
              result.dropdown = item.dropdown;
              result.image = item.image;
            }
            
          
            if (index === 3 ) {
              result.image = item.image;
            }
            
        
            if (index === 4 && item.subItems) {
              result.subItems = item.subItems.map(subItem => ({
                point: subItem.point,
                dropdown: subItem.dropdown,
                inputValue: subItem.inputValue
              }));
            }
            
            return result ;
          });
    
          case 5:
            return checklist.map((item, index) => {
              const result: any = {
                point: item.point
              };
              
            
              if (index === 0) {
                result.dropdown = item.dropdown;
                result.image = item.image;
                if (item.inputValue !== undefined) result.inputValue = item.inputValue;
              }
              
     
              if (index === 1) {
                result.inputValue = item.inputValue;
              }
              
          
              if (index === 2) {
                result.dropdown = item.dropdown;
              }
              
              return result;
            });
      default:
        return checklist;
    }
  };

  const formatDate = (date: dayjs.Dayjs | Date | string | null | undefined): string | undefined => {
    if (dayjs.isDayjs(date)) {
      return date.toISOString();
    } else if (date instanceof Date) {
      return date.toISOString();
    } else if (typeof date === 'string') {
      const parsedDate = dayjs(date);
      return parsedDate.isValid() ? parsedDate.toISOString() : undefined;
    }
    return undefined;
  };

  // const appendImages = (formData: FormData, files: { preview: string; name: string }[]): boolean => {
  //   let imagesAdded = false;
  //   files.forEach(file => {
  //     const blob = dataURItoBlob(file.preview);
  //     formData.append('images', blob, file.name);
  //     imagesAdded = true;
  //   });
  //   return imagesAdded;
  // };

  const isDropdownNotDone = () => {
    const finalTruckSealing = checklists4.find(item => item.point.includes("Has the final truck sealing been completed"));
    return finalTruckSealing ? finalTruckSealing.dropdown !== 'Yes' : true;
  };
  const handlePageSpecificSave = () => {
    if (isDropdownNotDone()) {
      toast.warn('Final truck sealing is not completed. Please ensure it is done before saving.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    handleSave();
  };

  const handleSave = async () => {
    if (isUploading) {
      return;
    }
    const currentStage = activeStep + 1;
    const stageName = `stage${currentStage}`;
    const currentChecklist = [checklists0, checklists1, checklists2, checklists3, checklists4][activeStep];

  
    let currentStageData = getChecklistForStage(currentStage, currentChecklist);
  
    currentStageData = currentStageData.map(item => {
      const newItem = { ...item };
      if (imageUrls[item.point]) {
        if (typeof imageUrls[item.point] === 'object') {
          const imageKeys = Object.keys(imageUrls[item.point]);
          if (imageKeys.length === 1) {
            newItem.image = imageUrls[item.point][imageKeys[0]];
          } else {
            newItem.images = imageUrls[item.point];
          }
        } else {
          newItem.image = imageUrls[item.point];
        }
      } else {
        // console.log(`No imageUrl found for ${item.point}`);
      }
    
      if (newItem.image && typeof newItem.image === 'string' && newItem.image.startsWith('data:image')) {
        delete newItem.image;
      }
      if (newItem.images) {
        newItem.images = Object.fromEntries(
          Object.entries(newItem.images).filter(([key, value]) => typeof value === 'string' && !value.startsWith('data:image'))
        );
        const imageKeys = Object.keys(newItem.images);
        if (imageKeys.length === 1) {
          newItem.image = newItem.images[imageKeys[0]];
          delete newItem.images;
        }
      }
    
      return newItem;
    });
  
    setLocalStageSaves(prev => ({
      ...prev,
      [stageName]: currentStageData
    }));
  
    const isValid = validateFields(currentStageData, currentStage);
  
    if (!isValid) {
      return;
    }
  
    let hasChanges = false;
  
    if (currentStage === 2) {
      hasChanges = currentStageData.some((item, index) => {
        const prevItem = previousStageData[stageName]?.[index];
        return prevItem === undefined || 
               item.checked !== prevItem.checked;
      });
    } else {
      hasChanges = JSON.stringify(currentStageData) !== JSON.stringify(previousStageData[stageName] || []);
    }
  
    if (!hasChanges && !hasUnsavedChanges) {
      toast.info('No changes detected.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  
    const allFieldsFilled = currentStageData.every(item => {
      if (item.image !== undefined && !item.image) return false;
      if (item.images !== undefined && Object.values(item.images).some(img => !img)) return false;
      if (item.inputValue !== undefined && !item.inputValue) return false;
      if (item.date !== undefined && !item.date) return false;
      if (item.dropdown !== undefined && !item.dropdown) return false;
      return true;
    });

  
    if (!allFieldsFilled) {
      toast.success('Data Saved!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  
    let images = false;
    let formData = new FormData();
    let payload: any = {
      _id: securityCheck._id,
      stage: stageName,
      [stageName]: {
        name: steps[activeStep],
        checklist: currentStageData,
        completed: true,
        completed_at: new Date().toISOString(),
        security: session?.user.data._id,
      }
    };

    console.log("89", payload)
  
    switch (currentStage) {
      case 1:
        payload.vehicle_reporting_date = formatDate(reportingDate);
        break;
      case 2:
        payload.vehicle_gate_in_date = formatDate(gateInDate);
        break;
      case 3:
        payload.load_in_date = formatDate(loadInDate);
        break;
      case 4:
        payload.load_out_date = formatDate(loadOutDate);
        break;
      case 5:
        payload.vehicle_gate_out_date = formatDate(gateOutDate);
        payload.finished_at = new Date().toISOString();
        break;
    }
  

    
  
    try {
  
      const response = await fetch('https://dev-api.instavans.com/api/thor/security/save_stage', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${session?.user.data.accessToken} Shipper ${session?.user.data.default_unit}`,
        }
      });
  
      const data = await response.json();

      if(response.status === 400){
        toast.success('Data saved!', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
  
      if (response.ok) {
        toast.success('Data saved!', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
  
        if (images) {
          await handleImageUpload(formData);
        }
  
        setPreviousStageData((prev: any) => ({
          ...prev,
          [stageName]: JSON.parse(JSON.stringify(currentStageData))
        }));
        setLocalStageSaves(prev => {
          const newSaves = { ...prev };
          delete newSaves[stageName];
          return newSaves;
        });
      } 
      else if (response.status === 401) {
        toast.error('You are unauthorized. Unable to save data.', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        throw new Error('Unexpected error occurred');
      }
    } catch (error: unknown) {
      console.error('Error saving data:', error);
    }
  };

  const handleNext = async () => {
    const currentStage = activeStep + 1;
    const stageName = `stage${currentStage}`;
    const currentChecklist = [checklists0, checklists1, checklists2, checklists3, checklists4][activeStep];
    const currentStageData = getChecklistForStage(currentStage, currentChecklist);
    const isValid = validateFields(currentStageData, currentStage);
  
    if (isValid) {
      let missingMandatoryFields: string[] = [];
  
      if (currentStage === 1) {
        missingMandatoryFields = currentStageData.filter(item => {
          if (item.point === "8.Screening Driver to check wheather the person is under alocohol influence or not ?") {
            if (!item.dropdown) {
              return true; 
            }
            if (item.dropdown === "Yes" && !item.image) {
              return true;
            }
            return false; 
          }
      
          const requiresInput = item.inputValue !== undefined && !item.inputValue;
          const requiresDropdown = item.dropdown !== undefined && !item.dropdown;
          const requiresImages = item.images !== undefined && Object.values(item.images || {}).some(img => !img);
          const requiresImage = item.image !== undefined && !item.image;
          const requiresDate = item.date !== undefined && !item.date;

          const pointsRequiringImage = [
            "Point1",
            "Point2",
            "Point3",
            "Point4",
            "Point5",
            "Point6"
          ];
    
          const requiresImageForPoint = pointsRequiringImage.includes(item.point) || !item.image;
  
          return requiresInput || requiresDropdown || requiresImages || requiresImage || requiresImageForPoint || requiresDate;
        }).map(item => item.point);
  
        if (!reportingDate || !dayjs(reportingDate).isValid()) {
          missingMandatoryFields.push("Vehicle reporting date");
        }
      } else if (currentStage === 2) {
        missingMandatoryFields = currentStageData.filter(item => item.checked === false).map(item => `Checkbox for ${item.point}`);
      }
       else if (currentStage === 3) {
        missingMandatoryFields = currentStageData.filter(item => {
          const requiresInput = item.inputValue !== undefined && !item.inputValue;
          const requiresDropdown = item.dropdown !== undefined && !item.dropdown;
          const requiresImages = item.images !== undefined && Object.values(item.images || {}).some(img => !img);


          return requiresInput || requiresDropdown || requiresImages;
        }).map(item => item.point);
      } 
      else if (currentStage === 4) {
        missingMandatoryFields = currentStageData.flatMap((item, index) => {
          const missingFields = [];
      
          if (index === 0) {
            if (!item.dropdown || !item.images || Object.values(item.images).some(img => !img)) {
              missingFields.push(item.point);
            }
          } else if (index === 1) {
            if (!item.dropdown) {
              missingFields.push(item.point);
            }
          } else if (index === 2) {
            if (!item.dropdown || !item.image) {
              missingFields.push(item.point);
            }
          } 
          // else if (index === 3) {
          //   if (!item.image) {
          //     missingFields.push(item.point);
          //   }
          // }
           else if (index === 4) {
            const subPoints = [
              "1.Has the Invoice Document been provided?",
              "2.Has a valid E-way Bill been provided (if applicable)?",
              "3.Has the Material Test Certificate (MTC) been provided (if applicable)?",
              "4.Has the Lorry Receipt (LR) Slip or Docket Slip been provided?"
            ];

            if (!item.subItems[0].dropdown  || (item.subItems[0].dropdown  === "Yes" && !item.subItems[0].inputValue)) missingFields.push(subPoints[0]);
            
            if (!item.subItems[3].dropdown || (item.subItems[3].dropdown === "Yes" && !item.subItems[3].inputValue)) missingFields.push(subPoints[3]);

            if (item.subItems[1].dropdown  === "Yes" && !item.subItems[1].inputValue) missingFields.push(subPoints[1]);

            if (item.subItems[2].dropdown  === "Yes" && !item.subItems[2].inputValue) missingFields.push(subPoints[2]);
          }
      
          return missingFields;
          
        });
      } else if (currentStage === 5) {
        missingMandatoryFields = currentStageData.filter(item => {
          const requiresInput = item.inputValue !== undefined && !item.inputValue;
          const requiresDropdown = item.dropdown !== undefined && !item.dropdown;
          const requiresImage = item.image !== undefined && !item.image;
  
          if (item.point === "1.Has the final truck sealing been completed, and what is the Seal Number (if applicable)?") {
            return requiresDropdown || requiresImage 
          } else {
            return requiresInput || requiresDropdown || requiresImage;
          }
        }).map(item => {
          if (item.point === "Point1" && item.inputValue === undefined) {
            return "Input box for Point1";
          } else if (item.inputValue === undefined) {
            return `Input box for ${item.point}`;
          } else if (item.dropdown === undefined) {
            return `Selection for ${item.point}`;
          } else if (item.image === undefined) {
            return `Image for ${item.point}`;
          } else {
            return item.point;
          }
        });
      } else {
        missingMandatoryFields = currentStageData.filter(item => !validateFields([item], currentStage)).map(item => item.point);
      }
  
      if (missingMandatoryFields.length > 0) {
        const missingFields = missingMandatoryFields.join(', ');
        toast.error(`Please complete the following mandatory fields: ${missingFields}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
  
      let hasChanges = false;
  
      if (currentStage === 2) {
        hasChanges = hasCheckboxChanges(currentStageData, previousStageData[stageName]);
      } else {
        hasChanges = JSON.stringify(currentStageData) !== JSON.stringify(previousStageData[stageName] || []);
      }

      if (hasChanges) {
        toast.warn('You have unsaved changes. Please save your changes before proceeding.', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // setHasUnsavedChanges(true);
        return; 
      }
  
      if (activeStep === steps.length - 1) {
        router.push('/completed');
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setIsCurrentStageSaved(true);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setIsCurrentStageSaved(true);
    }
  };
  
  const validateFields = (stageData: any[], stage: number): boolean => {
    switch (stage) {
      case 1:
        return stageData.every(item => {
          switch (item.point) {
            case "Is the vehicle body in satisfactory condition for transport?":
              return !!item.dropdown && Object.values(item.images).every(img => !!img);
            case "Does the vehicle have the required 3 tarpaulins for cargo protection?":
              return !!item.dropdown && !!item.image;
            case "Are the tarpaulins in good condition and stitchless as per company standards?":
              return !!item.dropdown && !!item.image;
            case "Has the vehicle's Pollution Under Control (PUC) certificate been verified as valid?":
              return !!item.dropdown && !!item.image && !!item.date;
            case "Has the vehicle's Fitness Certificate been confirmed as current and valid?":
              return !!item.dropdown && !!item.image && !!item.date;
            case "What is the verified carrying capacity of the vehicle in kilograms?":
              return !!item.inputValue && !!item.image;
            case "What is the driver's license number and expiration date of the driver's license?":
              return !!item.inputValue && !!item.date;
            case "Screening Driver to check wheather the person is under alocohol influence or not ?":
                if (!item.dropdown) {
                  return false; 
                }
                if (item.dropdown === "Yes" && !item.image) {
                  return false; 
                }
                return true;
      default:
        return true;
          }
        });
      case 2:
        return stageData.every(item => item.checked !== undefined);
      case 3:
          return stageData.every(item => {
              switch (item.point) {
                  case "Has the vehicle body been re-inspected and confirmed to be in good condition?":
                      return !!item.dropdown && Object.values(item.images).every(img => !!img);
                  case "Is the tarpaulin properly covering the entire bottom surface of the truck prior to loading?":
                      return !!item.dropdown && Object.values(item.images).every(img => !!img);
                  case "Has the cross-check between Pick Up Slip weight and Vehicle Passing weight been completed? (In Kgs)":
                      return !!item.dropdown && !!item.inputValue;
                  default:
                      return true;
          }
      });
      case 4:
        return stageData.every(item => {
          switch (item.point) {
            case "Has the layer-wise loading and stuffing been executed according to the approved Stacking Plan?":
              return !!item.dropdown && Object.values(item.images).some(img => !!img);
            case "Does the quantity of loaded material correspond precisely with the quantity listed in the Pick up List?":
              return !!item.dropdown;
            case "Has the truck been properly sealed, and if so, what is the Seal Number?":
              return !!item.dropdown && !!item.image;
            case "What is the final loaded weight in kilograms as shown in the provided image, and does the image include the Weigh Bridge Slip, if applicable?":
              return !!item.image;
            case "Have all required documents been provided and verified?":
              if (item.subItems[0].dropdown !== null && item.subItems[3].dropdown !== null) {
                return !!item.subItems[0].inputValue && !!item.subItems[3].inputValue;
              }
              return false;
            default:
              return true;
          }
        });
      case 5:
        return stageData.every(item => {
          switch (item.point) {
            case "Has the final truck sealing been completed, and what is the Seal Number (if applicable)?":
              return !!item.dropdown && !!item.image;
            case "What are the Commercial Invoice Numbers associated with this shipment?":
              return !!item.inputValue;
            case "Have the E-way bill and Invoice been verified to have valid and current dates?":
              return !!item.dropdown;
            default:
              return true;
          }
        });
      default:
        return true;
    }
  };
  
  const hasCheckboxChanges = (currentStageData: any[], previousStageData: any[]): boolean => {
    return currentStageData.some((item, index) => {
      const prevItem = previousStageData?.[index];
      return prevItem === undefined || item.checked !== prevItem.checked;
    });
  };

  const handleVehicleRejection = async (checklistItem: ChecklistItem, stage: number) => {
    const emailContent = `
      Reason for rejection: ${checklistItem.point}
      Stage: ${stage}
      * SO Number: ${shipment.sale_order}
      * Vehicle Number: ${vehicleNo}
      * Transporter Name: ${shipment?.carrier?.name}
      * SIN Number: ${shipment.SIN}
    `;

    const confirmRejection = window.confirm(`Vehicle rejected due to: ${checklistItem.point}\nAn email will be sent to the transporter. Do you want to proceed?`);

    if (confirmRejection) {
      try {
        await sendRejectionEmail(emailContent, stage);
        alert("Rejection email sent successfully. The vehicle has been rejected.");
      } catch (error) {
        console.error("Failed to send rejection email:", error);
        console.error('Error sending rejection email:', error);
        alert("Failed to send rejection email. Please try again.");
      }
    }
  };

const sendRejectionEmail = async (emailContent: string, stage: number) => {
  try {
    const response = await fetch('https://dev-api.instavans.com/api/thor/security/send-rejection-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${session?.user.data.accessToken} Shipper ${session?.user.data.default_unit}`,
      },
      body: JSON.stringify({
        emailContent,
        stage: `Stage ${stage}`,
        saleOrder: shipment.sale_order,
        vehicleNo,
          name: shipment?.carrier?.name,
        SIN: shipment.SIN,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to send rejection email');
    }
  } catch (error) {
    console.error('Error sending rejection email:', error);
    throw error;
  }
};
  
  const handleImageUpload = async (formData: FormData) => {
    try {
      const imageResponse = await fetch('https://dev-api.instavans.com/api/thor/security/save_stage_images', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `bearer ${session?.user.data.accessToken} Shipper ${session?.user.data.default_unit}`,
        }
      });
  
      const imageData = await imageResponse.json();
  
      if (imageData.statusCode === 200) {
        toast.success('Images Saved', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error(imageData.message || 'Error saving images', { hideProgressBar: true, autoClose: 2000, type: 'error' });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('An error occurred while uploading images', { hideProgressBar: true, autoClose: 2000, type: 'error' });
    }
  };
  
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
        const trackingMethod = d.trip_tracker && d.trip_tracker.methods && d.trip_tracker.methods.length && d.trip_tracker.methods[0] || 'N/A';
        const lastLocation = d.trip_tracker && d.trip_tracker.last_location.address && d.trip_tracker.last_location.address || 'N/A';
        const lastLocationAt = d.trip_tracker && d.trip_tracker.last_location_at;
  
        const security = data.data.securityCheck;
        if (security?.stage1?.completed === true) {
          const checks = security.stage1.checklist.map((c:any) => ({
            point: c.point,
            checked: c.checked,
            dropdown: c.dropdown,
            inputValue: c.inputValue,
            timestamp: c.timestamp,
            images: c.images,
            image: c.image,
            dropdownDisabled: c.dropdownDisabled,
            date: c.date,
            subItems: c.subItems
          }));
          setChecklists0(checks.length > 0 ? checks : checklists0);
          setReportingDate(security.stage1.completed_at);
          setActiveStep(0);
          if (security.stage1.images?.length) {
            const newImages = security.stage1.images.map((i: any) => ({ name: i, preview: i }));
            setVehicleReportingFiles(newImages);
          }
        } 
        if (security?.stage2?.completed === true) {
          const checks = security.stage2.checklist.map((c: any) => ({
            point: c.point,
            checked: c.checked,
            timestamp: c.timestamp,
          }));
          setChecklists1(checks);
          setGateInDate(security.stage2.completed_at);
          setActiveStep(1);
          if (security.stage2.images?.length) {
            const newImages = security.stage2.images.map((i: any) => ({ name: i, preview: i }));
            setVehcileGateInFiles(newImages);
          }
        } 
        if (security?.stage3?.completed === true) {
          const checks = security.stage3.checklist.map((c: any) => ({
            point: c.point,
            checked: c.checked,
            dropdown: c.dropdown,
            inputValue: c.inputValue,
            timestamp: c.timestamp,
            images: c.images,
            image: c.image,
            dropdownDisabled: c.dropdownDisabled,
            date: c.date,
            subItems: c.subItems
          }));
          setChecklists2(checks);
          setLoadInDate(security.stage3.completed_at);
          setActiveStep(2);
          if (security.stage3.images?.length) {
            const newImages = security.stage3.images.map((i: any) => ({ name: i, preview: i }));
            setVehcileLoadInFiles(newImages);
          }
        } 
        if (security?.stage4?.completed === true) {
          const subItems = checklists3[4].subItems;
          const checks = security.stage4.checklist.map((c: any, index: number) => ({
            point: c.point,
            dropdown: c.dropdown,
            inputValue: c.inputValue,
            images: c.images,
            image: c.image,
            dropdownDisabled: c.dropdownDisabled,
            subItems: c.subItems?.map((subItem: any) => ({
              point: subItem.point,
              dropdown: subItem.dropdown,
              inputValue: subItem.inputValue
            }))
          }));
          if (checks.length > 0 && Array.isArray(checks[4].subItems) && checks[4].subItems.length === 0) {
            checks[4].subItems = subItems;
        }
          setChecklists3(checks);
          setActiveStep(3);
          if (security.stage4.images?.length) {
            const newImages = security.stage4.images.map((i: any) => ({ name: i, preview: i }));
            setVehcileLoadOutFiles(newImages);
          }
        } 
        if (security?.stage5?.completed === true) {
          const checks = security.stage5.checklist.map((c: any) => ({
            point: c.point,
            checked: c.checked,
            dropdown: c.dropdown,
            inputValue: c.inputValue,
            timestamp: c.timestamp,
            images: c.images,
            image: c.image,
            dropdownDisabled: c.dropdownDisabled,
            date: c.date,
            subItems: c.subItems
          }));
          setChecklists4(checks);
          setGateOutDate(security.stage5.completed_at);
          setActiveStep(4);
          if (security.stage5.images?.length) {
            const newImages = security.stage5.images.map((i: any) => ({ name: i, preview: i }));
            setVehcileGateOutFiles(newImages);
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
        setVehicleReportingFiles(fileArray);
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
  const newFiles = [...vehicleReportingFiles];
  newFiles.splice(index, 1);
  setVehicleReportingFiles(newFiles);
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
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        className='bg-[#fcfcfc] py-[10px] fixed z-[3] top-[56px] w-full'
      >
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {
            completed: index < activeStep,
          };
          const labelProps: { optional?: React.ReactNode } = {};
          return (
            <Step
              key={label}
              {...stepProps}
              sx={{
                '& .MuiStepLabel-root .Mui-completed': {
                  color: '#18BE8A', // circle color (COMPLETED)
                },
                '& .MuiStepConnector-line': {
                  borderColor: index <= activeStep ? '#18BE8A' : '#e0e0e0', // line color based on step status
                  borderWidth: '2px', // adjust the width of the line
                },
                '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
                  color: '##18BE8A', // Just text label (COMPLETED)
                },
                '& .MuiStepLabel-root .Mui-active': {
                  color: '#18BE8A', // circle color (ACTIVE)
                },
                '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
                  color: '#71747A', // Just text label (ACTIVE)
                },
                '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                  fill: 'white', // circle's number (ACTIVE)
                },
              }}
            >
              <StepLabel {...labelProps}>
                <p className='text-[10px]'>{label}</p>
              </StepLabel>
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
             {activeStep == 0 && (
        <>
          <div className="top md:flex md:flex-row-reverse gap-[24px]">
          <div className="right w-full">
              <div className="checkList bg-[#fcfcfc] p-[20px] h-full rounded-[12px]">
                <div className="body flex flex-col gap-[16px]">
                  <div className="header">
                    <p className='text-[#131722] text-[18px] font-bold'>Checklist</p>
                  </div>
                  <div className="checkListSection h-[450px] overflow-y-scroll">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Check points</th>
                        <th>Yes</th>
                        <th>No</th>
                        <th>Images</th>
                      </tr>
                    </thead>
                    <tbody>
                      {checklists0.map((item, index) => (
                        <tr key={index} className="border-b border-[#E6E8EC]">
                          <td className="py-[12px]">
                            <Typography className="text-[#71747A]" variant="caption">{item.point}</Typography>
                          </td>
                          <td className="text-center">
                            {index < 5 && (
                              <input 
                                type="radio" 
                                name={`check-${index}`} 
                                value="Yes" 
                                checked={item.dropdown === "Yes"}
                                onChange={() => {
                                  const newChecklists = [...checklists0];
                                  newChecklists[index].dropdown = "Yes";
                                  setChecklists0(newChecklists);
                                }}
                                disabled={
                                  (index === 0) 
                                  ? !item.images || Object.values(item.images).some(img => !img)
                                  : (index === 3 || index === 4) 
                                    ? !item.image
                                    : false
                                }
                              />
                            )}
                            { index == 7 && (
                              <input 
                              type="radio" 
                              name={`check-${index}`} 
                              value="Yes" 
                              checked={item.dropdown === "Yes"}
                              onChange={() => {
                                const newChecklists = [...checklists0];
                                newChecklists[index].dropdown = "Yes";
                                setChecklists0(newChecklists);
                              }}
                            />
                            )}
                          </td>
                        <td className="text-center">
                          {index < 5 && (
                            <input 
                              type="radio" 
                              name={`check-${index}`} 
                              value="No" 
                              checked={item.dropdown === "No"}
                              onChange={() => {
                                const newChecklists = [...checklists0];
                                newChecklists[index].dropdown = "No";
                                setChecklists0(newChecklists);
                                if ((index === 0 || index === 4) && newChecklists[index].dropdown === "No") {
                                  const photoEvidence = item.images ? Object.values(item.images).filter(Boolean) : (item.image ? [item.image] : []);
                                  setIsRejectionDialogOpen(true);
                                  setRejectionReason(`Point ${index === 0 ? '1-1' : '5-5'} failed inspection`);
                                  setRejectedVehicleInfo({
                                    vehicleNo: vehicleNo, 
                                    saleOrder: "1", 
                                    SIN: "2", 
                                    transporterName: "aa",
                                    photoEvidence: photoEvidence
                                  });
                                }
                              }}
                              disabled={
                                (index === 0) 
                                  ? !item.images || Object.values(item.images).some(img => !img)
                                  : (index === 3 || index === 4) 
                                    ? !item.image
                                    : false
                              }
                            />
                          )}
                          { index == 7 && (
                            <input 
                            type="radio" 
                            name={`check-${index}`} 
                            value="No" 
                            checked={item.dropdown === "No"}
                            onChange={() => {
                              const newChecklists = [...checklists0];
                              newChecklists[index].dropdown = "No";
                              setChecklists0(newChecklists);
                            }}
                          />
                          )}
                        </td>
                          <td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                    {index === 7 && item.dropdown === "Yes" && (
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                style={{backgroundColor: "#E7E9FF", color: "#2962FF", fontSize: "10px", borderRadius: "12px", width: "64px", height: "24px"}}
                                className="upload-button text-white px-2 py-1 rounded"
                                onClick={() => {
                                  setIsUploadPopupOpen(true);
                                  setCurrentUploadIndex(index);
                                  setCurrentChecklistIndex(0);
                                }}
                              > 
                                <UploadIcon style={{width: "12px", height: "12px", marginRight: "4px", marginBottom: "3px"}} />
                                Upload
                              </button>
                            </div>
                          )}
                      {index!=7 && (
                        <div className="flex items-center justify-center gap-2">
                        <button 
                        style={{backgroundColor: "#E7E9FF", color: "#2962FF", fontSize: "10px", borderRadius: "12px", width: "64px", height: "24px"}}
                        className="upload-button text-white px-2 py-1 rounded"
                        onClick={() => {
                          setIsUploadPopupOpen(true);
                          setCurrentUploadIndex(index);
                          setCurrentChecklistIndex(0);
                        }}
                      > 
                        <UploadIcon style={{width: "12px", height: "12px", marginRight: "4px", marginBottom: "3px"}} />
                        Upload
                      </button>
                      </div>
                      )}
                      {((item.images && Object.values(item.images).filter(Boolean).length > 0) || item.image) && (
                        <div className="relative">
                          <img 
                            src={item.images ? Object.values(item.images).find(Boolean) : item.image} 
                            alt="Thumbnail" 
                            className="w-8 h-8 object-cover rounded"
                          />
                          {item.images && Object.values(item.images).filter(Boolean).length > 1 && (
                            <span className="absolute bottom-0 right-0 bg-gray-800 text-white text-xs px-1 rounded-full">
                              +{Object.values(item.images).filter(Boolean).length - 1}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex flex-col gap-[16px]" >
                      <VehicleGateIn vehicleNo={vehicleNo} driver={shipment.driver?.name} mobile={shipment.driver?.mobile} trackingMethod={trackingMethod} lastLocation={lastLocation} lastLocationAt={lastLocationAt} />
              <div className="gateInDetails bg-[#fcfcfc] p-[20px]  rounded-[12px]">
                <div className="body">
                  <div className="detailsSection">
                    <div className="label">
                      Vehicle reporting date
                    </div>
                    <div className="value">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileDateTimePicker className='w-full h-[48px] mt-[4px]'
                          value={reportingDate}
                          onChange={(newValue) => {
                            setReportingDate(newValue);
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
                      <input type="file" multiple className='opacity-0 absolute w-full h-full z-2' onChange={handleVehicleReportFileChange} />
                      <CollectionsOutlinedIcon className='text-[#1A1A1A]' />
                      <p className='text-[#1A1A1A] text-[10px]'>Gallery</p>
                    </div>
                  </div>
                  <div className="uploadSection flex gap-[16px]">
                    {vehicleReportingFiles.map((file, index) => (
                      <div key={index} className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative">
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
        </>
      )}
{isUploadPopupOpen && currentUploadIndex !== null && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] relative">
      <div className="absolute top-2 right-2 cursor-pointer" onClick={() => setIsUploadPopupOpen(false)}>
        <CloseIcon />
      </div>
      <h2 className="text-xl font-bold mb-4">Vehicle Images/Details</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
      {(() => {
        const checklists = [checklists0,checklists1, checklists2, checklists3, checklists4];
        const currentChecklist = checklists[currentChecklistIndex];
        
      const currentItem = (currentChecklist && currentChecklist.length > currentUploadIndex)
      ? currentChecklist[currentUploadIndex]
      : undefined;

      if (!currentItem) {
        console.error("Invalid item for upload index:", currentUploadIndex, "in checklist:", currentChecklist);
      }
  
          
          if (currentChecklistIndex === 0) {
            if (currentChecklistIndex === 0 && currentUploadIndex === 0) {
              const imageParts = ['Floor Body', 'Floor', 'Right', 'Left', 'Rear'];
              return imageParts.map(part => (
                <ImageUploadSlot
                  key={part}
                  image={(currentItem as any).images?.[part] || ''}
                  onCapture={() => handleImageCapture(0, currentUploadIndex, part)}
                  onRemove={() => handleRemoveImage(0, currentUploadIndex, part)}
                  label={part}
                  checklistIndex={0}
                  index={currentUploadIndex}
                  part={part}
                />
              ));
            } else if (currentChecklistIndex === 0 && currentUploadIndex === 3 || currentUploadIndex === 4 || currentUploadIndex === 5) {
              return (
                <>
                  <div className="col-span-1">
                    <ImageUploadSlot
                      image={(currentItem as any).image || ''}
                      onCapture={() => handleImageCapture(0, currentUploadIndex)}
                      onRemove={() => handleRemoveImage(0, currentUploadIndex)}
                      label="Photo"
                      checklistIndex={0}
                      index={currentUploadIndex}
                    />
                  </div>
                  <div className="col-span-2">
                    {currentChecklistIndex === 0 && currentUploadIndex === 3 || currentUploadIndex === 4 ? (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Select Date"
                        value={(currentItem as any).date}
                        onChange={(newValue: Date | null) => {
                          const newChecklists = [...checklists0];
                          (newChecklists[currentUploadIndex] as any).date = newValue;
                          setChecklists0(newChecklists);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            onKeyDown={(e) => e.preventDefault()} 
                            InputLabelProps={{ shrink: true }}  
                            sx={{ 
                              '& .MuiInputBase-input': { padding: '12px 14px' } 
                            }}
                          />
                        )}
                        minDate={new Date()}
                      />
                    </LocalizationProvider>
                    ) : (
                      <TextField
                        label="Carrying capacity (kg)"
                        value={(currentItem as any).inputValue || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newChecklists = [...checklists0];
                          (newChecklists[currentUploadIndex] as any).inputValue = e.target.value;
                          setChecklists0(newChecklists);
                        }}
                        fullWidth
                      />
                    )}
                  </div>
                </>
              );
            }else if (currentChecklistIndex === 0 && currentUploadIndex === 6) {
              return (
                <>
                  <div className="col-span-3">
                    <Box display="flex" gap={2}>
                      <TextField
                        label={currentUploadIndex === 5 ? "Carrying capacity (kg)" : "Driver's license number"}
                        value={(currentItem as any).inputValue || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newChecklists = [...checklists0];
                          (newChecklists[currentUploadIndex] as any).inputValue = e.target.value;
                          setChecklists0(newChecklists);
                        }}
                        fullWidth
                      />
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Select Date"
                          value={(currentItem as any).date}
                          onChange={(newValue: Date | null) => {
                            const newChecklists = [...checklists0];
                            (newChecklists[currentUploadIndex] as any).date = newValue;
                            setChecklists0(newChecklists);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              onKeyDown={(e) => e.preventDefault()} 
                              InputLabelProps={{ shrink: true }} 
                              sx={{
                                '& .MuiInputBase-input': { padding: '12px 14px',height: '31px' } 
                              }}
                            />
                          )}
                          minDate={new Date()}
                        />
                      </LocalizationProvider>
                    </Box>
                  </div>
                </>
              );
            }
            else if ((currentItem as any).images) {
              return Object.entries((currentItem as any).images).map(([part, image]) => (
                <ImageUploadSlot
                  key={part}
                  image={image as string}
                  onCapture={() => handleImageCapture(0, currentUploadIndex, part)}
                  onRemove={() => handleRemoveImage(0, currentUploadIndex, part)}
                  label={part}
                  checklistIndex={0}
                  index={currentUploadIndex}
                  part={part}
                />
              ));
            } 
            else {
              return (
                <ImageUploadSlot
                  image={(currentItem as any).image || ''}
                  onCapture={() => handleImageCapture(0, currentUploadIndex)}
                  onRemove={() => handleRemoveImage(0, currentUploadIndex)}
                  label="Photo"
                  checklistIndex={0}
                  index={currentUploadIndex}
                />
              );
            }
          } else if (currentChecklistIndex === 2) {
          if (currentChecklistIndex === 2 && currentUploadIndex === 0) {
            const imageParts = ['FloorBody', 'Floor', 'Right', 'Left', 'Rear'];
            return (
              <>
                {imageParts.map(part => (
                  <ImageUploadSlot
                    key={part}
                    image={(currentItem as any).images?.[part] || ''}
                    onCapture={() => handleImageCapture(2, currentUploadIndex, part)}
                    onRemove={() => handleRemoveImage(2, currentUploadIndex, part)}
                    label={part}
                    checklistIndex={2}
                    index={currentUploadIndex}
                    part={part}
                  />
                ))}
              </>
            );
          } else if (currentChecklistIndex === 2 && currentUploadIndex === 1) {
            const imageParts = ['Photo1', 'Photo2'];
            return (
              <>
                {imageParts.map(part => (
                  <ImageUploadSlot
                    key={part}
                    image={(currentItem as any).images?.[part] || ''}
                    onCapture={() => handleImageCapture(2, currentUploadIndex, part)}
                    onRemove={() => handleRemoveImage(2, currentUploadIndex, part)}
                    label={part}
                    checklistIndex={2}
                    index={currentUploadIndex}
                    part={part}
                  />
                ))}
              </>
            );
          } else if (currentChecklistIndex === 2 && currentUploadIndex === 2) {
            return (
              <TextField
                label="Weight [kg]"
                value={(currentItem as any).inputValue || ''}
                onChange={(e) => { 
                  const newChecklists = [...checklists2];
                  (newChecklists[currentUploadIndex] as any).inputValue = e.target.value;
                      setChecklists2(newChecklists);
                  }

                }
                fullWidth
              />
            );
          }
        } else if (currentChecklistIndex === 3) {
          if (currentChecklistIndex === 3 && currentUploadIndex === 0) {
            const imageParts = ['First Layer', 'Second Layer', 'Third Layer', 'Fourth Layer', 'Post Loading'];
            return (
              <>
                {imageParts.map(part => (
                  <ImageUploadSlot
                    key={part}
                    image={(currentItem as any).images?.[part] || ''}
                    onCapture={() => handleImageCapture(3, currentUploadIndex, part)}
                    onRemove={() => handleRemoveImage(3, currentUploadIndex, part)}
                    label={part}
                    checklistIndex={3}
                    index={currentUploadIndex}
                    part={part}
                  />
                ))}
              </>
            );
           } 
          else if (currentChecklistIndex === 3 && currentUploadIndex === 2) {
            return (
              <>
                <div className="col-span-1">
                  <ImageUploadSlot
                    image={(currentItem as any).image || ''}
                    onCapture={() => handleImageCapture(3, currentUploadIndex)}
                    onRemove={() => handleRemoveImage(3, currentUploadIndex)}
                    label="Photo"
                    checklistIndex={3}
                    index={currentUploadIndex}
                  />
                </div>
                <div className="col-span-2">
                  <TextField
                    label="Seal number (Optional)"
                    value={(currentItem as any).inputValue || ''}
                    onChange={(e) => 
                     { 
                      const newChecklists = [...checklists3];
                      (newChecklists[currentUploadIndex] as any).inputValue = e.target.value;
                          setChecklists3(newChecklists);
                      }
                    }
                    fullWidth
                  />
                </div>
              </>
            );
          } if (currentChecklistIndex === 3 && currentUploadIndex === 3) {
            return (
              <ImageUploadSlot
                image={(currentItem && currentItem.image) || ''}
                onCapture={() => handleImageCapture(3, currentUploadIndex)}
                onRemove={() => handleRemoveImage(3, currentUploadIndex)}
                label="Optional Photo"
                checklistIndex={3}
                index={currentUploadIndex}
              />
            );
          } 
          else if (currentChecklistIndex === 3 && currentUploadIndex === 4) {
            const currentItem = checklists3[currentUploadIndex];
            return (
              <>
                {currentItem.subItems && currentItem.subItems.map((subItem, index) => (
                  <div key={index} className="col-span-3 mb-2">
                    <YesNoSelection
                      label={subItem.point}
                      value={subItem.dropdown || ''}
                      onChange={(value) => 
                         handleYesNoChange(currentUploadIndex, value, `subItems.${index}.dropdown`)
                      }
                    />
                    {(subItem.dropdown === 'Yes' || subItem.dropdown === 'yes') && (
                      <TextField
                        label={`Input for ${subItem.point}`}
                        value={subItem.inputValue || ''}
                        onChange={(e) => 
                          handleInputChange(currentUploadIndex, e.target.value, `subItems.${index}.inputValue`)}
                        fullWidth
                      />
                    )}
                  </div>
                ))}
              </>
            );
          }
        } 
        else if (currentChecklistIndex === 4) {
          if (currentUploadIndex === 0 && currentChecklistIndex === 4) {
            return (
              <>
                <div className="col-span-1">
                  <ImageUploadSlot
                    image={(currentItem && currentItem.image) || ''}
                    onCapture={() => handleImageCapture(4, currentUploadIndex)}
                    onRemove={() => handleRemoveImage(4, currentUploadIndex)}
                    label="Photo"
                    checklistIndex={4}
                    index={currentUploadIndex}
                  />
                </div>
                <div className="col-span-2">
                  <TextField
                    label="Optional Input"
                    value={(currentItem && currentItem.inputValue) || ''}
                    onChange={(e) => 
                      {
                      const newChecklists = [...checklists4];
                      (newChecklists[currentUploadIndex] as any).inputValue = e.target.value;
                          setChecklists4(newChecklists);
                      }
                    }
                    
                    fullWidth
                  />
                </div>
              </>
            );
          }else if (currentChecklistIndex === 4 && currentUploadIndex === 1) {
            return (
              <TextField
                label="Input"
                value={(currentItem as any).inputValue || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 55) {
                    const formattedValue = value.replace(/(.{10})/g, '$1,').replace(/,$/, '');
                    handleInputChange(4, currentUploadIndex, formattedValue);
                  }
                }}
                fullWidth
              />
            );
          } else if (currentChecklistIndex === 4 && currentUploadIndex === 2) {
            return (
              <YesNoSelection
                value={(currentItem as any).yesNo}
                onChange={(value) => handleYesNoChange(4, currentUploadIndex, value)}
              />
            );
          }
        }
        else {
          return (
            <div>
              <p>Unhandled case:</p>
              <p>Checklist Index: {currentChecklistIndex}</p>
              <p>Upload Index: {currentUploadIndex}</p>
            </div>
          );
        }
        })()}
      </div>
      <button 
    className="w-full bg-blue-500 text-white py-2 rounded"
      onClick={() => {
        let currentItem:any ;
        let errors = [];
        let isNewUpload = false;
        let isNewInput = false;
        let isNewDate = false;
        let isAlreadySubmitted = false;
        let isSuccessfulSave = false;
        

        if (currentChecklistIndex === 0) {
          currentItem = checklists0[currentUploadIndex];
          isAlreadySubmitted = currentItem.submitted;

          if (currentChecklistIndex === 0 && currentUploadIndex === 3 || currentUploadIndex === 4) {
            if (!currentItem.date) {
              errors.push("Please select a date.");
            } else {
              isNewDate = currentItem.date !== currentItem.previousDate;
            }

            if (!currentItem.image) {
              errors.push("Please upload the required image.");
            } else {
              isNewUpload = !submittedImages[`${currentUploadIndex}-${currentImageIndex}-main`];
            }
          } 
          else if (currentChecklistIndex === 0 && currentUploadIndex === 0) {
            const requiredImageParts = ['Floor Body', 'Floor', 'Right', 'Left', 'Rear'];
            const missingImages = requiredImageParts.filter(part => !currentItem.images?.[part]);
            
            if (missingImages.length > 0) {
              errors.push(`Please upload images for: ${missingImages.join(', ')}`);
            } else {
              isNewUpload = !submittedImages[`${currentUploadIndex}-${currentImageIndex}-main`];
            }
          } else if (currentChecklistIndex === 0 && currentUploadIndex >= 1 && currentUploadIndex <= 4) {
            if (!currentItem.image) {
              errors.push("Please upload the required image.");
            } else {
              isNewUpload = !submittedImages[`${currentUploadIndex}-${currentImageIndex}-main`];
            }
          }
          else if (currentChecklistIndex === 0 && currentUploadIndex === 5) {
            if (!currentItem.image) {
              errors.push("Please upload the required image.");
            } else {
              isNewUpload = !submittedImages[`${currentUploadIndex}-${currentImageIndex}-main`];
            }
          
            if (!currentItem.inputValue) {
              errors.push("Please enter the required value.");
            } else if (!isSuccessfulSave && (currentItem.inputValue.length < 3 || currentItem.inputValue.length > 5)) {
              errors.push("Input length must be between 3 and 5 characters.");
            } else {
              isNewInput = currentItem.inputValue !== currentItem.previousInputValue;
            }
          }
        
          else if (currentChecklistIndex === 0 && currentUploadIndex === 6) {
            if (currentItem.inputValue !== undefined) {
              if (!currentItem.inputValue) {
                errors.push("Please enter the required value.");
              } else if (!isSuccessfulSave && currentItem.inputValue.length < 3) {
                errors.push("Input must be at least 3 characters long.");
              } else {
                isNewInput = currentItem.inputValue !== currentItem.previousInputValue;
              }
            }
            if (currentItem.date !== undefined && currentUploadIndex !== 3 && currentUploadIndex !== 4) {
              if (!currentItem.date) {
                errors.push("Please select a date.");
              } else {
                isNewDate = currentItem.date !== currentItem.previousDate;
              }
            }
          }
        
        else if ( currentChecklistIndex === 0 && currentUploadIndex === 7 ) {
          if (currentItem.dropdown === "No") {
            isSuccessfulSave = true;
            setIsUploadPopupOpen(false);
          } else if (currentItem.dropdown === "Yes" && currentItem.image) {
            isNewUpload = !submittedImages[`${currentUploadIndex}-${currentImageIndex}-main`];
            if (isNewUpload) {
              isSuccessfulSave = true;
              setIsUploadPopupOpen(false);
            }
          } else {
            errors.push("Please select 'No' or upload an image if 'Yes' is selected.");
          }
          }
        }
        else if (currentChecklistIndex === 2) {
          currentItem = checklists2[currentUploadIndex];
          isAlreadySubmitted = currentItem.submitted;

          if (currentChecklistIndex === 2 && currentUploadIndex === 0) {
            const requiredImageParts = ['FloorBody', 'Floor', 'Right', 'Left', 'Rear'];
            const missingImages = requiredImageParts.filter(part => !currentItem.images?.[part]);
            
            if (missingImages.length > 0) {
              errors.push(`Please upload images for: ${missingImages.join(', ')}`);
            } else {
              isNewUpload = !submittedImages[`${currentUploadIndex}-${currentUploadIndex}-main`];
            }
          } else if (currentChecklistIndex === 2 && currentUploadIndex === 1) {
            const requiredImageParts = ['Photo1', 'Photo2'];
            const missingImages = requiredImageParts.filter(part => !currentItem.images?.[part]);
            
            if (missingImages.length > 0) {
              errors.push(`Please upload images for: ${missingImages.join(', ')}`);
            } else {
              isNewUpload = !submittedImages[`${currentUploadIndex}-${currentUploadIndex}-main`];
            }
          } else if (currentChecklistIndex === 2 && currentUploadIndex === 2) {
            if (!currentItem.inputValue) {
              errors.push("Please enter the required value.");
            } else {
              isNewInput = currentItem.inputValue !== currentItem.previousInputValue;
            }
          }
        } 
        else if (currentChecklistIndex === 3) {
          currentItem = checklists3[currentUploadIndex];
          isAlreadySubmitted = currentItem.submitted;

          if (currentChecklistIndex === 3 && currentUploadIndex === 0) {
            const requiredImageParts = ['First Layer', 'Second Layer', 'Third Layer', 'Fourth Layer', 'Post Loading'];
            const missingImages = requiredImageParts.filter(part => !currentItem.images?.[part]);
            
            if (missingImages.length > 0) {
              errors.push(`Please upload images for: ${missingImages.join(', ')}`);
            } else {
              isNewUpload = !submittedImages[`${currentUploadIndex}-${currentUploadIndex}-main`];
            }
          } else if (currentChecklistIndex === 3 && currentUploadIndex === 2) {
            if (!currentItem.image) {
              errors.push("Please upload the required image.");
            } else {
              isNewUpload = !submittedImages[`${currentUploadIndex}-${currentUploadIndex}-main`];
            }
            isNewInput = currentItem.inputValue !== currentItem.previousInputValue;
          }
          else if (currentChecklistIndex === 3 && currentUploadIndex === 3) {
            isNewUpload = !submittedImages[`${currentUploadIndex}-${currentUploadIndex}-main`];
          }
          else if (currentChecklistIndex === 3 && currentUploadIndex === 4) {
            let isChanged = false;
            let hasErrors = false;
          
            
            for (let i = 0; i < 4; i++) {
              const subItem = currentItem.subItems[i];
              const yesNoValue = subItem[`dropdown${i+1}`];
              const inputValue = subItem[`inputValue${i+1}`];
              const previousYesNoValue = currentItem[`previousYesNo${i+1}`];
              const previousInputValue = currentItem[`previousInput${i+1}`];

              if ((i === 0 || i === 3) && yesNoValue === null) {
                errors.push(`Please select Yes or No for subpoint ${i+1}.`);
                hasErrors = true;
              }

              if ((i === 0 || i === 3) && yesNoValue === 'Yes' && !inputValue) {
                errors.push(`Please provide input for subpoint ${i+1}.`);
                hasErrors = true;
              }

              if ((i === 1 || i === 2) && yesNoValue === 'Yes' && !inputValue) {
                errors.push(`Please provide input for subpoint ${i+1}.`);
                hasErrors = true;
              }

              if (yesNoValue !== previousYesNoValue || inputValue !== previousInputValue) {
                isChanged = true;
              }
            }
          
            if (hasErrors) {
              errors.forEach(error => toast.error(error));
              return;
            }
          
            isNewInput = isChanged;
          
            if (isChanged) {
              for (let i = 1; i <= 4; i++) {
                currentItem[`previousYesNo${i}`] = currentItem[`yesNo${i}`];
                currentItem[`previousInput${i}`] = currentItem[`input${i}`];
              }
            }
          }
        } else if (currentChecklistIndex === 4) {
          currentItem = checklists4[currentUploadIndex];
          isAlreadySubmitted = currentItem.submitted;

          if (currentChecklistIndex === 4 && currentUploadIndex === 0) {
            if (!currentItem.image) {
              errors.push("Please upload the required image.");
            } else {
              isNewUpload = !submittedImages[`${currentUploadIndex}-${currentUploadIndex}-main`];
            }
            isNewInput = currentItem.inputValue !== currentItem.previousInputValue;
          } else if (currentChecklistIndex === 4 && currentUploadIndex === 1) {
            if (!currentItem.inputValue) {
              errors.push("Please enter the required value.");
            } else {
              isNewInput = currentItem.inputValue !== currentItem.previousInputValue;
            }
          }
        }

        if (errors.length > 0) {
          errors.forEach(error => toast.error(error));
          return;
        }

        let toastMessage = '';

        if (!isAlreadySubmitted) {
          if (isNewUpload || isNewInput || isNewDate) {
            toastMessage = 'Changes saved successfully';
           
            saveImagesToServer(currentChecklistIndex,currentUploadIndex);
            if (currentItem.inputValue !== undefined) {
              currentItem.previousInputValue = currentItem.inputValue;
            }
            if (currentItem.date !== undefined) {
              currentItem.previousDate = currentItem.date;
            }
            
            currentItem.submitted = true; 
            setIsUploadPopupOpen(false);
            toast.success(toastMessage);
            isSuccessfulSave = true;
          } else {
            toastMessage = 'No changes to save';
            toast.info(toastMessage);
          }
        } else {
          toastMessage = 'Already submitted';
          toast.info(toastMessage);
        }
      
      }}
>
  SUBMIT
</button>
    </div>
  </div>
)}
{showCamera && (
  <div className="camera-overlay">
    <button onClick={() => {
      const capturedImageURL = "path/to/captured/image.jpg";
      
      const updateChecklist = (prevChecklists: any) => {
        const newChecklists = [...prevChecklists];
        const currentItem = newChecklists[currentChecklistIndex];
        
        if (currentItem) {
          if (currentImagePart && currentItem.images) {
            currentItem.images[currentImagePart] = capturedImageURL;
          } else if (currentItem.image !== undefined) {
            currentItem.image = capturedImageURL;
          }
        }
        
        return newChecklists;
      };

      switch (currentChecklistIndex) {
        case 0:
          setChecklists0(updateChecklist);
          break;
        case 1:
          setChecklists1(updateChecklist);
          break;
        case 2:
          setChecklists2(updateChecklist);
          break;
        case 3:
          setChecklists3(updateChecklist);
          break;
        case 4:
          setChecklists4(updateChecklist);
          break;
        default:
          console.error('Invalid checklist index');
      }
      
      setShowCamera(false);
      // toast.success('Image uploaded successfully');
    }}>
      Capture Image
    </button>
  </div>
)}

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
                                checked={item.checked || false}
                                onChange={(event) => {
                                  const setChecklist = [setChecklists0, setChecklists1, setChecklists2, setChecklists3, setChecklists4][1];
                                  setChecklist((prev: any) => prev.map((checkItem: any, i: number) =>
                                    i === index ? { ...checkItem, checked: event.target.checked, timestamp: new Date() } : checkItem
                                  ));
                                }}
                              />
                              }
                              label={<span className="text-[12px]">Automatic Date & Time</span>}
                            />
                          </Grid>
                          <Grid item xs={12} className="value">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <MobileDateTimePicker
                                className='w-[250px] h-[48px] mt-[4px] ml-[27px]'
                                value={gateInDate}
                                onChange={(newValue) => setGateInDate(newValue)}
                                renderInput={(params) => <TextField {...params} />}
                              />
                            </LocalizationProvider>
                          </Grid>
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
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                        {/* <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer">

                          <CameraAltOutlinedIcon className='text-[#1A1A1A]' />
                          <p className='text-[#1A1A1A] text-[10px]'>Camera</p>
                        </div> */}
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
                      <div className="checkListSection h-[450px] overflow-y-scroll">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="text-left">Check points</th>
                            <th>Yes</th>
                            <th>No</th>
                            <th>Images</th>
                          </tr>
                        </thead>
                        <tbody>
                        {checklists2.map((item, index) => (
                          <tr key={index} className="border-b border-[#E6E8EC]">
                            <td className="py-[12px]">
                              <Typography className="text-[#71747A]" variant="caption">{item.point}</Typography>
                            </td>
                            <td className="text-center">
                              <input 
                                type="radio" 
                                name={`check2-${index}`} 
                                value="Yes" 
                                checked={item.dropdown === "Yes"}
                                onChange={() => {
                                  const newChecklists = [...checklists2];
                                  newChecklists[index].dropdown = "Yes";
                                  setChecklists2(newChecklists);
                                }}
                                disabled={
                                  index === 0
                                    ? !item.images || Object.values(item.images).every(img => !img)
                                    : index === 1
                                      ? !item.images || !item.images.Photo1 || !item.images.Photo2
                                      : false
                                }
                              />
                            </td>
                            <td className="text-center">
                              <input 
                                type="radio" 
                                name={`check2-${index}`} 
                                value="No" 
                                checked={item.dropdown === "No"}
                                onChange={() => {
                                  const newChecklists = [...checklists2];
                                  newChecklists[index].dropdown = "No";
                                  setChecklists2(newChecklists);

                                  if (index === 0 && newChecklists[index].dropdown === "No") {
                                    const photoEvidence = item.images ? Object.values(item.images).filter(Boolean) : [];
                                    setIsRejectionDialogOpen(true);
                                    setRejectionReason(`Point 2-1 failed inspection`);
                                    setRejectedVehicleInfo({
                                      vehicleNo: vehicleNo, 
                                      saleOrder: saleOrder, 
                                      SIN: SIN, 
                                      transporterName: transporterName,
                                      photoEvidence: photoEvidence
                                    });
                                  }
                                }}
                                disabled={
                                  index === 0
                                    ? !item.images || Object.values(item.images).every(img => !img)
                                    : index === 1
                                      ? !item.images || !item.images.Photo1 || !item.images.Photo2
                                      : false
                                }
                              />
                            </td>
                            <td className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  style={{backgroundColor: "#E7E9FF", color: "#2962FF", fontSize: "10px", borderRadius: "12px", width: "64px", height: "24px"}}
                                  className="upload-button text-white px-2 py-1 rounded"
                                  onClick={() => {
                                    setIsUploadPopupOpen(true);
                                    setCurrentUploadIndex(index);
                                    setCurrentChecklistIndex(2);
                                  }}
                                >
                                  <UploadIcon style={{width: "12px", height: "12px", marginRight: "4px", marginBottom: "3px"}} />
                                  Upload
                                </button>
                                {((item.images && Object.values(item.images).filter(Boolean).length > 0) || item.image) && (
                                  <div className="relative">
                                    <img 
                                      src={item.images ? Object.values(item.images).find(Boolean) : item.image} 
                                      alt="Thumbnail" 
                                      className="w-8 h-8 object-cover rounded"
                                    />
                                    {item.images && Object.values(item.images).filter(Boolean).length > 1 && (
                                      <span className="absolute bottom-0 right-0 bg-gray-800 text-white text-xs px-1 rounded-full">
                                        +{Object.values(item.images).filter(Boolean).length - 1}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                        </tbody>
                      </table>
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
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                      <div className="checkListSection h-[450px] overflow-y-scroll">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="text-left">Check points</th>
                            <th>Yes</th>
                            <th>No</th>
                            <th>Images</th>
                          </tr>
                        </thead>
                        <tbody>
                        {checklists3.map((item, index) => (
                          <tr key={index} className="border-b border-[#E6E8EC]">
                            <td className="py-[12px]">
                              <Typography className="text-[#71747A]" variant="caption">{item.point}</Typography>
                            </td>
                            {index === 4 ? (
                            <td colSpan={3}>
                            <div className="flex flex-col space-y-4 border-t border-[#E6E8EC] pt-4 mt-2">
                              {item.subItems?.map((point:any, num) => (
                                <div key={num} className="flex flex-col space-y-2">
                                  <Typography 
                                    className="text-[#71747A] text-sm flex-grow mr-4" 
                                    style={{fontSize: '12px', lineHeight: '1.25rem'}}
                                    variant="caption"
                                  >
                                    { point.point }
                                  </Typography>
                                  <div className="flex flex-col space-y-2" >
                                    <div className="flex items-center space-x-4">
                                      <div className="flex items-center space-x-2">
                                      <input 
                                    type="radio" 
                                    name={`check3-${index}-${num}`} 
                                    value="Yes" 
                                    onChange={() => {
                                      if (!checklists3) return; 
                                      const newChecklists = [...checklists3];
                                      if(newChecklists.length > 0){
                                        if(newChecklists[index]?.subItems){
                                          newChecklists[index].subItems[num].dropdown = "Yes";
                                        }
                                        setChecklists3(newChecklists);
                                      }
                                  }}
                                    required={num === 0 || num === 3}
                                  />
                                    <label>Yes</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                  <input 
                                    type="radio" 
                                    name={`check3-${index}-${num}`} 
                                    value="No" 
                                    onChange={() => {
                                      if (!checklists3) return; 
                                      const newChecklists = [...checklists3];
                                      if(newChecklists.length > 0){
                                        if(newChecklists[index]?.subItems){
                                          newChecklists[index].subItems[num].dropdown = "No";
                                        }
                                        setChecklists3(newChecklists);
                                      }
                                  }}
                                    required={num === 0 || num === 3}
                                  />
                                    <label>No</label>
                                  </div>
                                        </div>
                                        {(item.subItems && item.subItems[num] && item.subItems[num].dropdown === "Yes") && (
                                          <input 
                                          type="text" 
                                          value={item.subItems[num].inputValue || ''}
                                          onChange={(e) => {
                                            const newChecklists = [...checklists3];
                                            if(newChecklists[index]?.subItems){
                                              newChecklists[index].subItems[num].inputValue = e.target.value;
                                            }
                                            setChecklists3(newChecklists);
                                          }}
                                          placeholder="Enter details"
                                          className="border rounded px-2 py-1 mt-2"
                                          style={{
                                            fontSize: '12px',
                                            width: '200px',
                                          }}
                                        />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            ): (    <>
                                <td className="text-center">
                                  {index < 3 && (
                                    <input 
                                      type="radio" 
                                      name={`check3-${index}`} 
                                      value="Yes" 
                                      checked={item.dropdown === "Yes"}
                                      onChange={() => {
                                        const newChecklists = [...checklists3];
                                        newChecklists[index].dropdown = "Yes";
                                        setChecklists3(newChecklists);
                                      }}
                                      disabled={index === 0 ? (!item.images || Object.values(item.images).some(img => !img)) : 
                                                index === 2 ? !item.image : 
                                                false}
                                    />
                                  )}
                                </td>
                                <td className="text-center">
                                  {index < 3 && (
                                    <input 
                                      type="radio" 
                                      name={`check3-${index}`} 
                                      value="No" 
                                      checked={item.dropdown === "No"}
                                      onChange={() => {
                                        const newChecklists = [...checklists3];
                                        newChecklists[index].dropdown = "No";
                                        setChecklists3(newChecklists);
                                      }}
                                      disabled={index === 0 ? (!item.images || Object.values(item.images).some(img => !img)) : 
                                                index === 2 ? !item.image : 
                                                false}
                                    />
                                  )}
                                </td>
                                <td className="text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    {(index === 0 || index === 2 || index === 3) && (
                                      <button 
                                        style={{backgroundColor: "#E7E9FF", color: "#2962FF", fontSize: "10px", borderRadius: "12px", width: "64px", height: "24px"}}
                                        className="upload-button text-white px-2 py-1 rounded"
                                        onClick={() => {
                                          setIsUploadPopupOpen(true);
                                          setCurrentUploadIndex(index);
                                          setCurrentChecklistIndex(3);
                                        }}
                                      >
                                        <UploadIcon style={{width: "12px", height: "12px", marginRight: "4px", marginBottom: "3px"}} />
                                        Upload
                                      </button>
                                    )}
                                    {((item.images && Object.values(item.images).filter(Boolean).length > 0) || item.image) && (
                                      <div className="relative">
                                        <img 
                                          src={item.images ? Object.values(item.images).find(Boolean) : item.image} 
                                          alt="Thumbnail" 
                                          className="w-8 h-8 object-cover rounded"
                                        />
                                        {item.images && Object.values(item.images).filter(Boolean).length > 1 && (
                                          <span className="absolute bottom-0 right-0 bg-gray-800 text-white text-xs px-1 rounded-full">
                                            +{Object.values(item.images).filter(Boolean).length - 1}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </>
                            )
                            }
                          </tr>
                        )
                        )}
                        </tbody>
                      </table>
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
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                          <div className="checkListSection h-[450px]">
                          <table className="w-full">
                            <thead>
                              <tr>
                                <th className="text-left">Check points</th>
                                <th>Yes</th>
                                <th>No</th>
                                <th>Images</th>
                              </tr>
                            </thead>
                            <tbody>
                            {checklists4.map((item, index) => (
                              <tr key={index} className="border-b border-[#E6E8EC]">
                                <td className="py-[12px]">
                                  <Typography className="text-[#71747A]" variant="caption">{item.point}</Typography>
                                </td>
                                <td className="text-center">
                                  {(index === 0 || index === 2) && (
                                    <input 
                                      type="radio"
                                      name={`check4-${index}`}
                                      value="Yes"
                                      checked={item.dropdown === "Yes"}
                                      onChange={() => {
                                        const newChecklists = [...checklists4];
                                        newChecklists[index].dropdown = "Yes";
                                        setChecklists4(newChecklists);
                                      }}
                                      disabled={index === 0 ? !item.image : false}
                                    />
                                  )}
                                </td>
                                <td className="text-center">
                                  {(index === 0 || index === 2) && (
                                    <input 
                                      type="radio"
                                      name={`check4-${index}`}
                                      value="No"
                                      checked={item.dropdown === "No"}
                                      onChange={() => {
                                        const newChecklists = [...checklists4];
                                        newChecklists[index].dropdown = "No";
                                        setChecklists4(newChecklists);
                                      }}
                                      disabled={index === 0 ? !item.image : false}
                                    />
                                  )}
                                </td>
                                <td className="text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    {index === 0 && (
                                      <button 
                                        style={{backgroundColor: "#E7E9FF", color: "#2962FF", fontSize: "10px", borderRadius: "12px", width: "64px", height: "24px"}}
                                        className="upload-button text-white px-2 py-1 rounded"
                                        onClick={() => {
                                          setIsUploadPopupOpen(true);
                                          setCurrentUploadIndex(0);
                                          setCurrentChecklistIndex(4);
                                        }}
                                      >
                                        <UploadIcon style={{width: "12px", height: "12px", marginRight: "4px", marginBottom: "3px"}} />
                                        Upload
                                      </button>
                                    )}
                                    {index === 1 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px', marginTop:'10px'}}>
                                        {item.inputValue && item.inputValue.length > 10 && (
                                        <div className="relative top-[1px] text-xs text-gray-500 mb-1">
                                        <p>Invoice count: 
                                        {Math.floor(item.inputValue.replace(/,/g, '').length / 10)}
                                        </p>
                                        </div>
                                        )}
                                        <TextField
                                        value={item.inputValue || ''}
                                        onChange={(e) => {
                                        const value = e.target.value.replace(/,/g, '');
                                        if (value.length <= 55) {
                                        const formattedValue = value.replace(/(.{10})/g, '$1,').replace(/,$/, '');
                                        const newChecklists = [...checklists4];
                                        newChecklists[index].inputValue = formattedValue;
                                        setChecklists4(newChecklists);
                                        }
                                        }}
                                        fullWidth
                                        placeholder='Invoice Numbers'
                                        inputProps={{
                                        style: { fontSize: '12px', padding: '8px', width: '100px'} 
                                        }}
                                        />
                                        </div>
                                    )}
                                    {item.image && (
                                      <div className="relative">
                                        <img 
                                          src={item.image}
                                          alt="Thumbnail"
                                          className="w-8 h-8 object-cover rounded"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                            </tbody>
                          </table>
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
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                        <div onClick={handlePageSpecificSave} className="button">
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
              {/* <Dialog open={isRejectionDialogOpen} onClose={() => setIsRejectionDialogOpen(false)}>
                <DialogTitle>Vehicle Rejection</DialogTitle>
                <DialogContent>
                  <p>{rejectionReason}</p>
                  <p>Do you want to send a rejection email to the transporter?</p>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setIsRejectionDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleRejection} color="primary">Send Rejection Email</Button>
                </DialogActions>
              </Dialog> */}
            </div>
          )}

        </div></>}


    </div></>
  );
}

export default SecurityForm
function setIsSavedPermanently(arg0: boolean) {
  throw new Error('Function not implemented.');
}

