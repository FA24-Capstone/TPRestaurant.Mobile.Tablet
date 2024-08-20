export interface Combo {
  comboId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  discount: number;
  categoryId: number;
  category: ComboCategory;
  startDate: string;
  endDate: string;
  totalOptionSets?: number; // Assuming this is an integer
}

export interface ComboCategory {
  id: number;
  name: string;
  vietnameseName: string | null;
}

export interface DishCombo {
  dishCombo: DishComboDetail[];
  comboOptionSet: ComboOptionSet;
}

export interface DishComboDetail {
  dishComboId: string;
  quantity: number;
  dishSizeDetailId: string;
  dishSizeDetail: DishSizeDetail;
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
  dishSize: any; // Specify further if possible
}

export interface DishDetail {
  dishId: string;
  name: string;
  description: string;
  image: string;
  dishItemTypeId: number;
  dishItemType: any; // Replace 'any' with actual type if available
  isAvailable: boolean;
}

export interface CombosApiResponse {
  result: {
    items: Combo[];
  };
}

export interface ComboApiResponseData {
  combo: Combo;
  dishCombo: DishCombo[];
  imgs: string[];
}
export interface ComboApiResponse {
  result: ComboApiResponseData;
}
