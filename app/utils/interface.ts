export interface ChecklistItem {
    submitted?: any;
    subInputs?: any;
    subDropdowns?: any;
    previousDate?: any;
    previousInputValue?: string;
    option1?: string;
    option2?: string;
    date?: any;
    validate?: any;
    point: string;
    dropdown?: string;
    images?: { [key: string]: string };
    image?: string;
    inputValue?: string;
    checked?: boolean;
    isAutomatic?: boolean;
    subItems?: [
      {point: string; dropdown?: string ; inputValue?:string;},
      {point: string; dropdown?: string ; inputValue?:string;},
      {point: string; dropdown?: string ; inputValue?:string;},
      {point: string; dropdown?: string ; inputValue?:string;}
    ] | [];
    dropdownDisabled?: boolean;
    yesNo?: string | null;
  }

export interface RejectedVehicleInfo {
  vehicleNo: string;
  saleOrder: string;
  SIN: string;
  transporterName: string,
  photoEvidence: (string | undefined)[];
}

export interface ImageUploadSlotProps {
  image: string;
  onCapture: () => void;
  onRemove: () => void;
  label: string;
  checklistIndex: number;
  index: number;
  part?: string;
}