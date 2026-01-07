"use client";

import { Search } from "@/components/search";
import { SubHeader } from "@/components/subHeader";
import { Table } from "@/components/table";
import useProducts from "@/products/hooks/useProducts";

export default function ProductsPageWrapper() {
  const { data, isLoading } = useProducts();
  return (
    <div className="min-h-screen bg-background">
      <SubHeader />
      <Search page="products" />
      <Table data={data} isLoading={isLoading} type="products" />
    </div>
  );
}
