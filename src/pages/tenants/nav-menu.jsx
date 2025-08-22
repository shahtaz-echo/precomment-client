import { MessageCircleCode, ShoppingCart, TextQuote } from "lucide-react";
import { Link, useLocation } from "react-router";

const NavMenu = ({ tenant_id }) => {
  const { pathname } = useLocation();
  const base_location = `/tenants/${tenant_id}`;

  const menuItems = [
    {
      name: "Agent",
      path: `${base_location}`,
      icon: MessageCircleCode,
    },
    {
      name: "Products",
      path: `${base_location}/products`,
      icon: ShoppingCart,
    },
    {
      name: "FAQs",
      path: `${base_location}/faqs`,
      icon: TextQuote,
    },
  ];

  return (
    <div className="flex gap-6 mb-12">
      {menuItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`text-sm flx gap-2 border-b-2 pb-1 font-medium transition-colors hover:text-primary ${
              isActive
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent"
            }`}
          >
            <item.icon size={16} />
            {item.name}
          </Link>
        );
      })}
    </div>
  );
};

export default NavMenu;
