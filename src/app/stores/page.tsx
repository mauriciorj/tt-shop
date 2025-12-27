import { Search } from "@/components/search";
import { SubHeader } from "@/components/subHeader";
import { StoresTable } from "@/src/features/stores/components/storesTable";

export default function StoresPageWrapper() {
  return (
    <div className="min-h-screen bg-background">
      <SubHeader />
      <Search />
      <StoresTable />
    </div>
  );
}
