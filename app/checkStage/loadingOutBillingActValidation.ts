export const loadingOutBillingActValidation = (checkList: any) => {
    for (let item of checkList) {

    if (item?.code === "LAYERWISE_LOADING") {
      // Fail if `allowed` is false
      // if (!item?.allowed) {
      //   return false;
      // }

      // If `allowed` is true, ensure at least one image has a valid `imageURL`
      if (
        // item?.allowed &&
        (!item?.images ||
          !item.images.some((image: any) => image.imgType === "First Layer" && image.imageURL && typeof image.imageURL === 'string' && image.imageURL.trim() !== "")
        )
      ) {
        return false;
      }
    }
    if (item?.code === "DOCUMENT_VERIFICATION") {
      // Check if all sub-questions are not allowed
      const allSubQuestionsNotAllowed = item?.subQuestions?.every(
        (subItem: any) => subItem?.allowed === false
      );
      
      if (allSubQuestionsNotAllowed) {
        return true;
      }
      
      const invalidSubQuestions = item?.subQuestions?.some(
        (subItem: any, index: number, array: any[]) => 
          (index === 0 || index === array.length - 1) && 
          subItem?.allowed === true && 
          (!subItem?.subQuestionInputValue || 
           subItem?.subQuestionInputValue?.trim() === '')
      );
      
      if (invalidSubQuestions) {
        return false;
      }
      
      return true;
    }
  }
 
  return true; 
};