/* eslint-disable no-console */
import React from 'react'
import { render, screen } from '@testing-library/react'
import LineChart from '../lineChart'
import { IStoreWithCategory } from '@/stores/types'

// Suppress jsdom's unrecognised SVG tag warning (<stop> inside <linearGradient>)
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((msg: string) => {
    if (typeof msg === 'string' && msg.includes('unrecognized')) return
    console.warn(msg)
  })
})
afterAll(() => {
  ;(console.error as jest.Mock).mockRestore()
})

// ─── UI mocks ────────────────────────────────────────────────────────────────
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
}))

// Expose the config prop so colour logic can be asserted
jest.mock('@/components/ui/chart', () => ({
  ChartContainer: ({
    children,
    config,
  }: {
    children: React.ReactNode
    config: Record<string, { color: string }>
  }) => (
    <div data-testid="chart-container" data-color={config?.revenue?.color}>
      {children}
    </div>
  ),
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
}))

// Expose data so chartData transformation can be asserted
jest.mock('recharts', () => ({
  AreaChart: ({
    children,
    data,
  }: {
    children: React.ReactNode
    data: unknown[]
  }) => (
    <div data-testid="area-chart" data-points={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Area: () => null,
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
}))

// ─── Helpers ─────────────────────────────────────────────────────────────────
const makeStore = (
  overrides: Partial<IStoreWithCategory> = {}
): IStoreWithCategory => ({
  country: 'BR',
  category_id: '601450',
  category_name: 'Beauty',
  name: 'Test Store',
  image: null,
  type: 'marketplace',
  unit_price: 49.9,
  revenue: 85000,
  revenue_growth_rate: 12.5,
  revenue_history: [1000, 2000, 3000, 4000, 5000],
  sales: 3400,
  ...overrides,
})

// ─── Tests ───────────────────────────────────────────────────────────────────
describe('LineChart', () => {
  describe('null guard', () => {
    it('renders nothing when store is null', () => {
      const { container } = render(<LineChart store={null as any} />)
      expect(container).toBeEmptyDOMElement()
    })

    it('renders nothing when store is undefined', () => {
      const { container } = render(<LineChart store={undefined as any} />)
      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('card title', () => {
    it('renders the Revenue History heading', () => {
      render(<LineChart store={makeStore()} />)
      expect(
        screen.getByText('Revenue History (Last 30 Days)')
      ).toBeInTheDocument()
    })
  })

  describe('chart data transformation', () => {
    it('maps revenue_history to {day, revenue} entries', () => {
      render(
        <LineChart store={makeStore({ revenue_history: [100, 200, 300] })} />
      )
      const chart = screen.getByTestId('area-chart')
      const points = JSON.parse(chart.dataset.points!)
      expect(points).toEqual([
        { day: 1, revenue: 100 },
        { day: 2, revenue: 200 },
        { day: 3, revenue: 300 },
      ])
    })

    it('day index starts at 1', () => {
      render(<LineChart store={makeStore({ revenue_history: [500] })} />)
      const points = JSON.parse(
        screen.getByTestId('area-chart').dataset.points!
      )
      expect(points[0].day).toBe(1)
    })

    it('passes all history entries to the chart', () => {
      const history = [10, 20, 30, 40, 50]
      render(<LineChart store={makeStore({ revenue_history: history })} />)
      const points = JSON.parse(
        screen.getByTestId('area-chart').dataset.points!
      )
      expect(points).toHaveLength(5)
    })

    it('handles an empty revenue_history', () => {
      render(<LineChart store={makeStore({ revenue_history: [] })} />)
      const points = JSON.parse(
        screen.getByTestId('area-chart').dataset.points!
      )
      expect(points).toEqual([])
    })
  })

  describe('chart colour based on growth rate', () => {
    it('uses green when revenue_growth_rate is positive', () => {
      render(<LineChart store={makeStore({ revenue_growth_rate: 10 })} />)
      const color = screen.getByTestId('chart-container').dataset.color
      expect(color).toBe('hsl(142, 71%, 45%)')
    })

    it('uses green when revenue_growth_rate is exactly zero', () => {
      render(<LineChart store={makeStore({ revenue_growth_rate: 0 })} />)
      const color = screen.getByTestId('chart-container').dataset.color
      expect(color).toBe('hsl(142, 71%, 45%)')
    })

    it('uses red when revenue_growth_rate is negative', () => {
      render(<LineChart store={makeStore({ revenue_growth_rate: -5 })} />)
      const color = screen.getByTestId('chart-container').dataset.color
      expect(color).toBe('hsl(0, 84%, 60%)')
    })
  })

  describe('chart container', () => {
    it('renders the chart container', () => {
      render(<LineChart store={makeStore()} />)
      expect(screen.getByTestId('chart-container')).toBeInTheDocument()
    })

    it('renders the area chart', () => {
      render(<LineChart store={makeStore()} />)
      expect(screen.getByTestId('area-chart')).toBeInTheDocument()
    })
  })
})
