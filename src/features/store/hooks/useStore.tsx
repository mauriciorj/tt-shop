'use client'

import { useState, useMemo } from 'react'
import { api } from '@/convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import useCategories from '@/hooks/useCategories'
import { IStoreWithCategory } from '@/stores/types'
import { useQuery } from '@tanstack/react-query'

const useStore = () => {
  const [name, setName] = useState<string | null>(null)

  const { data: getStore, isLoading } = useQuery({
    ...convexQuery(api.stores.getStoreByName, {
      name: name || undefined,
    }),
  })

  // Get the categories from the database
  const { data: categories } = useCategories()

  const store = useMemo(() => {
    const getCategory = categories?.find(
      (category) => category.id === getStore?.category
    )?.label

    const storeWithCategory: IStoreWithCategory | null = getStore?.name
      ? {
          ...getStore,
          category: getCategory,
        }
      : null

    return storeWithCategory
  }, [name, getStore, categories])

  return { isLoading, setName, store }
}

export default useStore
