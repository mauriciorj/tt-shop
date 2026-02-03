'use client'

import Breadcrumb from '@/components/breadcrumb'
import SearchBar from '@/components/search'
import useProducts from '@/products/hooks/useProducts'
import Categories from '@/stores/components/categories'
import StatsCards from '@/stores/components/statsCards'
import StoresTable from '@/stores/components/storesTable'
import useStores from '@/stores/hooks/useStores'

const Stores = () => {
  const { totalProducts } = useProducts()
  const {
    categories,
    currentPage,
    data: stores,
    isLoading,
    paginatedStores,
    selectedCategory,
    setSelectedCategory,
    setCurrentPage,
    totalPages,
    totalStores,
  } = useStores()

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-8 px-10 mx-auto max-w-[1400px]">
        <Breadcrumb
          description="Descubra as melhores lojas no TikTok Shop"
          title="Lojas"
        />
        <StatsCards totalStores={totalStores} totalProducts={totalProducts} />
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
        <StoresTable
          currentPage={currentPage}
          items={stores}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />
      </main>
    </div>
  )
}

export default Stores
