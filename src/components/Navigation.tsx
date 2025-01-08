import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Package, Receipt, LayoutGrid } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Dashboard", icon: LayoutGrid },
    { to: "/products", label: "Products", icon: Package },
    { to: "/billing", label: "Billing", icon: Receipt },
  ];

  return (
    <nav className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 p-6 space-y-8">
      <div className="flex items-center space-x-2">
        <Package className="w-6 h-6 text-sage-500" />
        <span className="text-xl font-semibold text-sage-500">ProductOS</span>
      </div>
      
      <div className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
              location.pathname === to
                ? "bg-sage-50 text-sage-500"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;