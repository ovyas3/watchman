"use client";
import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useSession } from "next-auth/react";
import VehicleDts from "../components/vehicleDTS";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { signOut } from 'next-auth/react';
import VehicleIdentityReport from "../stages/VehicleIdentityReport";
import ParkingStage from "../stages/ParkingStage";
import VechicleGateIn from "../stages/VechicleGateIn";
import WeighBridge from "../stages/WeighBridge";
import LoadingInBillingAct from "../stages/LoadingInBillingAct";
import LoadingOutBillingAct from "../stages/LoadingOutBillingAct";
import VehicleGateOut from "../stages/VehicleGateOut";
 import { useSnackBar } from "../hooks/useSnackbar";



function SecurityForm({ searchParams }: any) {

  const { showSnackBar, SnackBarComponent } = useSnackBar();
  const { data: session } = useSession();
  const [allStages, setAllStages] = useState<any>(null);
  const [driverDts, setDriverDts] = useState<any>(null);
  const [activeStage, setActiveStage] = useState<any | null>({activeStage:null, activestep: null});
  const handleStepClick = (stepIndex: number) => {getSingleStage(allStages[stepIndex]._id);};

  const getAllStages = async () => {
    try {
      const config = {
        url: `https://prod-api.instavans.com/api/thor/v1/security/get_security_stages?vehicle_no=${searchParams.vehicleNo}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem(
            "accessToken"
          )} Shipper ${localStorage.getItem("default_unit")}`,
        },
      };
      const response = await axios(config);
      setAllStages(response.data.data.stageData);
      setDriverDts(response.data.data.shipmentDts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(
        "https://prod-api.instavans.com/api/thor/shipper_user/sign_out?from=web",
        {
          method: "PUT",
          headers: {
            Authorization: `bearer ${session?.user.data.accessToken} Shipper ${session?.user.data.default_unit}`,
            "Content-Type": "application/json",
          },
        }
      );
      await signOut({ redirect: true, callbackUrl: "/" });
      window.localStorage.removeItem("nextauth.session-token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("default_unit");
    } catch (error) {
      console.log(error);
    }
  };

  const getSingleStage = async (_id: any) => {
    try {
      const config = {
        url: `https://prod-api.instavans.com/api/thor/v1/security/get_individual_stages?stageID=${_id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem(
            "accessToken"
          )} Shipper ${localStorage.getItem("default_unit")}`,
        },
      }
      const response = await axios(config);
      if(response.status === 200){
        setActiveStage({activestep: response.data.data.order, activeStage: response.data.data});
      }
    } catch (error) {
      showSnackBar({ 
        message: 'Failed to fetch data', 
        severity: 'error',
        autoHideDuration: 3000 
      });
      console.log(error);
    }
  }

  useEffect(() => {
    getAllStages();
  }, []);

  useEffect(() => {
    if (driverDts) {
      const id = driverDts?.lastStage;
      getSingleStage(id);
    }
  }, [driverDts]);

  // console.log("🚀 ~ file: page.tsx:87 ~ SecurityForm ~ activeStage:", activeStage);

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col w-full h-screen bg-[#F0F3F9] p-5">
        <div className="flex justify-between flex-row-reverse mb-1">
          <div
            className="logout text-[#fafafa] text-[12px] w-[84px] h-[36px] flex items-center justify-center bg-[#E24D65] rounded cursor-pointer hover:bg-[#E45E74] transition duration-150 ease-out hover:ease-in"
             onClick={handleLogout}
          >
            LogOut
          </div>
        </div>

        <Stepper
          activeStep={activeStage.activestep ?? -1}
          alternativeLabel
          className="stepper-container"
        >
          {allStages?.map((label: any, index: number) => {
            const stepProps: { completed?: boolean } = {
              completed: index < (activeStage.activestep ?? -1),
            };
            const labelProps: { optional?: React.ReactNode } = {};

            return (
              <Step
                key={index}
                {...stepProps}
                className={`step ${
                  index <= (activeStage.activestep ?? -1) ? "completed" : ""
                }`}
                // onClick={() => handleStepClick(index)}
              >
                <StepLabel
                  {...labelProps}
                  className={`step-label ${
                    index === activeStage.activestep ? "active" : ""
                  }`}
                >
                  <p className="step-text">{label.name}</p>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>

        <div className="flex flex-col sm:flex-row w-full h-full mt-3">
          <VehicleDts driverDts={driverDts} activeStage={activeStage} setActiveStage={setActiveStage} />
          <div className="  w-full sm:ml-4 mt-4 sm:mt-0 mb-4">
            {activeStage?.activeStage?.stageCode === "VIR" && (<VehicleIdentityReport activeStage={activeStage} handleStepClick={handleStepClick} driverDts={driverDts}/>)}
            {activeStage?.activeStage?.stageCode === "PS" && (<ParkingStage activeStage={activeStage} handleStepClick={handleStepClick} driverDts={driverDts} />)}
            {activeStage?.activeStage?.stageCode === "VGI" && (<VechicleGateIn activeStage={activeStage} handleStepClick={handleStepClick} driverDts={driverDts} />)}
            {activeStage?.activeStage?.stageCode === "WBS" && (<WeighBridge activeStage={activeStage} handleStepClick={handleStepClick} driverDts={driverDts} />)}
            {activeStage?.activeStage?.stageCode === "LIBA" && (<LoadingInBillingAct activeStage={activeStage} handleStepClick={handleStepClick} driverDts={driverDts} />)}
            {activeStage?.activeStage?.stageCode === "LOBA" && (<LoadingOutBillingAct activeStage={activeStage} handleStepClick={handleStepClick} searchParams={searchParams} driverDts={driverDts} />)}
            {activeStage?.activeStage?.stageCode === "VGOA" && (<VehicleGateOut activeStage={activeStage} handleStepClick={handleStepClick} driverDts={driverDts} />)}
          </div>
        </div>
      </div>
      {SnackBarComponent}
    </>
  );
}

export default SecurityForm;
