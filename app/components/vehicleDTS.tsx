import React from "react";
import VehicleGateIn from "../components/vehicleGateIn";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import TextField from "@mui/material/TextField";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import Image from "next/image";
import closeIcon from "../../assets/popup_close_icon.svg";
import { enIN } from "date-fns/locale";

function VehicleDts({
  driverDts,
  activeStage,
  handleVehicleReportFileChange,
  handleVehicleReportDeleteFile,
  vehicleReportingFiles,
  setVehicleReportingFiles,
  vehicleNo,
  shipment,
  trackingMethod,
  lastLocation,
  lastLocationAt,
  reportingDate,
  setReportingDate,
  setActiveStage
}: any) {
  return (
    <div className="w-full sm:w-[30%] flex flex-col gap-[16px] sm:max-w-60">
      <VehicleGateIn
        vehicleNo={driverDts?.vehicleNo}
        driver={driverDts?.driver}
        mobile={driverDts?.mobile}
        trackingMethod={driverDts?.trackingMethod}
        lastLocation={driverDts?.lastLocation}
        lastLocationAt={driverDts?.lastLocationAt}
        SIN={driverDts?.sinNo || "N/A"}
      />
      {(activeStage?.activeStage?.stageCode === "VIR") && (
          <div className="gateInDetails bg-[#fcfcfc] p-[20px]  rounded-[12px]">
            <div className="body">
              <div className="detailsSection">
                <div className="label">Vehicle reporting date</div>
                <div className="value">
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={enIN}>
                    <MobileDateTimePicker
                      className="w-full h-[50px] mt-[6px]"
                      value={activeStage.activeStage?.start_at ? new Date(activeStage.activeStage?.start_at) : null}
                      onChange={(newValue) => {
                        setActiveStage((prev:any)=>{
                          const newActiveStage = {...prev};
                          newActiveStage.activeStage.start_at = newValue;
                          return newActiveStage;
                        })
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              padding: "0px !important", // Removes padding
                              fontSize: "14px", // Adjust the font size
                              border: "1px solid #E2E2E2",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none", // Removes the outline
                            },
                            "& .MuiInputBase-root": {
                              padding: 0, // Removes padding from the input field
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* <div className="vehicleImages bg-[#fcfcfc] p-[20px] rounded-[12px]">
              <div className="body flex flex-col gap-[16px]">
                <div className="header">
                  <p className="text-[#131722] text-[18px] font-bold">
                    Vehicle and other images
                  </p>
                </div>
                <div className="uploadSection flex gap-[16px]">
                  <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative">
                    <CameraAltOutlinedIcon className="text-[#1A1A1A]" />
                    <p className="text-[#1A1A1A] text-[10px]">Camera</p>
                  </div>
                  <div className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative">
                    <input
                      type="file"
                      multiple
                      className="opacity-0 absolute w-full h-full z-2"
                      onChange={handleVehicleReportFileChange}
                    />
                    <CollectionsOutlinedIcon className="text-[#1A1A1A]" />
                    <p className="text-[#1A1A1A] text-[10px]">Gallery</p>
                  </div>
                </div>
                <div className="uploadSection flex gap-[16px]">
                  {vehicleReportingFiles?.map((file:any, index:any) => (
                    <div
                      key={index}
                      className="item h-[64px] w-[64px] bg-[#F0F3F9] rounded-[6px] flex items-center justify-center flex-col cursor-pointer relative"
                    >
                      <Image
                        src={closeIcon}
                        alt=""
                        width={24}
                        height={24}
                        className="absolute top-[-10px] right-[-9px] text-[#131722] "
                        onClick={() => handleVehicleReportDeleteFile(index)}
                      />
                      <img key={file.name} src={file.preview} alt={file.name} />
                    </div>
                  ))}
                </div>
              </div>
            </div> */}
    </div>
  );
}

export default VehicleDts;
