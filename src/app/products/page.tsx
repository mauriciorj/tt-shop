"use client";

import { Search } from "@/components/search";
import { SubHeader } from "@/components/subHeader";
import { Table } from "@/components/table";
import useProducts from "@/products/hooks/useProducts";
import { PaginationControl } from "@/components/pagination-control";

export default function ProductsPageWrapper() {
  const { data, isLoading, page, setPage, totalPages } = useProducts();
  return (
    <div className="min-h-screen bg-background">
      <SubHeader />
      <Search page="products" />
      <Table data={data} isLoading={isLoading} type="products" />
      <PaginationControl
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
