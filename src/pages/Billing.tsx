import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { storage } from "@/lib/storage";
import { Invoice, Product } from "@/lib/types";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { LowStockAlert } from "@/components/LowStockAlert";
import { InvoicePDF } from "@/components/InvoicePDF";
import { ProductSearch } from "@/components/ProductSearch";
import { BillingTable } from "@/components/BillingTable";
import { ProductSelection } from "@/components/ProductSelection";

const Billing = () => {
  const { products, updateProduct } = useProducts();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(storage.getInvoices());
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<
    { product: Product; quantity: number }[]
  >([]);
  const [customerName, setCustomerName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPDF, setShowPDF] = useState<Invoice | null>(null);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addProductToInvoice = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (product && quantity > 0 && quantity <= product.stock) {
      setSelectedProducts([...selectedProducts, { product, quantity }]);
    } else {
      toast({
        title: "Error",
        description: "Invalid quantity or insufficient stock",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () => {
    return selectedProducts.reduce(
      (total, { product, quantity }) => total + product.price * quantity,
      0
    );
  };

  const updateProductStock = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      updateProduct({
        ...product,
        stock: product.stock - quantity,
      });
    }
  };

  const createInvoice = () => {
    if (!customerName || selectedProducts.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    selectedProducts.forEach(({ product, quantity }) => {
      updateProductStock(product.id, quantity);
    });

    const newInvoice: Invoice = {
      id: crypto.randomUUID(),
      customerName,
      items: selectedProducts.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
        price: product.price,
      })),
      total: calculateTotal(),
      date: new Date().toISOString(),
      status: "pending",
    };

    storage.saveInvoice(newInvoice);
    setInvoices(storage.getInvoices());
    setShowPDF(newInvoice);
    setIsCreating(false);
    setSelectedProducts([]);
    setCustomerName("");

    toast({
      title: "Invoice created",
      description: `Invoice for ${customerName} has been created successfully.`,
    });
  };

  if (showPDF) {
    return (
      <div className="space-y-4">
        <Button onClick={() => setShowPDF(null)}>Back to Billing</Button>
        <InvoicePDF invoice={showPDF} products={products} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <LowStockAlert />
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-900">Billing</h1>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-sage-500 hover:bg-sage-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

      <ProductSearch onSearch={setSearchQuery} />

      {isCreating && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Invoice</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Customer Name
              </label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <ProductSelection
              filteredProducts={filteredProducts}
              addProductToInvoice={addProductToInvoice}
            />

            <BillingTable
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
            />

            <div className="mt-4 text-right">
              <p className="text-lg font-semibold">
                Total: ₹{calculateTotal().toFixed(2)}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setSelectedProducts([]);
                  setCustomerName("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={createInvoice}
                className="bg-sage-500 hover:bg-sage-600"
              >
                Create Invoice
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Billing;