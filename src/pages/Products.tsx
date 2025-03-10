
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useProducts } from "@/contexts/ProductContext";
import { Product } from "@/lib/types";
import { LowStockAlert } from "@/components/LowStockAlert";
import { ProductSearch } from "@/components/ProductSearch";
import { ProductForm } from "@/components/ProductForm";
import { ProductTable } from "@/components/ProductTable";
import { StorageAlert } from "@/components/StorageAlert";
import { ProductHeader } from "@/components/ProductHeader";

const Products = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct, usingLocalStorage } = useProducts();
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

  const handleCancelForm = () => {
    setIsAdding(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <LowStockAlert />
      <StorageAlert usingLocalStorage={usingLocalStorage} />
      <ProductHeader onAddProduct={() => setIsAdding(true)} />
      <ProductSearch onSearch={setSearchQuery} />

      {(isAdding || editingProduct) && (
        <ProductForm 
          editingProduct={editingProduct} 
          onSubmit={handleSubmit} 
          onCancel={handleCancelForm} 
        />
      )}

      <Card className="animate-fadeIn">
        <ProductTable 
          products={filteredProducts} 
          onEdit={setEditingProduct} 
          onDelete={deleteProduct} 
          loading={loading} 
        />
      </Card>
    </div>
  );
};

export default Products;
