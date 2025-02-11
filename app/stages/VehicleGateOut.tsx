"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import UploadIcon from "@mui/icons-material/Upload";
import Checkbox from "@mui/material/Checkbox";
import UploadPopUpTwo from "../hooks/uploadPopUpTwo"
import axios from "axios";
import { vehicleGateOutValidation } from "../checkStage/vehicleGateOutValidation";
import { useRouter } from 'next/navigation';
import { useSnackbar, SnackbarComponent } from '../hooks/snackBar';

export default function VehicleGateOut({ activeStage, handleStepClick, driverDts }: any) {
  const router = useRouter();
  const { showSnackbar, snackbarState } = useSnackbar();
  const [checkListVGO, setCheckListVGO] = useState<any>(activeStage?.activeStage.checklist);
  const [isUploadPopUpTwoOpen, setIsUploadPopUpTwoOpen] = useState<boolean>(false);
  const [selectedQuetion, setSelectedQuetion] = useState<any>(null);
  const [nextStep, setNextStep] = useState<any>(null);

  const [saveDisabled, setSaveDisabled] = useState(true);
  const [successPopup, setSuccessPopup] = useState(false); // New state for success popup
  const [fadeOut, setFadeOut] = useState(false); // State for fade-out effect
  const [finishEnabled, setFinishEnabled] = useState(false);

  console.log("🚀 ~ file: VehicleGateOut.tsx:28 ~ VehicleGateOut ~ checkListVGO:", saveDisabled);

  const handleSaveClick = async () => {
    const payload:any = [];
    checkListVGO.map((item:any) => {
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
    setFinishEnabled(true);
  }

  const handleFinishClick = () => {
    showSnackbar('All Stages Verified and Completed!', 'success');
  
    setTimeout(() => {
      router.push('/');
    }, 3000);
  };


  useEffect(()=>{
    const pass = vehicleGateOutValidation(checkListVGO);
    setSaveDisabled(!pass);
  },[checkListVGO])




  return (
    <>
    <div className="w-full h-full relative">

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
      {/* ------- Checklist ------- */}
      <div className=" max-h-[calc(100vh-234px)] overflow-y-scroll mb-[60px] sm:mb-0">
        <div className="top md:flex md:flex-row-reverse gap-[24px]">
          <div className="right w-full">
            <div className="checkList bg-[#fcfcfc] p-[20px] h-full rounded-[12px]">
              <div className="body flex flex-col gap-[16px]">
                <div className="header">
                  <p className="text-[#131722] text-[18px] font-bold">
                    Vehicle Gate Out Activity
                  </p>
                </div>
                <div className=" h-[450px] overflow-y-scroll">
                  <table className="w-full">
                    <thead>
                      <tr className="text-sm font-semibold">
                        <th className="text-left">Check points</th>
                        <th>Yes</th>
                        <th>No</th>
                        <th>Images</th>
                        <th>Previews</th>
                      </tr>
                    </thead>

                    <tbody>
                      {checkListVGO.map((item: any, index: any) => (
                        <tr key={index} className="border-b border-[#E6E8EC]">
                          <td className="py-[12px]">
                            <Typography
                              className="text-[#71747A]"
                              variant="caption"
                            >
                              {item.point}
                            </Typography>
                          </td>

                          <td className="text-center px-3">
                            {index === 0 && (
                              <Checkbox
                                size="small"
                                checked={item.allowed}
                                disabled={!item?.images?.some((image: any) => image?.imageURL && typeof image?.imageURL === 'string')}                                onChange={(e) => {
                                  setCheckListVGO((prev: any) => {
                                    const newChecklists = [...prev];
                                    newChecklists[index].allowed =
                                      e.target.checked;
                                    return newChecklists;
                                  });
                                }}
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            )}
                            {(index === 3 || index === 2) && (
                              <Checkbox
                                size="small"
                                checked={item.allowed}
                                // disabled={item.images.length === 0}
                                onChange={(e) => {
                                  setCheckListVGO((prev: any) => {
                                    const newChecklists = [...prev];
                                    newChecklists[index].allowed =
                                      e.target.checked;
                                    return newChecklists;
                                  });
                                }}
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            )}
                          </td>

                          <td className="text-center px-3">
                            {index === 0 && (
                              <Checkbox
                                size="small"
                                checked={!item.allowed}
                                disabled={!item.images.some((image: any) => image.imageURL && typeof image.imageURL === 'string')}                                onChange={(e) => {
                                  setCheckListVGO((prev: any) => {
                                    const newChecklists = [...prev];
                                    newChecklists[index].allowed =
                                      !e.target.checked;
                                    return newChecklists;
                                  });
                                }}
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            )}
                            {(index === 3 || index === 2) && (
                              <Checkbox
                                size="small"
                                checked={!item.allowed}
                                // disabled={item.images.length === 0}
                                onChange={(e) => {
                                  setCheckListVGO((prev: any) => {
                                    const newChecklists = [...prev];
                                    newChecklists[index].allowed =
                                      !e.target.checked;
                                    return newChecklists;
                                  });
                                }}
                                inputProps={{ "aria-label": "controlled" }}
                              />
                            )}
                          </td>

                          <td className="text-center">
                            <div className="flex items-center justify-center gap-2 px-3">
                              {index === 0 && (
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    style={{
                                      backgroundColor: "#E7E9FF",
                                      color: "#2962FF",
                                      fontSize: "10px",
                                      borderRadius: "12px",
                                      width: "64px",
                                      height: "24px",
                                    }}
                                    className="upload-button text-white px-2 py-1 rounded"
                                    onClick={() => {
                                      setIsUploadPopUpTwoOpen(true);
                                      setSelectedQuetion(item);
                                    }}
                                  >
                                    <UploadIcon
                                      style={{
                                        width: "12px",
                                        height: "12px",
                                        marginRight: "4px",
                                        marginBottom: "3px",
                                      }}
                                    />
                                    Upload
                                  </button>
                                </div>
                              )}
                              {index === 3 && item.allowed && (
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    style={{
                                      backgroundColor: "#E7E9FF",
                                      color: "#2962FF",
                                      fontSize: "10px",
                                      borderRadius: "12px",
                                      width: "64px",
                                      height: "24px",
                                    }}
                                    className="upload-button text-white px-2 py-1 rounded"
                                    onClick={() => {
                                      setIsUploadPopUpTwoOpen(true);
                                      setSelectedQuetion(item);
                                    }}
                                  >
                                    <UploadIcon
                                      style={{
                                        width: "12px",
                                        height: "12px",
                                        marginRight: "4px",
                                        marginBottom: "3px",
                                      }}
                                    />
                                    Upload
                                  </button>
                                </div>
                              )}
                              {index === 1 && (
                                <div className="flex items-center justify-center gap-2 flex-col">
                                  <p className="text-[12px] text-[#71747A] text-nowrap">Enter Invoice Number Separated By <span className="font-bold">Comma (,)</span></p>
                                  <style>
                                    {`input[type="number"]::-webkit-inner-spin-button,
                                      input[type="number"]::-webkit-outer-spin-button {
                                        -webkit-appearance: none;
                                        margin: 0;
                                      }

                                      input[type="number"] {
                                        -moz-appearance: textfield;
                                      }

                                      input[type="number"] {
                                        appearance: none;
                                      }`}
                                  </style>
                                  <div>
                                  <input
                                    type="text"
                                    value={
                                      item.inputValue === 0
                                        ? ""
                                        : item.inputValue
                                    }
                                    className="border border-gray-300 rounded-md px-2 py-1 outline-none w-[150px] font-mono text-center text-[12px]"
                                    onChange={(e) => {
                                      const inputValue = e.target.value;

                                      const validatedValue = inputValue.replace(/[^0-9,]/g, '');
                                      
                                      const formattedValue = validatedValue.replace(/(\d{10})(?=\d)/g, '$1,');
                                      if (formattedValue.length <= 65) {
                                        setCheckListVGO((prev: any) => {
                                          const newChecklists = [...prev];
                                          newChecklists[index].inputValue =
                                          formattedValue;
                                          return newChecklists;
                                        });
                                      }
                                    }}
                                  />
                                  {item.inputValue !== "" && (
                                    <span className="text-[14px] text-[#71747A] font-mono ml-5">
                                      [{item?.inputValue?.split(",").filter((val:any) => val.trim() !== '').length}]
                                    </span>
                                  )}
                                  </div>
                                  
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="text-center mx-3">
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                              {index != 5 &&
                                item.images.map((img: any) => (
                                  <div className="w-[50px] h-[50px]">
                                    <img
                                      src={img.imageURL}
                                      alt={img.type}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              {index === 1 && (
                                <div className="flex items-center justify-center gap-2 flex-wrap">
                                  <div className="text-[10px] text-[#71747A]">
                                    {item.inputValue === 0
                                      ? ""
                                      : item?.inputValue?.split(",").map((item:any, index:any)=>{
                                        return(
                                          <p key={index}>{item}</p>
                                        )
                                      })}
                                  </div>
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
        </div>
      </div>

      {/* === Bottom Navigation === */}
      <div className="absolute bottom-0 bg-white rounded-[8px] w-full flex justify-between items-center p-1">
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
        <div className="flex gap-[5px] items-center">
          <button 
            onClick={() => {handleSaveClick()}}
            disabled={saveDisabled}
            className={` ${saveDisabled ? "bg-gray-400" : "bg-blue-600 hover:bg-[#2563EB]" } text-white text-sm px-8 py-2 rounded-md cursor-pointer duration-300 font-semibold`}
            style={{ marginRight: "15px" }}
          >Save
          </button>
          <button
            disabled={!finishEnabled}
            onClick={handleFinishClick}
            className={`${finishEnabled ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-400"} text-white text-sm px-8 py-2 rounded-md cursor-pointer duration-300 font-semibold`}
          >
            Finish
          </button>
        </div>
      </div>

      {/* === upload popup === */}
      {isUploadPopUpTwoOpen && (
        <UploadPopUpTwo
          openClose={setIsUploadPopUpTwoOpen}
          selectedItem={selectedQuetion}
          updateList={setCheckListVGO}
          questionList={checkListVGO}
        />
      )}
    </div>

    <SnackbarComponent 
      open={snackbarState.open} 
      message={snackbarState.message} 
      type={snackbarState.type} 
    />
    </>
  );
}
