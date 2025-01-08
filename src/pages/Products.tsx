import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProducts } from "@/contexts/ProductContext";
import { Product } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      category: formData.get("category") as string,
      stock: parseInt(formData.get("stock") as string),
    };

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...productData });
      setEditingProduct(null);
    } else {
      addProduct(productData);
      setIsAdding(false);
    }
    e.currentTarget.reset();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-900">Products</h1>
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-sage-500 hover:bg-sage-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {(isAdding || editingProduct) && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                name="name"
                defaultValue={editingProduct?.name}
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                name="description"
                defaultValue={editingProduct?.description}
                required
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
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
                <label className="block text-sm font-medium mb-1">Category</label>
                <Input
                  name="category"
                  defaultValue={editingProduct?.category}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
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
                onClick={() => {
                  setIsAdding(false);
                  setEditingProduct(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-sage-500 hover:bg-sage-600">
                {editingProduct ? "Update" : "Add"} Product
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingProduct(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Products;