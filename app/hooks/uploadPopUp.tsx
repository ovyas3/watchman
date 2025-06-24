"use client";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { ImageUploadSlotProps } from "../utils/interface";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import CameraModal from "../securityForm/CameraModal";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { enIN } from "date-fns/locale";
import { toast } from "react-toastify";
import { signOut } from "next-auth/react";

const UploadPopUp = ({
  openClose,
  selectedItem,
  updateList,
  questionList,
  activeStage,
  driverDts,
}: any) => {
  const [selectedCheckList, setSelectedCheckList] = useState<any>(selectedItem);
  const [popupOpen, setPopupOpen] = useState<any>({ msg: null, type: false });
  const [removeImagepopup, setRemoveImagepopup] = useState<any>(false);
  const [isValidLicense, setIsValidLicense] = useState(true);
  const limitedCapacityInKg = driverDts?.capacity?.capacity * 1.1 * 1000;

  useEffect(() => {
    if (popupOpen?.type) {
      const timer = setTimeout(() => {
        setPopupOpen({ msg: null, type: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [popupOpen]);

  console.log(
    "🚀 ~ file: uploadPopUp.tsx:43 ~ UploadPopUp ~ selectedItem:",
    popupOpen
  );

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        openClose(false);
      }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-lg shadow-lg w-[600px] relative"
      >
        <div
          className="absolute -top-12 right-0 cursor-pointer bg-white p-2 rounded-full hover:bg-gray-200 duration-1000 hover:rotate-180 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            openClose(false);
          }}
        >
          <CloseIcon />
        </div>

        {(selectedItem?.code === "VEHICLE_BODY_CHECK" ||
          selectedItem?.code === "BODY_REINSPECTION") &&
          (() => {
            return (
              <div>
                <h2>{selectedItem?.point}</h2>
                <div className=" flex flex-wrap gap-x-10 gap-y-5 mt-3 justify-center">
                  {selectedItem?.images?.map((part: any, index: any) => (
                    <ImageUploadSlot
                      key={index}
                      image={part?.imageURL || null}
                      label={part?.imgType || ""}
                      part={part}
                      updateList={updateList}
                      selectedCheckList={selectedCheckList}
                      setSelectedCheckList={setSelectedCheckList}
                      activeStage={activeStage}
                      selectedItem={selectedItem}
                      setPopupOpen={setPopupOpen}
                      setRemoveImagepopup={setRemoveImagepopup}
                      driverDts={driverDts}
                    />
                  ))}
                </div>
              </div>
            );
          })()}

        {(selectedItem?.code === "TARPAULIN_CHECK" ||
          selectedItem?.code === "TARPAULIN_POSITION_CHECK") &&
          (() => {
            // const imageParts = ["photo1", "photo2"];
            return (
              <div>
                <h2>{selectedItem?.point}</h2>
                <div className=" flex flex-wrap gap-x-10 gap-y-5 mt-3 justify-center">
                  {selectedItem?.images?.map((part: any, index: any) => (
                    <ImageUploadSlot
                      key={index}
                      image={part?.imageURL || null}
                      label={part?.imgType || ""}
                      part={part}
                      updateList={updateList}
                      selectedCheckList={selectedCheckList}
                      setSelectedCheckList={setSelectedCheckList}
                      activeStage={activeStage}
                      selectedItem={selectedItem}
                      setPopupOpen={setPopupOpen}
                      setRemoveImagepopup={setRemoveImagepopup}
                      driverDts={driverDts}
                    />
                  ))}
                </div>
              </div>
            );
          })()}

        {selectedItem?.code === "PUC_VALIDITY_CHECK" &&
          (() => {
            // const imageParts = ["photo1"];
            return (
              <div>
                <h2>{selectedItem?.point}</h2>
                <div className=" flex flex-wrap gap-x-10 gap-y-5 mt-3 justify-center">
                  {selectedItem?.images?.map((part: any, index: any) => (
                    <ImageUploadSlot
                      key={index}
                      image={part?.imageURL || null}
                      label={part?.imgType || ""}
                      part={part}
                      updateList={updateList}
                      selectedCheckList={selectedCheckList}
                      setSelectedCheckList={setSelectedCheckList}
                      activeStage={activeStage}
                      selectedItem={selectedItem}
                      setPopupOpen={setPopupOpen}
                      setRemoveImagepopup={setRemoveImagepopup}
                      driverDts={driverDts}
                    />
                  ))}
                </div>
              </div>
            );
          })()}

        {selectedItem?.code === "FITNESS_CERT_CHECK" &&
          (() => {
            // const imageParts = ["photo1"];
            return (
              <div>
                <h2>{selectedItem?.point}</h2>
                <div className=" flex flex-wrap gap-x-10 gap-y-5 mt-3 justify-center">
                  {selectedItem?.images?.map((part: any, index: any) => (
                    <ImageUploadSlot
                      key={index}
                      image={part?.imageURL || null}
                      label={part?.imgType || ""}
                      part={part}
                      updateList={updateList}
                      selectedCheckList={selectedCheckList}
                      setSelectedCheckList={setSelectedCheckList}
                      activeStage={activeStage}
                      selectedItem={selectedItem}
                      setPopupOpen={setPopupOpen}
                      setRemoveImagepopup={setRemoveImagepopup}
                      driverDts={driverDts}
                    />
                  ))}
                </div>
              </div>
            );
          })()}

        {selectedItem?.code === "CARRYING_CAPACITY" &&
          (() => {
            // const imageParts = ["photo1"];
            return (
              <div>
                <h2>{selectedItem?.point}</h2>
                <div className=" flex flex-wrap gap-x-10 gap-y-5 mt-3 justify-center">
                  {selectedItem?.images?.map((part: any, index: any) => (
                    <ImageUploadSlot
                      key={index}
                      image={part?.imageURL || null}
                      label={part?.imgType || ""}
                      part={part}
                      updateList={updateList}
                      selectedCheckList={selectedCheckList}
                      setSelectedCheckList={setSelectedCheckList}
                      activeStage={activeStage}
                      selectedItem={selectedItem}
                      setPopupOpen={setPopupOpen}
                      setRemoveImagepopup={setRemoveImagepopup}
                      driverDts={driverDts}
                    />
                  ))}
                </div>
              </div>
            );
          })()}

        {selectedItem?.code === "DRIVER_LICENSE_CHECK" &&
          (() => {
            const imageParts = ["photo1"];
            return (
              <div>
                <h2>{selectedItem?.point}</h2>
                <div className="flex justify-between mt-4">
                  <div>
                    <label className="text-[12px]">
                      Driver's License Number
                    </label>
                    {selectedCheckList.code === "DRIVER_LICENSE_CHECK" ? <span className="text-red-500 ml-1">*</span> : null}
                    <input
                      type="text"
                      // className="h-[56px]  border-[1px] border-gray-300 rounded-md px-4 py-2 outline-none mt-1 w-[241px]"
                      className={`h-[56px] border-[1px] ${
                        isValidLicense ? "border-gray-300" : "border-red-500"
                      } rounded-md px-4 py-2 outline-none mt-1 w-[241px]`}
                      placeholder="Driver's License Number"
                      value={selectedCheckList.inputValue || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedCheckList({
                          ...selectedCheckList,
                          inputValue: e.target.value,
                        });
                        updateList((previous: any) => {
                          const updatedList = [...previous];
                          updatedList.forEach((item: any) => {
                            if (item.code === selectedCheckList.code) {
                              item.inputValue = e.target.value;
                            }
                          });
                          return updatedList;
                        });
                        const licenseRegex = /^[A-Za-z0-9]{5,15}$/; // Adjust regex based on the format
                        setIsValidLicense(licenseRegex.test(value));
                      }}
                    />
                    {!isValidLicense && (
                      <p className="text-[12px] text-red-500 mt-1">
                        Please enter a valid driver's license number.
                      </p>
                    )}
                  </div>

                  <div className="content-center pb-2">
                    <label className="text-[12px]">Select Date</label>
                    {selectedCheckList.code === "DRIVER_LICENSE_CHECK" ? <span className="text-red-500 ml-1">*</span> : null}
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={enIN}>
                      <MobileDateTimePicker
                        className="w-full h-[48px] mt-[4px]"
                        value={
                          selectedCheckList.date === ""
                            ? new Date()
                            : new Date(selectedCheckList.date)
                        }
                        onChange={(newValue) => {
                          updateList((previous: any) => {
                            const updatedList = [...previous];
                            updatedList.forEach((item: any) => {
                              if (item.code === selectedCheckList.code) {
                                item.date = newValue;
                              }
                            });
                            return updatedList;
                          });
                          setSelectedCheckList((prev: any) => {
                            const updateObject = { ...prev };
                            updateObject.date = newValue;
                            return updateObject;
                          });
                        }}
                        minDate={new Date()}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
            );
          })()}

        {selectedItem?.code === "ALCOHOL_SCREENING" &&
          (() => {
            const imageParts = ["photo1"];
            return (
              <div>
                <h2>{selectedItem?.point}</h2>
                <div className=" flex flex-wrap gap-x-10 gap-y-5 mt-3 justify-center">
                  {selectedItem?.images.map((part: any, index: any) => (
                    <ImageUploadSlot
                      key={index}
                      image={part?.imageURL || null}
                      label={part?.imgType || ""}
                      part={part}
                      updateList={updateList}
                      selectedCheckList={selectedCheckList}
                      setSelectedCheckList={setSelectedCheckList}
                      activeStage={activeStage}
                      selectedItem={selectedItem}
                      setPopupOpen={setPopupOpen}
                      setRemoveImagepopup={setRemoveImagepopup}
                      driverDts={driverDts}
                    />
                  ))}
                </div>
              </div>
            );
          })()}

        {/* {selectedItem?.code === "WEIGHT_CROSSCHECK" &&
          (() => {
            const imageParts = ["photo1"];
            return (
              <div>
                <h2>{selectedItem?.point}</h2>
                <div className=" flex flex-wrap gap-x-10 gap-y-5 mt-3">
                  <input
                    type="number"
                    step="0.001"
                    className="w-full border-[1px] outline-none h-[48px] mt-[4px] px-2 rounded-sm no-stepper"
                    placeholder="Enter Carrying Capacity"
                    value={
                      selectedCheckList.inputValue > 0
                        ? selectedCheckList.inputValue
                        : ""
                    }
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setSelectedCheckList((prev: any) => ({
                        ...prev,
                        inputValue: newValue,
                      }));
                      updateList((previous: any) => {
                        const updatedList = previous.map((item: any) =>
                          item.code === selectedCheckList.code
                            ? { ...item, inputValue: newValue }
                            : item
                        );
                        return updatedList;
                      });
                    }}
                  />
                </div>
              </div>
            );
          })()} */}
        {selectedItem?.code === "WEIGHT_CROSSCHECK" &&
          (() => {
            const imageParts = ["photo1"];
            return (
              <div>
                <h2>{selectedItem?.point}</h2>
                <div className="flex flex-wrap gap-x-10 gap-y-5 mt-3">
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
                <label className="text-[12px] mt-[9px] mb-[-15px]">Carrying Capacity</label>
                {selectedCheckList.code === "WEIGHT_CROSSCHECK" ? <span className="text-red-500 text-lg absolute -top-[-85px] left-[115px]">*</span> : null}
                  <input
                    type="number"
                    step="0.001" // Allows up to 3 decimal places
                    className="w-full border-[1px] outline-none h-[48px] mt-[4px] px-2 rounded-sm no-stepper"
                    placeholder="Enter Carrying Capacity"
                    value={
                      selectedCheckList.inputValue > 0
                        ? selectedCheckList.inputValue
                        : ""
                    }
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const isValidDecimal = /^(\d+(\.\d{0,3})?)?$/.test(
                        inputValue
                      );

                      if (isValidDecimal) {
                        const newValue = parseFloat(inputValue);

                        if (newValue <= limitedCapacityInKg || isNaN(newValue)) {
                          setSelectedCheckList((prev: any) => ({
                            ...prev,
                            inputValue: inputValue,
                          }));

                          updateList((previous: any) => {
                            const updatedList = previous.map((item: any) =>
                              item.code === selectedCheckList.code
                                ? { ...item, inputValue: inputValue }
                                : item
                            );
                            return updatedList;
                          });
                        }
                      }
                    }}
                  />
                </div>
              </div>
            );
          })()}

        {popupOpen.type && popupOpen.msg && (
          <div
            className={`${
              popupOpen.msg.includes("successfully")
                ? "bg-green-200 text-black"
                : "bg-red-200 text-black"
            } py-2 px-4 text-black rounded-md text-center w-full mt-3`}
          >
            {popupOpen.msg}
          </div>
        )}

        <button
          onClick={() => {
            openClose(false);
          }}
          className="mt-5 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 duration-300 w-full"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default UploadPopUp;

const ImageUploadSlot = ({
  key,
  image,
  label,
  part,
  updateList, // update function to update the list of questions []
  selectedCheckList, // selected check list item {}
  setSelectedCheckList, // set function to set the selected check list item {}
  activeStage,
  selectedItem,
  setPopupOpen,
  setRemoveImagepopup,
  driverDts,
}: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const limitedCapacity = driverDts?.capacity?.capacity * 1.1 * 1000;

  const handleImageCapture = (capturedImage: any) => {
    updateList((previous: any) => {
      const updatedList = [...previous];
      updatedList.forEach((item: any) => {
        if (item.code === selectedCheckList.code) {
          item.images.map((image: any) => {
            if (image.imgType === label) {
              image.imageURL = capturedImage;
            }
          });
        }
      });
      return updatedList;
    });
    setSelectedCheckList((prev: any) => {
      const updateObject = { ...prev };
      updateObject.images.map((image: any) => {
        if (image.imgType === label) {
          image.imageURL = capturedImage;
        }
      });
      return updateObject;
    });
  };

  const handleRemoveClick = (e: any) => {
    e.stopPropagation(); // Prevents triggering the image click action
    setIsConfirmationOpen(true); // Open the confirmation popup
  };

  const handleConfirmRemove = () => {
    removeImage(selectedCheckList, label); // Confirm the image removal
    setIsConfirmationOpen(false); // Close the confirmation popup
  };

  const handleCancelRemove = () => {
    setIsConfirmationOpen(false); // Close the confirmation popup
  };

  const removeImage = async (selectedCheckList: any, label: string) => {
    const payloadRemove = {
      checkList_Id: selectedItem?._id,
      imgType: part?.imgType,
    };

    const config = {
      url: `https://prod-api.instavans.com/api/thor/v1/security/removeImage?checkList_Id=${selectedItem?._id}&imgType=${part?.imgType}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem(
          "accessToken"
        )} Shipper ${localStorage.getItem("default_unit")}`,
      },
    };

    try {
      const response: any = await axios(config);

      updateList((previous: any) => {
        const updatedList = [...previous];
        updatedList.forEach((item: any) => {
          if (item.code === selectedCheckList.code) {
            item.images.map((image: any) => {
              if (image.imgType === label) {
                image.imageURL = null;
              }
            });
          }
        });
        return updatedList;
      });
      setSelectedCheckList((prev: any) => {
        const updateObject = { ...prev };
        updateObject.images.map((image: any) => {
          if (image.imgType === label) {
            image.imageURL = null;
          }
        });
        return updateObject;
      });
    } catch (error) {
      if ((error as any).status == 500) {
        toast.error("Server error occurred. Please try again later.", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
        });
      }
      else if ((error as any).status   == 400) {
        toast.error("Invalid vehicle number - Please double-check the vehicle number — make sure there are no extra spaces or typos", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
        });
      }
      else if ((error as any).status   == 401) {
        toast.error("Authentication failed. Redirecting to login...", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
        });
        setTimeout(() => {
          signOut({ redirect: true, callbackUrl: "/" });
        }, 2000);
      }
      else if ((error as any).status   == 403) {
        toast.error("Access denied. You may not have permission for this vehicle", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
        });
      }
      else if ((error as any).status   == 404) {
        toast.error("Vehicle not found", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
        });
      }
      else {
        toast.error(`An Unexpected error occurred, (code: ${(error as any).status })`, {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
        });
      }
      console.log(error);
    }

    // updateList((previous: any) => {
    //   const updatedList = [...previous];
    //   updatedList.forEach((item: any) => {
    //     if (item.code === selectedCheckList.code) {
    //       item.images = item.images.filter(
    //         (image: any) => image.type !== label
    //       );
    //     }
    //   });
    //   return updatedList;
    // });
    // setSelectedCheckList((prev: any) => {
    //   const updateObject = { ...prev };
    //   updateObject.images = updateObject.images.filter(
    //     (image: any) => image.type !== label
    //   );
    //   return updateObject;
    // });
  };

  if (
    (selectedCheckList.code === "PUC_VALIDITY_CHECK" ||
      selectedCheckList.code === "FITNESS_CERT_CHECK") &&
    !selectedCheckList.date
  ) {
    updateList((previous: any) => {
      const updatedList = [...previous];
      updatedList.forEach((item: any) => {
        if (item.code === selectedCheckList.code) {
          item.date = new Date();
        }
      });
      return updatedList;
    });
    setSelectedCheckList((prev: any) => {
      const updateObject = { ...prev };
      updateObject.date = new Date();
      return updateObject;
    });
  }

  return (
    <>
      {selectedCheckList.code !== "DRIVER_LICENSE_CHECK" && (
        <div
          onClick={() => {
            !image && setIsModalOpen(true);
          }}
          key={key}
          className=" relative text-[12px]  border-[1px] w-[130px] h-[130px] flex items-center justify-center flex-col cursor-pointer"
        >
          {image ? (
            <div className="relative w-full h-full">
              <img
                src={image}
                alt={label}
                className="w-full h-full object-cover"
              />
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  // removeImage(selectedCheckList, label);
                  handleRemoveClick(e);
                }}
                className="absolute cursor-pointer h-7 w-7 top-[-10px] right-[-10px] bg-red-50 rounded-full z-[1] flex items-center justify-center shadow-lg"
              >
                <DeleteIcon sx={{ fontSize: "20px", color: "red" }} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <CameraAltOutlinedIcon />
              <p className=" text-center px-5">
                Add <span style={{ color: "#2962FF" }}>{label}</span> of the
                Vehicle
              {(selectedCheckList.code === "VEHICLE_BODY_CHECK" && label === "Floor Body") ||
              (selectedCheckList.code === "TARPAULIN_CHECK" && label === "back-right") ||
              (selectedCheckList.code === "FITNESS_CERT_CHECK" && label === "photo1") ||
              (selectedCheckList.code === "CARRYING_CAPACITY" && label === "photo01") ||
              (selectedCheckList.code === "ALCOHOL_SCREENING" && label === "photo1") ||
              (selectedCheckList.code === "BODY_REINSPECTION" && label === "Floor Body") ||
              (selectedCheckList.code === "TARPAULIN_POSITION_CHECK" && label === "back-right") ||
              (selectedCheckList.code === "LAYERWISE_LOADING" && label === "First Layer") ||
              (selectedCheckList.code === "TRUCK_SEAL_CHECK" && label === "photo01") ||
              (selectedCheckList.code === "UNLISTED_MATERIAL_CHECK" && label === "photo1") ? 
              <span className="text-red-500 text-lg absolute -top-0 left-2">*</span> : null}  
              </p>
            </div>
          )}
        </div>
      )}

      {(selectedCheckList.code === "PUC_VALIDITY_CHECK" ||
        selectedCheckList.code === "FITNESS_CERT_CHECK") && (
        <div className="content-center pb-2">
          <label className="text-[12px]">Select Date</label>
          {selectedCheckList.code === "PUC_VALIDITY_CHECK" || selectedCheckList.code === "FITNESS_CERT_CHECK" ? <span className="text-red-500 ml-1">*</span> : null}
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={enIN}>
            <MobileDateTimePicker
              className="w-full h-[48px] mt-[4px]"
              value={
                selectedCheckList.date === ""
                  ? new Date()
                  : new Date(selectedCheckList.date)
              }
              onChange={(newValue) => {
                console.log(newValue);
                updateList((previous: any) => {
                  const updatedList = [...previous];
                  updatedList.forEach((item: any) => {
                    if (item.code === selectedCheckList.code) {
                      item.date = newValue;
                    }
                  });
                  return updatedList;
                });
                setSelectedCheckList((prev: any) => {
                  const updateObject = { ...prev };
                  updateObject.date = newValue;
                  return updateObject;
                });
              }}
              minDate={new Date()}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
      )}

      {selectedCheckList.code === "CARRYING_CAPACITY" && (
        <div className="content-center">
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
          <label className="text-[12px]">Carrying Capacity</label>
          {selectedCheckList.code === "CARRYING_CAPACITY" ? <span className="text-red-500 ml-1">*</span> : null}
          <input
            type="number"
            step="0.001"
            className="w-full border-[1px] outline-none h-[48px] mt-[4px] px-2 rounded-sm"
            placeholder="Enter Carrying Capacity"
            value={
              selectedCheckList.inputValue > 0
                ? selectedCheckList.inputValue
                : ""
            }
            onChange={(e) => {
              const inputValue = e.target.value;
              const isValidDecimal = /^(\d+(\.\d{0,3})?)?$/.test(inputValue);
              if (isValidDecimal) {
                const newValue = parseFloat(inputValue);
                if (newValue <= limitedCapacity || isNaN(newValue)) {
                  setSelectedCheckList((prev: any) => ({
                    ...prev,
                    inputValue: inputValue,
                  }));
                  updateList((previous: any) => {
                    const updatedList = previous.map((item: any) =>
                      item.code === selectedCheckList.code
                        ? { ...item, inputValue: inputValue }
                        : item
                    );
                    return updatedList;
                  });
                }
              }
            }}
          />
        </div>
      )}

      {/* Confirmation Popup */}
      {isConfirmationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
            <h3 className="text-center text-lg">
              Are you sure you want to remove this image?
            </h3>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleConfirmRemove}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Yes, Remove
              </button>
              <button
                onClick={handleCancelRemove}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <CameraModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCapture={handleImageCapture}
          selectedItem={selectedItem}
          part={part}
          activeStage={activeStage}
          setPopupOpen={setPopupOpen}
        />
      )}
    </>
  );
};
