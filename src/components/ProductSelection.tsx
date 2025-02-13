import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/lib/types";
import { Input } from "@/components/ui/input";

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

  const searchedProducts = filteredProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.dimensions.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Search Products
          </label>
          <Input
            type="text"
            placeholder="Search by name or dimensions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Select Product
          </label>
          <Select onValueChange={handleProductSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a product" />
            </SelectTrigger>
            <SelectContent>
              {searchedProducts.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} - {product.dimensions}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
