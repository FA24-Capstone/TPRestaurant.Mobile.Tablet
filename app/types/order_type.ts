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
  combo?: Combo;
  quantity: number;
  note?: string;
}

export interface Combo {
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
