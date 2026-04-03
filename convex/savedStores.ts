import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import TopStoresDto from '@/stores/dtos/topStores'
import { IStoreWithCategory } from '@/stores/types'
import { data as categories } from '@/hooks/useCategories'

export const getSavedStoreIds = query({
  args: { clerk_id: v.string() },
  handler: async (ctx, { clerk_id }) => {
    const saved = await ctx.db
      .query('savedStores')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', clerk_id))
      .collect()
    return saved.map((s) => s.store_k_id)
  },
})

export const toggleSavedStore = mutation({
  args: { clerk_id: v.string(), store_k_id: v.string() },
  handler: async (ctx, { clerk_id, store_k_id }) => {
    const existing = await ctx.db
      .query('savedStores')
      .withIndex('by_clerk_id_store_k_id', (q) =>
        q.eq('clerk_id', clerk_id).eq('store_k_id', store_k_id)
      )
      .first()

    if (existing) {
      await ctx.db.delete(existing._id)
      return { saved: false }
    }

    await ctx.db.insert('savedStores', {
      clerk_id,
      store_k_id,
      created_at: new Date().toISOString(),
    })
    return { saved: true }
  },
})

export const getSavedStores = query({
  args: { clerk_id: v.string() },
  handler: async (ctx, { clerk_id }) => {
    const saved = await ctx.db
      .query('savedStores')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', clerk_id))
      .collect()

    const storeIds = saved.map((s) => s.store_k_id)

    const stores = await ctx.db.query('stores').collect()
    const filteredStores = stores.filter((s) => storeIds.includes(s.k_id))

    const resultsDto: { stores: IStoreWithCategory[] } = new TopStoresDto(
      filteredStores
    )

    const storesWithImages = await Promise.all(
      resultsDto.stores.map(async (store) => {
        store['image'] = store.image
          ? await ctx.storage.getUrl(store.image)
          : null
        return store
      })
    )

    const storesWithCategories = storesWithImages.map((store) => {
      store['category_name'] =
        categories.find((category) => category.id === store.category_id)
          ?.label || null
      return store
    })

    return storesWithCategories
  },
})
