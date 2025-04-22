"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import UploadIcon from "@mui/icons-material/Upload";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import UploadPopUpTwo from "../hooks/uploadPopUpTwo";
import { loadingOutBillingActValidation } from "../checkStage/loadingOutBillingActValidation";
import { useRouter } from 'next/navigation';

export default function LoadingOutBillingAct({
  activeStage,
  handleStepClick,
  searchParams,
  driverDts
}: any) {
  const [checklistsLOBA, setChecklistsLOBA] = useState<any[]>(activeStage?.activeStage?.checklist);
  const [isUploadPopUpTwoOpen, setIsUploadPopUpTwoOpen] =
    useState<boolean>(false);
  const [selectedQuetion, setSelectedQuetion] = useState<any>(null);
  const [nextStep, setNextStep] = useState<any>(null);

  const [saveDisabled, setSaveDisabled] = useState(true);
  const [successPopup, setSuccessPopup] = useState(false); // New state for success popup
  const [fadeOut, setFadeOut] = useState(false); // State for fade-out effect

  const router = useRouter();

  const handleNewVehicle = () => {
    router.push('/');
  }

  const handleSaveClick = async () => {
    const payload:any = [];
    checklistsLOBA.map((item:any) => {
      payload.push({
        _id: item?._id,
        allowed: item?.allowed,
        date: item?.date,
        inputValue: item?.inputValue,
        subQuestions: item?.subQuestions.map((subQuestion: any) => ({
          point: subQuestion?.point,
          allowed: subQuestion?.allowed,
          subQuestionInputValue: subQuestion?.subQuestionInputValue
        }))
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
    const pass = loadingOutBillingActValidation(checklistsLOBA);
    setSaveDisabled(!pass);
  },[checklistsLOBA])

  useEffect(() => {
    if(driverDts && driverDts.invoiceNumbers){
      setChecklistsLOBA((prev: any) => {
        return prev.map((item: any) => {
          const newItem = {...item};

          if(newItem.subQuestions && newItem.subQuestions.length > 0){
            newItem.subQuestions = newItem.subQuestions.map((subQuestion: any, index: number) => {
              if(index === 0 && driverDts.invoiceNumbers !== '--'){
                return {
                  ...subQuestion,
                  allowed: true,
                  subQuestionInputValue: driverDts.invoiceNumbers
                };
              } else if(index === 1 && driverDts.waybillNo !== '--'){
                return {
                  ...subQuestion,
                  allowed: true,
                  subQuestionInputValue: driverDts.waybillNo
                };
              }
              else{
                return {
                  ...subQuestion,
                };
              }
            })
          }
          console.log("newItem",newItem);
          return newItem;
        })
      })
    }
  }, [driverDts])

  console.log("🚀 ~ file: LoadingOutBillingAct.tsx:49 ~ LoadingOutBillingAct ~ selectedQuetion:",checklistsLOBA );

  return (
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
                   Loading Out And Billing Activity
                  </p>
                </div>

                <div className="overflow-y-scroll">
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
                      {checklistsLOBA.map((item, index) => (
                        <React.Fragment key={index}>
                          <tr className="border-b border-[#E6E8EC]">
                            <td className="py-[12px]">
                              <Typography
                                className="text-[#71747A]"
                                variant="caption"
                              >
                                {item.point}
                              </Typography>
                            </td>

                            {/* For rows other than row 4 */}
                            {item?.subQuestions?.length === 0 ? (
                              <>
                                <td className="text-center px-3">
                                  {index == 0 && (
                                    <Checkbox
                                    size="small"
                                    checked={item.allowed}
                                    disabled={
                                      !item.images.some((image: any) => image.imgType === "First Layer" && image.imageURL && typeof image.imageURL === 'string')
                                    }
                                    onChange={(e) => {
                                      setChecklistsLOBA((prev: any) => {
                                        const newChecklists = [...prev];
                                        newChecklists[index].allowed =
                                          e.target.checked;
                                        return newChecklists;
                                      });
                                    }}
                                    inputProps={{ "aria-label": "controlled" }}
                                  />
                                  )}
                                  {index < 2 && index != 0 && (
                                  <Checkbox
                                    size="small"
                                    checked={item.allowed}
                                    onChange={(e) => {
                                      setChecklistsLOBA((prev: any) => {
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
                                {index == 0 && (
                                  <Checkbox
                                    size="small"
                                    checked={!item.allowed}
                                    disabled={
                                      !item.images.some((image: any) => image.imgType === "First Layer" && image.imageURL && typeof image.imageURL === 'string')
                                    }
                                    onChange={(e) => {
                                      setChecklistsLOBA((prev: any) => {
                                        const newChecklists = [...prev];
                                        newChecklists[index].allowed =
                                          !e.target.checked;
                                        return newChecklists;
                                      });
                                    }}
                                    inputProps={{ "aria-label": "controlled" }}
                                  />
                                )}
                                  {index < 2 && index != 0 && (
                                     <Checkbox
                                     size="small"
                                     checked={!item.allowed}
                                     onChange={(e) => {
                                       setChecklistsLOBA((prev: any) => {
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
                                </td>
                                <td className="text-center mx-3">
                                  <div className="flex items-center justify-center gap-2 flex-wrap">
                                    {item.images.map((img: any) => (
                                      <div
                                        key={img.type}
                                        className="w-[50px] h-[50px]"
                                      >
                                        <img
                                          src={img.imageURL}
                                          alt={img.type}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </td>
                              </>
                            ) : (
                              // For row 4 with sub-questions
                              <>
                                <td colSpan={4} className="py-[12px]">
                                  <div className="flex flex-col gap-2">
                                    {item.subQuestions?.map(
                                      (subQuestion: any, subIndex: any) => (
                                        <div key={subIndex} className="">
                                          <Typography
                                            className="text-[#73767B] text-[12px] font-medium"
                                            variant="caption"
                                          >
                                            {subQuestion.point}
                                          </Typography>
                                          <div className="flex items-center gap-3 font-sans text-[12px]">
                                            <div className="flex items-center">
                                            <Checkbox
                                              size="small"
                                              checked={subQuestion.allowed}
                                              onChange={(e) => {
                                                setChecklistsLOBA(
                                                  (prev: any) => {
                                                    const newChecklists = [
                                                      ...prev,
                                                    ];
                                                    newChecklists[
                                                      index
                                                    ].subQuestions[
                                                      subIndex
                                                    ].allowed =
                                                      e.target.checked;
                                                    return newChecklists;
                                                  }
                                                );
                                              }}
                                              inputProps={{
                                                "aria-label": "controlled",
                                              }}
                                            />
                                            <span>Yes</span>
                                            </div>

                                            <div className="flex items-center">
                                            <Checkbox
                                              size="small"
                                              checked={!subQuestion.allowed}
                                              onChange={(e) => {
                                                setChecklistsLOBA(
                                                  (prev: any) => {
                                                    const newChecklists = [
                                                      ...prev,
                                                    ];
                                                    newChecklists[
                                                      index
                                                    ].subQuestions[
                                                      subIndex
                                                    ].allowed =
                                                      !e.target.checked;
                                                    return newChecklists;
                                                  }
                                                );
                                              }}
                                              inputProps={{
                                                "aria-label": "controlled",
                                              }}
                                            />
                                            <span>No</span>
                                            </div>
                                          </div>
                                          {subIndex === 0 && subQuestion.allowed && (
                                            <div className="mt-2">
                                              <input
                                                type="text"
                                                className="border border-gray-300 rounded px-2 py-1 text-[12px] outline-none"
                                                placeholder="Enter invoice number"
                                                value={item.subQuestions[subIndex].subQuestionInputValue || ""}
                                                maxLength={40} 
                                                onChange={(e) => {
                                                    setChecklistsLOBA((prev: any) => {
                                                      const newChecklists = [...prev];
                                                      newChecklists[index].subQuestions[subIndex].subQuestionInputValue = e.target.value;
                                                      return newChecklists;
                                                    });
                                                }}
                                              />
                                            </div>
                                          )}
                                          {subIndex === 1 && subQuestion.allowed && (
                                            <div className="mt-2">
                                              <input
                                                type="text"
                                                className="border border-gray-300 rounded px-2 py-1 text-[12px] outline-none"
                                                placeholder="Enter e-way bill"
                                                value={item.subQuestions[subIndex].subQuestionInputValue || ""}
                                                maxLength={10}
                                                onChange={(e) => {
                                                    setChecklistsLOBA((prev: any) => {
                                                      const newChecklists = [...prev];
                                                      newChecklists[index].subQuestions[subIndex].subQuestionInputValue = e.target.value;
                                                      return newChecklists;
                                                    });
                                                }}
                                              />
                                            </div>
                                          )}
                                          {subIndex === 2 && subQuestion.allowed && (
                                            <div className="mt-2">
                                              <input
                                                type="text"
                                                className="border border-gray-300 rounded px-2 py-1 text-[12px] outline-none"
                                                placeholder="Enter MTC number"
                                                value={item.subQuestions[subIndex].subQuestionInputValue || ""}
                                                maxLength={10} 
                                                onChange={(e) => {
                                                  setChecklistsLOBA((prev: any) => {
                                                    const newChecklists = [...prev];
                                                    newChecklists[index].subQuestions[subIndex].subQuestionInputValue = e.target.value;
                                                    return newChecklists;
                                                  });
                                                }}
                                              />
                                            </div>
                                          )}
                                          {subIndex === 3 && subQuestion.allowed && (
                                            <div className="mt-2">
                                              <input
                                                type="text"
                                                className="border border-gray-300 rounded px-2 py-1 text-[12px] outline-none"
                                                placeholder="Enter LR number"
                                                value={item.subQuestions[subIndex].subQuestionInputValue || ""}
                                                maxLength={10} 
                                                onChange={(e) => {
                                                  setChecklistsLOBA((prev: any) => {
                                                    const newChecklists = [...prev];
                                                    newChecklists[index].subQuestions[subIndex].subQuestionInputValue = e.target.value;
                                                    return newChecklists;
                                                  });
                                                }}
                                              />
                                            </div>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Navigation === */}
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
           onClick={()=>{handleSaveClick()}}
           disabled={saveDisabled}
           className={` ${saveDisabled ? "bg-gray-400" : "bg-blue-600 hover:bg-[#2563EB]" } text-white text-sm px-8 py-2 rounded-md cursor-pointer duration-300 font-semibold`}
            style={{ marginRight: "15px" }}
          >
            Save
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

      {/* ------- upload popup ------- */}
      {isUploadPopUpTwoOpen && (
        <UploadPopUpTwo
          openClose={setIsUploadPopUpTwoOpen}
          selectedItem={selectedQuetion}
          updateList={setChecklistsLOBA}
          questionList={checklistsLOBA}
          activeStage={activeStage}
        />
      )}
    </div>
  );
}
