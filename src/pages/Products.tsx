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
import { LowStockAlert } from "@/components/LowStockAlert";
import { ProductSearch } from "@/components/ProductSearch";

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get("name") as string,
      description: "", // Set empty description
      price: parseFloat(formData.get("price") as string),
      category: "", // Set empty category
      stock: parseInt(formData.get("stock") as string),
      dimensions: formData.get("dimensions") as string,
      imageUrl: formData.get("imageUrl") as string,
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
    <div className="space-y-8 animate-fadeIn">
      <LowStockAlert />
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-sage-900">Products</h1>
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-sage-500 hover:bg-sage-600 transition-colors duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <ProductSearch onSearch={setSearchQuery} />

      {(isAdding || editingProduct) && (
        <Card className="p-6 animate-slideIn bg-white shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-sage-900">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                onClick={() => {
                  setIsAdding(false);
                  setEditingProduct(null);
                }}
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
      )}

      <Card className="animate-fadeIn">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Dimensions</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-sage-50 transition-colors duration-200">
                <TableCell>
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-12 h-12 object-cover rounded-md"
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>₹{product.price.toFixed(2)}</TableCell>
                <TableCell>{product.dimensions}</TableCell>
                <TableCell>
                  <span className={product.stock < 5 ? "text-red-500 font-bold" : ""}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingProduct(product)}
                      className="hover:bg-sage-50 transition-colors duration-300"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteProduct(product.id)}
                      className="hover:bg-red-600 transition-colors duration-300"
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