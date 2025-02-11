import React from "react";
import { Button } from "@mui/material";

export default function WeighBridge({activeStage, handleStepClick}:any) {
    return (
        <div className="w-full h-full relative">
            
           

        <div className="absolute bottom-0 bg-white rounded-[8px] w-full flex justify-between items-center p-1">
          <Button onClick={()=>{handleStepClick(activeStage.activestep - 1)}} disabled={activeStage.activestep === 0} className={` ${activeStage.activestep === 0 ? 'bg-gray-400' : 'bg-blue-600'} text-white text-sm px-8 py-2 rounded-md cursor-pointer hover:bg-blue-500 duration-300 font-semibold`}>Back</Button>
          <div className="flex gap-[5px] items-center">
              <Button className=" bg-blue-600 text-white text-sm px-8 py-2 rounded-md cursor-pointer hover:bg-blue-500 duration-300 font-semibold">Save</Button>
              <Button onClick={()=>{handleStepClick(activeStage.activestep + 1)}} className=" bg-blue-600 text-white text-sm px-8 py-2 rounded-md cursor-pointer hover:bg-blue-500 duration-300 font-semibold">Next</Button>
          </div>
        </div>
      </div>
    );
}