
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Product } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductSelectionProps {
  filteredProducts: Product[];
  addProductToInvoice: (productId: string, quantity: number) => void;
}

export const ProductSelection: React.FC<ProductSelectionProps> = ({
  filteredProducts,
  addProductToInvoice,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleProductSelect = (productId: string) => {
    addProductToInvoice(productId, 1); // Default quantity to 1
  };

  const searchedProducts = searchQuery.trim() !== "" 
    ? filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.dimensions.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <Card className="p-4 md:p-6 space-y-4 max-w-full overflow-hidden">
      <div className="space-y-4">
        <div className="sticky top-0 bg-white z-10 pb-2">
          <label className="block text-base md:text-sm font-medium mb-2 text-gray-700">
            Search Products
          </label>
          <Input
            type="text"
            placeholder="Search by name or dimensions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-base md:text-sm h-12 md:h-10 px-4"
          />
        </div>
        
        {searchQuery.trim() !== "" && (
          <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[calc(100vh-200px)]">
            {searchedProducts.map((product) => (
              <Button
                key={product.id}
                variant="outline"
                className="w-full p-4 h-auto flex flex-col items-start space-y-2 text-left hover:bg-sage-50 active:bg-sage-100 touch-manipulation"
                onClick={() => handleProductSelect(product.id)}
              >
                <div className="font-medium text-base">{product.name}</div>
                <div className="text-base text-gray-600">{product.dimensions}</div>
                <div className="text-base text-sage-600">₹{product.price.toFixed(2)}</div>
              </Button>
            ))}
            {searchedProducts.length === 0 && (
              <div className="text-center text-gray-500 py-8 text-base">
                No products found matching your search
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export const CustomerInfo: React.FC<{
  customerName: string;
  setCustomerName: (name: string) => void;
  address: string;
  setAddress: (address: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
}> = ({
  customerName,
  setCustomerName,
  address,
  setAddress,
  phone,
  setPhone,
}) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-lg font-semibold text-gray-700">
            Customer Name
          </label>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="mt-2 w-full text-lg p-6 rounded-xl border-2 border-gray-200 focus:border-sage-500 transition-colors"
            placeholder="Enter customer name"
          />
        </div>
        
        <div>
          <label className="block text-lg font-semibold text-gray-700">
            Address
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-2 w-full text-lg p-6 rounded-xl border-2 border-gray-200 focus:border-sage-500 transition-colors"
            placeholder="Enter complete address"
            rows={3}
          />
        </div>
        
        <div>
          <label className="block text-lg font-semibold text-gray-700">
            Phone Number
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 w-full text-lg p-6 rounded-xl border-2 border-gray-200 focus:border-sage-500 transition-colors"
            placeholder="Enter phone number"
            type="tel"
          />
        </div>
      </div>
    </Card>
  );
};
