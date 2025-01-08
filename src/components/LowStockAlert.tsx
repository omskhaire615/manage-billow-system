import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useProducts } from "@/contexts/ProductContext";

export const LowStockAlert = () => {
  const { products } = useProducts();
  const lowStockProducts = products.filter((product) => product.stock < 5);

  if (lowStockProducts.length === 0) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTitle>Low Stock Alert!</AlertTitle>
      <AlertDescription>
        The following products are running low on stock:
        <ul className="mt-2 list-disc list-inside">
          {lowStockProducts.map((product) => (
            <li key={product.id}>
              {product.name} - {product.stock} items remaining
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};