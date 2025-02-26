
import React, { useState, useEffect } from "react";
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
import { BillingTable } from "@/components/BillingTable";
import { ProductSelection } from "@/components/ProductSelection";
import { BillsTable } from "@/components/BillsTable";

const Billing = () => {
  const { products, updateProduct } = useProducts();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<
    { product: Product; quantity: number }[]
  >([]);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showPDF, setShowPDF] = useState<Invoice | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const fetchedInvoices = await storage.getInvoices();
        setInvoices(fetchedInvoices);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch invoices",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInvoices();
  }, [toast]);

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

  const createInvoice = async () => {
    if (!customerName || !customerAddress || !customerPhone || selectedProducts.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      selectedProducts.forEach(({ product, quantity }) => {
        updateProductStock(product.id, quantity);
      });

      const newInvoice: Invoice = {
        id: crypto.randomUUID(),
        customerName,
        address: customerAddress,
        phone: customerPhone,
        items: selectedProducts.map(({ product, quantity }) => ({
          productId: product.id,
          quantity,
          price: product.price,
        })),
        total: calculateTotal(),
        date: new Date().toISOString(),
        status: "pending",
      };

      await storage.saveInvoice(newInvoice);
      const updatedInvoices = await storage.getInvoices();
      setInvoices(updatedInvoices);
      setShowPDF(newInvoice);
      setIsCreating(false);
      setSelectedProducts([]);
      setCustomerName("");
      setCustomerAddress("");
      setCustomerPhone("");

      toast({
        title: "Invoice created",
        description: `Invoice for ${customerName} has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    }
  };

  if (showPDF) {
    return (
      <div className="space-y-4">
        <Button onClick={() => setShowPDF(null)}>Back to Billing</Button>
        <InvoicePDF invoice={showPDF} products={products} />
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <LowStockAlert />
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-900">Billing</h1>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-sage-500 hover:bg-sage-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {!isCreating && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Previous Bills</h2>
          <BillsTable invoices={invoices.filter(inv => inv.status !== 'paid')} />
        </Card>
      )}

      {isCreating && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Invoice</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <Input
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full"
                  required
                  type="tel"
                />
              </div>
            </div>

            <ProductSelection
              filteredProducts={products}
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
                  setCustomerAddress("");
                  setCustomerPhone("");
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
