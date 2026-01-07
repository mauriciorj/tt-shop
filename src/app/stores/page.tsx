"use client";

import { Search } from "@/components/search";
import { SubHeader } from "@/components/subHeader";
import { Table } from "@/components/table";
import useStores from "@/stores/hooks/useStores";
import { PaginationControl } from "@/components/pagination-control";

export default function StoresPageWrapper() {
  const {
    data,
    isLoading,
    page,
    setPage,
    totalPages,
    sortBy,
    order,
    handleSort,
  } = useStores();
  return (
    <div className="min-h-screen bg-background">
      <SubHeader />
      <Search page="stores" />
      <Table
        data={data}
        isLoading={isLoading}
        type="stores"
        sortBy={sortBy}
        order={order}
        onSort={handleSort}
      />
      <PaginationControl
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
