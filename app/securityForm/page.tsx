"use client";
import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useSession } from "next-auth/react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
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
 import { toast } from "react-toastify";



function SecurityForm({ searchParams }: any) {

  const { showSnackBar, SnackBarComponent } = useSnackBar();
  const { data: session } = useSession();
  const [allStages, setAllStages] = useState<any>(null);
  const [driverDts, setDriverDts] = useState<any>(null);
  const [activeStage, setActiveStage] = useState<any | null>({activeStage:null, activestep: null});
  const initialStageLoaded = useRef(false);
  const [showLoadingInfoDialog, setShowLoadingInfoDialog] = useState(false);
  const [loadingBay, setLoadingBay] = useState("");
  const [loadingExecutiveName, setLoadingExecutiveName] = useState("");
  const [pendingNextStageDetails, setPendingNextStageDetails] = useState<{ stageId: string | null, stepIndex: number | null }>({ stageId: null, stepIndex: null });
  const VGI_STAGE_CODE = "VGI"; 
  const handleStepClick = (targetStepIndex: number) => {
    const currentStageCode = activeStage?.activeStage?.stageCode;
    const currentStepOrder = activeStage?.activestep;
    if (allStages[targetStepIndex]?._id) {
      getSingleStage(allStages[targetStepIndex]._id);
    }
    if (currentStageCode === VGI_STAGE_CODE && targetStepIndex > currentStepOrder && !driverDts?.loadingBay) {
      setPendingNextStageDetails({ stageId: allStages[targetStepIndex]?._id, stepIndex: targetStepIndex });
      setShowLoadingInfoDialog(true);
    }
  };

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
      const shipmentDtsFromServer = response.data.data.shipmentDts;
      const stageDataFromServer = response.data.data.stageData;
      const libaStage = stageDataFromServer.find((stage: any) => stage.stageCode === "LIBA");
      if (libaStage && libaStage.loadingBay && libaStage.loadingExecutiveName) {
        shipmentDtsFromServer.loadingBay = libaStage.loadingBay;
        shipmentDtsFromServer.loadingExecutiveName = libaStage.loadingExecutiveName;
      }
      setAllStages(stageDataFromServer);
      setDriverDts(shipmentDtsFromServer);
    } catch (error) {
      console.log(error);
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
  };

  const handleLoadingInfoSubmit = async () => {
    if (!loadingBay.trim() || !loadingExecutiveName.trim()) {
      toast.error("Please fill in both Loading Bay and Loading Executive Name.", { hideProgressBar: true, autoClose: 2000 });
      return;
    }
    const updatedDriverDts = {
      ...(driverDts || {}),
      loadingBay: loadingBay,
      loadingExecutiveName: loadingExecutiveName,
    };
    setDriverDts(updatedDriverDts);
    try {
      await axios.post('https://prod-api.instavans.com/api/thor/v1/security/save_loading_details', {
        securityCheck_id: driverDts?._id,
        loadingBay,
        loadingExecutiveName
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("accessToken")} Shipper ${localStorage.getItem("default_unit")}`,
        }
      });
      toast.success("Loading details saved successfully!", { hideProgressBar: true, autoClose: 2000 });
      setShowLoadingInfoDialog(false);
      setLoadingBay("");
      setLoadingExecutiveName("");
      if (pendingNextStageDetails.stageId) {
        getSingleStage(pendingNextStageDetails.stageId);
        setPendingNextStageDetails({ stageId: null, stepIndex: null });
      }
    } catch (error: any) {
      console.error("Error saving loading details:", error);
      const status = error.response?.status || error.status;
      toast.error(`Failed to save loading details (status: ${status}). Please try again.`, { hideProgressBar: true, autoClose: 3000 });
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
        const newLoadingBay = response.data.data.loadingBay;
        const newLoadingExecutiveName = response.data.data.loadingExecutiveName;
        if (newLoadingBay && newLoadingExecutiveName) {
          setDriverDts((prevDriverDts: any) => {
            if (prevDriverDts?.loadingBay !== newLoadingBay || prevDriverDts?.loadingExecutiveName !== newLoadingExecutiveName) {
              return { ...prevDriverDts, loadingBay: newLoadingBay, loadingExecutiveName: newLoadingExecutiveName };
            }
            return prevDriverDts;
          });
        }
      }
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
  }

  useEffect(() => {
    getAllStages();
  }, []);

  useEffect(() => {
    if (driverDts && driverDts.lastStage && !initialStageLoaded.current) {
      const lastStageId = driverDts.lastStage;
      const lastStageDetails = allStages?.find((stage: any) => stage._id === lastStageId);
      const vgiStageOrder = allStages?.find((s:any) => s.stageCode === VGI_STAGE_CODE)?.order;
      getSingleStage(lastStageId);
      if (lastStageDetails && vgiStageOrder !== undefined && lastStageDetails.order > vgiStageOrder && !driverDts.loadingBay && !driverDts.loadingExecutiveName) {
        setPendingNextStageDetails({ stageId: lastStageId, stepIndex: lastStageDetails.order });
        setShowLoadingInfoDialog(true);
      }
      //}
      initialStageLoaded.current = true;
    }
  }, [driverDts, allStages]);

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
            {activeStage?.activeStage?.stageCode === "LIBA" && (<LoadingInBillingAct activeStage={activeStage} handleStepClick={handleStepClick} driverDts={driverDts} setDriverDts={setDriverDts} />)}
            {activeStage?.activeStage?.stageCode === "LOBA" && (<LoadingOutBillingAct activeStage={activeStage} handleStepClick={handleStepClick} searchParams={searchParams} driverDts={driverDts} />)}
            {activeStage?.activeStage?.stageCode === "VGOA" && (<VehicleGateOut activeStage={activeStage} handleStepClick={handleStepClick} driverDts={driverDts} />)}
          </div>
        </div>
        <Dialog
          open={showLoadingInfoDialog}
          disableEscapeKeyDown={true}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: 6,
              p: 2,
              bgcolor: "#f9fafb",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              fontSize: "18px",
              color: "#1f2937",
              borderBottom: "1px solid #e5e7eb",
              pb: 1,
            }}
          >
            Enter Loading Details
          </DialogTitle>
          <DialogContent sx={{ pt: 10 }}>
            <TextField
              autoFocus
              margin="dense"
              id="loadingBay"
              label="Loading Bay"
              type="text"
              fullWidth
              variant="outlined"
              value={loadingBay}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z1-9\s]*$/.test(value) || value === "") {
                  setLoadingBay(value);
                }
              }}
              sx={{
                mb: 2,
                "& .MuiInputBase-root": { borderRadius: 2 },
              }}
            />
            <TextField
              margin="dense"
              id="loadingExecutiveName"
              label="Loading Executive Name"
              type="text"
              fullWidth
              variant="outlined"
              value={loadingExecutiveName}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z\s]*$/.test(value) || value === "") {
                  setLoadingExecutiveName(value);
                }
              }}
              sx={{
                "& .MuiInputBase-root": { borderRadius: 2 },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <button
              onClick={handleLoadingInfoSubmit}
              className="bg-blue-600 text-white text-sm px-6 py-2 rounded-md hover:bg-blue-500 duration-200 font-medium shadow-sm"
            >
              Submit
            </button>
          </DialogActions>
        </Dialog>
      </div>
      {SnackBarComponent}
    </>
  );
}

export default SecurityForm;
