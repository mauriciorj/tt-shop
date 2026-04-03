import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import TopProductsDto from '@/products/dtos/topProducts'
import { IProductWithCategory } from '@/products/types'
import { data as categories } from '@/hooks/useCategories'

export const getSavedProductIds = query({
  args: { clerk_id: v.string() },
  handler: async (ctx, { clerk_id }) => {
    const saved = await ctx.db
      .query('savedProducts')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', clerk_id))
      .collect()
    return saved.map((s) => s.product_k_id)
  },
})

export const toggleSavedProduct = mutation({
  args: { clerk_id: v.string(), product_k_id: v.string() },
  handler: async (ctx, { clerk_id, product_k_id }) => {
    const existing = await ctx.db
      .query('savedProducts')
      .withIndex('by_clerk_id_product_k_id', (q) =>
        q.eq('clerk_id', clerk_id).eq('product_k_id', product_k_id)
      )
      .first()

    if (existing) {
      await ctx.db.delete(existing._id)
      return { saved: false }
    }

    await ctx.db.insert('savedProducts', {
      clerk_id,
      product_k_id,
      created_at: new Date().toISOString(),
    })
    return { saved: true }
  },
})

export const getSavedProducts = query({
  args: { clerk_id: v.string() },
  handler: async (ctx, { clerk_id }) => {
    const saved = await ctx.db
      .query('savedProducts')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', clerk_id))
      .collect()

    const productIds = saved.map((s) => s.product_k_id)

    const products = await ctx.db.query('products').collect()
    const filteredProducts = products.filter((p) => productIds.includes(p.k_id))

    const resultsDto: { products: IProductWithCategory[] } = new TopProductsDto(
      filteredProducts
    )

    const productsWithImages = await Promise.all(
      resultsDto.products.map(async (product) => {
        product['image'] = product.image
          ? await ctx.storage.getUrl(product.image)
          : null
        return product
      })
    )

    const productsWithCategories = productsWithImages.map((product) => {
      product['category_name'] =
        categories.find((category) => category.id === product.category_id)
          ?.label || null
      return product
    })

    return productsWithCategories
  },
})
