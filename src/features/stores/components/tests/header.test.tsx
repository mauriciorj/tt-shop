import React from 'react'
import { render, screen } from '@testing-library/react'
import Header from '../header'
import { IStoreWithCategory } from '@/stores/types'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="badge">{children}</span>
  ),
}))

const makeStore = (overrides: Partial<IStoreWithCategory> = {}): IStoreWithCategory => ({
  country: 'BR',
  category_id: '601450',
  category_name: 'Beauty',
  k_id: 'store_001',
  name: 'My Test Store',
  image: 'https://example.com/store.jpg',
  type: 'marketplace',
  unit_price: 49.9,
  revenue: 85000,
  revenue_growth_rate: 12.5,
  revenue_history: [1000, 2000, 3000],
  sales: 3400,
  ...overrides,
})

describe('Header', () => {
  describe('null guard', () => {
    it('renders nothing when store is null', () => {
      const { container } = render(<Header store={null as any} />)
      expect(container).toBeEmptyDOMElement()
    })

    it('renders nothing when store is undefined', () => {
      const { container } = render(<Header store={undefined as any} />)
      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('store name', () => {
    it('renders the store name', () => {
      render(<Header store={makeStore()} />)
      expect(screen.getByText('My Test Store')).toBeInTheDocument()
    })

    it('renders as a heading', () => {
      render(<Header store={makeStore()} />)
      expect(screen.getByRole('heading', { name: 'My Test Store' })).toBeInTheDocument()
    })
  })

  describe('category badge', () => {
    it('renders the category name in the badge', () => {
      render(<Header store={makeStore({ category_name: 'Electronics' })} />)
      expect(screen.getByTestId('badge')).toHaveTextContent('Electronics')
    })

    it('renders null category name without crashing', () => {
      render(<Header store={makeStore({ category_name: null })} />)
      expect(screen.getByTestId('badge')).toBeInTheDocument()
    })
  })

  describe('store image', () => {
    it('renders the image when store has one', () => {
      render(<Header store={makeStore({ image: 'https://example.com/img.jpg' })} />)
      const img = screen.getByRole('img')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', 'https://example.com/img.jpg')
      expect(img).toHaveAttribute('alt', 'My Test Store')
    })

    it('does not render an image when store.image is null', () => {
      render(<Header store={makeStore({ image: null })} />)
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })

    it('does not render an image when store.image is undefined', () => {
      render(<Header store={makeStore({ image: undefined })} />)
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })
  })

  describe('blog CTA', () => {
    it('does not render the CTA link by default', () => {
      render(<Header store={makeStore()} />)
      expect(screen.queryByText('Começar agora')).not.toBeInTheDocument()
    })

    it('renders the CTA link when isBlog is true', () => {
      render(<Header store={makeStore()} isBlog />)
      expect(screen.getByText('Começar agora')).toBeInTheDocument()
    })

    it('CTA link points to /stores', () => {
      render(<Header store={makeStore()} isBlog />)
      expect(screen.getByRole('link', { name: /Começar agora/ })).toHaveAttribute('href', '/stores')
    })

    it('does not render the CTA link when isBlog is false', () => {
      render(<Header store={makeStore()} isBlog={false} />)
      expect(screen.queryByText('Começar agora')).not.toBeInTheDocument()
    })
  })
})
