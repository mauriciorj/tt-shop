"use client";

import { useState, useMemo } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SearchBar from "@/components/search";
import StoreTable, { Store as StoreType } from "@/components/storeTable";
import { mockStores } from "../store/[...id]/mockStores";
import { Store, TrendingUp, Users } from "lucide-react";
import { cn } from "@/utils/utils";

const CATEGORIES = [
  { id: "all", label: "All Stores", subcategories: [] },
  {
    id: "beauty",
    label: "Beauty",
    subcategories: [
      { id: "skincare", label: "Skincare" },
      { id: "makeup", label: "Makeup" },
    ],
  },
  {
    id: "fashion",
    label: "Fashion",
    subcategories: [
      { id: "clothing", label: "Clothing" },
      { id: "accessories", label: "Accessories" },
    ],
  },
  {
    id: "electronics",
    label: "Electronics",
    subcategories: [
      { id: "phones", label: "Phones & Tablets" },
      { id: "gadgets", label: "Gadgets" },
    ],
  },
  {
    id: "home",
    label: "Home & Living",
    subcategories: [
      { id: "furniture", label: "Furniture" },
      { id: "decor", label: "Decor" },
    ],
  },
  {
    id: "food",
    label: "Food & Beverage",
    subcategories: [
      { id: "snacks", label: "Snacks" },
      { id: "drinks", label: "Drinks" },
    ],
  },
];

const ITEMS_PER_PAGE = 10;

const Stores = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategory);
  const hasSubcategories =
    activeCategory && activeCategory.subcategories.length > 0;

  const filteredStores = useMemo(() => {
    return mockStores.filter((store) => {
      const matchesCategory =
        selectedCategory === "all" ||
        store.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesCategory;
    });
  }, [selectedCategory]);

  const totalPages = Math.ceil(filteredStores.length / ITEMS_PER_PAGE);
  const paginatedStores = filteredStores.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const stats = [
    {
      label: "Total Stores",
      value: "2,847",
      icon: Store,
      change: "+12%",
    },
    {
      label: "Active Sellers",
      value: "1.2M",
      icon: Users,
      change: "+8%",
    },
    {
      label: "Avg. Growth",
      value: "24%",
      icon: TrendingUp,
      change: "+5%",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-8 px-10 mx-auto max-w-[1400px]">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">
            Top TikTok <span className="gradient-text">Stores</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover the best performing stores on TikTok Shop
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="glass-card rounded-2xl p-6 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-green-400">
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Category Tabs */}
        <div
          className="space-y-3 mb-6 animate-slide-up"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSelectedSubcategory(null);
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Subcategory Tabs */}
          {hasSubcategories && (
            <div className="flex flex-wrap gap-2 pl-4 border-l-2 border-primary/30">
              <button
                onClick={() => {
                  setSelectedSubcategory(null);
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                  selectedSubcategory === null
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                All {activeCategory.label}
              </button>
              {activeCategory.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubcategory(sub.id);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                    selectedSubcategory === sub.id
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div
          className="relative z-20 flex justify-center mb-8 animate-slide-up"
          style={{ animationDelay: "250ms" }}
        >
          <SearchBar
            stores={mockStores as StoreType[]}
            placeholder="Search stores by name or category..."
          />
        </div>

        {/* Table */}
        <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
          <StoreTable
            stores={paginatedStores}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </div>
  );
};

export default Stores;
