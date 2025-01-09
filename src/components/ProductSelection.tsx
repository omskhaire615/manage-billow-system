import React from "react";
import { Product } from "@/lib/types";

interface ProductSelectionProps {
  filteredProducts: Product[];
  addProductToInvoice: (productId: string, quantity: number) => void;
}

export const ProductSelection = ({
  filteredProducts,
  addProductToInvoice,
}: ProductSelectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Products</h3>
      <div className="flex gap-4 mb-4">
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          onChange={(e) => addProductToInvoice(e.target.value, 1)}
          value=""
        >
          <option value="">Select a product</option>
          {filteredProducts.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - ₹{product.price} (Stock: {product.stock})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};