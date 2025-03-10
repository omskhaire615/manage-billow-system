
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Product } from "@/lib/types";

interface ProductFormProps {
  editingProduct: Product | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export const ProductForm = ({ editingProduct, onSubmit, onCancel }: ProductFormProps) => {
  return (
    <Card className="p-6 animate-slideIn bg-white shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-sage-900">
        {editingProduct ? "Edit Product" : "Add New Product"}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-sage-700">Name</label>
          <Input
            name="name"
            defaultValue={editingProduct?.name}
            required
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-sage-700">Image URL</label>
            <Input
              name="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              defaultValue={editingProduct?.imageUrl}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-sage-700">Dimensions (mm)</label>
            <Input
              name="dimensions"
              placeholder="100x200x300"
              defaultValue={editingProduct?.dimensions}
              required
              className="w-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-sage-700">Price (₹)</label>
            <Input
              name="price"
              type="number"
              step="0.01"
              defaultValue={editingProduct?.price}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-sage-700">Stock</label>
            <Input
              name="stock"
              type="number"
              defaultValue={editingProduct?.stock}
              required
              className="w-full"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="hover:bg-sage-50 transition-colors duration-300"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-sage-500 hover:bg-sage-600 transition-colors duration-300"
          >
            {editingProduct ? "Update" : "Add"} Product
          </Button>
        </div>
      </form>
    </Card>
  );
};
