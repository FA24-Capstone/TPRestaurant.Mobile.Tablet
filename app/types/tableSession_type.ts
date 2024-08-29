// src/app/types/tableSession_type.ts

// Interface for Combo within PrelistOrderDtos
export interface ComboDto {
  comboId: string;
  dishComboIds: string[];
}

// Interface for PrelistOrderDtos
export interface PrelistOrderDto {
  quantity: number;
  reservationDishId?: string;
  dishSizeDetailId?: string;
  combo?: ComboDto;
}

// Interface for the request body
export interface AddTableSessionRequest {
  tableId: string;
  startTime: string;
  reservationId?: string;
  prelistOrderDtos: PrelistOrderDto[];
}

// Interface for the response from the API
export interface AddTableSessionResponse {
  // Define the response properties based on the actual API response
  isSuccess: boolean;
  message: string;
  result: string;
  data: any; // Adjust 'any' to the actual data type if known
}
