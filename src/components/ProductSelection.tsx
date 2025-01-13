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
        <SelectTrigger>
          <SelectValue placeholder="Choose a product" />
        </SelectTrigger>
        <SelectContent>
          {products.map((product) => (
            <SelectItem key={product.id} value={product.id}>
              {product.name} - ₹{product.price} (Stock: {product.stock})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};