
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { storage } from "@/lib/storage";
import { BillsTable } from "@/components/BillsTable";
import { Search } from "lucide-react";
import { Invoice } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const BillingHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const allInvoices = await storage.getInvoices();
        setInvoices(allInvoices);
      } catch (error) {
        console.error('Failed to fetch invoices:', error);
        toast({
          title: "Error fetching invoices",
          description: "Couldn't load invoice history. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [toast]);
  
  const filteredInvoices = invoices
    .filter((invoice) =>
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
        {loading ? (
          <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sage-500"></div>
          </div>
        ) : (
          <BillsTable invoices={filteredInvoices} isHistoryView={true} />
        )}
      </Card>
    </div>
  );
};

export default BillingHistory;
