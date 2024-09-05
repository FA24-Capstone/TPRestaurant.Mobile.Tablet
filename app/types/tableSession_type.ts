// src/app/types/tableSession_type.ts
// ==================== CREATE ORDER SESSION ====================
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
  messages: any[];
  result: TableSessionData;
  data: any; // Adjust 'any' to the actual data type if known
}

export interface TableSessionData {
  tableSessionId: string;
  startTime: string;
  endTime: string | null;
  reservationId: string | null;
  reservation: any; // Specify a more specific type if known
  tableId: string;
  table: any; // Specify a more specific type if known
}

//========================ADD dishes in Tablesession =========================

export interface AddPrelistTableSessionRequest {
  tableSessionId: string;
  orderTime: string;
  prelistOrderDtos: PrelistOrderDto[];
}

export interface AddPrelistTableSessionReponse {
  result: [];
  isSuccess: boolean;
  messages: any[];
}

//========================GET Tablesession Order Fisrt=========================
export interface GetTableSessionResponse {
  result: OrderSessionHistory;
  isSuccess: boolean;
  messages: any[];
}

export interface OrderSessionHistory {
  tableSession: TableSession;
  uncheckedPrelistOrderDetails: UncheckedPrelistOrderDetail[];
  readPrelistOrderDetails: any[];
  readyToServePrelistOrderDetails: any[];
}

export interface TableSession {
  tableSessionId: string;
  startTime: string;
  endTime: any;
  reservationId: any;
  reservation: any;
  tableId: string;
  table: Table;
}

export interface Table {
  tableId: string;
  tableName: string;
  tableSizeId: number;
  tableSize: any;
  isDeleted: boolean;
  tableRatingId: string;
  tableRating: TableRating;
}

export interface TableRating {
  tableRatingId: string;
  name: string;
}

export interface UncheckedPrelistOrderDetail {
  prelistOrder: PrelistOrder;
  comboOrderDetails: ComboOrderDetail[];
}

export interface PrelistOrder {
  prelistOrderId: string;
  quantity: number;
  orderTime: string;
  readyToServeTime: any;
  note: any;
  statusId: number;
  orderStatus: any;
  reservationDishId: any;
  reservationDish: any;
  dishSizeDetailId?: string;
  dishSizeDetail?: DishSizeDetail;
  comboId?: string;
  combo?: Combo;
  tableSessionId: string;
  tableSession: TableSession2;
}

export interface DishSizeDetail {
  dishSizeDetailId: string;
  isAvailable: boolean;
  price: number;
  discount: number;
  dishId: string;
  dish: Dish;
  dishSizeId: number;
  dishSize: DishSize;
}

export interface Dish {
  dishId: string;
  name: string;
  description: string;
  image: string;
  dishItemTypeId: number;
  dishItemType: DishItemType;
  isAvailable: boolean;
}

export interface DishItemType {
  id: number;
  name: string;
  vietnameseName: string;
}

export interface DishSize {
  id: number;
  name: string;
  vietnameseName: string;
}

export interface Combo {
  comboId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  discount: number;
  categoryId: number;
  category: any;
  startDate: string;
  endDate: string;
}

export interface TableSession2 {
  tableSessionId: string;
  startTime: string;
  endTime: any;
  reservationId: any;
  reservation: any;
  tableId: string;
  table: Table2;
}

export interface Table2 {
  tableId: string;
  tableName: string;
  tableSizeId: number;
  tableSize: any;
  isDeleted: boolean;
  tableRatingId: string;
  tableRating: any;
}

export interface ComboOrderDetail {
  comboOrderDetailId: string;
  dishComboId: string;
  dishCombo: DishCombo;
  reservationDishId: any;
  reservationDish: any;
  orderDetailId: any;
  orderDetail: any;
  prelistOrderId: string;
  prelistOrder: any;
}

export interface DishCombo {
  dishComboId: string;
  quantity: number;
  dishSizeDetailId: string;
  dishSizeDetail: DishSizeDetail2;
  comboOptionSetId: string;
  comboOptionSet: any;
}

export interface DishSizeDetail2 {
  dishSizeDetailId: string;
  isAvailable: boolean;
  price: number;
  discount: number;
  dishId: string;
  dish: Dish2;
  dishSizeId: number;
  dishSize: DishSize2;
}

export interface Dish2 {
  dishId: string;
  name: string;
  description: string;
  image: string;
  dishItemTypeId: number;
  dishItemType: DishItemType2;
  isAvailable: boolean;
}

export interface DishItemType2 {
  id: number;
  name: string;
  vietnameseName: string;
}

export interface DishSize2 {
  id: number;
  name: string;
  vietnameseName: string;
}
