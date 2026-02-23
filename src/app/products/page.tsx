'use client'

import Breadcrumb from '@/components/breadcrumb'
import Categories from '@/components/categories'
import SearchBar from '@/components/search'
import useProducts from '@/products/hooks/useProducts'
import ProductsTable from '@/products/components/productsTable'
import ProductTableSkeleton from '@/products/components/productTableSkeleton'

const Products = () => {
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
