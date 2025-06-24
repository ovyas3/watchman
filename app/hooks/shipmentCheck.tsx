import { Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, Button } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import { DateTime } from 'luxon';
import { toast } from "react-toastify";
import { signOut } from "next-auth/react";

const shipmentCheck = ({
    driverDts,
    activeStage,
    currentStageCode,
    openClose,
    onSkip,
    onContinue
}: {
    driverDts: any;
    activeStage: any;
    currentStageCode: String;
    openClose: (open: boolean) => void;
    onSkip?: (lastShipment: any) => void;
    onContinue?: () => void;
}) => {


    const [lastShipment, setLastShipment] = useState<any>(null);
    const [previousChecklist, setPreviousChecklist] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [daysDifference, setDaysDifference] = useState<number | null>(null);
    const [daysAgo, setDaysAgo] = useState<string>('');

    const formatDaysAgo = (days: number | null): string => {
        if (days === null) return '';
        if (days < 1) return 'today';
        if (days === 1) return 'yesterday';
        return `${days} days ago`;
    };

    const calculateDaysDifference = (completedDate: string | Date): number => {
        const currentDate = new Date();
        const completed = new Date(completedDate);
        const currentDateStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const completedDateStart = new Date(completed.getFullYear(), completed.getMonth(), completed.getDate());
        const timeDiff = currentDateStart.getTime() - completedDateStart.getTime();
        return Math.floor(timeDiff / (1000 * 3600 * 24));
    };

    const checkShipment = async () => {
        try {
            const shipmentData = driverDts;

            if (shipmentData && shipmentData.vehicleNo) {
                const stageResponse = await axios.get(`https://prod-api.instavans.com/api/thor/v1/security/get_prevDts?vehicle_no=${shipmentData.vehicleNo}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `bearer ${localStorage.getItem("accessToken")} Shipper ${localStorage.getItem("default_unit")}`,
                    }
                });

                const prevShipmentData = {
                    ...stageResponse.data.data,
                    checklistResponse: stageResponse.data.data.checklistResponse
                };

                if (!prevShipmentData || !prevShipmentData.shipmentDts) {
                    // onContinue?.();
                    return;
                }

                const currentStage = prevShipmentData.stageData.find((stage: any) => stage.stageCode === currentStageCode);

                const stageChecklist = currentStage?.checklist || [];

                let showDialog = false;
                let daysDiff = null;
                let istTime = '';

                switch (currentStageCode) {
                    case 'VIR':
                        if (prevShipmentData.shipmentDts.finished_at) {
                            istTime = convertUTCToIST(prevShipmentData.shipmentDts.finished_at);
                            daysDiff = calculateDaysDifference(prevShipmentData.shipmentDts.finished_at);
                            showDialog = daysDiff <= 3;
                        } else {
                            showDialog = false;
                        }
                        break;
                    case 'VGI': 
                        if (currentStage && currentStage.completed_at) {
                            istTime = convertUTCToIST(currentStage.completed_at);
                            daysDiff = calculateDaysDifference(currentStage.completed_at);
                            showDialog = daysDiff <= 3;
                        } else {
                            showDialog = false;
                        }
                        break;
                    case 'LIBA':
                        if (currentStage && currentStage.completed_at) {
                            istTime = convertUTCToIST(currentStage.completed_at);
                            daysDiff = calculateDaysDifference(currentStage.completed_at);
                            showDialog = daysDiff <= 3;
                        } else {
                            showDialog = false;
                        }
                        break;
                    default:
                        showDialog = false;
                }

                if (showDialog && daysDiff !== null && daysDiff <= 3) {
                    setPreviousChecklist(stageChecklist);
                    setLastShipment({
                        ...prevShipmentData.shipmentDts,
                        prevShipmentData 
                    });
                    setIsDialogOpen(true);
                    setDaysDifference(daysDiff);
                    setDaysAgo(istTime);
                    openClose(true);
                } 
            } 
        } catch (error) {
            console.error('Error checking shipment:', error);
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
            // toast.error("Server error occurred. Please try again later.", {
            //     hideProgressBar: true,
            //     autoClose: 2000,
            //     type: "error",
            //   });
            setIsDialogOpen(false);
            openClose(false);
        }
    };
    const replaceChecklists = async (currentStage: any, prevShipmentData: any) => {
       
        try {
            const stageResponse = await axios.get(`https://prod-api.instavans.com/api/thor/v1/security/get_individual_stages?stageID=${currentStage._id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${localStorage.getItem("accessToken")} Shipper ${localStorage.getItem("default_unit")}`
                }
            });
    
            const fullStageData = stageResponse.data.data;
            const combinedChecklists = Array.from(new Set([
                ...fullStageData.checklist.map((item: any) => item._id),
                ...(prevShipmentData?.currentStage?.checklist || [])
            ]));

            const payload = {
                lists: fullStageData.checklist.map((originalChecklist: any) => ({
                    _id: originalChecklist._id,
                    allowed: originalChecklist.allowed ?? false,
                    date: originalChecklist.date || null,
                    inputValue: originalChecklist.inputValue || null,
                    code: originalChecklist.code || null,
                    images: originalChecklist.images?.map((img: any) => ({
                        prompt: img.prompt || '',
                        imgType: img.imgType || '',
                        imageURL: img.imageURL || '',
                        comment: img.comment || ''
                    })) || [],
                    subQuestions: originalChecklist.subQuestions?.map((sq: any) => ({
                        point: sq.point,
                        allowed: sq.allowed ?? false
                    })) || []
                })),
                completed: true,
                stageData: {
                    securityCheck_id: driverDts?._id,
                    stage_id: activeStage?.activeStage?._id,
                    start_at: new Date()
                },
                add: true
            };
        
            try {
                const response = await axios.post(
                    'https://prod-api.instavans.com/api/thor/v1/security/save_stage_individual', 
                    payload, 
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `bearer ${localStorage.getItem("accessToken")} Shipper ${localStorage.getItem("default_unit")}`
                        }
                    }
                );
                
                return combinedChecklists;
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
                throw error;
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
            return null;
        }
    };
    
    const handleSkip = async () => {
        try {
            const prevShipmentResponse = await axios.get(`https://prod-api.instavans.com/api/thor/v1/security/get_prevDts?vehicle_no=${driverDts.vehicleNo}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${localStorage.getItem("accessToken")} Shipper ${localStorage.getItem("default_unit")}`,
                }
            });
    
            const shipmentData = prevShipmentResponse.data.data;
            
            const prevStage = shipmentData.stageData.find((stage: any) => stage.stageCode === currentStageCode);

    
            if (!prevStage) {
                console.error(`No stage found for stage code: ${currentStageCode}`);
                setIsDialogOpen(false);
                openClose(false);
                return;
            }
    
            const currentStageResponse = await axios.get(`https://prod-api.instavans.com/api/thor/v1/security/get_individual_stages?stageID=${prevStage._id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${localStorage.getItem("accessToken")} Shipper ${localStorage.getItem("default_unit")}`,
                }
            });
    
            const currentStageData = currentStageResponse.data.data;

            const updatedChecklists = await replaceChecklists(prevStage, {
                shipmentDetails: shipmentData.shipmentDts,
                prevStage: prevStage
            });
    
            setIsDialogOpen(false);
            openClose(false);
            onSkip?.({
                shipmentDetails: shipmentData.shipmentDts,
                checklist: updatedChecklists || prevStage.checklist,
                apiResponse: updatedChecklists ? 'Checklists updated successfully' : 'Failed to update checklists'
            });
        } catch (error) {
            console.error('Error in handleSkip:', error);
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
            setIsDialogOpen(false);
            openClose(false);
        }
    };

    const handleCancel = () => {
        setIsDialogOpen(false);
        openClose(false);
    }

    const convertUTCToIST = (utcDateString: any) => {
        const date = DateTime.fromISO(utcDateString, { zone: 'utc' }).plus({ hours: 5, minutes: 30 });
        if (!date.isValid) {
          return 'Invalid date';
        }
        return date.toFormat('dd-MMM-yyyy hh:mm a');
    };
      

    const ShipmentCheckDialog = isDialogOpen ? (
        <Dialog
            open={true}
            onClose={handleCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Previous Shipment Detected
            </DialogTitle>
            <DialogContent>
                <DialogContentText style={{ marginBottom: '10px' }} id="shipment-check" sx={{
                    '& .days-highlight': {
                        fontWeight: 'bold',
                        ...(daysDifference !== null && (
                            daysDifference < 1 ? { color: 'green' } :
                            daysDifference === 1 ? { color: 'orange' } :
                            daysDifference <= 3 ? { color: 'red' } :
                            { color: 'gray' }
                        ))
                    }
                }}> 
                    A vehicle shipment was recorded <span className="days-highlight">{daysAgo}</span>. Do you want to proceed with this shipment ?
                </DialogContentText>
                {lastShipment?.prevShipmentData?.checklistResponse
                ?.filter((checklist: any) => {
                    const currentStage = lastShipment?.prevShipmentData?.stageData?.find(
                        (stage: any) => stage.stageCode === currentStageCode
                    );
                    return (
                        currentStage && 
                        currentStage.checklist.includes(checklist._id) && 
                        checklist.images && 
                        checklist.images.length > 0 &&
                        checklist.images.some((image: any) => image.imageURL)
                    );
                })
                .sort((a: any, b: any) => {
                    const currentStage = lastShipment?.prevShipmentData?.stageData?.find(
                        (stage: any) => stage.stageCode === currentStageCode
                    );
                    const indexA = currentStage?.checklist.indexOf(a._id);
                    const indexB = currentStage?.checklist.indexOf(b._id);
                    return indexA - indexB;
                })
                .map((checklist: any, index: number) => (
                    <div key={index} style={{ marginBottom: '20px' }}>
                        <strong>{checklist.point}</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                            {checklist.images.filter((image: any) => image.imageURL).map((image: any, imgIndex: number) => (
                                <div key={imgIndex} style={{ textAlign: 'center', width: '200px' }}>
                                    <img 
                                        src={image.imageURL} 
                                        alt={`${image.imgType} image`} 
                                        style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
                                    />
                                    {image.imgType && (
                                        <p style={{ fontSize: '0.8em', marginTop: '5px' }}>
                                            <strong>Image Type:</strong> {image.imgType}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <DialogActions>
                    <button onClick={handleCancel} 
                        style={{border: '1px solid #1976d2', marginRight: "10px", height: "36px"}} className="hover:bg-blue-600 hover:text-white text-sm px-8 py-2 rounded-md cursor-pointer duration-300 font-semibold"
                    >
                        No
                    </button>
                    <button 
                        onClick={handleSkip}
                        className={"bg-blue-500 hover:bg-blue-600  text-white text-sm px-8 py-2 rounded-md cursor-pointer duration-300 font-semibold"}
                     >
                        Yes
                    </button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    ) : null;
    
    return {
       checkShipment,
       ShipmentCheckDialog,
    }
}

export default shipmentCheck
