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
    <div className="w-full">
      <h3 className="text-lg font-medium mb-2">Products</h3>
      <div className="flex flex-col gap-4 mb-4">
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          onChange={(e) => addProductToInvoice(e.target.value, 1)}
          value=""
        >
          <option value="">Select a product</option>
          {filteredProducts.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - {product.dimensions} - ₹{product.price} (Stock: {product.stock})
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
            onClick={() => addProductToInvoice(product.id, 1)}
          >
            <p className="text-sm font-medium truncate">{product.name}</p>
            <p className="text-xs text-gray-500">{product.dimensions}</p>
            <p className="text-sm font-semibold mt-2">₹{product.price}</p>
            <p className="text-xs text-gray-500">Stock: {product.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
};