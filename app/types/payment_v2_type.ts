// Define the request and response types if needed
export interface MakeDineInOrderBillRequest {
  orderId: string;
  accountId: string;
  cashReceived: number;
  changeReturned: number;
  paymentMethod: number;
  couponIds: string[];
  loyalPointsToUse: number;
  chooseCashRefund: boolean;
}

export interface MakeDineReponse {
  result: MakeDineResult;
  isSuccess: boolean;
  messages: any[];
}

export interface MakeDineResult {
  order: Order;
  paymentLink: string;
}

export interface Order {
  orderId: string;
  orderDate: string;
  assignedTime: any;
  startDeliveringTime: any;
  deliveredTime: any;
  reservationDate: any;
  mealTime: string;
  endTime: any;
  cancelledTime: any;
  totalAmount: number;
  cashReceived: any;
  changeReturned: any;
  statusId: number;
  status: any;
  accountId: any;
  account: any;
  addressId: any;
  customerInfoAddress: any;
  loyalPointsHistoryId: any;
  loyalPointsHistory: any;
  note: string;
  orderTypeId: number;
  orderType: any;
  numOfPeople: number;
  deposit: any;
  isPrivate: any;
  validatingImg: any;
  shipperId: any;
  shipper: any;
  cancelDeliveryReason: any;
}
