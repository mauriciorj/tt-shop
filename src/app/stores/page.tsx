'use client'

import { toast } from 'sonner'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Breadcrumb from '@/components/breadcrumb'
import Categories from '@/components/categories'
import CategoriesSkeleton from '@/components/categoriesSkeleton'
import PeriodFilter from '@/components/periodFilter'
import SearchBar from '@/components/search'
import StoreTableSkeleton from '@/stores/components/storeTableSkeleton'
import StoresTable from '@/stores/components/storesTable'
import useStores from '@/stores/hooks/useStores'

const Stores = () => {
  const {
    categories,
    currentPage,
    data: stores,
    isFreeUser,
    isLoading,
    itemsPerPage,
    onPageChange,
    selectedCategory,
    selectedPeriod,
    setSelectedCategory,
    setCurrentPage,
    setSelectedPeriod,
    setSortKey,
    setSortOrder,
    sortKey,
    sortOrder,
    totalPages,
    userId,
  } = useStores()

  const savedStoreIds = useQuery(
    api.savedStores.getSavedStoreIds,
    userId ? { clerk_id: userId } : 'skip'
  )
  const toggleSaved = useMutation(api.savedStores.toggleSavedStore)

  const handleToggleSave = async (storeKId: string) => {
    if (!userId) {
      toast.error('Faça login para salvar lojas.')
      return
    }
    const result = await toggleSaved({
      clerk_id: userId,
      store_k_id: storeKId,
    })
    if (result.saved) {
      toast.success('Loja salva!')
    } else {
      toast.success('Loja removida dos salvos.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-8 px-10 mx-auto max-w-[1400px]">
        <Breadcrumb
          description="Descubra as melhores lojas no TikTok Shop"
          title="Lojas"
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
          data={stores}
          isFreeUser={isFreeUser}
          placeholder="Procuar por uma loja ou produto..."
        />
        {isLoading ? (
          <StoreTableSkeleton rows={itemsPerPage} />
        ) : (
          <StoresTable
            currentPage={currentPage}
            items={stores}
            onPageChange={onPageChange}
            onToggleSave={handleToggleSave}
            savedStoreIds={savedStoreIds ?? []}
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
