'use client'

import Breadcrumb from '@/components/breadcrumb'
import SearchBar from '@/components/search'
import Categories from '@/stores/components/categories'
import useProducts from '@/products/hooks/useProducts'
import ProductsTable from '@/products/components/productsTable'

const Products = () => {
  const {
    categories,
    currentPage,
    data: products,
    isLoading,
    selectedCategory,
    setCurrentPage,
    setSelectedCategory,
    status,
    loadMore,
    totalPages,
    totalProducts,
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
        <ProductsTable
          currentPage={currentPage}
          items={products}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />
      </main>
    </div>
  )
}

export default Products
