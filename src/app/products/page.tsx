'use client'

import { toast } from 'sonner'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Breadcrumb from '@/components/breadcrumb'
import Categories from '@/components/categories'
import CategoriesSkeleton from '@/components/categoriesSkeleton'
import PeriodFilter from '@/components/periodFilter'
import SearchBar from '@/components/search'
import useProducts from '@/products/hooks/useProducts'
import ProductsTable from '@/products/components/productsTable'
import ProductTableSkeleton from '@/products/components/productTableSkeleton'

const Products = () => {
  const {
    categories,
    currentPage,
    data: products,
    isFreeUser,
    isLoading,
    itemsPerPage,
    onPageChange,
    selectedCategory,
    selectedPeriod,
    setCurrentPage,
    setSelectedCategory,
    setSelectedPeriod,
    setSortKey,
    setSortOrder,
    sortKey,
    sortOrder,
    totalPages,
    userId,
  } = useProducts()

  const savedProductIds = useQuery(
    api.savedProducts.getSavedProductIds,
    userId ? { clerk_id: userId } : 'skip'
  )
  const toggleSaved = useMutation(api.savedProducts.toggleSavedProduct)

  const handleToggleSave = async (productKId: string) => {
    if (!userId) {
      toast.error('Faça login para salvar produtos.')
      return
    }
    const result = await toggleSaved({
      clerk_id: userId,
      product_k_id: productKId,
    })
    if (result.saved) {
      toast.success('Produto salvo!')
    } else {
      toast.success('Produto removido dos salvos.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-8 px-10 mx-auto max-w-[1400px]">
        <Breadcrumb
          description="Descubra os melhores produtos"
          title="Produtos"
        />
        {isLoading ? (
          <CategoriesSkeleton />
        ) : (
          <>
            <Categories
              categories={categories}
              isFreeUser={isFreeUser}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              setCurrentPage={setCurrentPage}
            />
            <PeriodFilter
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
              setCurrentPage={setCurrentPage}
            />
          </>
        )}
        <SearchBar
          clerkId={userId}
          data={products}
          isFreeUser={isFreeUser}
          isStore={false}
          placeholder="Procurar por um produto..."
        />
        {isLoading ? (
          <ProductTableSkeleton rows={itemsPerPage} />
        ) : (
          <ProductsTable
            currentPage={currentPage}
            items={products}
            isFreeUser={isFreeUser}
            onPageChange={onPageChange}
            onToggleSave={handleToggleSave}
            savedProductIds={savedProductIds ?? []}
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

export default Products
