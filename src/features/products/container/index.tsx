'use client'

import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Breadcrumb from '@/components/breadcrumb'
import Categories from '@/components/categories'
import SearchBar from '@/components/search'
import useProducts from '@/products/hooks/useProducts'
import ProductsTable from '@/products/components/productsTable'
import ProductTableSkeleton from '@/products/components/productTableSkeleton'

const ProductsContainer = () => {
  const { user } = useUser()
  const clerkId = user?.id ?? ''

  const savedProductIds = useQuery(
    api.savedProducts.getSavedProductIds,
    clerkId ? { clerk_id: clerkId } : 'skip'
  )
  const toggleSaved = useMutation(api.savedProducts.toggleSavedProduct)

  const handleToggleSave = async (productKId: string) => {
    if (!clerkId) {
      toast.error('Faça login para salvar produtos.')
      return
    }
    const result = await toggleSaved({
      clerk_id: clerkId,
      product_k_id: productKId,
    })
    if (result.saved) {
      toast.success('Produto salvo!')
    } else {
      toast.success('Produto removido dos salvos.')
    }
  }

  const {
    categories,
    currentPage,
    data: products,
    isLoading,
    itemsPerPage,
    onPageChange,
    selectedCategory,
    setCurrentPage,
    setSelectedCategory,
    setSortKey,
    setSortOrder,
    sortKey,
    sortOrder,
    totalPages,
  } = useProducts()

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-8 px-10 mx-auto max-w-[1400px]">
        <Breadcrumb
          description="Descubra os melhores produtos"
          title="Produtos"
        />
        <Categories
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setCurrentPage={setCurrentPage}
        />
        <SearchBar
          data={products}
          isStore={false}
          placeholder="Procurar por um produto..."
        />
        {isLoading ? (
          <ProductTableSkeleton rows={itemsPerPage} />
        ) : (
          <ProductsTable
            currentPage={currentPage}
            items={products}
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

export default ProductsContainer
