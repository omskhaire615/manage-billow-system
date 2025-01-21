import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerInfoProps {
  customerName: string;
  setCustomerName: (name: string) => void;
  address: string;
  setAddress: (address: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
}

export const CustomerInfo: React.FC<CustomerInfoProps> = ({
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
          <Label htmlFor="customerName" className="text-lg font-semibold text-gray-700">
            Customer Name
          </Label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="mt-2 text-lg p-6 rounded-xl border-2 border-gray-200 focus:border-sage-500 transition-colors"
            placeholder="Enter customer name"
          />
        </div>
        
        <div>
          <Label htmlFor="address" className="text-lg font-semibold text-gray-700">
            Address
          </Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-2 text-lg p-6 rounded-xl border-2 border-gray-200 focus:border-sage-500 transition-colors"
            placeholder="Enter address"
          />
        </div>
        
        <div>
          <Label htmlFor="phone" className="text-lg font-semibold text-gray-700">
            Phone Number
          </Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 text-lg p-6 rounded-xl border-2 border-gray-200 focus:border-sage-500 transition-colors"
            placeholder="Enter phone number"
            type="tel"
          />
        </div>
      </div>
    </Card>
  );
};