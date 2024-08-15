export interface Dish {
  id: string; // This matches the type from the API
  image: string | number;
  name: string;
  rating: number;
  ratingCount: number;
  type: string;
  price: string;
  quantity?: number;
  description?: string;
  isAvailable?: boolean;
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
    items: {
      dishId: string;
      name: string;
      description: string;
      image: string;
      dishItemType: {
        id: number;
        name: string;
      };
      isAvailable: boolean;
    }[];
  };
}
