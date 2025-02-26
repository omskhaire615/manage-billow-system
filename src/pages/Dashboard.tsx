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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TopProduct {
  id: string;
  name: string;
  totalSold: number;
  revenue: number;
  imageUrl: string;
  stock: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalInvoices: 0,
    totalRevenue: 0,
  });
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

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
              imageUrl: product.imageUrl,
              stock: product.stock,
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
    setChartData(topProductsList.map(product => ({
      name: product.name,
      sales: product.totalSold,
    })));
    setStats({
      totalProducts: products.length,
      totalInvoices: invoices.length,
      totalRevenue: revenue,
    });
  }, []);

  return (
    <div className="space-y-8">
      <LowStockAlert />
      
      <div className="relative w-full h-80 bg-gradient-to-r from-sage-50 to-sage-100 rounded-lg overflow-hidden mb-8 group">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/photo-1500673922987-e212871fec22')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
        <div className="relative flex flex-col items-center justify-center h-full space-y-6">
          <img 
            src="/lovable-uploads/2e0ae2ca-ad0a-46a5-9b53-156a55fc1de4.png" 
            alt="Om Traders Logo" 
            className="h-40 w-40 animate-scale-in hover:scale-110 transition-transform duration-500"
          />
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-sage-800 animate-text-slide">
              <span className="inline-block animate-char">O</span>
              <span className="inline-block animate-char">m</span>
              <span className="inline-block animate-char">&nbsp;</span>
              <span className="inline-block animate-char">T</span>
              <span className="inline-block animate-char">r</span>
              <span className="inline-block animate-char">a</span>
              <span className="inline-block animate-char">d</span>
              <span className="inline-block animate-char">e</span>
              <span className="inline-block animate-char">r</span>
              <span className="inline-block animate-char">s</span>
            </h1>
            <p className="text-xl text-sage-600 animate-fade-in delay-150 hover:text-sage-500 transition-colors duration-300">
              PVC, Hardware & Electronics
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-sage-50 rounded-lg animate-pulse">
              <Package className="w-6 h-6 text-sage-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900 animate-fade-in">
                {stats.totalProducts}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-sage-50 rounded-lg animate-pulse">
              <Receipt className="w-6 h-6 text-sage-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Invoices</p>
              <p className="text-2xl font-semibold text-gray-900 animate-fade-in">
                {stats.totalInvoices}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-sage-50 rounded-lg animate-pulse">
              <TrendingUp className="w-6 h-6 text-sage-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900 animate-fade-in">
                ₹{stats.totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Sales Chart</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#4A5D5C" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Units Sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <img 
                      src={product.imageUrl || "/placeholder.svg"} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
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
    </div>
  );
};

export default Dashboard;