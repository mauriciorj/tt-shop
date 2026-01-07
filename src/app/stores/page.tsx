"use client";

import { Search } from "@/components/search";
import { SubHeader } from "@/components/subHeader";
import { Table } from "@/components/table";
import useStores from "@/stores/hooks/useStores";

export default function StoresPageWrapper() {
  const { data, isLoading } = useStores();
  return (
    <div className="min-h-screen bg-background">
      <SubHeader />
      <Search page="stores" />
      <Table data={data} isLoading={isLoading} type="stores" />
    </div>
  );
}
