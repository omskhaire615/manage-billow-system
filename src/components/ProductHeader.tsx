
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductHeaderProps {
  onAddProduct: () => void;
}

export const ProductHeader = ({ onAddProduct }: ProductHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-semibold text-sage-900">Products</h1>
      <Button
        onClick={onAddProduct}
        className="bg-sage-500 hover:bg-sage-600 transition-colors duration-300"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Product
      </Button>
    </div>
  );
};
