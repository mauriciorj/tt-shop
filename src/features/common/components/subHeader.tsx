"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { id: "/stores", label: "Lojas", icon: "🏢" },
  { id: "/products", label: "Produtos", icon: "🏷️" },
];

export function SubHeader() {
  const pathname = usePathname();

  return (
    <div className="bg-background max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center gap-2">
        {TABS.map((tab) => (
          <Link key={tab.id} href={tab.id}>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                pathname === tab.id
                  ? "bg-blue-100 text-blue-700"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
