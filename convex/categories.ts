import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const addCategory = mutation({
  args: {
    main_category_id: v.string(),
    main_category_name: v.string(),
    second_category_id: v.optional(v.string()),
    second_category_name: v.optional(v.string()),
    third_category_id: v.optional(v.string()),
    third_category_name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const queryResult = await ctx.db
      .query('categories')
      .filter((q) => q.eq(q.field('main_category_id'), args.main_category_id))
      .filter((q) =>
        q.eq(q.field('second_category_id'), args.second_category_id)
      )
      .filter((q) => q.eq(q.field('third_category_id'), args.third_category_id))
      .first()

    // Don't do anything if the category already exists
    if (!queryResult) {
      await ctx.db.insert('categories', {
        ...args,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
    }
  },
})

export const getCategories = query({
  handler: async (ctx) => {
    const categories = await ctx.db.query('categories').collect()
    const mainCategories = categories.map((c) => c.main_category_name)
    const uniqueMainCategories = new Set(mainCategories)

    const setToArray = Array.from(uniqueMainCategories)

    const mainCategoriesIds = await Promise.all(
      setToArray?.map(async (item) => {
        const categories = await ctx.db
          .query('categories')
          .filter((q) => q.eq(q.field('main_category_name'), item))
          .first()

        return {
          id: categories?.main_category_id,
          label: categories?.main_category_name,
        }
      })
    )

    return [{ id: 'all', label: 'Todas as categorias' }, ...mainCategoriesIds]
  },
})
