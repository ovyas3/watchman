export const vehicleGateOutValidation = (checkList: any) => {
  for (let item of checkList) {
    if (item?.code === "TRUCK_SEAL_CHECK") {
      // Pass only when `allowed` is true
      if (!item?.allowed) return false;
      // if (item?.allowed && (!item?.inputValue || item.inputValue.trim() === ""))
      //   return false;
      if (
        item?.allowed &&
        !item?.images?.some((image: any) => image.imageURL)
      )
        return false;
    } else if (item?.code === "COMMERCIAL_INVOICE_NUMBERS") {
      // Pass only when it has `inputValue`
      if (!item?.inputValue || item.inputValue.trim() === "") {
        return false;
      }
    } else if (item?.code === "EWAY_BILL_INVOICE_VALIDITY") {
      // Pass only when `allowed` is true
      // if (!item?.allowed) {
      //   return false;
      // }
    } else if (item?.code === "UNLISTED_MATERIAL_CHECK") {
      // When `allowed` is true, `images` must contain an `imageURL`.
      // When `allowed` is false, it can pass without the `images` check.
      if (
        item?.allowed &&
        !item?.images?.some((image: any) => image.imageURL)
      ) {
        return false;
      }
    }
  }

  return true; // All validations passed
};
