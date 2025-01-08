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

  const removeProductFromInvoice = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
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

    // Update stock for all products
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

            <div>
              <h3 className="text-lg font-medium mb-2">Products</h3>
              <div className="flex gap-4 mb-4">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  onChange={(e) => addProductToInvoice(e.target.value, 1)}
                  value=""
                >
                  <option value="">Select a product</option>
                  {filteredProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.price} (Stock: {product.stock})
                    </option>
                  ))}
                </select>
              </div>

              {selectedProducts.map(({ product, quantity }, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 mb-2"
                >
                  <span>{product.name}</span>
                  <Input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value);
                      if (newQuantity > 0 && newQuantity <= product.stock) {
                        setSelectedProducts(
                          selectedProducts.map((item, i) =>
                            i === index
                              ? { ...item, quantity: newQuantity }
                              : item
                          )
                        );
                      }
                    }}
                    className="w-20"
                  />
                  <span>${(product.price * quantity).toFixed(2)}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeProductFromInvoice(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <div className="mt-4 text-right">
                <p className="text-lg font-semibold">
                  Total: ${calculateTotal().toFixed(2)}
                </p>
              </div>
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