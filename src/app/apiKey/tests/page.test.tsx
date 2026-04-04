import React from 'react'
import { render, screen } from '@testing-library/react'
import ApiPage from '../page'

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('@/hooks/useUser', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('../../../features/api-keys/components/ApiKeyManager', () => ({
  __esModule: true,
  default: () => <div data-testid="api-key-manager" />,
}))

jest.mock('@/ui/button', () => ({
  Button: ({
    children,
    asChild,
  }: {
    children: React.ReactNode
    asChild?: boolean
  }) => <div data-testid="button" data-as-child={String(!!asChild)}>{children}</div>,
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

jest.mock('lucide-react', () => ({
  KeyRound: () => <svg data-testid="icon-key-round" />,
  Lock: () => <svg data-testid="icon-lock" />,
}))

// ─── Imports after mocks ──────────────────────────────────────────────────────

import UseUser from '@/hooks/useUser'

const mockUseUser = UseUser as jest.Mock

// ─── Helpers ─────────────────────────────────────────────────────────────────

const setupUser = (overrides = {}) =>
  mockUseUser.mockReturnValue({ isFreeUser: false, isLoading: false, ...overrides })

beforeEach(() => {
  jest.clearAllMocks()
  setupUser()
})

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('ApiPage', () => {
  describe('page heading', () => {
    it('renders the "Chaves de" heading text', () => {
      render(<ApiPage />)
      expect(screen.getByText('Chaves de')).toBeInTheDocument()
    })

    it('renders the "API" heading text', () => {
      render(<ApiPage />)
      expect(screen.getByText('API')).toBeInTheDocument()
    })

    it('renders the subtitle', () => {
      render(<ApiPage />)
      expect(
        screen.getByText('Gerencie suas chaves de acesso à API do UseShopRadar')
      ).toBeInTheDocument()
    })

    it('renders the KeyRound icon', () => {
      render(<ApiPage />)
      expect(screen.getByTestId('icon-key-round')).toBeInTheDocument()
    })
  })

  describe('loading state', () => {
    it('renders ApiKeyManager while loading (isLoading=true, isFreeUser=false)', () => {
      setupUser({ isLoading: true, isFreeUser: false })
      render(<ApiPage />)
      expect(screen.getByTestId('api-key-manager')).toBeInTheDocument()
    })

    it('does not render the lock gate while loading even if isFreeUser=true', () => {
      setupUser({ isLoading: true, isFreeUser: true })
      render(<ApiPage />)
      expect(screen.queryByText('Recurso exclusivo para assinantes')).not.toBeInTheDocument()
    })
  })

  describe('free user gate', () => {
    beforeEach(() => setupUser({ isFreeUser: true, isLoading: false }))

    it('renders the lock gate heading', () => {
      render(<ApiPage />)
      expect(screen.getByText('Recurso exclusivo para assinantes')).toBeInTheDocument()
    })

    it('renders the upgrade description', () => {
      render(<ApiPage />)
      expect(
        screen.getByText('Faça upgrade do seu plano para acessar a API do UseShopRadar.')
      ).toBeInTheDocument()
    })

    it('renders the upgrade button', () => {
      render(<ApiPage />)
      expect(screen.getByRole('link', { name: 'Fazer upgrade' })).toBeInTheDocument()
    })

    it('upgrade link points to /subscription', () => {
      render(<ApiPage />)
      expect(screen.getByRole('link', { name: 'Fazer upgrade' })).toHaveAttribute(
        'href',
        '/subscription'
      )
    })

    it('renders the Lock icon', () => {
      render(<ApiPage />)
      expect(screen.getByTestId('icon-lock')).toBeInTheDocument()
    })

    it('does not render ApiKeyManager', () => {
      render(<ApiPage />)
      expect(screen.queryByTestId('api-key-manager')).not.toBeInTheDocument()
    })

    it('does not render the "Como usar" section', () => {
      render(<ApiPage />)
      expect(screen.queryByText('Como usar')).not.toBeInTheDocument()
    })
  })

  describe('paid user content', () => {
    beforeEach(() => setupUser({ isFreeUser: false, isLoading: false }))

    it('renders ApiKeyManager', () => {
      render(<ApiPage />)
      expect(screen.getByTestId('api-key-manager')).toBeInTheDocument()
    })

    it('renders the "Como usar" section heading', () => {
      render(<ApiPage />)
      expect(screen.getByText('Como usar')).toBeInTheDocument()
    })

    it('renders the usage instructions text', () => {
      render(<ApiPage />)
      expect(
        screen.getByText('Inclua sua chave no cabeçalho de cada requisição:')
      ).toBeInTheDocument()
    })

    it('renders the code example with the Authorization header', () => {
      render(<ApiPage />)
      expect(screen.getByText(/Authorization: Bearer usr_sua_chave_aqui/)).toBeInTheDocument()
    })

    it('renders the GET /api/videos example', () => {
      render(<ApiPage />)
      expect(screen.getByText(/GET \/api\/videos/)).toBeInTheDocument()
    })

    it('does not render the lock gate', () => {
      render(<ApiPage />)
      expect(screen.queryByText('Recurso exclusivo para assinantes')).not.toBeInTheDocument()
    })

    it('does not render the Lock icon', () => {
      render(<ApiPage />)
      expect(screen.queryByTestId('icon-lock')).not.toBeInTheDocument()
    })

    it('does not render the upgrade link', () => {
      render(<ApiPage />)
      expect(screen.queryByRole('link', { name: 'Fazer upgrade' })).not.toBeInTheDocument()
    })
  })
})
