
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await storage.getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProduct: Product = {
        ...productData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await storage.saveProduct(newProduct);
      const updatedProducts = await storage.getProducts();
      setProducts(updatedProducts);
      toast({
        title: "Product added",
        description: `${newProduct.name} has been added successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      await storage.saveProduct(product);
      const updatedProducts = await storage.getProducts();
      setProducts(updatedProducts);
      toast({
        title: "Product updated",
        description: `${product.name} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await storage.deleteProduct(id);
      const updatedProducts = await storage.getProducts();
      setProducts(updatedProducts);
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  return (
    <ProductContext.Provider value={{ products, isLoading, addProduct, updateProduct, deleteProduct }}>
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
