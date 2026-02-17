'use client'

import { useState, useMemo } from 'react'
import { api } from '@/convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import useCategories from '@/hooks/useCategories'
import { IProductWithCategory } from '@/products/types'
import { useQuery } from '@tanstack/react-query'

const useProduct = () => {
  const [name, setName] = useState<string | null>(null)

  const { data: getProduct, isLoading } = useQuery({
    ...convexQuery(api.products.getProductByName, {
      name: name || undefined,
    }),
  })

  // Get the categories from the database
  const { data: categories } = useCategories()

  const product = useMemo(() => {
    const getCategory = categories?.find(
      (category) => category.id === getProduct?.category
    )?.label

    const productWithCategory: IProductWithCategory | null = getProduct?.name
      ? {
          ...getProduct,
          category: getCategory,
        }
      : null

    return productWithCategory
  }, [name, getProduct, categories])

  return { isLoading, setName, product }
}

export default useProduct
