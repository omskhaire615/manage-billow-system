import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Package, Receipt, TrendingUp } from "lucide-react";
import { storage } from "@/lib/storage";
import { LowStockAlert } from "@/components/LowStockAlert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TopProduct {
  id: string;
  name: string;
  totalSold: number;
  revenue: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalInvoices: 0,
    totalRevenue: 0,
  });
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  useEffect(() => {
    const products = storage.getProducts();
    const invoices = storage.getInvoices();
    const revenue = invoices.reduce((acc, inv) => acc + inv.total, 0);

    // Calculate top selling products
    const productSales: { [key: string]: TopProduct } = {};
    
    invoices.forEach(invoice => {
      invoice.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          if (!productSales[product.id]) {
            productSales[product.id] = {
              id: product.id,
              name: product.name,
              totalSold: 0,
              revenue: 0,
            };
          }
          productSales[product.id].totalSold += item.quantity;
          productSales[product.id].revenue += item.quantity * item.price;
        }
      });
    });

    const topProductsList = Object.values(productSales)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    setTopProducts(topProductsList);
    setStats({
      totalProducts: products.length,
      totalInvoices: invoices.length,
      totalRevenue: revenue,
    });
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      <LowStockAlert />
      
      <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
      
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

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead className="text-right">Units Sold</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-right">{product.totalSold}</TableCell>
                <TableCell className="text-right">
                  ₹{product.revenue.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Dashboard;