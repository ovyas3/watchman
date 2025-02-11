export const vehicleIDEValidation = (checkList: any) => {
  console.log(
    "🚀 ~ file: vehicleIDE.ts:3 ~ vehicleIDEValidation ~ checkList:",
    checkList
  );

  for (let item of checkList) {
    if (item?.code === "VEHICLE_BODY_CHECK") {
      // Fail if `allowed` is false
      // if (!item?.allowed) {
      //   return false;
      // }

      // If `allowed` is true, ensure at least one image has a valid `imageURL`
      if (
      //   // item?.allowed &&
        (!item?.images ||
          !item.images.some((image: any) => image.imgType === "Floor Body" && image.imageURL && typeof image.imageURL === 'string' && image.imageURL.trim() !== "")
        )
      ) {
        return false;
      }
    }

    if (item?.code === "TARPAULIN_CHECK") {
      // Fail if `allowed` is false
    //  if (!item?.allowed) {
    //     return false;
    //   }

      // If `allowed` is true, ensure at least one image has a valid `imageURL`
      if (
        // item?.allowed &&
        (!item?.images ||
          !item.images.some((image: any) => image.imgType === "back-right" && image.imageURL && typeof image.imageURL === 'string' && image.imageURL.trim() !== "")
        )
      ) {
        return false;
      }
    }

    if (item?.code === "PUC_VALIDITY_CHECK") {
      // Fail if `allowed` is false
    //  if (!item?.allowed) {
    //     return false;
    //   }

      // If `allowed` is true, ensure at least one image has a valid `imageURL`
      // if (
        // item?.allowed &&
      //   (!item?.images ||
      //     !item.images.some(
      //       (img: any) =>
      //         typeof img?.imageURL === "string" && img.imageURL.trim() !== ""
      //     ))
      // ) {
      //   return false;
      // }
    }

    if (item?.code === "FITNESS_CERT_CHECK") {
      // Fail if `allowed` is false
    //  if (!item?.allowed) {
    //     return false;
    //   }

      // If `allowed` is true, ensure at least one image has a valid `imageURL`
      if (
        // item?.allowed &&
        (!item?.images ||
          !item.images.some(
            (img: any) =>
              typeof img?.imageURL === "string" && img.imageURL.trim() !== ""
          ))
      ) {
        return false;
      }
    }

    if (item?.code === "CARRYING_CAPACITY") {
      if (
        // item?.allowed === true &&
        (!item?.inputValue || item?.inputValue <= 0)
      ) {
        return false;
      }
    }

    if (item?.code === "DRIVER_LICENSE_CHECK") {
      if (
        // item?.allowed === true &&
        (!item?.inputValue || item?.inputValue <= 0)
      ) {
        return false;
      }
    }

    if (item?.code === "ALCOHOL_SCREENING") {
      if (item?.allowed === true) {
        const hasValidImage = item?.images?.some(
          (image: any) => image?.imageURL && image?.imageURL.trim() !== ""
        );
        if (!hasValidImage) {
          return false;
        }
      }
    }
  }

  return true;
};
