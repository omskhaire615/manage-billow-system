
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
import { storage } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
import { Check, Eye } from "lucide-react";

interface BillsTableProps {
  invoices: Invoice[];
  isHistoryView?: boolean;
}

export const BillsTable = ({ invoices: initialInvoices, isHistoryView = false }: BillsTableProps) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>(
    isHistoryView ? initialInvoices : initialInvoices.filter((inv) => inv.status !== "paid")
  );
  const { products } = useProducts();

  const handleStatusChange = (invoiceId: string) => {
    const updatedInvoices = invoices.filter((invoice) => invoice.id !== invoiceId);
    setInvoices(updatedInvoices);
    storage.updateInvoiceStatus(invoiceId, "paid");
    toast({
      title: "Status Updated",
      description: "Invoice has been marked as paid",
    });
  };

  if (selectedInvoice) {
    return (
      <div className="space-y-4">
        <Button onClick={() => setSelectedInvoice(null)} className="mb-4">
          Back to Bills
        </Button>
        <InvoicePDF invoice={selectedInvoice} products={products} />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[100px]">Date</TableHead>
            <TableHead className="min-w-[150px]">Customer</TableHead>
            <TableHead className="min-w-[100px] text-right">Total</TableHead>
            <TableHead className="min-w-[100px] text-center">Status</TableHead>
            <TableHead className="min-w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} className="hover:bg-muted/50 transition-all">
              <TableCell className="font-medium whitespace-nowrap">
                {new Date(invoice.date).toLocaleDateString()}
              </TableCell>
              <TableCell className="break-words">{invoice.customerName}</TableCell>
              <TableCell className="text-right whitespace-nowrap">₹{invoice.total.toFixed(2)}</TableCell>
              <TableCell className="text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    invoice.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {invoice.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedInvoice(invoice)}
                    className="hover:bg-primary/90 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {!isHistoryView && invoice.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(invoice.id)}
                      className="hover:bg-green-500 hover:text-white transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
