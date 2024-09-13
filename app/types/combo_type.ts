export interface ComboApiData {
  combo: Combo;
  dishCombo: DishCombo[];
  imgs: string[];
}
export interface ComboIdApiResponse {
  result: ComboApiData;
  isSuccess: boolean;
  messages: any[];
}
export interface Combo {
  comboId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  discount: number;
  categoryId: number;
  category: Category;
  startDate: string;
  endDate: string;
  totalOptionSets?: number; // Assuming this is an integer
}

export interface Category {
  id: number;
  name: string;
  vietnameseName: any;
}

export interface DishCombo {
  dishCombo: DishComboDetail[];
  comboOptionSetId: string;
  optionSetNumber: number;
  numOfChoice: number;
  dishItemTypeId: number;
  dishItemType: DishItemType;
}

export interface DishItemType {
  id: number;
  name: string;
  vietnameseName: any;
}

export interface DishComboDetail {
  dishComboId: string;
  quantity: number;
  dishSizeDetailId: string;
  dishSizeDetail: DishSizeDetail;
  comboOptionSetId: string;
  comboOptionSet: any;
}

export interface ComboOptionSet {
  comboOptionSetId: string;
  optionSetNumber: number;
  numOfChoice: number;
  dishItemTypeId: number;
  dishItemType: any; // Specify further if possible
  comboId: string;
  combo: Combo | null;
}

export interface Dish {
  dishId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  dishItemTypeId: number;
  dishItemType: any;
  isAvailable: boolean;
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

export interface DishSize {
  id: number;
  name: string;
  vietnameseName: any;
}

export interface DishDetail {
  dishId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  dishItemTypeId: number;
  dishItemType: any; // Replace 'any' with actual type if available
  isAvailable: boolean;
}

// ============================== API get all combo ==============================

export interface CombosApiResponse {
  result: CombosData;
  isSuccess: boolean;
  messages: any[];
}

export interface CombosData {
  items: ItemCombo[];
  totalPages: number;
}

export interface ItemCombo {
  comboId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  discount: number;
  categoryId: number;
  category: Category;
  startDate: string;
  endDate: string;
}
