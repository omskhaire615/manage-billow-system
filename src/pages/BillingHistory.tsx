import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { storage } from "@/lib/storage";
import { Invoice } from "@/lib/types";
import { BillsTable } from "@/components/BillsTable";
import { Search } from "lucide-react";

const BillingHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const allInvoices = storage.getInvoices();
  
  const filteredInvoices = allInvoices.filter((invoice) =>
    invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold text-gray-900">Billing History</h1>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Search by customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card className="p-6">
        <BillsTable invoices={filteredInvoices} />
      </Card>
    </div>
  );
};

export default BillingHistory;