export interface DishOrder {
  type: "dish";
  id: string;
  name: string;
  price: number;
  image: string | number;
  quantity: number;
  rating: number;
  ratingCount: number;
  size?: string;
  sizePrice?: number;
}

export interface ComboOrder {
  type?: "combo";
  comboId: string;
  comboName: string;
  comboImage: string | number;
  quantity: number;
  comboPrice: number;
  selectedDishes: { id: string; name: string; price: number }[];
}

// Type guard for DishOrder
export function isDishOrder(item: any): item is DishOrder {
  return item.type === "dish";
}

// Type guard for ComboOrder
export function isComboOrder(item: any): item is ComboOrder {
  return item.type === "combo";
}
