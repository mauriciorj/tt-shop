import TopVideosDto from '../topVideosDto'
import { ITopVideos } from '@/videos/types'

const makeVideo = (overrides: Partial<ITopVideos> = {}): ITopVideos => ({
  _id: 'j57abc123' as any,
  _creationTime: 1711900000000,
  created_at: '2024-03-31T00:00:00.000Z',
  updated_at: '2024-04-01T00:00:00.000Z',
  description: 'Best product ever',
  duration: '1:23',
  k_id: 'vid_001',
  k_revenue: 9500,
  k_sales: 320,
  views: 2_000_000,
  main_category: '601450',
  storage_id: 'storage_abc',
  tt_account: '@seller',
  transcription: 'This is a transcription',
  k_revenue_7_days: 1200,
  k_revenue_14_days: 2400,
  ...overrides,
})

describe('TopVideosDto', () => {
  describe('constructor', () => {
    it('returns empty videos when given an empty array', () => {
      const dto = new TopVideosDto([])
      expect(dto.videos).toEqual([])
    })

    it('maps a single video correctly', () => {
      const dto = new TopVideosDto([makeVideo()])
      expect(dto.videos).toHaveLength(1)
    })

    it('maps multiple videos', () => {
      const dto = new TopVideosDto([makeVideo(), makeVideo({ k_id: 'vid_002' })])
      expect(dto.videos).toHaveLength(2)
    })
  })

  describe('field mapping', () => {
    it('maps k_revenue to revenue', () => {
      const dto = new TopVideosDto([makeVideo({ k_revenue: 5000 })])
      expect(dto.videos[0].revenue).toBe(5000)
    })

    it('maps k_sales to sales', () => {
      const dto = new TopVideosDto([makeVideo({ k_sales: 150 })])
      expect(dto.videos[0].sales).toBe(150)
    })

    it('maps k_id to video_id', () => {
      const dto = new TopVideosDto([makeVideo({ k_id: 'vid_xyz' })])
      expect(dto.videos[0].video_id).toBe('vid_xyz')
    })

    it('maps storage_id to image', () => {
      const dto = new TopVideosDto([makeVideo({ storage_id: 'storage_img_001' })])
      expect(dto.videos[0].image).toBe('storage_img_001')
    })

    it('maps main_category to category_id', () => {
      const dto = new TopVideosDto([makeVideo({ main_category: '601450' })])
      expect(dto.videos[0].category_id).toBe('601450')
    })

    it('maps k_revenue_7_days to revenue_7_days', () => {
      const dto = new TopVideosDto([makeVideo({ k_revenue_7_days: 800 })])
      expect(dto.videos[0].revenue_7_days).toBe(800)
    })

    it('maps k_revenue_14_days to revenue_14_days', () => {
      const dto = new TopVideosDto([makeVideo({ k_revenue_14_days: 1600 })])
      expect(dto.videos[0].revenue_14_days).toBe(1600)
    })

    it('passes through description, duration, views, tt_account, and transcription', () => {
      const dto = new TopVideosDto([
        makeVideo({
          description: 'Great video',
          duration: '0:30',
          views: 500_000,
          tt_account: '@creator',
          transcription: 'Hello world',
        }),
      ])
      const video = dto.videos[0]
      expect(video.description).toBe('Great video')
      expect(video.duration).toBe('0:30')
      expect(video.views).toBe(500_000)
      expect(video.tt_account).toBe('@creator')
      expect(video.transcription).toBe('Hello world')
    })
  })

  describe('optional fields', () => {
    it('sets category_id to null when main_category is undefined', () => {
      const dto = new TopVideosDto([makeVideo({ main_category: undefined })])
      expect(dto.videos[0].category_id).toBeNull()
    })

    it('sets category_id to null when main_category is null', () => {
      const dto = new TopVideosDto([makeVideo({ main_category: null })])
      expect(dto.videos[0].category_id).toBeNull()
    })

    it('sets image to undefined when storage_id is undefined', () => {
      const dto = new TopVideosDto([makeVideo({ storage_id: undefined })])
      expect(dto.videos[0].image).toBeUndefined()
    })

    it('sets revenue_7_days to undefined when k_revenue_7_days is missing', () => {
      const dto = new TopVideosDto([makeVideo({ k_revenue_7_days: undefined })])
      expect(dto.videos[0].revenue_7_days).toBeUndefined()
    })

    it('sets revenue_14_days to undefined when k_revenue_14_days is missing', () => {
      const dto = new TopVideosDto([makeVideo({ k_revenue_14_days: undefined })])
      expect(dto.videos[0].revenue_14_days).toBeUndefined()
    })

    it('sets tt_account to undefined when not provided', () => {
      const dto = new TopVideosDto([makeVideo({ tt_account: undefined })])
      expect(dto.videos[0].tt_account).toBeUndefined()
    })

    it('sets transcription to undefined when not provided', () => {
      const dto = new TopVideosDto([makeVideo({ transcription: undefined })])
      expect(dto.videos[0].transcription).toBeUndefined()
    })
  })

  describe('internal Convex fields removal', () => {
    it('does not include _id in the output', () => {
      const dto = new TopVideosDto([makeVideo()])
      expect(dto.videos[0]).not.toHaveProperty('_id')
    })

    it('does not include _creationTime in the output', () => {
      const dto = new TopVideosDto([makeVideo()])
      expect(dto.videos[0]).not.toHaveProperty('_creationTime')
    })

    it('does not include created_at in the output', () => {
      const dto = new TopVideosDto([makeVideo()])
      expect(dto.videos[0]).not.toHaveProperty('created_at')
    })

    it('does not include updated_at in the output', () => {
      const dto = new TopVideosDto([makeVideo()])
      expect(dto.videos[0]).not.toHaveProperty('updated_at')
    })
  })
})
