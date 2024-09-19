export interface OrderRequest {
  customerId?: string;
  orderType: number;
  note: string;
  orderDetailsDtos: OrderDetailsDto[];
  reservationOrder?: ReservationOrder;
  deliveryOrder?: DeliveryOrder;
  mealWithoutReservation?: MealWithoutReservation;
}

export interface OrderDetailsDto {
  dishSizeDetailId?: string;
  combo?: ComboRequest;
  quantity: number;
  note?: string;
}

export interface ComboRequest {
  comboId: string;
  dishComboIds: string[];
}

export interface ReservationOrder {
  numberOfPeople: number;
  mealTime: string;
  endTime: string;
  isPrivate: boolean;
  deposit: number;
  paymentMethod: number;
}

export interface DeliveryOrder {
  numberOfPeople: number;
  orderTime: string;
  deliveryTime: string;
  loyalPointToUse: number;
  couponIds: string[];
  paymentMethod: number;
}

export interface MealWithoutReservation {
  numberOfPeople: number;
  tableIds: string[];
}

// ============ order reponse ============
export interface CreateOrderReponse {
  result: CreateOrderData;
  isSuccess: boolean;
  messages: any[];
}

export interface CreateOrderData {
  order: Order;
  paymentLink: any;
}

export interface Order {
  orderId: string;
  orderDate: string;
  deliveryTime: any;
  reservationDate: any;
  mealTime: string;
  endTime: any;
  totalAmount: number;
  statusId: number;
  status: any;
  customerId: any;
  customerInfo: any;
  paymentMethodId: number;
  paymentMethod: any;
  loyalPointsHistoryId: any;
  loyalPointsHistory: any;
  note: string;
  orderTypeId: number;
  orderType: any;
  numOfPeople: number;
  deposit: any;
  isPrivate: any;
}
//

// ========= add dish to order id ==========

export interface AddOrderRequest {
  orderId: string;
  orderDetailsDtos: OrderDetailsDto[];
}

// ========= add dish to order response ==========

export interface AddOrderReponse {
  result: string;
  isSuccess: boolean;
  messages: string[];
}

// ========= get history order by id ==========
export interface GetHistoryOrderIdReponse {
  result: OrderHistoryData;
  isSuccess: boolean;
  messages: any[];
}
//

export interface OrderHistoryData {
  order: Order;
  orderDishes: OrderDish[];
  orderTables: OrderTable[];
}
//

export interface OrderTable {
  tableDetailId: string;
  tableId: string;
  table: Table;
  orderId: string;
  order: Order;
  startTime: string;
  endDate: any;
}
//
export interface Table {
  tableId: string;
  tableName: string;
  tableSizeId: number;
  tableSize: any;
  isDeleted: boolean;
  roomId: string;
  room: any;
}
//

export interface OrderDish {
  orderDetailsId: string;
  dishSizeDetailId?: string;
  dishSizeDetail?: DishSizeDetail;
  comboDish?: ComboDish;
}
//
export interface ComboDish {
  comboId: string;
  quantity?: number;
  combo: Combo;
  dishCombos: DishCombo[];
}
//
export interface DishCombo {
  dishComboId: string;
  quantity: number;
  dishSizeDetailId: string;
  dishSizeDetail: DishSizeDetailCombo;
  comboOptionSetId: string;
  comboOptionSet: ComboOptionSet;
}
//
export interface ComboOptionSet {
  comboOptionSetId: string;
  optionSetNumber: number;
  numOfChoice: number;
  dishItemTypeId: number;
  dishItemType: any;
  comboId: string;
  combo: any;
}
//
export interface DishSizeDetailCombo {
  dishSizeDetailId: string;
  isAvailable: boolean;
  price: number;
  discount: number;
  dishId: string;
  dish: DishOfCombo;
  dishSizeId: number;
  dishSize: DishSizeInCombo;
}
//
export interface DishSizeInCombo {
  id: number;
  name: string;
  vietnameseName: string;
}
//
export interface DishOfCombo {
  dishId: string;
  name: string;
  description: string;
  image: string;
  dishItemTypeId: number;
  dishItemType: any;
  isAvailable: boolean;
}
//

export interface DishSizeDetail {
  dishSizeDetailId: string;
  quantity?: number;
  startDate?: string;
  endDate?: string;
  isAvailable: boolean;
  price: number;
  discount: number;
  dishId: string;
  dish: Dish;
  dishSizeId: number;
  dishSize: DishSize;
}
//

export interface DishSize {
  id: number;
  name: string;
  vietnameseName: string;
}
//

export interface Dish {
  dishId: string;
  name: string;
  description: string;
  image: string;
  dishItemTypeId: number;
  dishItemType: any;
  isAvailable: boolean;
}
//
export interface Combo {
  comboId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  discount: number;
  categoryId: number;
  category?: any;
  startDate: string;
  endDate: string;
}
//
