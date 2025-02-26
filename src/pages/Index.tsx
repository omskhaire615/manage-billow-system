
import { useEffect } from "react";
import { storage } from "@/lib/storage";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const { products, isLoading } = useProducts();
  const { toast } = useToast();

  useEffect(() => {
    const testConnection = async () => {
      try {
        const testProducts = await storage.getProducts();
        console.log("Connection test:", testProducts);
        
        if (testProducts) {
          toast({
            title: "Connected to MongoDB",
            description: "Successfully connected to the database",
          });
        }
      } catch (error) {
        console.error("Connection error:", error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to MongoDB. Please check your API credentials.",
          variant: "destructive",
        });
      }
    };

    testConnection();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500 mx-auto"></div>
          <p className="text-sage-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-sage-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-sage-900 mb-4">
            Welcome to Om Traders
          </h1>
          <p className="text-xl text-sage-600 mb-8">
            Your trusted partner for PVC, Hardware & Electronics
          </p>
          {products.length > 0 ? (
            <p className="text-sage-700">
              Successfully loaded {products.length} products from database
            </p>
          ) : (
            <p className="text-sage-700">
              No products found in database. Start by adding some products!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
