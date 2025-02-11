export const loadingInBillingActValidation = (checkList: any) => {
  console.log(
    "🚀 ~ file: loadingInBillingActValidation.ts ~ loadingInBillingActValidation ~ checkList:",
    checkList
  );

  for (let item of checkList) {
    if (
      item?.code === "BODY_REINSPECTION" 
    ) {
     // Fail if `allowed` is false
    //  if (!item?.allowed) {
    //     return false;
    //   }

      // If `allowed` is true, ensure at least one image has a valid `imageURL`
      if (
        // item?.allowed &&
        (!item?.images ||
          !item.images.some((image: any) => image.imgType === "Floor Body" && image.imageURL && typeof image.imageURL === 'string' && image.imageURL.trim() !== "")
        )
      ) {
        return false;
      }
    } else if (item?.code === "TARPAULIN_POSITION_CHECK") {
      if (
        (!item?.images ||
          !item.images.some((image: any) => image.imgType === "back-right" && image.imageURL && typeof image.imageURL === 'string' && image.imageURL.trim() !== "")
        )
      ) {
        return false;
      }
    } else if (item?.code === "WEIGHT_CROSSCHECK") {
      // Pass only when `allowed` is true and `inputValue` exists and is greater than 0
      if (item?.inputValue <= 0 || item?.inputValue == null) {
        return false;
      }
    }
  }

  return true;
};
