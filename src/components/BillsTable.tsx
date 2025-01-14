import React from "react";
import { Invoice } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface BillsTableProps {
  invoices: Invoice[];
  onViewBill: (invoice: Invoice) => void;
}

export const BillsTable = ({ invoices, onViewBill }: BillsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-left">Invoice ID</th>
            <th className="py-2 px-4 text-left">Customer</th>
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-right">Total</th>
            <th className="py-2 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-b">
              <td className="py-2 px-4">{invoice.id}</td>
              <td className="py-2 px-4">{invoice.customerName}</td>
              <td className="py-2 px-4">
                {new Date(invoice.date).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 text-right">₹{invoice.total.toFixed(2)}</td>
              <td className="py-2 px-4 text-center">
                <Button
                  variant="outline"
                  onClick={() => onViewBill(invoice)}
                  className="hover:bg-sage-50 transition-all duration-300"
                >
                  View Bill
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};