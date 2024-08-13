export interface Dish {
  id: number;
  image: string | number;
  name: string;
  rating: number;
  ratingCount: number;
  type: string;
  price: string;
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

export interface ListOrderProps {
  orders: Order[];
}
