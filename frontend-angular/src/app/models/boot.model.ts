export interface Boot {
  _id?: string;
  name: string;
  model?: string;
  title?: string;
  brand: string;
  color: string;
  description: string;
  price: number;
  releaseDate: string;
  inStock: boolean;
  stock: number;
  size: number;
  surface: 'FG' | 'AG' | 'TF' | 'IC';
  createdAt?: string;
  updatedAt?: string;
}
