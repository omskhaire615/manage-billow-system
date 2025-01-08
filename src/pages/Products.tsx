import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { storage } from "@/lib/storage";
import { Product } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setProducts(storage.getProducts());
  }, []);

  const handleDelete = (id: string) => {
    storage.deleteProduct(id);
    setProducts(storage.getProducts());
    toast({
      title: "Product deleted",
      description: "The product has been successfully deleted.",
    });
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-900">Products</h1>
        <Button className="bg-sage-500 hover:bg-sage-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="p-6 hover:shadow-lg transition-all duration-200"
          >
            <div className="space-y-4">
              <div>
                <span className="text-sm text-sage-500 bg-sage-50 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {product.name}
              </h3>
              <p className="text-gray-500 text-sm line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-semibold text-gray-900">
                  ${product.price}
                </span>
                <span className="text-sm text-gray-500">
                  Stock: {product.stock}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1 hover:bg-sage-50 hover:text-sage-500"
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Products;