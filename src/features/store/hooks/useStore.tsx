'use client'

import { useState, useMemo } from 'react'
import { api } from '@/convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import { data as categories } from '@/hooks/useCategories'
import { IStoreWithCategory } from '@/stores/types'
import { useQuery } from '@tanstack/react-query'

const useStore = () => {
  const [name, setName] = useState<string | null>(null)

  const { data: getStore, isLoading } = useQuery({
    ...convexQuery(api.stores.getStoreByName, {
      name: name || undefined,
    }),
  })

  const store = useMemo(() => {
    const getCategory = categories?.find(
      (category) => category.id === getStore?.category_id
    )?.label

    const storeWithCategory: IStoreWithCategory | null = getStore?.name
      ? {
          ...getStore,
          category_name: getCategory,
        }
      : null

    return storeWithCategory
  }, [name, getStore, categories])

  return { isLoading, setName, store }
}

export default useStore
