import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Package, Receipt, TrendingUp, AlertTriangle } from "lucide-react";
import { storage } from "@/lib/storage";
import { LowStockAlert } from "@/components/LowStockAlert";
import { TopSellingProducts } from "@/components/TopSellingProducts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalInvoices: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const products = storage.getProducts();
    const invoices = storage.getInvoices();
    const revenue = invoices.reduce((acc, inv) => acc + inv.total, 0);

    setStats({
      totalProducts: products.length,
      totalInvoices: invoices.length,
      totalRevenue: revenue,
    });
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
        <h2 className="text-2xl font-bold text-sage-600">Om Traders</h2>
      </div>

      <div className="space-y-6">
        <LowStockAlert />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-sage-50 rounded-lg">
                <Package className="w-6 h-6 text-sage-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalProducts}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-sage-50 rounded-lg">
                <Receipt className="w-6 h-6 text-sage-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Invoices</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalInvoices}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-sage-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-sage-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{stats.totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <TopSellingProducts />
      </div>
    </div>
  );
};

export default Dashboard;