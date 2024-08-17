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
}

export interface ComboCategory {
  id: number;
  name: string;
  vietnameseName: string | null;
}

export interface CombosApiResponse {
  result: {
    items: Combo[];
  };
}
