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
  result: {
    reservation: Reservation;
    reservationDishes: ReservationDish[];
    reservationTableDetails: ReservationTableDetail[];
  };
  isSuccess: boolean;
  messages: string[];
}

export interface ReservationByPhoneApiResponse {
  result: {
    items: Reservation[];
  };
  isSuccess: boolean;
  messages: string[];
}
