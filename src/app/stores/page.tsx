"use client";

import Table, { ITable } from "@/components/table";
import SearchBar from "@/components/search";
import Categories from "@/stores/components/categories";
import Header from "@/stores/components/header";
import StatsCards from "@/stores/components/statsCards";
import useProducts from "@/products/hooks/useProducts";
import useStores from "@/stores/hooks/useStores";

const Stores = () => {
  const { totalProducts } = useProducts();
  const {
    categories,
    currentPage,
    data: stores,
    isLoading,
    paginatedStores,
    selectedCategory,
    selectedSubcategory,
    setSelectedCategory,
    setCurrentPage,
    setSelectedSubcategory,
    totalPages,
    totalStores,
  } = useStores();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-8 px-10 mx-auto max-w-[1400px]">
        <Header />
        <StatsCards totalStores={totalStores} totalProducts={totalProducts} />
        <Categories
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubcategory={selectedSubcategory}
          setSelectedSubcategory={setSelectedSubcategory}
          setCurrentPage={setCurrentPage}
        />
        {/* <SearchBar
          stores={mockStores as ITable[]}
          placeholder="Procuar por uma loja ou produto..."
        /> */}
        <Table
          items={stores}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
};

export default Stores;
