
import axios from 'axios';
import { Product, Invoice, Category } from './types';

// Replace these with your MongoDB Atlas Data API credentials
const DATA_API_URL = 'YOUR_MONGODB_DATA_API_ENDPOINT';
const API_KEY = 'YOUR_API_KEY';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Request-Headers': '*',
  'api-key': API_KEY,
};

export const storage = {
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await axios.post(`${DATA_API_URL}/find`, {
        collection: 'products',
        database: 'om_traders',
        dataSource: 'Cluster0',
      }, { headers });
      return response.data.documents || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  saveProduct: async (product: Product) => {
    try {
      if (product.id) {
        // Update existing product
        await axios.post(`${DATA_API_URL}/updateOne`, {
          collection: 'products',
          database: 'om_traders',
          dataSource: 'Cluster0',
          filter: { id: product.id },
          update: {
            $set: {
              ...product,
              updatedAt: new Date().toISOString(),
            },
          },
          upsert: true,
        }, { headers });
      } else {
        // Insert new product
        await axios.post(`${DATA_API_URL}/insertOne`, {
          collection: 'products',
          database: 'om_traders',
          dataSource: 'Cluster0',
          document: {
            ...product,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }, { headers });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      await axios.post(`${DATA_API_URL}/deleteOne`, {
        collection: 'products',
        database: 'om_traders',
        dataSource: 'Cluster0',
        filter: { id },
      }, { headers });
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  getInvoices: async (): Promise<Invoice[]> => {
    try {
      const response = await axios.post(`${DATA_API_URL}/find`, {
        collection: 'invoices',
        database: 'om_traders',
        dataSource: 'Cluster0',
      }, { headers });
      return response.data.documents || [];
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
  },

  saveInvoice: async (invoice: Invoice) => {
    try {
      await axios.post(`${DATA_API_URL}/insertOne`, {
        collection: 'invoices',
        database: 'om_traders',
        dataSource: 'Cluster0',
        document: invoice,
      }, { headers });
    } catch (error) {
      console.error('Error saving invoice:', error);
      throw error;
    }
  },

  updateInvoiceStatus: async (invoiceId: string, status: "paid" | "pending") => {
    try {
      await axios.post(`${DATA_API_URL}/updateOne`, {
        collection: 'invoices',
        database: 'om_traders',
        dataSource: 'Cluster0',
        filter: { id: invoiceId },
        update: {
          $set: { status },
        },
      }, { headers });
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  },

  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await axios.post(`${DATA_API_URL}/find`, {
        collection: 'categories',
        database: 'om_traders',
        dataSource: 'Cluster0',
      }, { headers });
      return response.data.documents || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  saveCategory: async (category: Category) => {
    try {
      await axios.post(`${DATA_API_URL}/insertOne`, {
        collection: 'categories',
        database: 'om_traders',
        dataSource: 'Cluster0',
        document: category,
      }, { headers });
    } catch (error) {
      console.error('Error saving category:', error);
      throw error;
    }
  },
};
