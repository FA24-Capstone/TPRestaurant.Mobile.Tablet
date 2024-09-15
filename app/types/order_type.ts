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
export interface OrderReponse {
  result: Result;
  isSuccess: boolean;
  messages: any[];
}

export interface Result {
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

export interface OrderHistoryData {
  order: OrderInfo;
  orderDetails: OrderDetails[];
}

export interface OrderInfo {
  orderId: string;
  orderDate: string;
  deliveryTime: any;
  reservationDate: any;
  mealTime: string;
  endTime: any;
  totalAmount: number;
  statusId: number;
  status: StatusOrder;
  customerId: any;
  customerInfo: any;
  paymentMethodId: number;
  paymentMethod: PaymentMethod;
  loyalPointsHistoryId: any;
  loyalPointsHistory: any;
  note: string;
  orderTypeId: number;
  orderType: OrderType;
  numOfPeople: number;
  deposit: any;
  isPrivate: any;
}

export interface StatusOrder {
  id: number;
  name: string;
  vietnameseName: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  vietnameseName: string;
}

export interface OrderType {
  id: number;
  name: string;
}

export interface OrderDetails {
  orderDetail: OrderDetail;
  comboOrderDetails: any[];
}

export interface OrderDetail {
  orderDetailId: string;
  orderId: string;
  order: any;
  dishSizeDetailId?: string;
  dishSizeDetail?: DishSizeDetail;
  comboId?: string;
  combo: Combo;
  quantity: number;
  price: number;
  note: string;
  orderTime: string;
  readyToServeTime: any;
  orderDetailStatusId: number;
  orderDetailStatus: any;
}

export interface DishSizeDetail {
  dishSizeDetailId: string;
  isAvailable: boolean;
  price: number;
  discount: number;
  dishId: string;
  dish: Dish;
  dishSizeId: number;
  dishSize: any;
}

export interface Dish {
  dishId: string;
  name: string;
  description: string;
  image: string;
  dishItemTypeId: number;
  dishItemType: any;
  isAvailable: boolean;
}

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
