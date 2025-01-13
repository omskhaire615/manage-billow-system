import React from "react";
import { Card } from "@/components/ui/card";
import { storage } from "@/lib/storage";
import { useProducts } from "@/contexts/ProductContext";

export const TopSellingProducts = () => {
  const { products } = useProducts();
  const invoices = storage.getInvoices();

  const productSales = products.map((product) => {
    const totalSold = invoices.reduce((acc, invoice) => {
      const item = invoice.items.find((item) => item.productId === product.id);
      return acc + (item?.quantity || 0);
    }, 0);

    return {
      ...product,
      totalSold,
    };
  });

  const topProducts = productSales
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
      <div className="space-y-4">
        {topProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-12 h-12 rounded-md object-cover"
              />
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">₹{product.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">{product.totalSold} units sold</p>
              <p className="text-sm text-gray-500">In stock: {product.stock}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};