'use client'

import { useState, useMemo } from 'react'
import { api } from '@/convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import { data as categories } from '@/hooks/useCategories'
import { useQuery } from '@tanstack/react-query'
import { IProductWithCategory } from '@/product/types'

const useProduct = () => {
  const [name, setName] = useState<string | null>(null)

  const { data: getProduct, isLoading } = useQuery({
    ...convexQuery(api.products.getProductByName, {
      name: name || undefined,
    }),
  })

  const product = useMemo(() => {
    const getCategory = categories?.find(
      (category) => category.id === getProduct?.category_id
    )?.label

    const storeWithCategory: IProductWithCategory | null = getProduct?.name
      ? {
          ...getProduct,
          category_name: getCategory,
        }
      : null

    return storeWithCategory
  }, [name, getProduct, categories])

  return { isLoading, setName, product }
}

export default useProduct
