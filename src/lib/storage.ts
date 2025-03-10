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
  isUsingFallback: () => boolean;
}

class MongoDBStorage implements Storage {
  private client: MongoClient | null = null;
  private dbName: string | undefined;
  private productCollectionName = 'products';
  private invoiceCollectionName = 'invoices';
  private connectionString: string | undefined;

  constructor() {
    this.connectionString = process.env.MONGODB_URI;
    this.dbName = process.env.MONGODB_DB;
  }

  private async connect(): Promise<MongoClient> {
    if (typeof this.connectionString === 'undefined') {
      throw new Error('MongoDB connection string is not defined. Please set the MONGODB_URI environment variable.');
    }

    if (typeof this.dbName === 'undefined') {
      throw new Error('MongoDB database name is not defined. Please set the MONGODB_DB environment variable.');
    }

    if (!this.client) {
      try {
        const { MongoClient } = await import('mongodb');
        this.client = new MongoClient(this.connectionString);
        await this.client.connect();
      } catch (error: any) {
        console.error('MongoDB Connection Error:', error);
        this.client = null;
        throw error;
      }
    }
    return this.client;
  }

  private async getDB(): Promise<Database> {
    const client = await this.connect();
    return client.db(this.dbName as string);
  }

  async getProducts(): Promise<Product[]> {
    try {
      const db = await this.getDB();
      const products = await db.collection<Product>(this.productCollectionName).find({});
      return products;
    } catch (error) {
      console.error('Error fetching products from MongoDB:', error);
      return this.useFallbackStorage().getProducts();
    }
  }

  async saveProduct(product: Product): Promise<void> {
    try {
      const db = await this.getDB();
      
      // Check if the product already exists
      const existingProduct = await db.collection<Product>(this.productCollectionName).find({ id: product.id });
      
      if (existingProduct && existingProduct.length > 0) {
        // Update the existing product
        const result = await db.collection<Product>(this.productCollectionName).updateOne({ id: product.id }, { $set: product });
        if (result.matchedCount === 0) {
          throw new Error('Product update failed: Product not found.');
        }
      } else {
        // Insert the new product
        await db.collection<Product>(this.productCollectionName).insertOne(product);
      }
    } catch (error) {
      console.error('Error saving product to MongoDB:', error);
      return this.useFallbackStorage().saveProduct(product);
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const db = await this.getDB();
      const result = await db.collection<Product>(this.productCollectionName).deleteOne({ id: id });
      if (result.deletedCount === 0) {
        throw new Error('Product deletion failed: Product not found.');
      }
    } catch (error) {
      console.error('Error deleting product from MongoDB:', error);
      return this.useFallbackStorage().deleteProduct(id);
    }
  }

  async getInvoices(): Promise<Invoice[]> {
    try {
      const db = await this.getDB();
      const invoices = await db.collection<Invoice>(this.invoiceCollectionName).find({});
      return invoices;
    } catch (error) {
      console.error('Error fetching invoices from MongoDB:', error);
      return this.useFallbackStorage().getInvoices();
    }
  }

  async saveInvoice(invoice: Invoice): Promise<void> {
    try {
      const db = await this.getDB();
      
      // Check if the invoice already exists
      const existingInvoice = await db.collection<Invoice>(this.invoiceCollectionName).find({ id: invoice.id });
      
      if (existingInvoice && existingInvoice.length > 0) {
        // Update the existing invoice
        const result = await db.collection<Invoice>(this.invoiceCollectionName).updateOne({ id: invoice.id }, { $set: invoice });
        if (result.matchedCount === 0) {
          throw new Error('Invoice update failed: Invoice not found.');
        }
      } else {
        // Insert the new invoice
        await db.collection<Invoice>(this.invoiceCollectionName).insertOne(invoice);
      }
    } catch (error) {
      console.error('Error saving invoice to MongoDB:', error);
      return this.useFallbackStorage().saveInvoice(invoice);
    }
  }

  isUsingFallback(): boolean {
    return this.client === null;
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

  isUsingFallback(): boolean {
    return true;
  }
}

const mongodbStorage = new MongoDBStorage();
const fallbackStorage = new FallbackStorage();

export const storage: Storage = mongodbStorage;
