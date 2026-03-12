'use client'

import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Breadcrumb from '@/components/breadcrumb'
import Categories from '@/components/categories'
import SearchBar from '@/components/search'
import StoreTableSkeleton from '@/stores/components/storeTableSkeleton'
import StoresTable from '@/stores/components/storesTable'
import useStores from '@/stores/hooks/useStores'

const StoresContainer = () => {
  const { user } = useUser()
  const clerkId = user?.id ?? ''

  const savedStoreIds = useQuery(
    api.savedStores.getSavedStoreIds,
    clerkId ? { clerk_id: clerkId } : 'skip'
  )
  const toggleSaved = useMutation(api.savedStores.toggleSavedStore)

  const handleToggleSave = async (storeKId: string) => {
    if (!clerkId) {
      toast.error('Faça login para salvar lojas.')
      return
    }
    const result = await toggleSaved({
      clerk_id: clerkId,
      store_k_id: storeKId,
    })
    if (result.saved) {
      toast.success('Loja salva!')
    } else {
      toast.success('Loja removida dos salvos.')
    }
  }

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

export default StoresContainer
