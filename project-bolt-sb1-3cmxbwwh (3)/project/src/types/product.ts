export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
