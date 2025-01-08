import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { storage } from "@/lib/storage";
import { Invoice } from "@/lib/types";

const Billing = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    setInvoices(storage.getInvoices());
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-900">Billing</h1>
        <Button className="bg-sage-500 hover:bg-sage-600">
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

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