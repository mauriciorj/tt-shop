import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import StoresTable, { TableProps } from '../storesTable'
import { IStoreWithCategory } from '@/stores/types'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}))

jest.mock('@/components/revenueSparkline', () => ({
  __esModule: true,
  default: () => <div data-testid="sparkline" />,
}))

jest.mock('@/components/tablePagination', () => ({
  __esModule: true,
  default: ({ currentPage, totalPages }: { currentPage: number; totalPages: number | undefined }) => (
    <div data-testid="table-pagination">
      {currentPage}/{totalPages}
    </div>
  ),
}))

// ─── Helpers ─────────────────────────────────────────────────────────────────
const makeStore = (overrides: Partial<IStoreWithCategory> = {}): IStoreWithCategory => ({
  country: 'BR',
  category_id: '601450',
  category_name: 'Beauty',
  k_id: 'store_001',
  name: 'Test Store',
  image: null,
  type: 'marketplace',
  unit_price: 49.9,
  rank: 1,
  revenue: 85000,
  revenue_growth_rate: 12.5,
  revenue_history: [1000, 2000, 3000],
  sales: 3400,
  ...overrides,
})

const defaultProps: TableProps = {
  currentPage: 1,
  items: [],
  isFreeUser: false,
  onPageChange: jest.fn(),
  setSortKey: jest.fn(),
  setSortOrder: jest.fn(),
  sortKey: 'revenue',
  sortOrder: 'desc',
  totalPages: 1,
}

const renderTable = (overrides: Partial<TableProps> = {}) =>
  render(<StoresTable {...defaultProps} {...overrides} />)

beforeEach(() => {
  jest.clearAllMocks()
})

// ─── Tests ───────────────────────────────────────────────────────────────────
describe('StoresTable', () => {
  describe('table headers', () => {
    it('renders all static column headers', () => {
      renderTable()
      expect(screen.getByText('Rank')).toBeInTheDocument()
      expect(screen.getByText('Loja')).toBeInTheDocument()
      expect(screen.getByText('Categoria')).toBeInTheDocument()
    })

    it('renders all sortable column headers', () => {
      renderTable()
      expect(screen.getByRole('button', { name: /^Receita$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Receita Histórica/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Receita %/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Vendas/i })).toBeInTheDocument()
    })

    it('does not render Salvar column when onToggleSave is not provided', () => {
      renderTable()
      expect(screen.queryByText('Salvar')).not.toBeInTheDocument()
    })

    it('renders Salvar column when onToggleSave is provided', () => {
      renderTable({ onToggleSave: jest.fn() })
      expect(screen.getByText('Salvar')).toBeInTheDocument()
    })
  })

  describe('sorting', () => {
    it('clicking an active column in asc order calls setSortOrder with desc', () => {
      const setSortOrder = jest.fn()
      renderTable({ sortKey: 'revenue', sortOrder: 'asc', setSortOrder })
      fireEvent.click(screen.getByRole('button', { name: /^Receita$/i }))
      expect(setSortOrder).toHaveBeenCalledWith('desc')
    })

    it('clicking an active column in desc order calls setSortOrder with asc', () => {
      const setSortOrder = jest.fn()
      renderTable({ sortKey: 'revenue', sortOrder: 'desc', setSortOrder })
      fireEvent.click(screen.getByRole('button', { name: /^Receita$/i }))
      expect(setSortOrder).toHaveBeenCalledWith('asc')
    })

    it('clicking a different column calls setSortKey with new key', () => {
      const setSortKey = jest.fn()
      renderTable({ sortKey: 'revenue', setSortKey })
      fireEvent.click(screen.getByRole('button', { name: /Vendas/i }))
      expect(setSortKey).toHaveBeenCalledWith('sales')
    })

    it('clicking a different column resets sort order to asc', () => {
      const setSortOrder = jest.fn()
      renderTable({ sortKey: 'revenue', sortOrder: 'desc', setSortOrder })
      fireEvent.click(screen.getByRole('button', { name: /Vendas/i }))
      expect(setSortOrder).toHaveBeenCalledWith('asc')
    })

    it('resets to page 1 after any sort change', () => {
      const onPageChange = jest.fn()
      renderTable({ onPageChange })
      fireEvent.click(screen.getByRole('button', { name: /^Receita$/i }))
      expect(onPageChange).toHaveBeenCalledWith(1)
    })

    it('shows ArrowUp icon on the active column when order is asc', () => {
      renderTable({
        sortKey: 'revenue',
        sortOrder: 'asc',
        items: [],
      })
      // ArrowUp renders as an SVG inside the Receita button
      const receitaBtn = screen.getByRole('button', { name: /^Receita$/i })
      expect(receitaBtn.querySelector('svg')).toBeInTheDocument()
    })

    it('shows no icon on a column that is not the active sort key', () => {
      renderTable({ sortKey: 'sales', sortOrder: 'asc' })
      // Receita button should have no SVG (not the active sort)
      const receitaBtn = screen.getByRole('button', { name: /^Receita$/i })
      expect(receitaBtn.querySelector('svg')).toBeNull()
    })
  })

  describe('row rendering', () => {
    it('renders the store name', () => {
      renderTable({ items: [makeStore({ name: 'Cool Shop' })] })
      expect(screen.getByText('Cool Shop')).toBeInTheDocument()
    })

    it('renders the rank', () => {
      renderTable({ items: [makeStore({ rank: 5 })] })
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('renders the category name', () => {
      renderTable({ items: [makeStore({ category_name: 'Electronics' })] })
      expect(screen.getByText('Electronics')).toBeInTheDocument()
    })

    it('does not render category badge when category_name is null', () => {
      renderTable({ items: [makeStore({ category_name: null })] })
      expect(screen.queryByText('Electronics')).not.toBeInTheDocument()
    })

    it('renders revenue formatted as BRL currency', () => {
      renderTable({ items: [makeStore({ revenue: 85000 })] })
      expect(screen.getByText(/R\$\s?85\.000/)).toBeInTheDocument()
    })

    it('renders sales formatted with pt-BR locale', () => {
      renderTable({ items: [makeStore({ sales: 3400 })] })
      expect(screen.getByText('3.400')).toBeInTheDocument()
    })

    it('renders a sparkline for each row', () => {
      renderTable({ items: [makeStore(), makeStore({ name: 'Other Store' })] })
      expect(screen.getAllByTestId('sparkline')).toHaveLength(2)
    })
  })

  describe('growth rate', () => {
    it('prepends + for positive growth rate', () => {
      renderTable({ items: [makeStore({ revenue_growth_rate: 8.5 })] })
      expect(screen.getByText('+8.5%')).toBeInTheDocument()
    })

    it('does not prepend + for negative growth rate', () => {
      renderTable({ items: [makeStore({ revenue_growth_rate: -4.2 })] })
      expect(screen.getByText('-4.2%')).toBeInTheDocument()
    })

    it('shows no prefix for zero growth rate', () => {
      renderTable({ items: [makeStore({ revenue_growth_rate: 0 })] })
      expect(screen.getByText('0%')).toBeInTheDocument()
    })
  })

  describe('store image', () => {
    it('renders the image when store has one', () => {
      renderTable({ items: [makeStore({ image: 'https://example.com/img.jpg', name: 'Img Store' })] })
      const img = screen.getByRole('img', { name: 'Img Store' })
      expect(img).toHaveAttribute('src', 'https://example.com/img.jpg')
    })

    it('does not render an image when store.image is null', () => {
      renderTable({ items: [makeStore({ image: null, name: 'No Image Store' })] })
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })
  })

  describe('rank badge styling', () => {
    it('applies primary style for rank 1', () => {
      renderTable({ items: [makeStore({ rank: 1 })] })
      const badge = screen.getByText('1')
      expect(badge.className).toContain('bg-primary')
    })

    it('applies accent style for rank 2', () => {
      renderTable({ items: [makeStore({ rank: 2 })] })
      const badge = screen.getByText('2')
      expect(badge.className).toContain('bg-accent')
    })

    it('applies orange style for rank 3', () => {
      renderTable({ items: [makeStore({ rank: 3 })] })
      const badge = screen.getByText('3')
      expect(badge.className).toContain('bg-orange-500')
    })

    it('applies secondary style for rank > 3', () => {
      renderTable({ items: [makeStore({ rank: 10 })] })
      const badge = screen.getByText('10')
      expect(badge.className).toContain('bg-secondary')
    })
  })

  describe('row navigation', () => {
    it('navigates to the store page on row click', () => {
      renderTable({ items: [makeStore({ name: 'Minha Loja' })] })
      fireEvent.click(screen.getByText('Minha Loja'))
      expect(mockPush).toHaveBeenCalledWith('/store/minha-loja')
    })

    it('normalizes store name with accents in the URL', () => {
      renderTable({ items: [makeStore({ name: 'Loja Ótima' })] })
      fireEvent.click(screen.getByText('Loja Ótima'))
      expect(mockPush).toHaveBeenCalledWith('/store/loja-otima')
    })
  })

  describe('save button', () => {
    it('does not render save buttons when onToggleSave is not provided', () => {
      renderTable({ items: [makeStore()] })
      expect(screen.queryByTitle('Salvar loja')).not.toBeInTheDocument()
    })

    it('renders a save button for each row when onToggleSave is provided', () => {
      renderTable({
        items: [makeStore({ k_id: 'a' }), makeStore({ k_id: 'b', name: 'Store B' })],
        onToggleSave: jest.fn(),
        savedStoreIds: [],
      })
      expect(screen.getAllByTitle('Salvar loja')).toHaveLength(2)
    })

    it('shows "Salvar loja" title when store is not saved', () => {
      renderTable({
        items: [makeStore({ k_id: 'store_001' })],
        onToggleSave: jest.fn(),
        savedStoreIds: [],
      })
      expect(screen.getByTitle('Salvar loja')).toBeInTheDocument()
    })

    it('shows "Remover dos salvos" title when store is saved', () => {
      renderTable({
        items: [makeStore({ k_id: 'store_001' })],
        onToggleSave: jest.fn(),
        savedStoreIds: ['store_001'],
      })
      expect(screen.getByTitle('Remover dos salvos')).toBeInTheDocument()
    })

    it('calls onToggleSave with the store k_id when clicked', () => {
      const onToggleSave = jest.fn()
      renderTable({
        items: [makeStore({ k_id: 'store_001' })],
        onToggleSave,
        savedStoreIds: [],
      })
      fireEvent.click(screen.getByTitle('Salvar loja'))
      expect(onToggleSave).toHaveBeenCalledWith('store_001')
    })

    it('does not navigate when the save button is clicked', () => {
      renderTable({
        items: [makeStore({ k_id: 'store_001' })],
        onToggleSave: jest.fn(),
        savedStoreIds: [],
      })
      fireEvent.click(screen.getByTitle('Salvar loja'))
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('pagination', () => {
    it('renders the pagination component', () => {
      renderTable()
      expect(screen.getByTestId('table-pagination')).toBeInTheDocument()
    })

    it('passes currentPage and totalPages to pagination', () => {
      renderTable({ currentPage: 3, totalPages: 7 })
      expect(screen.getByTestId('table-pagination')).toHaveTextContent('3/7')
    })
  })

  describe('empty state', () => {
    it('renders the table with no rows when items is empty', () => {
      renderTable({ items: [] })
      expect(screen.queryByRole('row', { name: /Test Store/ })).not.toBeInTheDocument()
    })
  })
})
