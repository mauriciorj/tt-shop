import { Search } from "@/components/search";
import { SubHeader } from "@/components/subHeader";
import { ProductsTable } from "@/products/components/productsTable";

export default function ProductsPageWrapper() {
  return (
    <div className="min-h-screen bg-background">
      <SubHeader />
      <Search page="products" />
      <ProductsTable />
    </div>
  );
}
