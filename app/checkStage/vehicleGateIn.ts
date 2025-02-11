export const vehicleGateInValidation = (checkList: any) => {
    console.log(
      "🚀 ~ file: vehicleGateInValidation.ts ~ vehicleGateInValidation ~ checkList:",
      checkList
    );
  
    for (let item of checkList) {
      if (item?.code === "VEHICLE_GATE_ENTRY_TIMESTAMP") {
        // Check if the item is allowed and has a valid date
        if (!item?.allowed || !item?.date || new Date(item?.date).toString() === "Invalid Date") {
          return false;
        }
      }
    }
  
    return true;
  };