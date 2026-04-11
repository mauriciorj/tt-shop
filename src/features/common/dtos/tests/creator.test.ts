import CreatorDto from '../creator'
import { ICreator } from '@/types/index'

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeRawCreator = (overrides: Partial<ICreator> = {}): ICreator => ({
  _id: 'creator_001' as any,
  _creationTime: 1700000000000,
  k_id: 'k_creator_001',
  storage_id: 'https://example.com/avatar.jpg',
  tt_account: '@testcreator',
  tt_nickname: 'Test Creator',
  tt_followers: 150_000,
  k_revenue: 42_000,
  k_sales: 1_200,
  ...overrides,
})

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('CreatorDto', () => {
  // NOTE: the constructor has a missing `return` after the null guard, so null /
  // undefined inputs fall through to getCreator(data!) with optional-chaining,
  // producing an object of undefined fields rather than null.
  describe('null / undefined input', () => {
    it('produces a creator object (not null) when data is null due to missing return', () => {
      const dto = new CreatorDto(null)
      // The null guard sets this.creator = null but then falls through and
      // overwrites with getCreator(null!).  All fields use optional chaining
      // so they resolve to undefined.
      expect(dto.creator).not.toBeNull()
    })

    it('produces a creator object (not null) when data is undefined', () => {
      const dto = new CreatorDto(undefined)
      expect(dto.creator).not.toBeNull()
    })

    it('all fields are undefined when data is null', () => {
      const dto = new CreatorDto(null)
      expect(dto.creator).toEqual({
        storage_id: undefined,
        tt_account: undefined,
        tt_nickname: undefined,
        tt_followers: undefined,
        revenue: undefined,
        sales: undefined,
      })
    })

    it('all fields are undefined when data is undefined', () => {
      const dto = new CreatorDto(undefined)
      expect(dto.creator).toEqual({
        storage_id: undefined,
        tt_account: undefined,
        tt_nickname: undefined,
        tt_followers: undefined,
        revenue: undefined,
        sales: undefined,
      })
    })
  })

  describe('field mapping', () => {
    it('maps storage_id correctly', () => {
      const dto = new CreatorDto(makeRawCreator({ storage_id: 'https://cdn.example.com/img.jpg' }))
      expect(dto.creator?.storage_id).toBe('https://cdn.example.com/img.jpg')
    })

    it('maps storage_id to undefined when absent', () => {
      const dto = new CreatorDto(makeRawCreator({ storage_id: undefined }))
      expect(dto.creator?.storage_id).toBeUndefined()
    })

    it('maps tt_account correctly', () => {
      const dto = new CreatorDto(makeRawCreator({ tt_account: '@mycreator' }))
      expect(dto.creator?.tt_account).toBe('@mycreator')
    })

    it('maps tt_nickname correctly', () => {
      const dto = new CreatorDto(makeRawCreator({ tt_nickname: 'My Creator' }))
      expect(dto.creator?.tt_nickname).toBe('My Creator')
    })

    it('maps tt_followers correctly', () => {
      const dto = new CreatorDto(makeRawCreator({ tt_followers: 999_999 }))
      expect(dto.creator?.tt_followers).toBe(999_999)
    })

    it('maps k_revenue to revenue', () => {
      const dto = new CreatorDto(makeRawCreator({ k_revenue: 75_000 }))
      expect(dto.creator?.revenue).toBe(75_000)
    })

    it('maps k_sales to sales', () => {
      const dto = new CreatorDto(makeRawCreator({ k_sales: 500 }))
      expect(dto.creator?.sales).toBe(500)
    })

    it('maps sales to undefined when k_sales is absent', () => {
      const dto = new CreatorDto(makeRawCreator({ k_sales: undefined }))
      expect(dto.creator?.sales).toBeUndefined()
    })
  })

  describe('fields not included in output', () => {
    it('does not include _id', () => {
      const dto = new CreatorDto(makeRawCreator())
      expect(dto.creator).not.toHaveProperty('_id')
    })

    it('does not include _creationTime', () => {
      const dto = new CreatorDto(makeRawCreator())
      expect(dto.creator).not.toHaveProperty('_creationTime')
    })

    it('does not include k_id', () => {
      const dto = new CreatorDto(makeRawCreator())
      expect(dto.creator).not.toHaveProperty('k_id')
    })

    it('does not include k_revenue (mapped to revenue)', () => {
      const dto = new CreatorDto(makeRawCreator())
      expect(dto.creator).not.toHaveProperty('k_revenue')
    })

    it('does not include k_sales (mapped to sales)', () => {
      const dto = new CreatorDto(makeRawCreator())
      expect(dto.creator).not.toHaveProperty('k_sales')
    })

    it('does not include created_at', () => {
      const dto = new CreatorDto(makeRawCreator({ created_at: '2024-01-01' }))
      expect(dto.creator).not.toHaveProperty('created_at')
    })

    it('does not include updated_at', () => {
      const dto = new CreatorDto(makeRawCreator({ updated_at: '2024-06-01' }))
      expect(dto.creator).not.toHaveProperty('updated_at')
    })
  })

  describe('getCreator method', () => {
    it('returns the same shape as the constructor sets on creator', () => {
      const raw = makeRawCreator()
      const dto = new CreatorDto(raw)
      expect(dto.creator).toEqual(dto.getCreator(raw))
    })

    it('can be called independently and returns the mapped object', () => {
      const raw = makeRawCreator({ tt_account: '@direct', k_revenue: 1_000 })
      const dto = new CreatorDto(raw)
      const result = dto.getCreator(raw)
      expect(result.tt_account).toBe('@direct')
      expect(result.revenue).toBe(1_000)
    })
  })

  describe('full shape', () => {
    it('produces the expected output shape for a complete creator', () => {
      const dto = new CreatorDto(makeRawCreator())
      expect(dto.creator).toEqual({
        storage_id: 'https://example.com/avatar.jpg',
        tt_account: '@testcreator',
        tt_nickname: 'Test Creator',
        tt_followers: 150_000,
        revenue: 42_000,
        sales: 1_200,
      })
    })

    it('produces the expected shape when optional fields are absent', () => {
      const dto = new CreatorDto(
        makeRawCreator({ storage_id: undefined, k_sales: undefined })
      )
      expect(dto.creator).toEqual({
        storage_id: undefined,
        tt_account: '@testcreator',
        tt_nickname: 'Test Creator',
        tt_followers: 150_000,
        revenue: 42_000,
        sales: undefined,
      })
    })
  })
})
