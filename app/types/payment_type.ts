// src/app/types/payment_type.ts
export interface CreatePaymentRequest {
  orderId: string;
  accountId?: string;
  paymentMethod: number;
}

export interface CreatePaymentResponse {
  result: any;
  isSuccess: boolean;
  messages: string[];
}

// details of the payment ================================

export interface PaymentDetailReponse {
  result: PaymentDetailReult;
  isSuccess: boolean;
  messages: any[];
}

export interface PaymentDetailReult {
  transaction: Transaction;
  order: Order2;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  paidDate: string;
  paymentMethodId: number;
  paymentMethod: any;
  transationStatusId: number;
  transationStatus: TransationStatus;
  transactionTypeId: number;
  transactionType: TransactionType;
  orderId: string;
  order: Order;
  accountId: any;
  account: any;
}

export interface TransationStatus {
  id: number;
  name: string;
  vietnameseName: string;
}

export interface TransactionType {
  id: number;
  name: string;
  vietnameseName: string;
}

export interface Order {
  orderId: string;
  orderDate: string;
  assignedTime: string;
  startDeliveringTime: any;
  deliveredTime: any;
  reservationDate: any;
  mealTime: any;
  endTime: any;
  cancelledTime: any;
  totalAmount: number;
  cashReceived: any;
  changeReturned: any;
  statusId: number;
  status: Status;
  accountId: string;
  account: Account;
  addressId: string;
  customerInfoAddress: CustomerInfoAddress;
  loyalPointsHistoryId: any;
  loyalPointsHistory: any;
  note: string;
  orderTypeId: number;
  orderType: OrderType;
  numOfPeople: any;
  deposit: any;
  isPrivate: any;
  validatingImg: any;
  shipperId: any;
  shipper: any;
  cancelDeliveryReason: any;
}

export interface Status {
  id: number;
  name: string;
  vietnameseName: string;
}

export interface Account {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string;
  gender: boolean;
  address: string;
  isVerified: boolean;
  isDeleted: boolean;
  loyaltyPoint: number;
  avatar: string;
  isManuallyCreated: boolean;
  isDelivering: boolean;
  storeCreditAmount: number;
  expiredDate: string;
  registeredDate: string;
  isBanned: boolean;
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: any;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: any;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

export interface CustomerInfoAddress {
  customerInfoAddressId: string;
  customerInfoAddressName: string;
  isCurrentUsed: boolean;
  accountId: string;
  account: Account2;
  lat: number;
  lng: number;
  isDeleted: boolean;
}

export interface Account2 {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string;
  gender: boolean;
  address: string;
  isVerified: boolean;
  isDeleted: boolean;
  loyaltyPoint: number;
  avatar: string;
  isManuallyCreated: boolean;
  isDelivering: boolean;
  storeCreditAmount: number;
  expiredDate: string;
  registeredDate: string;
  isBanned: boolean;
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: any;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: any;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

export interface OrderType {
  id: number;
  name: string;
  vietnameseName: string;
}

export interface Order2 {
  order: Order3;
  orderDishes: OrderDish[];
  orderTables: any[];
}

export interface Order3 {
  orderId: string;
  orderDate: string;
  depositPaidDate: any;
  orderPaidDate: string;
  assignedTime: string;
  startDeliveringTime: any;
  deliveredTime: any;
  cancelledTime: any;
  reservationDate: any;
  mealTime: any;
  endTime: any;
  totalAmount: number;
  statusId: number;
  status: Status2;
  accountId: string;
  account: Account3;
  addressId: string;
  customerInfoAddress: CustomerInfoAddress2;
  loyalPointsHistoryId: any;
  loyalPointsHistory: any;
  note: string;
  orderTypeId: number;
  orderType: OrderType2;
  numOfPeople: any;
  deposit: any;
  isPrivate: any;
  transaction: Transaction2;
  validatingImg: any;
  shipper: any;
  totalDistance: string;
  totalDuration: string;
  cancelDeliveryReason: any;
}

export interface Status2 {
  id: number;
  name: string;
  vietnameseName: string;
}

export interface Account3 {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string;
  gender: boolean;
  address: string;
  isVerified: boolean;
  isDeleted: boolean;
  loyaltyPoint: number;
  avatar: string;
  isManuallyCreated: boolean;
  isDelivering: boolean;
  storeCreditAmount: number;
  expiredDate: string;
  registeredDate: string;
  isBanned: boolean;
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: any;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: any;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

export interface CustomerInfoAddress2 {
  customerInfoAddressId: string;
  customerInfoAddressName: string;
  isCurrentUsed: boolean;
  accountId: string;
  account: Account4;
  lat: number;
  lng: number;
  isDeleted: boolean;
}

export interface Account4 {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string;
  gender: boolean;
  address: string;
  isVerified: boolean;
  isDeleted: boolean;
  loyaltyPoint: number;
  avatar: string;
  isManuallyCreated: boolean;
  isDelivering: boolean;
  storeCreditAmount: number;
  expiredDate: string;
  registeredDate: string;
  isBanned: boolean;
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: any;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: any;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

export interface OrderType2 {
  id: number;
  name: string;
  vietnameseName: string;
}

export interface Transaction2 {
  id: string;
  amount: number;
  date: string;
  paidDate: string;
  paymentMethodId: number;
  paymentMethod: any;
  transationStatusId: number;
  transationStatus: TransationStatus2;
  transactionTypeId: number;
  transactionType: TransactionType2;
  orderId: string;
  order: Order4;
  accountId: any;
  account: any;
}

export interface TransationStatus2 {
  id: number;
  name: string;
  vietnameseName: string;
}

export interface TransactionType2 {
  id: number;
  name: string;
  vietnameseName: string;
}

export interface Order4 {
  orderId: string;
  orderDate: string;
  assignedTime: string;
  startDeliveringTime: any;
  deliveredTime: any;
  reservationDate: any;
  mealTime: any;
  endTime: any;
  cancelledTime: any;
  totalAmount: number;
  cashReceived: any;
  changeReturned: any;
  statusId: number;
  status: Status3;
  accountId: string;
  account: Account5;
  addressId: string;
  customerInfoAddress: CustomerInfoAddress3;
  loyalPointsHistoryId: any;
  loyalPointsHistory: any;
  note: string;
  orderTypeId: number;
  orderType: OrderType3;
  numOfPeople: any;
  deposit: any;
  isPrivate: any;
  validatingImg: any;
  shipperId: any;
  shipper: any;
  cancelDeliveryReason: any;
}

export interface Status3 {
  id: number;
  name: string;
  vietnameseName: string;
}

export interface Account5 {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string;
  gender: boolean;
  address: string;
  isVerified: boolean;
  isDeleted: boolean;
  loyaltyPoint: number;
  avatar: string;
  isManuallyCreated: boolean;
  isDelivering: boolean;
  storeCreditAmount: number;
  expiredDate: string;
  registeredDate: string;
  isBanned: boolean;
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: any;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: any;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

export interface CustomerInfoAddress3 {
  customerInfoAddressId: string;
  customerInfoAddressName: string;
  isCurrentUsed: boolean;
  accountId: string;
  account: Account6;
  lat: number;
  lng: number;
  isDeleted: boolean;
}

export interface Account6 {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string;
  gender: boolean;
  address: string;
  isVerified: boolean;
  isDeleted: boolean;
  loyaltyPoint: number;
  avatar: string;
  isManuallyCreated: boolean;
  isDelivering: boolean;
  storeCreditAmount: number;
  expiredDate: string;
  registeredDate: string;
  isBanned: boolean;
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: any;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: any;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

export interface OrderType3 {
  id: number;
  name: string;
  vietnameseName: string;
}

export interface OrderDish {
  orderDetailsId: string;
  quantity: number;
  dishSizeDetailId: string;
  dishSizeDetail: DishSizeDetail;
  comboDish: any;
  note: any;
  orderTime: string;
  statusId: number;
  status: Status4;
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
  quantityLeft: number;
  dailyCountdown: number;
}

export interface Dish {
  dishId: string;
  name: string;
  description: string;
  image: string;
  dishItemTypeId: number;
  dishItemType: any;
  isAvailable: boolean;
  isDeleted: boolean;
  isMainItem: boolean;
  preparationTime: any;
}

export interface DishSize {
  id: number;
  name: string;
  vietnameseName: string;
}

export interface Status4 {
  id: number;
  name: string;
  vietnameseName: string;
}
