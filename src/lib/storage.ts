
import { Product, Invoice, Category } from './types';

// Replace these with your actual MongoDB Data API information
const DATA_API_URL = 'YOUR_MONGODB_DATA_API_ENDPOINT';
const API_KEY = 'YOUR_API_KEY';
const DATABASE = 'inventory_management';
const USE_LOCALSTORAGE_FALLBACK = true; // Set to false once MongoDB is working

// Collection names
const COLLECTIONS = {
  PRODUCTS: 'products',
  INVOICES: 'invoices',
  CATEGORIES: 'categories',
};

// Local storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'products',
  INVOICES: 'invoices',
  CATEGORIES: 'categories',
};

// Helper function to get data from localStorage
const getFromLocalStorage = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading from localStorage for key ${key}:`, error);
    return [];
  }
};

// Helper function to save data to localStorage
const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    const existingData = getFromLocalStorage<T>(key);
    
    // If the data has an id field, use it for update/insert logic
    if ('id' in data) {
      const id = (data as any).id;
      const index = existingData.findIndex((item: any) => item.id === id);
      
      if (index > -1) {
        existingData[index] = data;
      } else {
        existingData.push(data);
      }
      
      localStorage.setItem(key, JSON.stringify(existingData));
    } else {
      // Just append the data if no id
      existingData.push(data);
      localStorage.setItem(key, JSON.stringify(existingData));
    }
  } catch (error) {
    console.error(`Error saving to localStorage for key ${key}:`, error);
  }
};

// Helper function to delete data from localStorage
const deleteFromLocalStorage = (key: string, id: string): void => {
  try {
    const existingData = getFromLocalStorage<any>(key);
    const updatedData = existingData.filter((item: any) => item.id !== id);
    localStorage.setItem(key, JSON.stringify(updatedData));
  } catch (error) {
    console.error(`Error deleting from localStorage for key ${key}:`, error);
  }
};

// Helper function for making API requests to MongoDB Data API
const fetchFromMongoDB = async (action: string, collection: string, data: any = {}): Promise<any> => {
  try {
    // Check if MongoDB API URL and key are set
    if (DATA_API_URL === 'YOUR_MONGODB_DATA_API_ENDPOINT' || 
        API_KEY === 'YOUR_API_KEY') {
      throw new Error('MongoDB API credentials not set. Using localStorage fallback.');
    }
    
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
      const errorText = await response.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        throw new Error(`MongoDB API Error: ${errorText || response.statusText}`);
      }
      throw new Error(`MongoDB API Error: ${errorJson.error || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('MongoDB API request failed:', error);
    
    // If fallback is enabled, don't throw further
    if (USE_LOCALSTORAGE_FALLBACK) {
      console.warn('Falling back to localStorage');
      return null;
    }
    
    throw error;
  }
};

export const storage = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    try {
      // Try MongoDB first
      const result = await fetchFromMongoDB('find', COLLECTIONS.PRODUCTS);
      if (result) {
        return result.documents || [];
      }
      
      // Fallback to localStorage
      if (USE_LOCALSTORAGE_FALLBACK) {
        return getFromLocalStorage<Product>(STORAGE_KEYS.PRODUCTS);
      }
      
      return [];
    } catch (error) {
      console.error('Failed to fetch products:', error);
      if (USE_LOCALSTORAGE_FALLBACK) {
        return getFromLocalStorage<Product>(STORAGE_KEYS.PRODUCTS);
      }
      return [];
    }
  },

  saveProduct: async (product: Product): Promise<void> => {
    try {
      // If using MongoDB
      const mongoResult = await fetchFromMongoDB('findOne', COLLECTIONS.PRODUCTS, {
        filter: { id: product.id }
      });
      
      if (mongoResult && !USE_LOCALSTORAGE_FALLBACK) {
        // Update existing product
        if (mongoResult.document) {
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
          await fetchFromMongoDB('insertOne', COLLECTIONS.PRODUCTS, {
            document: {
              ...product,
              createdAt: product.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          });
        }
        return;
      }
      
      // Fallback to localStorage
      if (USE_LOCALSTORAGE_FALLBACK) {
        saveToLocalStorage<Product>(STORAGE_KEYS.PRODUCTS, {
          ...product,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Failed to save product:', error);
      if (USE_LOCALSTORAGE_FALLBACK) {
        saveToLocalStorage<Product>(STORAGE_KEYS.PRODUCTS, {
          ...product,
          updatedAt: new Date().toISOString(),
        });
      } else {
        throw error;
      }
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    try {
      // Try MongoDB first
      const result = await fetchFromMongoDB('deleteOne', COLLECTIONS.PRODUCTS, {
        filter: { id }
      });
      
      // Fallback to localStorage if needed
      if (USE_LOCALSTORAGE_FALLBACK) {
        deleteFromLocalStorage(STORAGE_KEYS.PRODUCTS, id);
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      if (USE_LOCALSTORAGE_FALLBACK) {
        deleteFromLocalStorage(STORAGE_KEYS.PRODUCTS, id);
      } else {
        throw error;
      }
    }
  },

  // Invoices
  getInvoices: async (): Promise<Invoice[]> => {
    try {
      // Try MongoDB first
      const result = await fetchFromMongoDB('find', COLLECTIONS.INVOICES);
      if (result) {
        return result.documents || [];
      }
      
      // Fallback to localStorage
      if (USE_LOCALSTORAGE_FALLBACK) {
        return getFromLocalStorage<Invoice>(STORAGE_KEYS.INVOICES);
      }
      
      return [];
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      if (USE_LOCALSTORAGE_FALLBACK) {
        return getFromLocalStorage<Invoice>(STORAGE_KEYS.INVOICES);
      }
      return [];
    }
  },

  saveInvoice: async (invoice: Invoice): Promise<void> => {
    try {
      // Try MongoDB first
      await fetchFromMongoDB('insertOne', COLLECTIONS.INVOICES, {
        document: invoice
      });
      
      // Fallback to localStorage if needed
      if (USE_LOCALSTORAGE_FALLBACK) {
        saveToLocalStorage<Invoice>(STORAGE_KEYS.INVOICES, invoice);
      }
    } catch (error) {
      console.error('Failed to save invoice:', error);
      if (USE_LOCALSTORAGE_FALLBACK) {
        saveToLocalStorage<Invoice>(STORAGE_KEYS.INVOICES, invoice);
      } else {
        throw error;
      }
    }
  },

  updateInvoiceStatus: async (invoiceId: string, status: "paid" | "pending"): Promise<void> => {
    try {
      // Try MongoDB first
      await fetchFromMongoDB('updateOne', COLLECTIONS.INVOICES, {
        filter: { id: invoiceId },
        update: { $set: { status } }
      });
      
      // Fallback to localStorage if needed
      if (USE_LOCALSTORAGE_FALLBACK) {
        const invoices = getFromLocalStorage<Invoice>(STORAGE_KEYS.INVOICES);
        const updatedInvoices = invoices.map(invoice => 
          invoice.id === invoiceId ? { ...invoice, status } : invoice
        );
        localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(updatedInvoices));
      }
    } catch (error) {
      console.error('Failed to update invoice status:', error);
      if (USE_LOCALSTORAGE_FALLBACK) {
        const invoices = getFromLocalStorage<Invoice>(STORAGE_KEYS.INVOICES);
        const updatedInvoices = invoices.map(invoice => 
          invoice.id === invoiceId ? { ...invoice, status } : invoice
        );
        localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(updatedInvoices));
      } else {
        throw error;
      }
    }
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    try {
      // Try MongoDB first
      const result = await fetchFromMongoDB('find', COLLECTIONS.CATEGORIES);
      if (result) {
        return result.documents || [];
      }
      
      // Fallback to localStorage
      if (USE_LOCALSTORAGE_FALLBACK) {
        return getFromLocalStorage<Category>(STORAGE_KEYS.CATEGORIES);
      }
      
      return [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      if (USE_LOCALSTORAGE_FALLBACK) {
        return getFromLocalStorage<Category>(STORAGE_KEYS.CATEGORIES);
      }
      return [];
    }
  },

  saveCategory: async (category: Category): Promise<void> => {
    try {
      // Try MongoDB first
      await fetchFromMongoDB('insertOne', COLLECTIONS.CATEGORIES, {
        document: category
      });
      
      // Fallback to localStorage if needed
      if (USE_LOCALSTORAGE_FALLBACK) {
        saveToLocalStorage<Category>(STORAGE_KEYS.CATEGORIES, category);
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      if (USE_LOCALSTORAGE_FALLBACK) {
        saveToLocalStorage<Category>(STORAGE_KEYS.CATEGORIES, category);
      } else {
        throw error;
      }
    }
  },

  // Test connection to MongoDB
  testConnection: async (): Promise<boolean> => {
    try {
      if (DATA_API_URL === 'YOUR_MONGODB_DATA_API_ENDPOINT' || 
          API_KEY === 'YOUR_API_KEY') {
        console.warn('MongoDB API credentials not set');
        return false;
      }
      
      await fetchFromMongoDB('find', COLLECTIONS.PRODUCTS, { limit: 1 });
      return true;
    } catch (error) {
      console.error('MongoDB connection test failed:', error);
      return false;
    }
  },
  
  // Indicate if we're using the fallback mechanism
  isUsingFallback: (): boolean => {
    return USE_LOCALSTORAGE_FALLBACK;
  }
};
