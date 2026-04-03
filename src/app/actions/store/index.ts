import { api } from '@/convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'
import { data as categories } from '@/hooks/useCategories'
import { IStoreWithCategory } from '@/stores/types'

export const getStoreByName = async (name: string) => {
  const getStore = await fetchQuery(api.stores.getStoreByName, { name })

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
}
