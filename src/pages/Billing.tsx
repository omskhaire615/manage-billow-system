import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { storage } from "@/lib/storage";
import { Invoice, Product } from "@/lib/types";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

const Billing = () => {
  const { products } = useProducts();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(storage.getInvoices());
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<
    { product: Product; quantity: number }[]
  >([]);
  const [customerName, setCustomerName] = useState("");

  const addProductToInvoice = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (product && quantity > 0) {
      setSelectedProducts([
        ...selectedProducts,
        { product, quantity },
      ]);
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

  const createInvoice = () => {
    if (!customerName || selectedProducts.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

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
    setIsCreating(false);
    setSelectedProducts([]);
    setCustomerName("");

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
          className="bg-sage-500 hover:bg-sage-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

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
                  onChange={(e) =>
                    addProductToInvoice(e.target.value, 1)
                  }
                  value=""
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.price}
                    </option>
                  ))}
                </select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedProducts.map(({ product, quantity }, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value);
                            if (newQuantity > 0) {
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
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        ${(product.price * quantity).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeProductFromInvoice(index)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

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

      <div className="space-y-4">
        {invoices.map((invoice) => (
          <Card
            key={invoice.id}
            className="p-6 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {invoice.customerName}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(invoice.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-gray-900">
                  ${invoice.total.toFixed(2)}
                </p>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    invoice.status === "paid"
                      ? "bg-green-50 text-green-600"
                      : invoice.status === "pending"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Billing;