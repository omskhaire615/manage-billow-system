import React from "react";
import { Product } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductSelectionProps {
  products: Product[];
  onProductSelect: (productId: string) => void;
}

export const ProductSelection = ({ products, onProductSelect }: ProductSelectionProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Product</label>
      <Select onValueChange={onProductSelect}>
        <SelectTrigger className="w-full transition-all duration-200 hover:border-sage-500">
          <SelectValue placeholder="Choose a product" />
        </SelectTrigger>
        <SelectContent>
          {products.map((product) => (
            <SelectItem 
              key={product.id} 
              value={product.id}
              className="flex items-center space-x-3 p-2 cursor-pointer transition-colors duration-200 hover:bg-sage-50"
            >
              <div className="flex items-center space-x-3">
                <img 
                  src={product.imageUrl || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"} 
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded-md"
                />
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">₹{product.price} (Stock: {product.stock})</p>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};