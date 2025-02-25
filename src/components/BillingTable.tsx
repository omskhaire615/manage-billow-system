
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/lib/types";

interface BillingTableProps {
  selectedProducts: { product: Product; quantity: number }[];
  setSelectedProducts: React.Dispatch<
    React.SetStateAction<{ product: Product; quantity: number }[]>
  >;
}

export const BillingTable = ({
  selectedProducts,
  setSelectedProducts,
}: BillingTableProps) => {
  const removeProductFromInvoice = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Product</TableHead>
            <TableHead className="min-w-[120px]">Dimensions</TableHead>
            <TableHead className="min-w-[100px]">Quantity</TableHead>
            <TableHead className="min-w-[100px]">Price</TableHead>
            <TableHead className="min-w-[100px]">Total</TableHead>
            <TableHead className="min-w-[100px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedProducts.map(({ product, quantity }, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.dimensions}</TableCell>
              <TableCell>
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
                          i === index ? { ...item, quantity: newQuantity } : item
                        )
                      );
                    }
                  }}
                  className="w-20"
                />
              </TableCell>
              <TableCell>₹{product.price.toFixed(2)}</TableCell>
              <TableCell>₹{(product.price * quantity).toFixed(2)}</TableCell>
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
    </div>
  );
};
