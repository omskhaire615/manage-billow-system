import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Package, Receipt, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";

const Navigation = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(!isMobile);

  const toggleNav = () => setIsOpen(!isOpen);

  const NavItem = ({ to, icon: Icon, children }: { to: string; icon: any; children: React.ReactNode }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:text-gray-900",
          isActive ? "bg-gray-100 text-gray-900" : "hover:bg-gray-50"
        )
      }
    >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
    </NavLink>
  );

  return (
    <>
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={toggleNav}
        >
          <Package className="h-4 w-4" />
        </Button>
      )}
      <nav
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white p-4 shadow-lg transition-transform duration-200 ease-in-out z-40",
          isMobile && !isOpen && "-translate-x-full"
        )}
      >
        <div className="space-y-4">
          <div className="py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Om Traders
            </h2>
          </div>
          <div className="space-y-1">
            <NavItem to="/" icon={Home}>Dashboard</NavItem>
            <NavItem to="/products" icon={Package}>Products</NavItem>
            <NavItem to="/billing" icon={Receipt}>Billing</NavItem>
            <NavItem to="/billing-history" icon={History}>Billing History</NavItem>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;