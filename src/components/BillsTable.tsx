import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/lib/types";
import { InvoicePDF } from "./InvoicePDF";
import { useProducts } from "@/contexts/ProductContext";

interface BillsTableProps {
  invoices: Invoice[];
}

export const BillsTable = ({ invoices }: BillsTableProps) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { products } = useProducts();

  if (selectedInvoice) {
    return (
      <div className="space-y-4">
        <Button onClick={() => setSelectedInvoice(null)}>Back to Bills</Button>
        <InvoicePDF invoice={selectedInvoice} products={products} />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id} className="hover:bg-muted/50 transition-all">
            <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
            <TableCell>{invoice.customerName}</TableCell>
            <TableCell>₹{invoice.total.toFixed(2)}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedInvoice(invoice)}
                className="hover:bg-primary/90 transition-colors"
              >
                Download PDF
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};