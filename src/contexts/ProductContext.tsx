import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setProducts(storage.getProducts());
  }, []);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storage.saveProduct(newProduct);
    setProducts(storage.getProducts());
    toast({
      title: "Product added",
      description: `${newProduct.name} has been added successfully.`,
    });
  };

  const updateProduct = (product: Product) => {
    storage.saveProduct(product);
    setProducts(storage.getProducts());
    toast({
      title: "Product updated",
      description: `${product.name} has been updated successfully.`,
    });
  };

  const deleteProduct = (id: string) => {
    storage.deleteProduct(id);
    setProducts(storage.getProducts());
    toast({
      title: "Product deleted",
      description: "The product has been deleted successfully.",
    });
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};