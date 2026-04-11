import VideoDto from '../video'
import { IVideo } from '@/types/index'

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeRawVideo = (overrides: Partial<IVideo> = {}): IVideo => ({
  _id: 'video_001' as any,
  _creationTime: 1700000000000,
  tt_account: '@testcreator',
  storage_id: 'https://example.com/thumb.jpg',
  description: 'Amazing product review',
  views: 1_250_000,
  duration: '0:45',
  k_id: 'vid_001',
  k_revenue: 35_000,
  k_sales: 800,
  main_category: '601450',
  transcription: 'This is the full transcription text.',
  created_at: '2024-01-01',
  updated_at: '2024-06-01',
  ...overrides,
})

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('VideoDto', () => {
  // NOTE: the constructor has a missing `return` after the null guard, so null /
  // undefined inputs fall through to getVideo(data!) with optional chaining,
  // producing an object of undefined fields rather than null.
  describe('null / undefined input', () => {
    it('produces a video object (not null) when data is null due to missing return', () => {
      const dto = new VideoDto(null)
      expect(dto.video).not.toBeNull()
    })

    it('produces a video object (not null) when data is undefined', () => {
      const dto = new VideoDto(undefined)
      expect(dto.video).not.toBeNull()
    })

    it('all fields are undefined when data is null', () => {
      const dto = new VideoDto(null)
      expect(dto.video).toEqual({
        tt_account: undefined,
        storage_id: undefined,
        description: undefined,
        views: undefined,
        duration: undefined,
        id: undefined,
        revenue: undefined,
        sales: undefined,
        transcription: undefined,
      })
    })

    it('all fields are undefined when data is undefined', () => {
      const dto = new VideoDto(undefined)
      expect(dto.video).toEqual({
        tt_account: undefined,
        storage_id: undefined,
        description: undefined,
        views: undefined,
        duration: undefined,
        id: undefined,
        revenue: undefined,
        sales: undefined,
        transcription: undefined,
      })
    })
  })

  describe('field mapping', () => {
    it('maps tt_account correctly', () => {
      const dto = new VideoDto(makeRawVideo({ tt_account: '@mycreator' }))
      expect(dto.video?.tt_account).toBe('@mycreator')
    })

    it('maps tt_account to undefined when absent', () => {
      const dto = new VideoDto(makeRawVideo({ tt_account: undefined }))
      expect(dto.video?.tt_account).toBeUndefined()
    })

    it('maps storage_id correctly', () => {
      const dto = new VideoDto(makeRawVideo({ storage_id: 'https://cdn.example.com/vid.jpg' }))
      expect(dto.video?.storage_id).toBe('https://cdn.example.com/vid.jpg')
    })

    it('maps storage_id to undefined when absent', () => {
      const dto = new VideoDto(makeRawVideo({ storage_id: undefined }))
      expect(dto.video?.storage_id).toBeUndefined()
    })

    it('maps description correctly', () => {
      const dto = new VideoDto(makeRawVideo({ description: 'Best product ever' }))
      expect(dto.video?.description).toBe('Best product ever')
    })

    it('maps views correctly', () => {
      const dto = new VideoDto(makeRawVideo({ views: 5_000_000 }))
      expect(dto.video?.views).toBe(5_000_000)
    })

    it('maps duration correctly', () => {
      const dto = new VideoDto(makeRawVideo({ duration: '1:23' }))
      expect(dto.video?.duration).toBe('1:23')
    })

    it('maps k_id to id', () => {
      const dto = new VideoDto(makeRawVideo({ k_id: 'vid_abc' }))
      expect(dto.video?.id).toBe('vid_abc')
    })

    it('maps k_revenue to revenue', () => {
      const dto = new VideoDto(makeRawVideo({ k_revenue: 78_000 }))
      expect(dto.video?.revenue).toBe(78_000)
    })

    it('maps k_sales to sales', () => {
      const dto = new VideoDto(makeRawVideo({ k_sales: 1_500 }))
      expect(dto.video?.sales).toBe(1_500)
    })

    it('maps sales to undefined when k_sales is absent', () => {
      const dto = new VideoDto(makeRawVideo({ k_sales: undefined }))
      expect(dto.video?.sales).toBeUndefined()
    })

    it('maps transcription correctly', () => {
      const dto = new VideoDto(makeRawVideo({ transcription: 'Full text here.' }))
      expect(dto.video?.transcription).toBe('Full text here.')
    })

    it('maps transcription to undefined when absent', () => {
      const dto = new VideoDto(makeRawVideo({ transcription: undefined }))
      expect(dto.video?.transcription).toBeUndefined()
    })
  })

  describe('fields not included in output', () => {
    it('does not include _id', () => {
      const dto = new VideoDto(makeRawVideo())
      expect(dto.video).not.toHaveProperty('_id')
    })

    it('does not include _creationTime', () => {
      const dto = new VideoDto(makeRawVideo())
      expect(dto.video).not.toHaveProperty('_creationTime')
    })

    it('does not include k_id (mapped to id)', () => {
      const dto = new VideoDto(makeRawVideo())
      expect(dto.video).not.toHaveProperty('k_id')
    })

    it('does not include k_revenue (mapped to revenue)', () => {
      const dto = new VideoDto(makeRawVideo())
      expect(dto.video).not.toHaveProperty('k_revenue')
    })

    it('does not include k_sales (mapped to sales)', () => {
      const dto = new VideoDto(makeRawVideo())
      expect(dto.video).not.toHaveProperty('k_sales')
    })

    it('does not include main_category', () => {
      const dto = new VideoDto(makeRawVideo())
      expect(dto.video).not.toHaveProperty('main_category')
    })

    it('does not include created_at', () => {
      const dto = new VideoDto(makeRawVideo())
      expect(dto.video).not.toHaveProperty('created_at')
    })

    it('does not include updated_at', () => {
      const dto = new VideoDto(makeRawVideo())
      expect(dto.video).not.toHaveProperty('updated_at')
    })
  })

  describe('getVideo method', () => {
    it('returns the same shape as the constructor sets on video', () => {
      const raw = makeRawVideo()
      const dto = new VideoDto(raw)
      expect(dto.video).toEqual(dto.getVideo(raw))
    })

    it('can be called independently and returns the mapped object', () => {
      const raw = makeRawVideo({ description: 'Direct call test', k_revenue: 1_234 })
      const dto = new VideoDto(raw)
      const result = dto.getVideo(raw)
      expect(result.description).toBe('Direct call test')
      expect(result.revenue).toBe(1_234)
    })
  })

  describe('full shape', () => {
    it('produces the expected output shape for a complete video', () => {
      const dto = new VideoDto(makeRawVideo())
      expect(dto.video).toEqual({
        tt_account: '@testcreator',
        storage_id: 'https://example.com/thumb.jpg',
        description: 'Amazing product review',
        views: 1_250_000,
        duration: '0:45',
        id: 'vid_001',
        revenue: 35_000,
        sales: 800,
        transcription: 'This is the full transcription text.',
      })
    })

    it('produces the expected shape when all optional fields are absent', () => {
      const dto = new VideoDto(
        makeRawVideo({
          tt_account: undefined,
          storage_id: undefined,
          k_sales: undefined,
          main_category: undefined,
          transcription: undefined,
          created_at: undefined,
          updated_at: undefined,
        })
      )
      expect(dto.video).toEqual({
        tt_account: undefined,
        storage_id: undefined,
        description: 'Amazing product review',
        views: 1_250_000,
        duration: '0:45',
        id: 'vid_001',
        revenue: 35_000,
        sales: undefined,
        transcription: undefined,
      })
    })
  })
})
