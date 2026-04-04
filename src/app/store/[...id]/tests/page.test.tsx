import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import StoreDetail from '../page'

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockPush = jest.fn()
const mockSetName = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: jest.fn(),
}))

// Factory mock — avoids ESM issues from the real hook loading Clerk/Convex
jest.mock('@/stores/hooks/useStore', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@/stores/components/storeNotFound', () => ({
  __esModule: true,
  default: () => <div data-testid="not-found-store" />,
}))

jest.mock('../loading', () => ({
  __esModule: true,
  default: () => <div data-testid="store-skeleton" />,
}))

jest.mock('@/stores/components/header', () => ({
  __esModule: true,
  default: ({ store }: { store: unknown }) => (
    <div data-testid="store-header">{(store as any)?.name}</div>
  ),
}))

jest.mock('@/stores/components/cardsStats', () => ({
  __esModule: true,
  default: () => <div data-testid="cards-stats" />,
}))

jest.mock('@/stores/components/lineChart', () => ({
  __esModule: true,
  default: () => <div data-testid="line-chart" />,
}))

jest.mock('@/components/productsTable', () => ({
  __esModule: true,
  default: () => <div data-testid="products-table" />,
}))

jest.mock('@/components/creatorsTable', () => ({
  __esModule: true,
  default: () => <div data-testid="creators-table" />,
}))

jest.mock('@/components/videosTable', () => ({
  __esModule: true,
  default: ({ isFreeUser, clerkId }: { isFreeUser: boolean; clerkId: string }) => (
    <div data-testid="videos-table" data-free={String(isFreeUser)} data-clerk={clerkId} />
  ),
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => <button onClick={onClick}>{children}</button>,
}))

jest.mock('lucide-react', () => ({
  ArrowLeft: () => <svg data-testid="arrow-left" />,
}))

// ─── Imports after mocks ──────────────────────────────────────────────────────

import useStore from '@/stores/hooks/useStore'
import { useParams } from 'next/navigation'

const mockUseStore = useStore as jest.Mock
const mockUseParams = useParams as jest.Mock

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeStore = (overrides = {}) => ({
  name: 'Test Store',
  category_id: '601450',
  category_name: 'Beleza',
  country: 'BR',
  type: 'marketplace',
  unit_price: 49.9,
  revenue: 85000,
  revenue_growth_rate: 12.5,
  revenue_history: [1000, 2000, 3000],
  sales: 3400,
  image: null,
  top_products: [],
  top_creators: [],
  top_videos: [],
  ...overrides,
})

const setupUseStore = (overrides = {}) =>
  mockUseStore.mockReturnValue({
    clerkId: 'user_123',
    isFreeUser: false,
    isLoading: false,
    store: null,
    setName: mockSetName,
    ...overrides,
  })

beforeEach(() => {
  jest.clearAllMocks()
  mockUseParams.mockReturnValue({ id: ['test-store'] })
  setupUseStore({ store: makeStore() })
})

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('StoreDetail page', () => {
  describe('setName on mount', () => {
    it('calls setName with the first id param on mount', () => {
      mockUseParams.mockReturnValue({ id: ['my-shop'] })
      render(<StoreDetail />)
      expect(mockSetName).toHaveBeenCalledWith('my-shop')
    })

    it('does not call setName when id is empty', () => {
      mockUseParams.mockReturnValue({ id: [] })
      render(<StoreDetail />)
      expect(mockSetName).not.toHaveBeenCalled()
    })

    it('does not call setName when id is undefined', () => {
      mockUseParams.mockReturnValue({})
      setupUseStore({ store: null, isLoading: false })
      render(<StoreDetail />)
      expect(mockSetName).not.toHaveBeenCalled()
    })
  })

  describe('not found state', () => {
    it('renders NotFoundStore when not loading and store is null', () => {
      setupUseStore({ isLoading: false, store: null })
      render(<StoreDetail />)
      expect(screen.getByTestId('not-found-store')).toBeInTheDocument()
    })

    it('does not render the main content when store is null', () => {
      setupUseStore({ isLoading: false, store: null })
      render(<StoreDetail />)
      expect(screen.queryByTestId('store-header')).not.toBeInTheDocument()
    })

    it('does not render NotFoundStore while loading', () => {
      setupUseStore({ isLoading: true, store: null })
      render(<StoreDetail />)
      expect(screen.queryByTestId('not-found-store')).not.toBeInTheDocument()
    })
  })

  describe('loading state', () => {
    it('renders the skeleton while loading', () => {
      setupUseStore({ isLoading: true, store: null })
      render(<StoreDetail />)
      expect(screen.getByTestId('store-skeleton')).toBeInTheDocument()
    })

    it('does not render store content while loading', () => {
      setupUseStore({ isLoading: true, store: null })
      render(<StoreDetail />)
      expect(screen.queryByTestId('store-header')).not.toBeInTheDocument()
    })

    it('renders the back button even while loading', () => {
      setupUseStore({ isLoading: true, store: null })
      render(<StoreDetail />)
      expect(screen.getByRole('button', { name: /Voltar para lojas/i })).toBeInTheDocument()
    })
  })

  describe('content state', () => {
    it('renders the Header with the store', () => {
      render(<StoreDetail />)
      expect(screen.getByTestId('store-header')).toBeInTheDocument()
    })

    it('renders the store name inside the Header', () => {
      setupUseStore({ store: makeStore({ name: 'My Shop' }) })
      render(<StoreDetail />)
      expect(screen.getByTestId('store-header')).toHaveTextContent('My Shop')
    })

    it('renders CardsStats', () => {
      render(<StoreDetail />)
      expect(screen.getByTestId('cards-stats')).toBeInTheDocument()
    })

    it('renders LineChart', () => {
      render(<StoreDetail />)
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    })

    it('renders ProductsTable', () => {
      render(<StoreDetail />)
      expect(screen.getByTestId('products-table')).toBeInTheDocument()
    })

    it('renders CreatorsTable', () => {
      render(<StoreDetail />)
      expect(screen.getByTestId('creators-table')).toBeInTheDocument()
    })

    it('renders VideosTable', () => {
      render(<StoreDetail />)
      expect(screen.getByTestId('videos-table')).toBeInTheDocument()
    })

    it('does not render the skeleton when store is loaded', () => {
      render(<StoreDetail />)
      expect(screen.queryByTestId('store-skeleton')).not.toBeInTheDocument()
    })
  })

  describe('VideosTable props', () => {
    it('passes isFreeUser to VideosTable', () => {
      setupUseStore({ store: makeStore(), isFreeUser: true })
      render(<StoreDetail />)
      expect(screen.getByTestId('videos-table')).toHaveAttribute('data-free', 'true')
    })

    it('passes clerkId to VideosTable', () => {
      setupUseStore({ store: makeStore(), clerkId: 'clerk_xyz' })
      render(<StoreDetail />)
      expect(screen.getByTestId('videos-table')).toHaveAttribute('data-clerk', 'clerk_xyz')
    })
  })

  describe('back button', () => {
    it('renders the back button', () => {
      render(<StoreDetail />)
      expect(screen.getByRole('button', { name: /Voltar para lojas/i })).toBeInTheDocument()
    })

    it('navigates to /stores when clicked', () => {
      render(<StoreDetail />)
      fireEvent.click(screen.getByRole('button', { name: /Voltar para lojas/i }))
      expect(mockPush).toHaveBeenCalledWith('/stores')
    })

    it('does not navigate before the button is clicked', () => {
      render(<StoreDetail />)
      expect(mockPush).not.toHaveBeenCalled()
    })
  })
})
