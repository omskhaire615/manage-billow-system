import React from "react";
import { Input } from "@/components/ui/input";

interface ProductSearchProps {
  onSearch: (query: string) => void;
}

export const ProductSearch = ({ onSearch }: ProductSearchProps) => {
  return (
    <div className="mb-4">
      <Input
        type="search"
        placeholder="Search products..."
        onChange={(e) => onSearch(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};