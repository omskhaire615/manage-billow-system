import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProducts } from "@/contexts/ProductContext";
import { OrderPDF } from "@/components/OrderPDF";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
}

const OrderMaker = () => {
  const { products } = useProducts();
  const { toast } = useToast();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showPDF, setShowPDF] = useState(false);

  const handleAddItem = () => {
    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const newItem: OrderItem = {
      productId: product.id,
      quantity,
      name: product.name,
      price: product.price,
    };

    setOrderItems([...orderItems, newItem]);
    setSelectedProduct("");
    setQuantity(1);
    toast({
      title: "Item added",
      description: `Added ${quantity} ${product.name} to the order`,
    });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(newItems);
  };

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Order Maker</h1>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Product</label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - ₹{product.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>
        <Button onClick={handleAddItem} disabled={!selectedProduct}>
          Add to Order
        </Button>
      </Card>

      {orderItems.length > 0 && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Order Items</h2>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setShowPDF(!showPDF)}>
                {showPDF ? "Hide PDF" : "Show PDF"}
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₹{item.price.toFixed(2)}</TableCell>
                  <TableCell>₹{(item.quantity * item.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-semibold">
                  Total:
                </TableCell>
                <TableCell className="font-semibold">₹{total.toFixed(2)}</TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      )}

      {showPDF && orderItems.length > 0 && (
        <Card className="p-6">
          <OrderPDF orderItems={orderItems} total={total} />
        </Card>
      )}
    </div>
  );
};

export default OrderMaker;