import TopStoresDto from '../topStores'
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
describe('TopStoresDto', () => {
  describe('null / undefined / empty guard', () => {
    it('sets stores to [] when data is null', () => {
      const dto = new TopStoresDto(null)
      expect(dto.stores).toEqual([])
    })

    it('sets stores to [] when data is undefined', () => {
      const dto = new TopStoresDto(undefined)
      expect(dto.stores).toEqual([])
    })

    it('sets stores to [] when data is an empty array', () => {
      const dto = new TopStoresDto([])
      expect(dto.stores).toEqual([])
    })
  })

  describe('field mapping', () => {
    it('maps country correctly', () => {
      const dto = new TopStoresDto([makeRawStore({ country: 'US' })])
      expect(dto.stores[0].country).toBe('US')
    })

    it('maps main_category to category_id', () => {
      const dto = new TopStoresDto([makeRawStore({ main_category: '999' })])
      expect(dto.stores[0].category_id).toBe('999')
    })

    it('maps k_id to k_id', () => {
      const dto = new TopStoresDto([makeRawStore({ k_id: 'store_abc' })])
      expect(dto.stores[0].k_id).toBe('store_abc')
    })

    it('maps name correctly', () => {
      const dto = new TopStoresDto([makeRawStore({ name: 'Cool Shop' })])
      expect(dto.stores[0].name).toBe('Cool Shop')
    })

    it('maps storage_id to image', () => {
      const dto = new TopStoresDto([makeRawStore({ storage_id: 'https://cdn.example.com/shop.jpg' })])
      expect(dto.stores[0].image).toBe('https://cdn.example.com/shop.jpg')
    })

    it('maps image to undefined when storage_id is undefined', () => {
      const dto = new TopStoresDto([makeRawStore({ storage_id: undefined })])
      expect(dto.stores[0].image).toBeUndefined()
    })

    it('maps type correctly', () => {
      const dto = new TopStoresDto([makeRawStore({ type: 'brand' })])
      expect(dto.stores[0].type).toBe('brand')
    })

    it('maps unit_price correctly', () => {
      const dto = new TopStoresDto([makeRawStore({ unit_price: 29.99 })])
      expect(dto.stores[0].unit_price).toBe(29.99)
    })

    it('maps k_revenue to revenue', () => {
      const dto = new TopStoresDto([makeRawStore({ k_revenue: 99999 })])
      expect(dto.stores[0].revenue).toBe(99999)
    })

    it('maps k_revenue_7_days to revenue_7_days', () => {
      const dto = new TopStoresDto([makeRawStore({ k_revenue_7_days: 15000 })])
      expect(dto.stores[0].revenue_7_days).toBe(15000)
    })

    it('maps k_revenue_14_days to revenue_14_days', () => {
      const dto = new TopStoresDto([makeRawStore({ k_revenue_14_days: 30000 })])
      expect(dto.stores[0].revenue_14_days).toBe(30000)
    })

    it('maps k_revenue_growth_rate to revenue_growth_rate', () => {
      const dto = new TopStoresDto([makeRawStore({ k_revenue_growth_rate: -5.2 })])
      expect(dto.stores[0].revenue_growth_rate).toBe(-5.2)
    })

    it('maps k_revenue_history to revenue_history', () => {
      const dto = new TopStoresDto([makeRawStore({ k_revenue_history: [100, 200, 300] })])
      expect(dto.stores[0].revenue_history).toEqual([100, 200, 300])
    })

    it('maps k_sales to sales', () => {
      const dto = new TopStoresDto([makeRawStore({ k_sales: 7800 })])
      expect(dto.stores[0].sales).toBe(7800)
    })
  })

  describe('fields stripped from output', () => {
    it('does not include _id in the output', () => {
      const dto = new TopStoresDto([makeRawStore()])
      expect(dto.stores[0]).not.toHaveProperty('_id')
    })

    it('does not include _creationTime in the output', () => {
      const dto = new TopStoresDto([makeRawStore()])
      expect(dto.stores[0]).not.toHaveProperty('_creationTime')
    })

    it('does not include created_at in the output', () => {
      const dto = new TopStoresDto([makeRawStore()])
      expect(dto.stores[0]).not.toHaveProperty('created_at')
    })

    it('does not include k_day_sales in the output', () => {
      const dto = new TopStoresDto([makeRawStore()])
      expect(dto.stores[0]).not.toHaveProperty('k_day_sales')
    })

    it('does not include k_day_revenue in the output', () => {
      const dto = new TopStoresDto([makeRawStore()])
      expect(dto.stores[0]).not.toHaveProperty('k_day_revenue')
    })

    it('does not include k_top_creators in the output', () => {
      const dto = new TopStoresDto([makeRawStore()])
      expect(dto.stores[0]).not.toHaveProperty('k_top_creators')
    })

    it('does not include k_top_products in the output', () => {
      const dto = new TopStoresDto([makeRawStore()])
      expect(dto.stores[0]).not.toHaveProperty('k_top_products')
    })

    it('does not include k_top_videos in the output', () => {
      const dto = new TopStoresDto([makeRawStore()])
      expect(dto.stores[0]).not.toHaveProperty('k_top_videos')
    })

    it('does not include second_category in the output', () => {
      const dto = new TopStoresDto([makeRawStore()])
      expect(dto.stores[0]).not.toHaveProperty('second_category')
    })

    it('does not include third_category in the output', () => {
      const dto = new TopStoresDto([makeRawStore()])
      expect(dto.stores[0]).not.toHaveProperty('third_category')
    })

    it('does not include updated_at in the output', () => {
      const dto = new TopStoresDto([makeRawStore()])
      expect(dto.stores[0]).not.toHaveProperty('updated_at')
    })
  })

  describe('multiple items', () => {
    it('maps all items in the array', () => {
      const dto = new TopStoresDto([
        makeRawStore({ k_id: 'store_001', name: 'Shop A' }),
        makeRawStore({ k_id: 'store_002', name: 'Shop B' }),
        makeRawStore({ k_id: 'store_003', name: 'Shop C' }),
      ])
      expect(dto.stores).toHaveLength(3)
      expect(dto.stores[0].name).toBe('Shop A')
      expect(dto.stores[1].name).toBe('Shop B')
      expect(dto.stores[2].name).toBe('Shop C')
    })

    it('preserves order of items', () => {
      const dto = new TopStoresDto([
        makeRawStore({ k_id: 'z' }),
        makeRawStore({ k_id: 'a' }),
        makeRawStore({ k_id: 'm' }),
      ])
      expect(dto.stores.map((s) => s.k_id)).toEqual(['z', 'a', 'm'])
    })
  })

  describe('full shape', () => {
    it('produces the expected output shape for a complete store', () => {
      const raw = makeRawStore()
      const dto = new TopStoresDto([raw])
      expect(dto.stores[0]).toEqual({
        country: 'BR',
        category_id: '601450',
        k_id: 'store_001',
        name: 'Test Store',
        image: 'https://example.com/img.jpg',
        type: 'marketplace',
        unit_price: 49.9,
        revenue: 85000,
        revenue_7_days: 20000,
        revenue_14_days: 40000,
        revenue_growth_rate: 12.5,
        revenue_history: [1000, 2000, 3000],
        sales: 3400,
      })
    })
  })
})
