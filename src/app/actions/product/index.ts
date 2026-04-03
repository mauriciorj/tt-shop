import { api } from '@/convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'
import { data as categories } from '@/hooks/useCategories'
import { IProductWithCategory } from '@/products/types'

export const getProductByName = async (name: string) => {
  const getProduct = await fetchQuery(api.products.getProductByName, { name })

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
}
