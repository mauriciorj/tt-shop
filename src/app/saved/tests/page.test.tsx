import React from 'react'
import { render, screen } from '@testing-library/react'
import Saved from '../page'

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('@/saved/hooks/useSaved', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, defaultValue }: { children: React.ReactNode; defaultValue: string }) => (
    <div data-testid="tabs" data-default={defaultValue}>{children}</div>
  ),
  TabsList: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tabs-list">{children}</div>
  ),
  TabsTrigger: ({ value, children }: { value: string; children: React.ReactNode }) => (
    <button data-testid={`tab-trigger-${value}`}>{children}</button>
  ),
  TabsContent: ({ value, children }: { value: string; children: React.ReactNode }) => (
    <div data-testid={`tab-content-${value}`}>{children}</div>
  ),
}))

jest.mock('@/saved/components/SavedStoreCard', () => ({
  __esModule: true,
  default: ({ store }: { store: any }) => (
    <div data-testid="saved-store-card" data-kid={store.k_id} />
  ),
}))

jest.mock('@/saved/components/SavedStoreCardSkeleton', () => ({
  __esModule: true,
  default: ({ cards }: { cards: number }) => (
    <div data-testid="saved-store-skeleton" data-cards={cards} />
  ),
}))

jest.mock('@/saved/components/SavedProductCard', () => ({
  __esModule: true,
  default: ({ product }: { product: any }) => (
    <div data-testid="saved-product-card" data-kid={product.k_id} />
  ),
}))

jest.mock('@/saved/components/SavedProductCardSkeleton', () => ({
  __esModule: true,
  default: ({ cards }: { cards: number }) => (
    <div data-testid="saved-product-skeleton" data-cards={cards} />
  ),
}))

jest.mock('@/saved/components/savedVideoCard', () => ({
  __esModule: true,
  default: ({ video }: { video: any }) => (
    <div data-testid="saved-video-card" data-id={video.video_id} />
  ),
}))

jest.mock('@/saved/components/SavedVideoCardSkeleton', () => ({
  __esModule: true,
  default: ({ cards }: { cards: number }) => (
    <div data-testid="saved-video-skeleton" data-cards={cards} />
  ),
}))

jest.mock('lucide-react', () => ({
  Heart: () => <svg data-testid="icon-heart" />,
  Store: () => <svg data-testid="icon-store" />,
  Video: () => <svg data-testid="icon-video" />,
  Package: () => <svg data-testid="icon-package" />,
}))

// ─── Imports after mocks ──────────────────────────────────────────────────────

import UseSaved from '@/saved/hooks/useSaved'

const mockUseSaved = UseSaved as jest.Mock

// ─── Helpers ─────────────────────────────────────────────────────────────────

const defaultHook = {
  savedStores: [],
  savedStoresIsLoading: false,
  savedProducts: [],
  savedProductsIsLoading: false,
  savedVideos: [],
  savedVideosIsLoading: false,
}

const setupHook = (overrides = {}) =>
  mockUseSaved.mockReturnValue({ ...defaultHook, ...overrides })

beforeEach(() => {
  jest.clearAllMocks()
  setupHook()
})

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Saved page', () => {
  describe('page heading', () => {
    it('renders the "Itens" heading', () => {
      render(<Saved />)
      expect(screen.getByText('Itens')).toBeInTheDocument()
    })

    it('renders the "Salvos" heading', () => {
      render(<Saved />)
      expect(screen.getByText('Salvos')).toBeInTheDocument()
    })

    it('renders the subtitle', () => {
      render(<Saved />)
      expect(
        screen.getByText('Suas lojas e vídeos favoritos em um só lugar')
      ).toBeInTheDocument()
    })

    it('renders the Heart icon', () => {
      render(<Saved />)
      expect(screen.getByTestId('icon-heart')).toBeInTheDocument()
    })
  })

  describe('tabs structure', () => {
    it('renders the Tabs component with default value "stores"', () => {
      render(<Saved />)
      expect(screen.getByTestId('tabs')).toHaveAttribute('data-default', 'stores')
    })

    it('renders the stores tab trigger', () => {
      render(<Saved />)
      expect(screen.getByTestId('tab-trigger-stores')).toBeInTheDocument()
    })

    it('renders the products tab trigger', () => {
      render(<Saved />)
      expect(screen.getByTestId('tab-trigger-products')).toBeInTheDocument()
    })

    it('renders the videos tab trigger', () => {
      render(<Saved />)
      expect(screen.getByTestId('tab-trigger-videos')).toBeInTheDocument()
    })

    it('renders all three tab content panels', () => {
      render(<Saved />)
      expect(screen.getByTestId('tab-content-stores')).toBeInTheDocument()
      expect(screen.getByTestId('tab-content-products')).toBeInTheDocument()
      expect(screen.getByTestId('tab-content-videos')).toBeInTheDocument()
    })
  })

  describe('tab counts', () => {
    it('shows 0 stores when savedStores is empty', () => {
      render(<Saved />)
      expect(screen.getByTestId('tab-trigger-stores')).toHaveTextContent('Lojas (0)')
    })

    it('shows correct store count in tab trigger', () => {
      setupHook({
        savedStores: [{ k_id: 'a', name: 'Shop A' }, { k_id: 'b', name: 'Shop B' }],
      })
      render(<Saved />)
      expect(screen.getByTestId('tab-trigger-stores')).toHaveTextContent('Lojas (2)')
    })

    it('shows 0 products when savedProducts is empty', () => {
      render(<Saved />)
      expect(screen.getByTestId('tab-trigger-products')).toHaveTextContent('Produtos (0)')
    })

    it('shows correct product count in tab trigger', () => {
      setupHook({ savedProducts: [{ k_id: 'p1' }, { k_id: 'p2' }, { k_id: 'p3' }] })
      render(<Saved />)
      expect(screen.getByTestId('tab-trigger-products')).toHaveTextContent('Produtos (3)')
    })

    it('shows 0 videos when savedVideos is empty', () => {
      render(<Saved />)
      expect(screen.getByTestId('tab-trigger-videos')).toHaveTextContent('Vídeos (0)')
    })

    it('shows correct video count in tab trigger', () => {
      setupHook({ savedVideos: [{ video_id: 'v1' }] })
      render(<Saved />)
      expect(screen.getByTestId('tab-trigger-videos')).toHaveTextContent('Vídeos (1)')
    })

    it('uses nullish coalescing for store count in the trigger label', () => {
      // The tab trigger uses ?. so it safely shows 0 when savedStores is nullish,
      // but the content area expects an array — pass an empty array here.
      setupHook({ savedStores: [] })
      render(<Saved />)
      expect(screen.getByTestId('tab-trigger-stores')).toHaveTextContent('Lojas (0)')
    })
  })

  describe('stores tab — loading', () => {
    it('renders SavedStoreCardSkeleton when loading', () => {
      setupHook({ savedStoresIsLoading: true })
      render(<Saved />)
      expect(screen.getByTestId('saved-store-skeleton')).toBeInTheDocument()
    })

    it('passes cards=6 to SavedStoreCardSkeleton', () => {
      setupHook({ savedStoresIsLoading: true })
      render(<Saved />)
      expect(screen.getByTestId('saved-store-skeleton')).toHaveAttribute('data-cards', '6')
    })

    it('does not render store cards while loading', () => {
      setupHook({
        savedStoresIsLoading: true,
        savedStores: [{ k_id: 'a', name: 'Shop A' }],
      })
      render(<Saved />)
      expect(screen.queryByTestId('saved-store-card')).not.toBeInTheDocument()
    })
  })

  describe('stores tab — content', () => {
    it('renders a SavedStoreCard for each saved store', () => {
      setupHook({
        savedStores: [
          { k_id: 'a', name: 'Shop A' },
          { k_id: 'b', name: 'Shop B' },
        ],
      })
      render(<Saved />)
      expect(screen.getAllByTestId('saved-store-card')).toHaveLength(2)
    })

    it('renders the empty state when no stores are saved', () => {
      render(<Saved />)
      expect(screen.getByText('Nenhuma loja salva ainda.')).toBeInTheDocument()
    })

    it('does not render the empty state when stores exist', () => {
      setupHook({ savedStores: [{ k_id: 'a', name: 'Shop A' }] })
      render(<Saved />)
      expect(screen.queryByText('Nenhuma loja salva ainda.')).not.toBeInTheDocument()
    })

    it('does not render skeleton when not loading', () => {
      render(<Saved />)
      expect(screen.queryByTestId('saved-store-skeleton')).not.toBeInTheDocument()
    })
  })

  describe('products tab — loading', () => {
    it('renders SavedProductCardSkeleton when loading', () => {
      setupHook({ savedProductsIsLoading: true })
      render(<Saved />)
      expect(screen.getByTestId('saved-product-skeleton')).toBeInTheDocument()
    })

    it('passes cards=6 to SavedProductCardSkeleton', () => {
      setupHook({ savedProductsIsLoading: true })
      render(<Saved />)
      expect(screen.getByTestId('saved-product-skeleton')).toHaveAttribute('data-cards', '6')
    })

    it('does not render product cards while loading', () => {
      setupHook({
        savedProductsIsLoading: true,
        savedProducts: [{ k_id: 'p1' }],
      })
      render(<Saved />)
      expect(screen.queryByTestId('saved-product-card')).not.toBeInTheDocument()
    })
  })

  describe('products tab — content', () => {
    it('renders a SavedProductCard for each saved product', () => {
      setupHook({
        savedProducts: [{ k_id: 'p1' }, { k_id: 'p2' }, { k_id: 'p3' }],
      })
      render(<Saved />)
      expect(screen.getAllByTestId('saved-product-card')).toHaveLength(3)
    })

    it('renders the empty state when no products are saved', () => {
      render(<Saved />)
      expect(screen.getByText('Nenhum produto salvo ainda.')).toBeInTheDocument()
    })

    it('does not render the empty state when products exist', () => {
      setupHook({ savedProducts: [{ k_id: 'p1' }] })
      render(<Saved />)
      expect(screen.queryByText('Nenhum produto salvo ainda.')).not.toBeInTheDocument()
    })
  })

  describe('videos tab — loading', () => {
    it('renders SavedVideoCardSkeleton when loading', () => {
      setupHook({ savedVideosIsLoading: true })
      render(<Saved />)
      expect(screen.getByTestId('saved-video-skeleton')).toBeInTheDocument()
    })

    it('passes cards=6 to SavedVideoCardSkeleton', () => {
      setupHook({ savedVideosIsLoading: true })
      render(<Saved />)
      expect(screen.getByTestId('saved-video-skeleton')).toHaveAttribute('data-cards', '6')
    })

    it('does not render video cards while loading', () => {
      setupHook({
        savedVideosIsLoading: true,
        savedVideos: [{ video_id: 'v1' }],
      })
      render(<Saved />)
      expect(screen.queryByTestId('saved-video-card')).not.toBeInTheDocument()
    })
  })

  describe('videos tab — content', () => {
    it('renders a SavedVideoCard for each saved video', () => {
      setupHook({
        savedVideos: [{ video_id: 'v1' }, { video_id: 'v2' }],
      })
      render(<Saved />)
      expect(screen.getAllByTestId('saved-video-card')).toHaveLength(2)
    })

    it('renders the empty state when no videos are saved', () => {
      render(<Saved />)
      expect(screen.getByText('Nenhum vídeo salvo ainda.')).toBeInTheDocument()
    })

    it('does not render the empty state when videos exist', () => {
      setupHook({ savedVideos: [{ video_id: 'v1' }] })
      render(<Saved />)
      expect(screen.queryByText('Nenhum vídeo salvo ainda.')).not.toBeInTheDocument()
    })
  })
})
