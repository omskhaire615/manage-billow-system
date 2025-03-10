
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
  usingLocalStorage: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingLocalStorage, setUsingLocalStorage] = useState(false);
  const { toast } = useToast();

  // Check if we're using localStorage or MongoDB
  useEffect(() => {
    const checkStorageMode = async () => {
      const isUsingFallback = storage.isUsingFallback();
      setUsingLocalStorage(isUsingFallback);
      
      if (isUsingFallback) {
        toast({
          title: "Using Local Storage",
          description: "MongoDB connection not available. Using browser storage instead.",
          variant: "default",
        });
      }
    };
    
    checkStorageMode();
  }, [toast]);

  const refreshProducts = async () => {
    try {
      setLoading(true);
      const productsData = await storage.getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast({
        title: "Error fetching products",
        description: "Couldn't load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProduct: Product = {
        ...productData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await storage.saveProduct(newProduct);
      await refreshProducts();
      
      toast({
        title: "Product added",
        description: `${newProduct.name} has been added successfully.`,
      });
    } catch (error) {
      console.error('Failed to add product:', error);
      toast({
        title: "Error adding product",
        description: usingLocalStorage 
          ? "There was a problem saving to browser storage."
          : "There was a problem connecting to MongoDB. Check your API credentials.",
        variant: "destructive",
      });
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      await storage.saveProduct(product);
      await refreshProducts();
      
      toast({
        title: "Product updated",
        description: `${product.name} has been updated successfully.`,
      });
    } catch (error) {
      console.error('Failed to update product:', error);
      toast({
        title: "Error updating product",
        description: usingLocalStorage 
          ? "There was a problem saving to browser storage."
          : "There was a problem connecting to MongoDB. Check your API credentials.",
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await storage.deleteProduct(id);
      await refreshProducts();
      
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully.",
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast({
        title: "Error deleting product",
        description: usingLocalStorage 
          ? "There was a problem removing from browser storage."
          : "There was a problem connecting to MongoDB. Check your API credentials.",
        variant: "destructive",
      });
    }
  };

  return (
    <ProductContext.Provider 
      value={{ 
        products, 
        loading, 
        addProduct, 
        updateProduct, 
        deleteProduct, 
        refreshProducts,
        usingLocalStorage 
      }}
    >
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
