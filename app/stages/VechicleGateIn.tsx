'use client'
import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import { vehicleGateInValidation } from "../checkStage/vehicleGateIn";
import shipmentCheck from "../hooks/shipmentCheck";
import { enIN } from "date-fns/locale";
import { useRouter } from 'next/navigation';

export default function VechicleGateIn({ activeStage, handleStepClick, driverDts }: any) {
  const [checklistsVGI, setChecklistsVGI] = useState<any>(activeStage?.activeStage.checklist);
  const [nextStep, setNextStep] = useState<any>(null);

  const [saveDisabled, setSaveDisabled] = useState(true);
  const [successPopup, setSuccessPopup] = useState(false); // New state for success popup
  const [fadeOut, setFadeOut] = useState(false); // State for fade-out effect


  console.log("🚀 ~ file: VechicleGateIn.tsx:23 ~ VechicleGateIn ~ checklistsVGI:", checklistsVGI);

  const router = useRouter();

  const handleNewVehicle = () => {
    router.push('/');
  }

  const handleSaveClick = async () => {
    const payload:any = [];
    checklistsVGI.map((item:any) => {
      payload.push({
        _id: item?._id,
        allowed: item?.allowed,
        date: item?.date,
        inputValue: item?.inputValue,
        subQuestions: item?.subQuestions
      });
    });
    const stageDataPayload = {
      securityCheck_id: driverDts?._id,
      stage_id: activeStage?.activeStage?._id,
      start_at: activeStage?.activeStage?.start_at || new Date(),
    }
    const config = {
      url: `https://prod-api.instavans.com/api/thor/v1/security/save_stage_individual`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem(
          "accessToken"
        )} Shipper ${localStorage.getItem("default_unit")}`,
      },
      data: {lists: payload, completed: false, stageData: stageDataPayload}, 
    };
    const response = await axios(config);
    try {
      if (response.data.statusCode === 200) {
        setNextStep(true);
        setSuccessPopup(true);
        setTimeout(() => setFadeOut(true), 2000); 
        setTimeout(() => {
          setSuccessPopup(false);
          setFadeOut(false); // Hide popup after 3 seconds
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    const pass = vehicleGateInValidation(checklistsVGI);
    setSaveDisabled(!pass);
  },[checklistsVGI])

  const [isSkipped, setIsSkipped] = useState(false);

    const { checkShipment, ShipmentCheckDialog } = shipmentCheck({
      driverDts,
      activeStage,
      currentStageCode: "VGI",
      openClose: (open: boolean) => setIsSkipped(!open),
      onSkip: (lastShipment) => {
        handleStepClick(activeStage.activestep + 1);
      },
      onContinue: () => {
        handleStepClick(activeStage.activestep + 1);
      }
    });
  
    useEffect(() => {
      if(driverDts){
        checkShipment();
      }
    },[driverDts, activeStage]);

  return (
    <div className="w-full h-full relative">
       {ShipmentCheckDialog}
      {/* ------- Success Popup ------- */}
      {successPopup && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ${
            fadeOut ? "opacity-0" : "opacity-100"
          } transition-opacity duration-1000`} // Smooth fade-out
          style={{ backdropFilter: "blur(4px)" }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-xl font-bold mb-2">Success!</h2>
            <p className="text-sm text-gray-600 mb-4">Data saved successfully!</p>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setSuccessPopup(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
      {/* === Checklist === */}
      <div className=" max-h-[calc(100vh-234px)] overflow-y-scroll mb-[60px] sm:mb-0">
        <div className="top md:flex md:flex-row-reverse gap-[24px]">
          <div className="right w-full">
            <div className="checkList bg-[#fcfcfc] p-[20px] h-full rounded-[12px]">
              <div className="body flex flex-col gap-[16px]">
                <div className="header">
                  <p className="text-[#131722] text-[18px] font-bold">
                    Vehicle Gate In
                  </p>
                </div>
                <div className=" h-[450px] overflow-y-scroll">
                  {checklistsVGI.flatMap((item:any, index:number) => {
                    return (
                      <div className="detailsSection flex justify-between mb-5" key={index}>
                        <div>
                          <div className="">{item.point}</div>
                          <div className="content-center pb-2 mt-2" style={{display: 'flex', flexDirection: 'column'}}>
                            <label className="text-[14px]" style={{color: 'rgba(0,0,0,0.6)', marginRight: '10px', marginBottom: '5px'}}>Select Date</label>
                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={enIN}>
                              <MobileDateTimePicker
                                className="block h-10 mt-[4px]"
                                value={
                                  !item.date
                                    ? new Date()
                                    : new Date(item?.date)
                                }
                                onChange={(newValue: any) => {
                                  setChecklistsVGI((prev: any) => {
                                    const newChecklists = [...prev];
                                    newChecklists[index].date = newValue;
                                    return newChecklists;
                                  });
                                }}
                                renderInput={(params: any) => (
                                  <TextField {...params}
                                  sx={{
                                    '& .MuiInputBase-root': {
                                      height: '40px',
                                    },
                                    width: '52%',
                                      '& .MuiOutlinedInput-root': {
                                      '&.Mui-focused fieldset': {
                                        borderColor: 'rgba(0, 0, 0, 0.23)',
                                      },
                                    },
                                  }} />
                                )}
                                // minDate={new Date()}
                              />
                            </LocalizationProvider>
                          </div>
                        </div>

                        <div className="flex gap-[8px] items-center">
                          <Checkbox
                            size="small"
                            checked={item.allowed}
                            // disabled={item.images.length === 0}
                            onChange={(e: any) => {
                              setChecklistsVGI((prev: any) => {
                                const newChecklists = [...prev];
                                newChecklists[index].allowed = e.target.checked;
                                return newChecklists;
                              });
                            }}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                          <div style={{marginRight: '15px'}}>Capture System Date & Time</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === navigation === */}
      <div className="absolute bottom-0 bg-white rounded-[8px] w-full flex justify-between items-center p-1">
        <div className="flex gap-[20px] items-center">
        <button onClick={handleNewVehicle} className='bg-blue-600 text-white text-sm px-8 py-2 rounded-md cursor-pointer hover:bg-blue-500 duration-300 font-semibold'>New Vehicle</button>
        <button
          onClick={() => {
            handleStepClick(activeStage.activestep - 1);
          }}
          disabled={activeStage.activestep === 0}
          className={` ${
            activeStage.activestep === 0 ? "bg-gray-400" : "bg-blue-600"
          } text-white text-sm px-8 py-2 rounded-md cursor-pointer hover:bg-blue-500 duration-300 font-semibold`}
        >
          Back
        </button>
        </div>
        <div className="flex gap-[5px] items-center">
          <button 
          onClick={() => {
            handleSaveClick();
          }}
          // disabled={saveDisabled}
          className={` ${saveDisabled ? "bg-blue-600" : "bg-blue-600"} text-white text-sm px-8 py-2 rounded-md cursor-pointer hover:bg-blue-500 duration-300 font-semibold`}
          style={{ marginRight: "15px" }}
          >Save
          </button>
          <button
            onClick={() => {
              handleStepClick(activeStage.activestep + 1);
            }}
            disabled={!nextStep}
            className={` ${!nextStep ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-500 "} text-white text-sm px-8 py-2 rounded-md cursor-pointer duration-300 font-semibold`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
