
import { Product, Invoice, Category } from './types';

// Replace these with your actual MongoDB Data API information
const DATA_API_URL = 'YOUR_MONGODB_DATA_API_ENDPOINT';
const API_KEY = 'YOUR_API_KEY';
const DATABASE = 'inventory_management';

// Collection names
const COLLECTIONS = {
  PRODUCTS: 'products',
  INVOICES: 'invoices',
  CATEGORIES: 'categories',
};

// Helper function for making API requests to MongoDB Data API
const fetchFromMongoDB = async (action: string, collection: string, data: any = {}) => {
  try {
    const response = await fetch(`${DATA_API_URL}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
      body: JSON.stringify({
        dataSource: 'Cluster0', // Replace with your cluster name if different
        database: DATABASE,
        collection,
        ...data,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`MongoDB API Error: ${errorData.error || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('MongoDB API request failed:', error);
    throw error;
  }
};

export const storage = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    try {
      const result = await fetchFromMongoDB('find', COLLECTIONS.PRODUCTS);
      return result.documents || [];
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  },

  saveProduct: async (product: Product): Promise<void> => {
    try {
      const products = await storage.getProducts();
      const index = products.findIndex(p => p.id === product.id);
      
      if (index > -1) {
        // Update existing product
        const updatedProduct = { 
          ...product, 
          updatedAt: new Date().toISOString() 
        };
        
        await fetchFromMongoDB('updateOne', COLLECTIONS.PRODUCTS, {
          filter: { id: product.id },
          update: { $set: updatedProduct },
          upsert: true
        });
      } else {
        // Insert new product
        const newProduct = {
          ...product,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        await fetchFromMongoDB('insertOne', COLLECTIONS.PRODUCTS, {
          document: newProduct
        });
      }
    } catch (error) {
      console.error('Failed to save product:', error);
      throw error;
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    try {
      await fetchFromMongoDB('deleteOne', COLLECTIONS.PRODUCTS, {
        filter: { id }
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  },

  // Invoices
  getInvoices: async (): Promise<Invoice[]> => {
    try {
      const result = await fetchFromMongoDB('find', COLLECTIONS.INVOICES);
      return result.documents || [];
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      return [];
    }
  },

  saveInvoice: async (invoice: Invoice): Promise<void> => {
    try {
      await fetchFromMongoDB('insertOne', COLLECTIONS.INVOICES, {
        document: invoice
      });
    } catch (error) {
      console.error('Failed to save invoice:', error);
      throw error;
    }
  },

  updateInvoiceStatus: async (invoiceId: string, status: "paid" | "pending"): Promise<void> => {
    try {
      await fetchFromMongoDB('updateOne', COLLECTIONS.INVOICES, {
        filter: { id: invoiceId },
        update: { $set: { status } }
      });
    } catch (error) {
      console.error('Failed to update invoice status:', error);
      throw error;
    }
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    try {
      const result = await fetchFromMongoDB('find', COLLECTIONS.CATEGORIES);
      return result.documents || [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  },

  saveCategory: async (category: Category): Promise<void> => {
    try {
      await fetchFromMongoDB('insertOne', COLLECTIONS.CATEGORIES, {
        document: category
      });
    } catch (error) {
      console.error('Failed to save category:', error);
      throw error;
    }
  },

  // Test connection to MongoDB
  testConnection: async (): Promise<boolean> => {
    try {
      await fetchFromMongoDB('find', COLLECTIONS.PRODUCTS, { limit: 1 });
      return true;
    } catch (error) {
      console.error('MongoDB connection test failed:', error);
      return false;
    }
  }
};
