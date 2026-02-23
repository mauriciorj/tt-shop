'use client'

import Breadcrumb from '@/components/breadcrumb'
import Categories from '@/components/categories'
import SearchBar from '@/components/search'
import StoreTableSkeleton from '@/stores/components/storeTableSkeleton'
import StoresTable from '@/stores/components/storesTable'
import useStores from '@/stores/hooks/useStores'

const Stores = () => {
  const {
    categories,
    currentPage,
    data: stores,
    isLoading,
    itemsPerPage,
    onPageChange,
    selectedCategory,
    setSelectedCategory,
    setCurrentPage,
    setSortKey,
    setSortOrder,
    sortKey,
    sortOrder,
    totalPages,
  } = useStores()

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-8 px-10 mx-auto max-w-[1400px]">
        <Breadcrumb
          description="Descubra as melhores lojas no TikTok Shop"
          title="Lojas"
        />
        <Categories
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setCurrentPage={setCurrentPage}
        />
        <SearchBar
          data={stores}
          placeholder="Procuar por uma loja ou produto..."
        />
        {isLoading ? (
          <StoreTableSkeleton rows={itemsPerPage} />
        ) : (
          <StoresTable
            currentPage={currentPage}
            items={stores}
            onPageChange={onPageChange}
            setSortKey={setSortKey}
            setSortOrder={setSortOrder}
            sortKey={sortKey}
            sortOrder={sortOrder}
            totalPages={totalPages}
          />
        )}
      </main>
    </div>
  )
}

export default Stores
