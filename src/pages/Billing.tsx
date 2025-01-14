import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/storage";
import { Invoice, Product } from "@/lib/types";
import { BillingTable } from "@/components/BillingTable";
import { BillsTable } from "@/components/BillsTable";
import { ProductSelection } from "@/components/ProductSelection";
import { pdf } from '@react-pdf/renderer';
import { InvoicePDF } from "@/components/InvoicePDF";

const Billing = () => {
  const { products, updateProduct } = useProducts();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(
    storage.getInvoices().filter(invoice => invoice.status === "pending")
  );
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<
    { product: Product; quantity: number }[]
  >([]);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProducts([...selectedProducts, { product, quantity: 1 }]);
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

  const downloadPDF = async (invoice: Invoice) => {
    try {
      const blob = await pdf(
        <InvoicePDF invoice={invoice} products={products} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${invoice.id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Invoice PDF has been downloaded",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  const createInvoice = async () => {
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
      customerAddress,
      customerPhone,
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
    setInvoices(storage.getInvoices().filter(invoice => invoice.status === "pending"));
    await downloadPDF(newInvoice);
    setIsCreating(false);
    setSelectedProducts([]);
    setCustomerName("");
    setCustomerAddress("");
    setCustomerPhone("");

    toast({
      title: "Invoice created",
      description: `Invoice for ${customerName} has been created and downloaded.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center animate-fadeIn">
        <h1 className="text-3xl font-semibold text-gray-900">Billing</h1>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-sage-500 hover:bg-sage-600 transition-all duration-300 transform hover:scale-105"
        >
          New Invoice
        </Button>
      </div>

      {!isCreating && (
        <Card className="p-6 animate-fadeIn">
          <h2 className="text-xl font-semibold mb-4">Pending Bills</h2>
          <BillsTable invoices={invoices} />
        </Card>
      )}

      {isCreating && (
        <Card className="p-6 animate-slideIn">
          <h2 className="text-xl font-semibold mb-4">Create New Invoice</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="transition-all duration-200 hover:transform hover:scale-[1.02]">
                <label className="block text-sm font-medium mb-1">
                  Customer Name *
                </label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full transition-all duration-200 hover:border-sage-500"
                  required
                />
              </div>
              <div className="transition-all duration-200 hover:transform hover:scale-[1.02]">
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full transition-all duration-200 hover:border-sage-500"
                  type="tel"
                />
              </div>
            </div>
            
            <div className="transition-all duration-200 hover:transform hover:scale-[1.02]">
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full transition-all duration-200 hover:border-sage-500"
              />
            </div>

            <div className="transition-all duration-200 hover:transform hover:scale-[1.02]">
              <ProductSelection 
                products={products.filter(p => p.stock > 0)} 
                onProductSelect={handleProductSelect}
              />
            </div>

            <div className="animate-fadeIn">
              <BillingTable
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
              />
            </div>

            <div className="mt-4 text-right animate-fadeIn">
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
                className="hover:bg-sage-50 transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                onClick={createInvoice}
                className="bg-sage-500 hover:bg-sage-600 transition-all duration-300 transform hover:scale-105"
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
