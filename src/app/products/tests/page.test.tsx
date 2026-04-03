import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Products from '../page'

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('@/products/hooks/useProducts', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}))

jest.mock('@/convex/_generated/api', () => ({
  api: {
    savedProducts: {
      getSavedProductIds: 'savedProducts:getSavedProductIds',
      toggleSavedProduct: 'savedProducts:toggleSavedProduct',
    },
  },
}))

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}))

jest.mock('@/components/breadcrumb', () => ({
  __esModule: true,
  default: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="breadcrumb" data-title={title} data-description={description} />
  ),
}))

jest.mock('@/components/categories', () => ({
  __esModule: true,
  default: ({
    selectedCategory,
    setSelectedCategory,
    setCurrentPage,
  }: {
    categories: unknown
    isFreeUser: boolean
    selectedCategory: string
    setSelectedCategory: (v: string) => void
    setCurrentPage: (p: number) => void
  }) => (
    <div
      data-testid="categories"
      data-selected={selectedCategory}
      onClick={() => {
        setSelectedCategory('601450')
        setCurrentPage(1)
      }}
    />
  ),
}))

jest.mock('@/components/categoriesSkeleton', () => ({
  __esModule: true,
  default: () => <div data-testid="categories-skeleton" />,
}))

jest.mock('@/components/periodFilter', () => ({
  __esModule: true,
  default: ({
    selectedPeriod,
    setSelectedPeriod,
  }: {
    isFreeUser: boolean
    selectedPeriod: string
    setSelectedPeriod: (v: string) => void
    setCurrentPage: (p: number) => void
  }) => (
    <div
      data-testid="period-filter"
      data-period={selectedPeriod}
      onClick={() => setSelectedPeriod('7')}
    />
  ),
}))

jest.mock('@/components/search', () => ({
  __esModule: true,
  default: ({
    clerkId,
    isFreeUser,
    isStore,
  }: {
    clerkId: string
    data: unknown
    isFreeUser: boolean
    isStore: boolean
    placeholder: string
  }) => (
    <div
      data-testid="search-bar"
      data-clerk={clerkId}
      data-free={String(isFreeUser)}
      data-is-store={String(isStore)}
    />
  ),
}))

jest.mock('@/products/components/productTableSkeleton', () => ({
  __esModule: true,
  default: ({ rows }: { rows: number }) => (
    <div data-testid="product-table-skeleton" data-rows={rows} />
  ),
}))

jest.mock('@/products/components/productsTable', () => ({
  __esModule: true,
  default: ({
    currentPage,
    totalPages,
    onToggleSave,
    savedProductIds,
  }: {
    currentPage: number
    totalPages: number
    items: unknown[]
    isFreeUser: boolean
    onPageChange: () => void
    onToggleSave: (id: string) => void
    savedProductIds: string[]
    setSortKey: () => void
    setSortOrder: () => void
    sortKey: string
    sortOrder: string
  }) => (
    <div
      data-testid="products-table"
      data-page={currentPage}
      data-total={totalPages}
      data-saved={JSON.stringify(savedProductIds)}
    >
      <button onClick={() => onToggleSave('product_001')}>toggle-save</button>
    </div>
  ),
}))

// ─── Imports after mocks ──────────────────────────────────────────────────────

import useProducts from '@/products/hooks/useProducts'
import { useQuery, useMutation } from 'convex/react'
import { toast } from 'sonner'

const mockUseProducts = useProducts as jest.Mock
const mockUseQuery = useQuery as jest.Mock
const mockUseMutation = useMutation as jest.Mock
const mockToast = toast as jest.Mocked<typeof toast>

// ─── Helpers ─────────────────────────────────────────────────────────────────

const defaultProductsHook = {
  categories: [{ id: 'all', label: 'Todas as categorias' }],
  currentPage: 1,
  data: [],
  isFreeUser: false,
  isLoading: false,
  itemsPerPage: 10,
  onPageChange: jest.fn(),
  selectedCategory: 'all',
  selectedPeriod: '30',
  setCurrentPage: jest.fn(),
  setSelectedCategory: jest.fn(),
  setSelectedPeriod: jest.fn(),
  setSortKey: jest.fn(),
  setSortOrder: jest.fn(),
  sortKey: 'revenue',
  sortOrder: 'desc',
  totalPages: 1,
  userId: 'user_123',
}

const setupHook = (overrides = {}) =>
  mockUseProducts.mockReturnValue({ ...defaultProductsHook, ...overrides })

beforeEach(() => {
  jest.clearAllMocks()
  setupHook()
  mockUseQuery.mockReturnValue(['product_001'])
  mockUseMutation.mockReturnValue(jest.fn().mockResolvedValue({ saved: true }))
})

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Products page', () => {
  describe('breadcrumb', () => {
    it('renders the breadcrumb', () => {
      render(<Products />)
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
    })

    it('passes the correct title to breadcrumb', () => {
      render(<Products />)
      expect(screen.getByTestId('breadcrumb')).toHaveAttribute('data-title', 'Produtos')
    })

    it('passes the correct description to breadcrumb', () => {
      render(<Products />)
      expect(screen.getByTestId('breadcrumb')).toHaveAttribute(
        'data-description',
        'Descubra os melhores produtos'
      )
    })
  })

  describe('loading state', () => {
    it('renders CategoriesSkeleton when loading', () => {
      setupHook({ isLoading: true })
      render(<Products />)
      expect(screen.getByTestId('categories-skeleton')).toBeInTheDocument()
    })

    it('does not render Categories when loading', () => {
      setupHook({ isLoading: true })
      render(<Products />)
      expect(screen.queryByTestId('categories')).not.toBeInTheDocument()
    })

    it('does not render PeriodFilter when loading', () => {
      setupHook({ isLoading: true })
      render(<Products />)
      expect(screen.queryByTestId('period-filter')).not.toBeInTheDocument()
    })

    it('renders ProductTableSkeleton when loading', () => {
      setupHook({ isLoading: true })
      render(<Products />)
      expect(screen.getByTestId('product-table-skeleton')).toBeInTheDocument()
    })

    it('passes itemsPerPage as rows to ProductTableSkeleton', () => {
      setupHook({ isLoading: true, itemsPerPage: 10 })
      render(<Products />)
      expect(screen.getByTestId('product-table-skeleton')).toHaveAttribute('data-rows', '10')
    })

    it('does not render ProductsTable when loading', () => {
      setupHook({ isLoading: true })
      render(<Products />)
      expect(screen.queryByTestId('products-table')).not.toBeInTheDocument()
    })
  })

  describe('content state', () => {
    it('renders Categories when not loading', () => {
      render(<Products />)
      expect(screen.getByTestId('categories')).toBeInTheDocument()
    })

    it('renders PeriodFilter when not loading', () => {
      render(<Products />)
      expect(screen.getByTestId('period-filter')).toBeInTheDocument()
    })

    it('does not render CategoriesSkeleton when not loading', () => {
      render(<Products />)
      expect(screen.queryByTestId('categories-skeleton')).not.toBeInTheDocument()
    })

    it('renders ProductsTable when not loading', () => {
      render(<Products />)
      expect(screen.getByTestId('products-table')).toBeInTheDocument()
    })

    it('does not render ProductTableSkeleton when not loading', () => {
      render(<Products />)
      expect(screen.queryByTestId('product-table-skeleton')).not.toBeInTheDocument()
    })
  })

  describe('search bar', () => {
    it('always renders the search bar', () => {
      render(<Products />)
      expect(screen.getByTestId('search-bar')).toBeInTheDocument()
    })

    it('passes userId as clerkId to SearchBar', () => {
      setupHook({ userId: 'clerk_xyz' })
      render(<Products />)
      expect(screen.getByTestId('search-bar')).toHaveAttribute('data-clerk', 'clerk_xyz')
    })

    it('passes isFreeUser to SearchBar', () => {
      setupHook({ isFreeUser: true })
      render(<Products />)
      expect(screen.getByTestId('search-bar')).toHaveAttribute('data-free', 'true')
    })

    it('passes isStore=false to SearchBar', () => {
      render(<Products />)
      expect(screen.getByTestId('search-bar')).toHaveAttribute('data-is-store', 'false')
    })

    it('renders search bar even while loading', () => {
      setupHook({ isLoading: true })
      render(<Products />)
      expect(screen.getByTestId('search-bar')).toBeInTheDocument()
    })
  })

  describe('ProductsTable props', () => {
    it('passes currentPage to ProductsTable', () => {
      setupHook({ currentPage: 3 })
      render(<Products />)
      expect(screen.getByTestId('products-table')).toHaveAttribute('data-page', '3')
    })

    it('passes totalPages to ProductsTable', () => {
      setupHook({ totalPages: 5 })
      render(<Products />)
      expect(screen.getByTestId('products-table')).toHaveAttribute('data-total', '5')
    })

    it('passes savedProductIds from Convex query to ProductsTable', () => {
      mockUseQuery.mockReturnValue(['product_abc', 'product_xyz'])
      render(<Products />)
      expect(screen.getByTestId('products-table')).toHaveAttribute(
        'data-saved',
        JSON.stringify(['product_abc', 'product_xyz'])
      )
    })

    it('passes empty array to ProductsTable when savedProductIds is undefined', () => {
      mockUseQuery.mockReturnValue(undefined)
      render(<Products />)
      expect(screen.getByTestId('products-table')).toHaveAttribute('data-saved', '[]')
    })
  })

  describe('handleToggleSave', () => {
    it('calls toggleSaved with userId and productKId', async () => {
      const toggleSaved = jest.fn().mockResolvedValue({ saved: true })
      mockUseMutation.mockReturnValue(toggleSaved)
      render(<Products />)
      fireEvent.click(screen.getByRole('button', { name: 'toggle-save' }))
      await waitFor(() => {
        expect(toggleSaved).toHaveBeenCalledWith({
          clerk_id: 'user_123',
          product_k_id: 'product_001',
        })
      })
    })

    it('shows success toast when product is saved', async () => {
      mockUseMutation.mockReturnValue(jest.fn().mockResolvedValue({ saved: true }))
      render(<Products />)
      fireEvent.click(screen.getByRole('button', { name: 'toggle-save' }))
      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith('Produto salvo!')
      })
    })

    it('shows removal toast when product is unsaved', async () => {
      mockUseMutation.mockReturnValue(jest.fn().mockResolvedValue({ saved: false }))
      render(<Products />)
      fireEvent.click(screen.getByRole('button', { name: 'toggle-save' }))
      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith('Produto removido dos salvos.')
      })
    })

    it('shows error toast and does not call toggleSaved when userId is absent', async () => {
      const toggleSaved = jest.fn()
      mockUseMutation.mockReturnValue(toggleSaved)
      setupHook({ userId: null })
      render(<Products />)
      fireEvent.click(screen.getByRole('button', { name: 'toggle-save' }))
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Faça login para salvar produtos.')
      })
      expect(toggleSaved).not.toHaveBeenCalled()
    })
  })

  describe('Convex query', () => {
    it('passes clerk_id to getSavedProductIds when userId is set', () => {
      setupHook({ userId: 'user_abc' })
      render(<Products />)
      expect(mockUseQuery).toHaveBeenCalledWith(
        'savedProducts:getSavedProductIds',
        { clerk_id: 'user_abc' }
      )
    })

    it('passes "skip" to getSavedProductIds when userId is falsy', () => {
      setupHook({ userId: null })
      render(<Products />)
      expect(mockUseQuery).toHaveBeenCalledWith(
        'savedProducts:getSavedProductIds',
        'skip'
      )
    })
  })
})
