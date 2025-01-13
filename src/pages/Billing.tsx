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
import * as XLSX from 'xlsx';

const Billing = () => {
  const { products, updateProduct } = useProducts();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(storage.getInvoices());
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<
    { product: Product; quantity: number }[]
  >([]);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

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

  const exportToExcel = (invoice: Invoice) => {
    const invoiceProducts = invoice.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        "Product Name": product?.name || "",
        "Quantity": item.quantity,
        "Price": `₹${item.price}`,
        "Total": `₹${item.price * item.quantity}`,
      };
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([
      {
        "Invoice ID": invoice.id,
        "Customer Name": invoice.customerName,
        "Customer Address": invoice.customerAddress || "N/A",
        "Customer Phone": invoice.customerPhone || "N/A",
        "Date": new Date(invoice.date).toLocaleDateString(),
        "Status": invoice.status,
      },
      { "": "" }, // Empty row for spacing
      ...invoiceProducts,
      { "": "" }, // Empty row for spacing
      { "Total Amount": `₹${invoice.total}` },
    ]);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice");
    XLSX.writeFile(workbook, `Invoice-${invoice.id}.xlsx`);
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
    setInvoices(storage.getInvoices());
    exportToExcel(newInvoice);
    setIsCreating(false);
    setSelectedProducts([]);
    setCustomerName("");
    setCustomerAddress("");
    setCustomerPhone("");

    toast({
      title: "Invoice created",
      description: `Invoice for ${customerName} has been created successfully.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-900">Billing</h1>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-sage-500 hover:bg-sage-600 transition-colors"
        >
          New Invoice
        </Button>
      </div>

      {!isCreating && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Previous Bills</h2>
          <BillsTable invoices={invoices} />
        </Card>
      )}

      {isCreating && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Invoice</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Customer Name *
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
                  Phone Number
                </label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full"
                  type="tel"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full"
              />
            </div>

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