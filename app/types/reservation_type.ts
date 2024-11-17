import { OrderHistoryData } from "./order_type";

// Define types for customer information
export interface CustomerInfo {
  customerId: string;
  name: string;
  phoneNumber: string;
  dob: string;
  gender: boolean;
  address: string | null;
  loyaltyPoint: number;
  isVerified: boolean;
  verifyCode: string | null;
  accountId: string | null;
  account: any; // You may define a specific type for the account if necessary
}

// Define types for dish information within the reservation
export interface Dish {
  dishId: string;
  name: string;
  description: string;
  image: string;
  dishItemTypeId: number;
  dishItemType: any | null; // You may define a specific type for dishItemType if necessary
  isAvailable: boolean;
}

export interface DishSize {
  id: number;
  name: string;
  vietnameseName: string;
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

export interface ReservationDish {
  reservationDishId: string;
  dishSizeDetailId: string | null;
  dishSizeDetail: DishSizeDetail | null;
  comboDish: ComboDish | null;
}

// Define types for combo dish within the reservation
export interface ComboDish {
  comboId: string;
  combo: Combo;
  dishCombos: DishCombo[];
}

export interface Combo {
  comboId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  discount: number;
  categoryId: number;
  category: any | null; // You may define a specific type for category if necessary
  startDate: string;
  endDate: string;
}

export interface DishCombo {
  dishComboId: string;
  quantity: number;
  dishSizeDetailId: string;
  dishSizeDetail: DishSizeDetail;
  comboOptionSetId: string;
  comboOptionSet: any | null; // You may define a specific type for comboOptionSet if necessary
}

// Define types for table information within the reservation
export interface Table {
  tableId: string;
  tableName: string;
  tableSizeId: number;
  tableSize: any | null; // You may define a specific type for tableSize if necessary
  isDeleted: boolean;
  tableRatingId: string;
  tableRating: any | null; // You may define a specific type for tableRating if necessary
}

export interface ReservationTableDetail {
  reservationTableDetailId: string;
  tableId: string;
  table: Table;
  reservationId: string;
  reservation: any | null; // You may define a specific type for reservation if necessary
}

// Define types for the reservation itself
export interface Reservation {
  reservationId: string;
  reservationDate: string;
  numberOfPeople: number;
  endTime: string;
  customerInfoId: string;
  customerInfo: CustomerInfo;
  deposit: number;
  note: string | null;
  isPrivate: boolean;
  statusId: number;
  reservationStatus: any | null; // You may define a specific type for reservationStatus if necessary
}

// Define the overall response structure
export interface ReservationApiResponse {
  result: OrderHistoryData;
  isSuccess: boolean;
  messages: any[];
}

export interface ReservationByPhoneApiResponse {
  result: {
    items: Reservation[];
  };
  isSuccess: boolean;
  messages: string[];
}

// Get account by phone number

export interface AccountApiResponse {
  result: AccountResult;
  isSuccess: boolean;
  messages: any[];
}

export interface AccountResult {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  gender: boolean;
  dob: string;
  isVerified: boolean;
  userName: string;
  email: string;
  avatar: any;
  addresses: Address[];
  loyalPoint: number;
  amount: number;
  isDeleted: boolean;
  isDelivering: boolean;
  storeCreditExpireDay: string;
  isManuallyCreated: boolean;
  roles: Role[];
  mainRole: string;
}

export interface Address {
  customerInfoAddressId: string;
  customerInfoAddressName: string;
  isCurrentUsed: boolean;
  accountId: string;
  account: Account;
  lat: number;
  lng: number;
  isDeleted: boolean;
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
  avatar: any;
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
  passwordHash: string;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: any;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

export interface Role {
  id: string;
  name: string;
  normalizedName: string;
  concurrencyStamp: string;
}
