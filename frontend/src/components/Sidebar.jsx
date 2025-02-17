"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Calendar, FileText, Book } from "lucide-react";

const menuItems = [
  { name: "Leads", href: "/dashboard/leads", icon: Users },
  { name: "Interactions", href: "/dashboard/interaction", icon: Calendar },
  { name: "Enquiries", href: "/dashboard/enquiries", icon: FileText },
  { name: "Bookings", href: "/dashboard/bookings", icon: Book },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="h-screen w-64 bg-gray-900 text-white fixed top-0 left-0 flex flex-col">
      <Link href="/dashboard" className="p-6 text-xl font-bold hover:text-gray-400 transition">
        CRM Dashboard
      </Link>
      
      <nav className="flex-1 px-4">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href} 
            className={`flex items-center gap-3 p-3 my-2 rounded-lg hover:bg-gray-700 transition ${
              pathname === item.href ? "bg-gray-800" : ""
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
