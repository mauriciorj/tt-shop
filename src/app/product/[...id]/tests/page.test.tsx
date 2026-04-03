import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ProductDetail from '../page'

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockPush = jest.fn()
const mockSetName = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: jest.fn(),
}))

jest.mock('@/src/features/products/hooks/useProduct', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@/hooks/useUser', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('../loading', () => ({
  __esModule: true,
  default: () => <div data-testid="product-skeleton" />,
}))

jest.mock('@/src/features/products/components/notFoundProduct', () => ({
  __esModule: true,
  default: () => <div data-testid="not-found-product" />,
}))

jest.mock('@/src/features/products/components/header', () => ({
  __esModule: true,
  default: ({ product }: { product: unknown }) => (
    <div data-testid="product-header">{(product as any)?.name}</div>
  ),
}))

jest.mock('@/src/features/products/components/cardsStats', () => ({
  __esModule: true,
  default: () => <div data-testid="cards-stats" />,
}))

jest.mock('@/src/features/products/components/lineChart', () => ({
  __esModule: true,
  default: () => <div data-testid="line-chart" />,
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

import useProduct from '@/src/features/products/hooks/useProduct'
import UseUser from '@/hooks/useUser'
import { useParams } from 'next/navigation'

const mockUseProduct = useProduct as jest.Mock
const mockUseUser = UseUser as jest.Mock
const mockUseParams = useParams as jest.Mock

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeProduct = (overrides = {}) => ({
  name: 'Test Product',
  category_id: '601450',
  category_name: 'Beleza',
  country: 'BR',
  unit_price: 49.9,
  revenue: 85000,
  revenue_growth_rate: 12.5,
  revenue_history: [1000, 2000, 3000],
  sales: 3400,
  image: null,
  top_creators: [],
  top_videos: [],
  ...overrides,
})

const setupUseProduct = (overrides = {}) =>
  mockUseProduct.mockReturnValue({
    isLoading: false,
    product: null,
    setName: mockSetName,
    ...overrides,
  })

const setupUseUser = (overrides = {}) =>
  mockUseUser.mockReturnValue({
    isFreeUser: false,
    id: 'user_123',
    ...overrides,
  })

beforeEach(() => {
  jest.clearAllMocks()
  mockUseParams.mockReturnValue({ id: ['test-product'] })
  setupUseProduct({ product: makeProduct() })
  setupUseUser()
})

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('ProductDetail page', () => {
  describe('setName on mount', () => {
    it('calls setName with the first id param on mount', () => {
      mockUseParams.mockReturnValue({ id: ['my-product'] })
      render(<ProductDetail />)
      expect(mockSetName).toHaveBeenCalledWith('my-product')
    })

    it('does not call setName when id array is empty', () => {
      mockUseParams.mockReturnValue({ id: [] })
      render(<ProductDetail />)
      expect(mockSetName).not.toHaveBeenCalled()
    })

    it('does not call setName when id is undefined', () => {
      mockUseParams.mockReturnValue({})
      setupUseProduct({ product: null, isLoading: false })
      render(<ProductDetail />)
      expect(mockSetName).not.toHaveBeenCalled()
    })
  })

  describe('not found state', () => {
    it('renders NotFoundProduct when not loading and product is null', () => {
      setupUseProduct({ isLoading: false, product: null })
      render(<ProductDetail />)
      expect(screen.getByTestId('not-found-product')).toBeInTheDocument()
    })

    it('does not render the main content when product is null', () => {
      setupUseProduct({ isLoading: false, product: null })
      render(<ProductDetail />)
      expect(screen.queryByTestId('product-header')).not.toBeInTheDocument()
    })

    it('does not render NotFoundProduct while loading', () => {
      setupUseProduct({ isLoading: true, product: null })
      render(<ProductDetail />)
      expect(screen.queryByTestId('not-found-product')).not.toBeInTheDocument()
    })
  })

  describe('loading state', () => {
    it('renders the skeleton while loading', () => {
      setupUseProduct({ isLoading: true, product: null })
      render(<ProductDetail />)
      expect(screen.getByTestId('product-skeleton')).toBeInTheDocument()
    })

    it('does not render product content while loading', () => {
      setupUseProduct({ isLoading: true, product: null })
      render(<ProductDetail />)
      expect(screen.queryByTestId('product-header')).not.toBeInTheDocument()
    })

    it('renders the back button even while loading', () => {
      setupUseProduct({ isLoading: true, product: null })
      render(<ProductDetail />)
      expect(screen.getByRole('button', { name: /Voltar para produtos/i })).toBeInTheDocument()
    })
  })

  describe('content state', () => {
    it('renders the Header with the product', () => {
      render(<ProductDetail />)
      expect(screen.getByTestId('product-header')).toBeInTheDocument()
    })

    it('renders the product name inside the Header', () => {
      setupUseProduct({ product: makeProduct({ name: 'Cool Gadget' }) })
      render(<ProductDetail />)
      expect(screen.getByTestId('product-header')).toHaveTextContent('Cool Gadget')
    })

    it('renders CardsStats', () => {
      render(<ProductDetail />)
      expect(screen.getByTestId('cards-stats')).toBeInTheDocument()
    })

    it('renders LineChart', () => {
      render(<ProductDetail />)
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    })

    it('renders CreatorsTable', () => {
      render(<ProductDetail />)
      expect(screen.getByTestId('creators-table')).toBeInTheDocument()
    })

    it('renders VideosTable', () => {
      render(<ProductDetail />)
      expect(screen.getByTestId('videos-table')).toBeInTheDocument()
    })

    it('does not render the skeleton when product is loaded', () => {
      render(<ProductDetail />)
      expect(screen.queryByTestId('product-skeleton')).not.toBeInTheDocument()
    })
  })

  describe('VideosTable props', () => {
    it('passes isFreeUser to VideosTable', () => {
      setupUseUser({ isFreeUser: true })
      render(<ProductDetail />)
      expect(screen.getByTestId('videos-table')).toHaveAttribute('data-free', 'true')
    })

    it('passes clerkId to VideosTable', () => {
      setupUseUser({ id: 'clerk_xyz' })
      render(<ProductDetail />)
      expect(screen.getByTestId('videos-table')).toHaveAttribute('data-clerk', 'clerk_xyz')
    })
  })

  describe('back button', () => {
    it('renders the back button', () => {
      render(<ProductDetail />)
      expect(screen.getByRole('button', { name: /Voltar para produtos/i })).toBeInTheDocument()
    })

    it('navigates to /stores when clicked', () => {
      render(<ProductDetail />)
      fireEvent.click(screen.getByRole('button', { name: /Voltar para produtos/i }))
      expect(mockPush).toHaveBeenCalledWith('/stores')
    })

    it('does not navigate before the button is clicked', () => {
      render(<ProductDetail />)
      expect(mockPush).not.toHaveBeenCalled()
    })
  })
})
