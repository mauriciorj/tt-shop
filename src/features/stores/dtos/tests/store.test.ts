import StoreDto from '../store'
import { IStore } from '@/stores/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────
const makeRawStore = (overrides: Partial<IStore> = {}): IStore => ({
  _id: 'convex_id_001' as any,
  _creationTime: 1700000000000,
  country: 'BR',
  created_at: '2024-01-01',
  k_day_revenue: 500,
  k_day_sales: 10,
  k_id: 'store_001',
  k_revenue: 85000,
  k_revenue_7_days: 20000,
  k_revenue_14_days: 40000,
  k_revenue_growth_rate: 12.5,
  k_revenue_history: [1000, 2000, 3000],
  k_sales: 3400,
  k_top_creators: ['creator_a', 'creator_b'],
  k_top_products: ['prod_a', 'prod_b'],
  k_top_videos: ['vid_a', 'vid_b'],
  main_category: '601450',
  name: 'Test Store',
  second_category: '601451',
  storage_id: 'https://example.com/img.jpg',
  third_category: '601452',
  type: 'marketplace',
  unit_price: 49.9,
  updated_at: '2024-06-01',
  ...overrides,
})

// ─── Tests ───────────────────────────────────────────────────────────────────
describe('StoreDto', () => {
  describe('null / undefined guard', () => {
    it('sets store to null when data is null', () => {
      const dto = new StoreDto(null)
      expect(dto.store).toBeNull()
    })

    it('sets store to null when data is undefined', () => {
      const dto = new StoreDto(undefined)
      expect(dto.store).toBeNull()
    })
  })

  describe('field mapping', () => {
    it('maps country correctly', () => {
      const dto = new StoreDto(makeRawStore({ country: 'US' }))
      expect(dto.store?.country).toBe('US')
    })

    it('maps main_category to category_id', () => {
      const dto = new StoreDto(makeRawStore({ main_category: '999' }))
      expect(dto.store?.category_id).toBe('999')
    })

    it('maps name correctly', () => {
      const dto = new StoreDto(makeRawStore({ name: 'My Shop' }))
      expect(dto.store?.name).toBe('My Shop')
    })

    it('maps storage_id to image', () => {
      const dto = new StoreDto(makeRawStore({ storage_id: 'https://cdn.example.com/shop.jpg' }))
      expect(dto.store?.image).toBe('https://cdn.example.com/shop.jpg')
    })

    it('maps image to undefined when storage_id is undefined', () => {
      const dto = new StoreDto(makeRawStore({ storage_id: undefined }))
      expect(dto.store?.image).toBeUndefined()
    })

    it('maps type correctly', () => {
      const dto = new StoreDto(makeRawStore({ type: 'brand' }))
      expect(dto.store?.type).toBe('brand')
    })

    it('maps unit_price correctly', () => {
      const dto = new StoreDto(makeRawStore({ unit_price: 99.99 }))
      expect(dto.store?.unit_price).toBe(99.99)
    })

    it('maps k_revenue to revenue', () => {
      const dto = new StoreDto(makeRawStore({ k_revenue: 123456 }))
      expect(dto.store?.revenue).toBe(123456)
    })

    it('maps k_revenue_growth_rate to revenue_growth_rate', () => {
      const dto = new StoreDto(makeRawStore({ k_revenue_growth_rate: -3.7 }))
      expect(dto.store?.revenue_growth_rate).toBe(-3.7)
    })

    it('maps k_revenue_history to revenue_history', () => {
      const dto = new StoreDto(makeRawStore({ k_revenue_history: [100, 200, 300] }))
      expect(dto.store?.revenue_history).toEqual([100, 200, 300])
    })

    it('maps k_sales to sales', () => {
      const dto = new StoreDto(makeRawStore({ k_sales: 7800 }))
      expect(dto.store?.sales).toBe(7800)
    })
  })

  describe('optional array fields with fallback', () => {
    it('maps k_top_creators to top_creators', () => {
      const dto = new StoreDto(makeRawStore({ k_top_creators: ['c1', 'c2'] }))
      expect(dto.store?.top_creators).toEqual(['c1', 'c2'])
    })

    it('defaults top_creators to [] when k_top_creators is undefined', () => {
      const dto = new StoreDto(makeRawStore({ k_top_creators: undefined }))
      expect(dto.store?.top_creators).toEqual([])
    })

    it('maps k_top_products to top_products', () => {
      const dto = new StoreDto(makeRawStore({ k_top_products: ['p1', 'p2'] }))
      expect(dto.store?.top_products).toEqual(['p1', 'p2'])
    })

    it('defaults top_products to [] when k_top_products is undefined', () => {
      const dto = new StoreDto(makeRawStore({ k_top_products: undefined }))
      expect(dto.store?.top_products).toEqual([])
    })

    it('maps k_top_videos to top_videos', () => {
      const dto = new StoreDto(makeRawStore({ k_top_videos: ['v1', 'v2'] }))
      expect(dto.store?.top_videos).toEqual(['v1', 'v2'])
    })

    it('defaults top_videos to [] when k_top_videos is undefined', () => {
      const dto = new StoreDto(makeRawStore({ k_top_videos: undefined }))
      expect(dto.store?.top_videos).toEqual([])
    })
  })

  describe('fields stripped from output', () => {
    it('does not include _id in the output', () => {
      const dto = new StoreDto(makeRawStore())
      expect(dto.store).not.toHaveProperty('_id')
    })

    it('does not include _creationTime in the output', () => {
      const dto = new StoreDto(makeRawStore())
      expect(dto.store).not.toHaveProperty('_creationTime')
    })

    it('does not include created_at in the output', () => {
      const dto = new StoreDto(makeRawStore())
      expect(dto.store).not.toHaveProperty('created_at')
    })

    it('does not include k_day_sales in the output', () => {
      const dto = new StoreDto(makeRawStore())
      expect(dto.store).not.toHaveProperty('k_day_sales')
    })

    it('does not include k_day_revenue in the output', () => {
      const dto = new StoreDto(makeRawStore())
      expect(dto.store).not.toHaveProperty('k_day_revenue')
    })

    it('does not include k_id in the output', () => {
      const dto = new StoreDto(makeRawStore())
      expect(dto.store).not.toHaveProperty('k_id')
    })

    it('does not include second_category in the output', () => {
      const dto = new StoreDto(makeRawStore())
      expect(dto.store).not.toHaveProperty('second_category')
    })

    it('does not include third_category in the output', () => {
      const dto = new StoreDto(makeRawStore())
      expect(dto.store).not.toHaveProperty('third_category')
    })

    it('does not include updated_at in the output', () => {
      const dto = new StoreDto(makeRawStore())
      expect(dto.store).not.toHaveProperty('updated_at')
    })
  })

  describe('full shape', () => {
    it('produces the expected output shape for a complete store', () => {
      const raw = makeRawStore()
      const dto = new StoreDto(raw)
      expect(dto.store).toEqual({
        country: 'BR',
        category_id: '601450',
        name: 'Test Store',
        image: 'https://example.com/img.jpg',
        type: 'marketplace',
        unit_price: 49.9,
        revenue: 85000,
        revenue_growth_rate: 12.5,
        revenue_history: [1000, 2000, 3000],
        sales: 3400,
        top_creators: ['creator_a', 'creator_b'],
        top_products: ['prod_a', 'prod_b'],
        top_videos: ['vid_a', 'vid_b'],
      })
    })
  })
})
