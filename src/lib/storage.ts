
import { Product, Invoice } from '@/lib/types';

interface Collection<T extends object> {
  insertOne: (doc: T) => Promise<{ insertedId: string }>;
  find: (query: object) => Promise<T[]>;
  updateOne: (query: object, update: object) => Promise<{ matchedCount: number, modifiedCount: number }>;
  deleteOne: (query: object) => Promise<{ deletedCount: number }>;
}

interface Database {
  collection: <T extends object>(name: string) => Collection<T>;
}

interface MongoClient {
  db: (dbName: string) => Database;
}

interface Storage {
  getProducts: () => Promise<Product[]>;
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getInvoices: () => Promise<Invoice[]>;
  saveInvoice: (invoice: Invoice) => Promise<void>;
  updateInvoiceStatus: (id: string, status: 'pending' | 'paid') => Promise<void>;
  isUsingFallback: () => boolean;
}

class MongoDBStorage implements Storage {
  private client: any = null;
  private dbName = 'om_traders';
  private productCollectionName = 'products';
  private invoiceCollectionName = 'invoices';
  private apiKey = 'd3ff95f9-21bf-40ec-97d3-18c236d78835';
  private dataSource = 'AtlasCluster';
  private baseApiUrl = 'https://data.mongodb-api.com/app/data-xbfvi/endpoint/data/v1';

  private async executeRequest(action: string, collection: string, document?: any, filter?: any) {
    const url = this.baseApiUrl + '/action/' + action;
    
    const body: any = {
      dataSource: this.dataSource,
      database: this.dbName,
      collection: collection
    };
    
    if (document) {
      body.document = document;
    }
    
    if (filter) {
      body.filter = filter;
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        throw new Error(`MongoDB API request failed: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('MongoDB API request error:', error);
      throw error;
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      const result = await this.executeRequest('find', this.productCollectionName);
      return result.documents || [];
    } catch (error) {
      console.error('Error fetching products from MongoDB:', error);
      return this.useFallbackStorage().getProducts();
    }
  }

  async saveProduct(product: Product): Promise<void> {
    try {
      // Check if the product already exists
      const existingProducts = await this.executeRequest('find', this.productCollectionName, null, { id: product.id });
      
      if (existingProducts && existingProducts.documents && existingProducts.documents.length > 0) {
        // Update the existing product
        await this.executeRequest('updateOne', this.productCollectionName, null, 
          { id: product.id }, 
          { $set: product }
        );
      } else {
        // Insert the new product
        await this.executeRequest('insertOne', this.productCollectionName, product);
      }
    } catch (error) {
      console.error('Error saving product to MongoDB:', error);
      return this.useFallbackStorage().saveProduct(product);
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await this.executeRequest('deleteOne', this.productCollectionName, null, { id });
    } catch (error) {
      console.error('Error deleting product from MongoDB:', error);
      return this.useFallbackStorage().deleteProduct(id);
    }
  }

  async getInvoices(): Promise<Invoice[]> {
    try {
      const result = await this.executeRequest('find', this.invoiceCollectionName);
      return result.documents || [];
    } catch (error) {
      console.error('Error fetching invoices from MongoDB:', error);
      return this.useFallbackStorage().getInvoices();
    }
  }

  async saveInvoice(invoice: Invoice): Promise<void> {
    try {
      // Check if the invoice already exists
      const existingInvoices = await this.executeRequest('find', this.invoiceCollectionName, null, { id: invoice.id });
      
      if (existingInvoices && existingInvoices.documents && existingInvoices.documents.length > 0) {
        // Update the existing invoice
        await this.executeRequest('updateOne', this.invoiceCollectionName, null,
          { id: invoice.id },
          { $set: invoice }
        );
      } else {
        // Insert the new invoice
        await this.executeRequest('insertOne', this.invoiceCollectionName, invoice);
      }
    } catch (error) {
      console.error('Error saving invoice to MongoDB:', error);
      return this.useFallbackStorage().saveInvoice(invoice);
    }
  }

  async updateInvoiceStatus(id: string, status: 'pending' | 'paid'): Promise<void> {
    try {
      await this.executeRequest('updateOne', this.invoiceCollectionName, null,
        { id },
        { $set: { status } }
      );
    } catch (error) {
      console.error('Error updating invoice status in MongoDB:', error);
      // Get the invoice, update it, then save it back (fallback method)
      const invoices = await this.useFallbackStorage().getInvoices();
      const invoice = invoices.find(inv => inv.id === id);
      if (invoice) {
        invoice.status = status;
        await this.useFallbackStorage().saveInvoice(invoice);
      }
    }
  }

  isUsingFallback(): boolean {
    return this.apiKey === '' || this.baseApiUrl === '';
  }

  private useFallbackStorage(): Storage {
    return fallbackStorage;
  }
}

class FallbackStorage implements Storage {
  private readonly PRODUCTS_KEY = 'products';
  private readonly INVOICES_KEY = 'invoices';

  async getProducts(): Promise<Product[]> {
    const products = localStorage.getItem(this.PRODUCTS_KEY);
    return products ? JSON.parse(products) : [];
  }

  async saveProduct(product: Product): Promise<void> {
    const products = await this.getProducts();
    const existingIndex = products.findIndex((p) => p.id === product.id);

    if (existingIndex > -1) {
      products[existingIndex] = product;
    } else {
      products.push(product);
    }

    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
  }

  async deleteProduct(id: string): Promise<void> {
    let products = await this.getProducts();
    products = products.filter((product) => product.id !== id);
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
  }

  async getInvoices(): Promise<Invoice[]> {
    const invoices = localStorage.getItem(this.INVOICES_KEY);
    return invoices ? JSON.parse(invoices) : [];
  }

  async saveInvoice(invoice: Invoice): Promise<void> {
    const invoices = await this.getInvoices();
    const existingIndex = invoices.findIndex((i) => i.id === invoice.id);

    if (existingIndex > -1) {
      invoices[existingIndex] = invoice;
    } else {
      invoices.push(invoice);
    }

    localStorage.setItem(this.INVOICES_KEY, JSON.stringify(invoices));
  }

  async updateInvoiceStatus(id: string, status: 'pending' | 'paid'): Promise<void> {
    const invoices = await this.getInvoices();
    const index = invoices.findIndex(inv => inv.id === id);
    if (index !== -1) {
      invoices[index].status = status;
      localStorage.setItem(this.INVOICES_KEY, JSON.stringify(invoices));
    }
  }

  isUsingFallback(): boolean {
    return true;
  }
}

const mongodbStorage = new MongoDBStorage();
const fallbackStorage = new FallbackStorage();

export const storage: Storage = mongodbStorage;
