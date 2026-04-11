import ProductDto from '../product'
import { IProduct } from '@/types/index'

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeRawProduct = (overrides: Partial<IProduct> = {}): IProduct => ({
  _id: 'product_001' as any,
  _creationTime: 1700000000000,
  country: 'BR',
  name: 'Wireless Earbuds',
  name_url: 'wireless-earbuds',
  storage_id: 'https://example.com/product.jpg',
  launch_date: '2024-01-01',
  product_rating: 4.5,
  main_category: '601450',
  second_category: '601451',
  third_category: '601452',
  unit_price: 29.99,
  k_id: 'prod_001',
  k_creator_conversion_ratio: 0.12,
  k_day_revenue: 1_500,
  k_day_sales: 50,
  k_revenue: 90_000,
  k_revenue_history: [10_000, 20_000, 30_000],
  k_revenue_history_14_days: [5_000, 10_000],
  k_revenue_history_7_days: [2_000, 4_000],
  k_revenue_growth_rate: 8.3,
  k_sales: 3_000,
  k_top_creators: ['creator_a', 'creator_b'],
  k_top_videos: ['vid_a', 'vid_b'],
  created_at: '2024-01-01',
  updated_at: '2024-06-01',
  ...overrides,
})

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ProductDto', () => {
  // NOTE: the constructor has a missing `return` after the null guard, so null /
  // undefined inputs fall through to getProduct(data!) with optional chaining,
  // producing an object of undefined fields rather than null.
  describe('null / undefined input', () => {
    it('produces a product object (not null) when data is null due to missing return', () => {
      const dto = new ProductDto(null)
      expect(dto.product).not.toBeNull()
    })

    it('produces a product object (not null) when data is undefined', () => {
      const dto = new ProductDto(undefined)
      expect(dto.product).not.toBeNull()
    })

    it('all fields are undefined when data is null', () => {
      const dto = new ProductDto(null)
      expect(dto.product).toEqual({
        name: undefined,
        storage_id: undefined,
        product_rating: undefined,
        unit_price: undefined,
        creator_conversion_ratio: undefined,
        day_revenue: undefined,
        day_sales: undefined,
        revenue: undefined,
        revenue_history: undefined,
        revenue_history_14_days: undefined,
        revenue_history_7_days: undefined,
        revenue_growth_rate: undefined,
        sales: undefined,
      })
    })

    it('all fields are undefined when data is undefined', () => {
      const dto = new ProductDto(undefined)
      expect(dto.product).toEqual({
        name: undefined,
        storage_id: undefined,
        product_rating: undefined,
        unit_price: undefined,
        creator_conversion_ratio: undefined,
        day_revenue: undefined,
        day_sales: undefined,
        revenue: undefined,
        revenue_history: undefined,
        revenue_history_14_days: undefined,
        revenue_history_7_days: undefined,
        revenue_growth_rate: undefined,
        sales: undefined,
      })
    })
  })

  describe('field mapping', () => {
    it('maps name correctly', () => {
      const dto = new ProductDto(makeRawProduct({ name: 'Smart Watch' }))
      expect(dto.product?.name).toBe('Smart Watch')
    })

    it('maps storage_id correctly', () => {
      const dto = new ProductDto(makeRawProduct({ storage_id: 'https://cdn.example.com/watch.jpg' }))
      expect(dto.product?.storage_id).toBe('https://cdn.example.com/watch.jpg')
    })

    it('maps storage_id to undefined when absent', () => {
      const dto = new ProductDto(makeRawProduct({ storage_id: undefined }))
      expect(dto.product?.storage_id).toBeUndefined()
    })

    it('maps product_rating correctly', () => {
      const dto = new ProductDto(makeRawProduct({ product_rating: 3.8 }))
      expect(dto.product?.product_rating).toBe(3.8)
    })

    it('maps unit_price correctly', () => {
      const dto = new ProductDto(makeRawProduct({ unit_price: 99.99 }))
      expect(dto.product?.unit_price).toBe(99.99)
    })

    it('maps k_creator_conversion_ratio to creator_conversion_ratio', () => {
      const dto = new ProductDto(makeRawProduct({ k_creator_conversion_ratio: 0.25 }))
      expect(dto.product?.creator_conversion_ratio).toBe(0.25)
    })

    it('maps k_day_revenue to day_revenue', () => {
      const dto = new ProductDto(makeRawProduct({ k_day_revenue: 2_000 }))
      expect(dto.product?.day_revenue).toBe(2_000)
    })

    it('maps day_revenue to undefined when k_day_revenue is absent', () => {
      const dto = new ProductDto(makeRawProduct({ k_day_revenue: undefined }))
      expect(dto.product?.day_revenue).toBeUndefined()
    })

    it('maps k_day_sales to day_sales', () => {
      const dto = new ProductDto(makeRawProduct({ k_day_sales: 75 }))
      expect(dto.product?.day_sales).toBe(75)
    })

    it('maps day_sales to undefined when k_day_sales is absent', () => {
      const dto = new ProductDto(makeRawProduct({ k_day_sales: undefined }))
      expect(dto.product?.day_sales).toBeUndefined()
    })

    it('maps k_revenue to revenue', () => {
      const dto = new ProductDto(makeRawProduct({ k_revenue: 120_000 }))
      expect(dto.product?.revenue).toBe(120_000)
    })

    it('maps k_revenue_history to revenue_history', () => {
      const dto = new ProductDto(makeRawProduct({ k_revenue_history: [1_000, 2_000, 3_000] }))
      expect(dto.product?.revenue_history).toEqual([1_000, 2_000, 3_000])
    })

    it('maps k_revenue_history_14_days to revenue_history_14_days', () => {
      const dto = new ProductDto(makeRawProduct({ k_revenue_history_14_days: [4_000, 8_000] }))
      expect(dto.product?.revenue_history_14_days).toEqual([4_000, 8_000])
    })

    it('maps revenue_history_14_days to undefined when absent', () => {
      const dto = new ProductDto(makeRawProduct({ k_revenue_history_14_days: undefined }))
      expect(dto.product?.revenue_history_14_days).toBeUndefined()
    })

    it('maps k_revenue_history_7_days to revenue_history_7_days', () => {
      const dto = new ProductDto(makeRawProduct({ k_revenue_history_7_days: [1_500, 3_000] }))
      expect(dto.product?.revenue_history_7_days).toEqual([1_500, 3_000])
    })

    it('maps revenue_history_7_days to undefined when absent', () => {
      const dto = new ProductDto(makeRawProduct({ k_revenue_history_7_days: undefined }))
      expect(dto.product?.revenue_history_7_days).toBeUndefined()
    })

    it('maps k_revenue_growth_rate to revenue_growth_rate', () => {
      const dto = new ProductDto(makeRawProduct({ k_revenue_growth_rate: -3.5 }))
      expect(dto.product?.revenue_growth_rate).toBe(-3.5)
    })

    it('maps k_sales to sales', () => {
      const dto = new ProductDto(makeRawProduct({ k_sales: 5_000 }))
      expect(dto.product?.sales).toBe(5_000)
    })
  })

  describe('fields not included in output', () => {
    it('does not include _id', () => {
      const dto = new ProductDto(makeRawProduct())
      expect(dto.product).not.toHaveProperty('_id')
    })

    it('does not include _creationTime', () => {
      const dto = new ProductDto(makeRawProduct())
      expect(dto.product).not.toHaveProperty('_creationTime')
    })

    it('does not include country', () => {
      const dto = new ProductDto(makeRawProduct())
      expect(dto.product).not.toHaveProperty('country')
    })

    it('does not include k_id', () => {
      const dto = new ProductDto(makeRawProduct())
      expect(dto.product).not.toHaveProperty('k_id')
    })

    it('does not include name_url', () => {
      const dto = new ProductDto(makeRawProduct({ name_url: 'wireless-earbuds' }))
      expect(dto.product).not.toHaveProperty('name_url')
    })

    it('does not include launch_date', () => {
      const dto = new ProductDto(makeRawProduct())
      expect(dto.product).not.toHaveProperty('launch_date')
    })

    it('does not include main_category', () => {
      const dto = new ProductDto(makeRawProduct())
      expect(dto.product).not.toHaveProperty('main_category')
    })

    it('does not include second_category', () => {
      const dto = new ProductDto(makeRawProduct())
      expect(dto.product).not.toHaveProperty('second_category')
    })

    it('does not include third_category', () => {
      const dto = new ProductDto(makeRawProduct())
      expect(dto.product).not.toHaveProperty('third_category')
    })

    it('does not include k_revenue (mapped to revenue)', () => {
      const dto = new ProductDto(makeRawProduct())
      expect(dto.product).not.toHaveProperty('k_revenue')
    })

    it('does not include k_sales (mapped to sales)', () => {
      const dto = new ProductDto(makeRawProduct())
      expect(dto.product).not.toHaveProperty('k_sales')
    })

    it('does not include k_top_creators', () => {
      const dto = new ProductDto(makeRawProduct())
      expect(dto.product).not.toHaveProperty('k_top_creators')
    })

    it('does not include k_top_videos', () => {
      const dto = new ProductDto(makeRawProduct())
      expect(dto.product).not.toHaveProperty('k_top_videos')
    })

    it('does not include created_at', () => {
      const dto = new ProductDto(makeRawProduct())
      expect(dto.product).not.toHaveProperty('created_at')
    })

    it('does not include updated_at', () => {
      const dto = new ProductDto(makeRawProduct())
      expect(dto.product).not.toHaveProperty('updated_at')
    })
  })

  describe('getProduct method', () => {
    it('returns the same shape as the constructor sets on product', () => {
      const raw = makeRawProduct()
      const dto = new ProductDto(raw)
      expect(dto.product).toEqual(dto.getProduct(raw))
    })

    it('can be called independently and returns the mapped object', () => {
      const raw = makeRawProduct({ name: 'Direct Call', k_revenue: 999 })
      const dto = new ProductDto(raw)
      const result = dto.getProduct(raw)
      expect(result.name).toBe('Direct Call')
      expect(result.revenue).toBe(999)
    })
  })

  describe('full shape', () => {
    it('produces the expected output shape for a complete product', () => {
      const dto = new ProductDto(makeRawProduct())
      expect(dto.product).toEqual({
        name: 'Wireless Earbuds',
        storage_id: 'https://example.com/product.jpg',
        product_rating: 4.5,
        unit_price: 29.99,
        creator_conversion_ratio: 0.12,
        day_revenue: 1_500,
        day_sales: 50,
        revenue: 90_000,
        revenue_history: [10_000, 20_000, 30_000],
        revenue_history_14_days: [5_000, 10_000],
        revenue_history_7_days: [2_000, 4_000],
        revenue_growth_rate: 8.3,
        sales: 3_000,
      })
    })

    it('produces the expected shape when all optional fields are absent', () => {
      const dto = new ProductDto(
        makeRawProduct({
          storage_id: undefined,
          name_url: undefined,
          second_category: undefined,
          third_category: undefined,
          k_day_revenue: undefined,
          k_day_sales: undefined,
          k_revenue_history_14_days: undefined,
          k_revenue_history_7_days: undefined,
          k_top_creators: undefined,
          k_top_videos: undefined,
          created_at: undefined,
          updated_at: undefined,
        })
      )
      expect(dto.product).toEqual({
        name: 'Wireless Earbuds',
        storage_id: undefined,
        product_rating: 4.5,
        unit_price: 29.99,
        creator_conversion_ratio: 0.12,
        day_revenue: undefined,
        day_sales: undefined,
        revenue: 90_000,
        revenue_history: [10_000, 20_000, 30_000],
        revenue_history_14_days: undefined,
        revenue_history_7_days: undefined,
        revenue_growth_rate: 8.3,
        sales: 3_000,
      })
    })
  })
})
