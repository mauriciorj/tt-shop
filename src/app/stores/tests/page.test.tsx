import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Stores from '../page'

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('@/stores/hooks/useStores', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}))

jest.mock('@/convex/_generated/api', () => ({
  api: {
    savedStores: {
      getSavedStoreIds: 'savedStores:getSavedStoreIds',
      toggleSavedStore: 'savedStores:toggleSavedStore',
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
  default: ({ clerkId, isFreeUser }: { clerkId: string; data: unknown; isFreeUser: boolean; placeholder: string }) => (
    <div data-testid="search-bar" data-clerk={clerkId} data-free={String(isFreeUser)} />
  ),
}))

jest.mock('@/stores/components/storesTableSkeleton', () => ({
  __esModule: true,
  default: ({ rows }: { rows: number }) => (
    <div data-testid="stores-table-skeleton" data-rows={rows} />
  ),
}))

jest.mock('@/stores/components/storesTable', () => ({
  __esModule: true,
  default: ({
    currentPage,
    totalPages,
    onToggleSave,
    savedStoreIds,
  }: {
    currentPage: number
    totalPages: number
    items: unknown[]
    isFreeUser: boolean
    onPageChange: () => void
    onToggleSave: (id: string) => void
    savedStoreIds: string[]
    setSortKey: () => void
    setSortOrder: () => void
    sortKey: string
    sortOrder: string
  }) => (
    <div
      data-testid="stores-table"
      data-page={currentPage}
      data-total={totalPages}
      data-saved={JSON.stringify(savedStoreIds)}
    >
      <button onClick={() => onToggleSave('store_001')}>toggle-save</button>
    </div>
  ),
}))

// ─── Imports after mocks ──────────────────────────────────────────────────────

import useStores from '@/stores/hooks/useStores'
import { useQuery, useMutation } from 'convex/react'
import { toast } from 'sonner'

const mockUseStores = useStores as jest.Mock
const mockUseQuery = useQuery as jest.Mock
const mockUseMutation = useMutation as jest.Mock
const mockToast = toast as jest.Mocked<typeof toast>

// ─── Helpers ─────────────────────────────────────────────────────────────────

const defaultStoresHook = {
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
  mockUseStores.mockReturnValue({ ...defaultStoresHook, ...overrides })

beforeEach(() => {
  jest.clearAllMocks()
  setupHook()
  mockUseQuery.mockReturnValue(['store_001'])
  mockUseMutation.mockReturnValue(jest.fn().mockResolvedValue({ saved: true }))
})

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Stores page', () => {
  describe('breadcrumb', () => {
    it('renders the breadcrumb', () => {
      render(<Stores />)
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
    })

    it('passes the correct title to breadcrumb', () => {
      render(<Stores />)
      expect(screen.getByTestId('breadcrumb')).toHaveAttribute('data-title', 'Lojas')
    })

    it('passes the correct description to breadcrumb', () => {
      render(<Stores />)
      expect(screen.getByTestId('breadcrumb')).toHaveAttribute(
        'data-description',
        'Descubra as melhores lojas no TikTok Shop'
      )
    })
  })

  describe('loading state', () => {
    it('renders CategoriesSkeleton when loading', () => {
      setupHook({ isLoading: true })
      render(<Stores />)
      expect(screen.getByTestId('categories-skeleton')).toBeInTheDocument()
    })

    it('does not render Categories when loading', () => {
      setupHook({ isLoading: true })
      render(<Stores />)
      expect(screen.queryByTestId('categories')).not.toBeInTheDocument()
    })

    it('does not render PeriodFilter when loading', () => {
      setupHook({ isLoading: true })
      render(<Stores />)
      expect(screen.queryByTestId('period-filter')).not.toBeInTheDocument()
    })

    it('renders StoreTableSkeleton when loading', () => {
      setupHook({ isLoading: true })
      render(<Stores />)
      expect(screen.getByTestId('stores-table-skeleton')).toBeInTheDocument()
    })

    it('passes itemsPerPage as rows to StoreTableSkeleton', () => {
      setupHook({ isLoading: true, itemsPerPage: 10 })
      render(<Stores />)
      expect(screen.getByTestId('stores-table-skeleton')).toHaveAttribute('data-rows', '10')
    })

    it('does not render StoresTable when loading', () => {
      setupHook({ isLoading: true })
      render(<Stores />)
      expect(screen.queryByTestId('stores-table')).not.toBeInTheDocument()
    })
  })

  describe('content state', () => {
    it('renders Categories when not loading', () => {
      render(<Stores />)
      expect(screen.getByTestId('categories')).toBeInTheDocument()
    })

    it('renders PeriodFilter when not loading', () => {
      render(<Stores />)
      expect(screen.getByTestId('period-filter')).toBeInTheDocument()
    })

    it('does not render CategoriesSkeleton when not loading', () => {
      render(<Stores />)
      expect(screen.queryByTestId('categories-skeleton')).not.toBeInTheDocument()
    })

    it('renders StoresTable when not loading', () => {
      render(<Stores />)
      expect(screen.getByTestId('stores-table')).toBeInTheDocument()
    })

    it('does not render StoreTableSkeleton when not loading', () => {
      render(<Stores />)
      expect(screen.queryByTestId('stores-table-skeleton')).not.toBeInTheDocument()
    })
  })

  describe('search bar', () => {
    it('always renders the search bar', () => {
      render(<Stores />)
      expect(screen.getByTestId('search-bar')).toBeInTheDocument()
    })

    it('passes userId as clerkId to SearchBar', () => {
      setupHook({ userId: 'clerk_xyz' })
      render(<Stores />)
      expect(screen.getByTestId('search-bar')).toHaveAttribute('data-clerk', 'clerk_xyz')
    })

    it('passes isFreeUser to SearchBar', () => {
      setupHook({ isFreeUser: true })
      render(<Stores />)
      expect(screen.getByTestId('search-bar')).toHaveAttribute('data-free', 'true')
    })

    it('renders search bar even while loading', () => {
      setupHook({ isLoading: true })
      render(<Stores />)
      expect(screen.getByTestId('search-bar')).toBeInTheDocument()
    })
  })

  describe('StoresTable props', () => {
    it('passes currentPage to StoresTable', () => {
      setupHook({ currentPage: 3 })
      render(<Stores />)
      expect(screen.getByTestId('stores-table')).toHaveAttribute('data-page', '3')
    })

    it('passes totalPages to StoresTable', () => {
      setupHook({ totalPages: 5 })
      render(<Stores />)
      expect(screen.getByTestId('stores-table')).toHaveAttribute('data-total', '5')
    })

    it('passes savedStoreIds from Convex query to StoresTable', () => {
      mockUseQuery.mockReturnValue(['store_abc', 'store_xyz'])
      render(<Stores />)
      expect(screen.getByTestId('stores-table')).toHaveAttribute(
        'data-saved',
        JSON.stringify(['store_abc', 'store_xyz'])
      )
    })

    it('passes empty array to StoresTable when savedStoreIds is undefined', () => {
      mockUseQuery.mockReturnValue(undefined)
      render(<Stores />)
      expect(screen.getByTestId('stores-table')).toHaveAttribute('data-saved', '[]')
    })
  })

  describe('handleToggleSave', () => {
    it('calls toggleSaved with userId and storeKId', async () => {
      const toggleSaved = jest.fn().mockResolvedValue({ saved: true })
      mockUseMutation.mockReturnValue(toggleSaved)
      render(<Stores />)
      fireEvent.click(screen.getByRole('button', { name: 'toggle-save' }))
      await waitFor(() => {
        expect(toggleSaved).toHaveBeenCalledWith({
          clerk_id: 'user_123',
          store_k_id: 'store_001',
        })
      })
    })

    it('shows success toast when store is saved', async () => {
      mockUseMutation.mockReturnValue(jest.fn().mockResolvedValue({ saved: true }))
      render(<Stores />)
      fireEvent.click(screen.getByRole('button', { name: 'toggle-save' }))
      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith('Loja salva!')
      })
    })

    it('shows removal toast when store is unsaved', async () => {
      mockUseMutation.mockReturnValue(jest.fn().mockResolvedValue({ saved: false }))
      render(<Stores />)
      fireEvent.click(screen.getByRole('button', { name: 'toggle-save' }))
      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith('Loja removida dos salvos.')
      })
    })

    it('shows error toast and does not call toggleSaved when userId is absent', async () => {
      const toggleSaved = jest.fn()
      mockUseMutation.mockReturnValue(toggleSaved)
      setupHook({ userId: null })
      render(<Stores />)
      fireEvent.click(screen.getByRole('button', { name: 'toggle-save' }))
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Faça login para salvar lojas.')
      })
      expect(toggleSaved).not.toHaveBeenCalled()
    })
  })

  describe('Convex query', () => {
    it('passes clerk_id to getSavedStoreIds when userId is set', () => {
      setupHook({ userId: 'user_abc' })
      render(<Stores />)
      expect(mockUseQuery).toHaveBeenCalledWith(
        'savedStores:getSavedStoreIds',
        { clerk_id: 'user_abc' }
      )
    })

    it('passes "skip" to getSavedStoreIds when userId is falsy', () => {
      setupHook({ userId: null })
      render(<Stores />)
      expect(mockUseQuery).toHaveBeenCalledWith(
        'savedStores:getSavedStoreIds',
        'skip'
      )
    })
  })
})
