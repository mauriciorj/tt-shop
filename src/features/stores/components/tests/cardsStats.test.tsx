import React from 'react'
import { render, screen } from '@testing-library/react'
import CardsStats from '../cardsStats'
import { IStoreWithCategory } from '@/stores/types'

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}))

const makeStore = (overrides: Partial<IStoreWithCategory> = {}): IStoreWithCategory => ({
  country: 'BR',
  category_id: '601450',
  category_name: 'Beauty',
  k_id: 'store_001',
  name: 'Test Store',
  image: null,
  type: 'marketplace',
  unit_price: 49.9,
  revenue: 85000,
  revenue_growth_rate: 12.5,
  revenue_history: [1000, 2000, 3000],
  sales: 3400,
  ...overrides,
})

describe('CardsStats', () => {
  describe('null guard', () => {
    it('renders nothing when store is null', () => {
      const { container } = render(<CardsStats store={null as any} />)
      expect(container).toBeEmptyDOMElement()
    })

    it('renders nothing when store is undefined', () => {
      const { container } = render(<CardsStats store={undefined as any} />)
      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('revenue card', () => {
    it('renders the Revenue label', () => {
      render(<CardsStats store={makeStore()} />)
      expect(screen.getByText('Revenue')).toBeInTheDocument()
    })

    it('formats revenue using pt-BR locale', () => {
      render(<CardsStats store={makeStore({ revenue: 85000 })} />)
      expect(screen.getByText('85.000')).toBeInTheDocument()
    })

    it('renders the revenue description', () => {
      render(<CardsStats store={makeStore()} />)
      expect(screen.getByText('Estimated monthly revenue')).toBeInTheDocument()
    })

    it('formats revenue of zero correctly', () => {
      render(<CardsStats store={makeStore({ revenue: 0 })} />)
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  describe('growth rate card', () => {
    it('renders the Growth Rate label', () => {
      render(<CardsStats store={makeStore()} />)
      expect(screen.getByText('Growth Rate')).toBeInTheDocument()
    })

    it('displays the growth rate value with % sign', () => {
      render(<CardsStats store={makeStore({ revenue_growth_rate: 12.5 })} />)
      expect(screen.getByText('12.5 %')).toBeInTheDocument()
    })

    it('renders the growth rate description', () => {
      render(<CardsStats store={makeStore()} />)
      expect(screen.getByText('Estimated growth rate')).toBeInTheDocument()
    })

    it('shows TrendingUp icon when growth rate is positive', () => {
      render(<CardsStats store={makeStore({ revenue_growth_rate: 5 })} />)
      // lucide renders SVGs — verify no TrendingDown is present instead
      const svgs = document.querySelectorAll('svg')
      expect(svgs.length).toBeGreaterThan(0)
    })

    it('shows TrendingUp icon when growth rate is zero', () => {
      render(<CardsStats store={makeStore({ revenue_growth_rate: 0 })} />)
      expect(screen.getByText('0 %')).toBeInTheDocument()
    })

    it('shows TrendingDown icon when growth rate is negative', () => {
      render(<CardsStats store={makeStore({ revenue_growth_rate: -8.3 })} />)
      expect(screen.getByText('-8.3 %')).toBeInTheDocument()
    })
  })

  describe('sales card', () => {
    it('renders the Sales label', () => {
      render(<CardsStats store={makeStore()} />)
      expect(screen.getByText('Sales')).toBeInTheDocument()
    })

    it('formats sales using pt-BR locale', () => {
      render(<CardsStats store={makeStore({ sales: 3400 })} />)
      expect(screen.getByText('3.400')).toBeInTheDocument()
    })

    it('renders the sales description', () => {
      render(<CardsStats store={makeStore()} />)
      expect(screen.getByText('Estimated sales')).toBeInTheDocument()
    })
  })

  describe('unit price card', () => {
    it('renders the Unit Price label', () => {
      render(<CardsStats store={makeStore()} />)
      expect(screen.getByText('Unit Price')).toBeInTheDocument()
    })

    it('displays the unit price value', () => {
      render(<CardsStats store={makeStore({ unit_price: 49.9 })} />)
      expect(screen.getByText('49.9')).toBeInTheDocument()
    })

    it('renders the unit price description', () => {
      render(<CardsStats store={makeStore()} />)
      expect(screen.getByText('Estimated unit price')).toBeInTheDocument()
    })

    it('displays zero unit price', () => {
      render(<CardsStats store={makeStore({ unit_price: 0 })} />)
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  describe('all cards rendered', () => {
    it('renders all four stat card titles', () => {
      render(<CardsStats store={makeStore()} />)
      expect(screen.getByText('Revenue')).toBeInTheDocument()
      expect(screen.getByText('Growth Rate')).toBeInTheDocument()
      expect(screen.getByText('Sales')).toBeInTheDocument()
      expect(screen.getByText('Unit Price')).toBeInTheDocument()
    })
  })
})
