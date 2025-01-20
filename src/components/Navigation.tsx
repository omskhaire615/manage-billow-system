import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Package, Receipt, LayoutGrid, Menu, X } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/", label: "Dashboard", icon: LayoutGrid },
    { to: "/products", label: "Products", icon: Package },
    { to: "/billing", label: "Billing", icon: Receipt },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const navContent = (
    <>
      <div className="flex items-center space-x-2 p-4">
        <Package className="w-6 h-6 text-sage-500" />
        <span className="text-xl font-semibold text-sage-500">Om Traders</span>
      </div>
      
      <div className="space-y-2 p-4">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={() => isMobile && setIsOpen(false)}
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
    </>
  );

  if (isMobile) {
    return (
      <>
        <button
          onClick={toggleMenu}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <nav
          className={cn(
            "fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-40",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {navContent}
        </nav>
      </>
    );
  }

  return (
    <nav className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200">
      {navContent}
    </nav>
  );
};

export default Navigation;