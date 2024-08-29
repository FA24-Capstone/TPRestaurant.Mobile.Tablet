export interface DishItemResponse {
  dish: {
    dishId: string; // Thay thế id thành dishId
    image: string;
    name: string;
    description?: string;
    dishItemTypeId: number;
    isAvailable?: boolean;
    dishItemType: DishItemType;
  };
  dishSizeDetails: DishSizeDetail[];
}

export interface DishItemType {
  id: number;
  name: string;
  vietnameseName: string | null;
}

export interface DishSize {
  id: number;
  name: string;
  vietnameseName: string | null;
}

export interface DishSizeDetail {
  dishSizeDetailId: string;
  isAvailable: boolean;
  price: number;
  discount: number;
  dishId: string;
  dishSizeId: number;
  dishSize: DishSize;
}

export interface Dish {
  id: string; // This matches the type from the API
  image: string | number;
  name: string;
  rating: number;
  type?: string;
  ratingCount: number;
  dishItemTypeId: number;
  price: number;
  quantity?: number;
  description?: string;
  isAvailable?: boolean;
  dishSizeDetails: DishSizeDetail[];
  dishItemType: DishItemType;
}

export interface Order {
  date: string;
  id: number;
  dishes: Dish[];
  note: string;
  status: string;
}

export interface OrderHistoryItemProps {
  order: Order;
  index: number;
}

export interface HistoryOrderCardProps {
  dish: Dish;
}

export interface ListOrderProps {
  orders: Order[];
}

export interface DishesApiResponse {
  result: {
    items: DishItemResponse[];
  };
}
