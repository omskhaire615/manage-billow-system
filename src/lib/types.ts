export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  dimensions: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  customerName: string;
  customerAddress?: string;
  customerPhone?: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  date: string;
  status: "paid" | "pending" | "cancelled";
}

export interface Category {
  id: string;
  name: string;
}