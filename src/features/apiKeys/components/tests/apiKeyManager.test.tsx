import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import ApiKeyManager from '../apiKeyManager'

// ── hooks ─────────────────────────────────────────────────────────────────────
jest.mock('../../hooks/useApiKey', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@/hooks/useUser', () => ({
  __esModule: true,
  default: jest.fn(),
}))

// ── external deps ─────────────────────────────────────────────────────────────
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// ── imports after mocks ───────────────────────────────────────────────────────
import UseApiKey from '../../hooks/useApiKey'
import UseUser from '@/hooks/useUser'
import { toast } from 'sonner'

const mockUseApiKey = UseApiKey as jest.Mock
const mockUseUser = UseUser as jest.Mock

// ── helpers ───────────────────────────────────────────────────────────────────
const MOCK_API_KEY = {
  created_at: '2024-01-15T10:00:00Z',
  key_prefix: 'usr_abc',
}

function mockFetch(ok: boolean, body: object) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(body),
  })
}

beforeEach(() => {
  jest.clearAllMocks()
  mockUseUser.mockReturnValue({ id: 'user_123' })
  Object.assign(navigator, {
    clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
  })
})

// ── tests ─────────────────────────────────────────────────────────────────────
describe('ApiKeyManager', () => {
  describe('loading state', () => {
    it('renders a skeleton while loading', () => {
      mockUseApiKey.mockReturnValue({ apiKey: null, isLoading: true })
      const { container } = render(<ApiKeyManager />)
      // Skeleton renders as a div with the animate-pulse class provided by the Skeleton component
      expect(container.querySelector('[class*="animate"]')).toBeInTheDocument()
    })

    it('does not render the empty-state or key-display while loading', () => {
      mockUseApiKey.mockReturnValue({ apiKey: null, isLoading: true })
      render(<ApiKeyManager />)
      expect(
        screen.queryByText('Nenhuma chave de API gerada ainda.')
      ).not.toBeInTheDocument()
    })
  })

  describe('no API key', () => {
    beforeEach(() => {
      mockUseApiKey.mockReturnValue({ apiKey: null, isLoading: false })
    })

    it('shows the empty-state message', () => {
      render(<ApiKeyManager />)
      expect(
        screen.getByText('Nenhuma chave de API gerada ainda.')
      ).toBeInTheDocument()
    })

    it('does not show the Revoke button', () => {
      render(<ApiKeyManager />)
      expect(screen.queryByText('Revogar')).not.toBeInTheDocument()
    })

    it('shows "Gerar chave de API" as the generate button label', () => {
      render(<ApiKeyManager />)
      expect(screen.getByText('Gerar chave de API')).toBeInTheDocument()
    })

    it('does not show the regeneration warning', () => {
      render(<ApiKeyManager />)
      expect(
        screen.queryByText(/revogará a chave atual/)
      ).not.toBeInTheDocument()
    })
  })

  describe('existing API key', () => {
    beforeEach(() => {
      mockUseApiKey.mockReturnValue({
        apiKey: MOCK_API_KEY,
        isLoading: false,
      })
    })

    it('shows the masked key', () => {
      render(<ApiKeyManager />)
      // masked key always starts with usr_ and contains asterisks
      expect(screen.getByText(/^usr_\*+/)).toBeInTheDocument()
    })

    it('shows the creation date', () => {
      render(<ApiKeyManager />)
      // The date is formatted in pt-BR: "15 de jan. de 2024" or similar
      expect(screen.getByText(/Criada em/)).toBeInTheDocument()
    })

    it('shows the Revoke button', () => {
      render(<ApiKeyManager />)
      expect(screen.getByText('Revogar')).toBeInTheDocument()
    })

    it('shows "Gerar nova chave" as the generate button label', () => {
      render(<ApiKeyManager />)
      expect(screen.getByText('Gerar nova chave')).toBeInTheDocument()
    })

    it('shows the regeneration warning text', () => {
      render(<ApiKeyManager />)
      expect(
        screen.getByText(/revogará a chave atual/)
      ).toBeInTheDocument()
    })
  })

  describe('generate key — success', () => {
    beforeEach(() => {
      mockUseApiKey.mockReturnValue({ apiKey: null, isLoading: false })
      mockFetch(true, { key: 'usr_newkey_abc123' })
    })

    it('calls /api/generate-key with POST', async () => {
      render(<ApiKeyManager />)
      await act(async () => {
        fireEvent.click(screen.getByText('Gerar chave de API'))
      })
      expect(global.fetch).toHaveBeenCalledWith('/api/generate-key', {
        method: 'POST',
      })
    })

    it('opens the key dialog with the generated key', async () => {
      render(<ApiKeyManager />)
      await act(async () => {
        fireEvent.click(screen.getByText('Gerar chave de API'))
      })
      expect(screen.getByText('Sua nova chave de API')).toBeInTheDocument()
      expect(screen.getByText('usr_newkey_abc123')).toBeInTheDocument()
    })

    it('shows the one-time copy warning in the dialog', async () => {
      render(<ApiKeyManager />)
      await act(async () => {
        fireEvent.click(screen.getByText('Gerar chave de API'))
      })
      expect(
        screen.getByText(/Ela não será exibida novamente/)
      ).toBeInTheDocument()
    })

    it('closes the dialog and clears the key when the close button is clicked', async () => {
      render(<ApiKeyManager />)
      await act(async () => {
        fireEvent.click(screen.getByText('Gerar chave de API'))
      })
      fireEvent.click(screen.getByText('Entendi, já copiei'))
      await waitFor(() => {
        expect(
          screen.queryByText('Sua nova chave de API')
        ).not.toBeInTheDocument()
      })
    })
  })

  describe('generate key — error', () => {
    it('shows an error toast when the request fails (non-ok response)', async () => {
      mockUseApiKey.mockReturnValue({ apiKey: null, isLoading: false })
      mockFetch(false, { error: 'Unauthorized' })
      render(<ApiKeyManager />)
      await act(async () => {
        fireEvent.click(screen.getByText('Gerar chave de API'))
      })
      expect(toast.error).toHaveBeenCalledWith('Falha ao gerar a chave de API')
    })

    it('shows an error toast when fetch throws', async () => {
      mockUseApiKey.mockReturnValue({ apiKey: null, isLoading: false })
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))
      render(<ApiKeyManager />)
      await act(async () => {
        fireEvent.click(screen.getByText('Gerar chave de API'))
      })
      expect(toast.error).toHaveBeenCalledWith('Falha ao gerar a chave de API')
    })
  })

  describe('delete key', () => {
    beforeEach(() => {
      mockUseApiKey.mockReturnValue({
        apiKey: MOCK_API_KEY,
        isLoading: false,
      })
    })

    it('opens the delete confirmation dialog when Revoke is clicked', () => {
      render(<ApiKeyManager />)
      fireEvent.click(screen.getByText('Revogar'))
      expect(screen.getByText('Revogar chave de API?')).toBeInTheDocument()
      expect(
        screen.getByText(/Qualquer aplicação usando esta chave/)
      ).toBeInTheDocument()
    })

    it('closes the dialog without deleting when Cancel is clicked', async () => {
      render(<ApiKeyManager />)
      fireEvent.click(screen.getByText('Revogar'))
      fireEvent.click(screen.getByText('Cancelar'))
      await waitFor(() => {
        expect(
          screen.queryByText('Revogar chave de API?')
        ).not.toBeInTheDocument()
      })
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('calls /api/delete-key with DELETE on confirm', async () => {
      mockFetch(true, {})
      render(<ApiKeyManager />)
      fireEvent.click(screen.getByText('Revogar'))
      // The AlertDialogAction is the second "Revogar" text (inside the dialog footer)
      const revogarButtons = screen.getAllByText('Revogar')
      await act(async () => {
        fireEvent.click(revogarButtons[revogarButtons.length - 1])
      })
      expect(global.fetch).toHaveBeenCalledWith('/api/delete-key', {
        method: 'DELETE',
      })
    })

    it('shows a success toast after successful deletion', async () => {
      mockFetch(true, {})
      render(<ApiKeyManager />)
      fireEvent.click(screen.getByText('Revogar'))
      const revogarButtons = screen.getAllByText('Revogar')
      await act(async () => {
        fireEvent.click(revogarButtons[revogarButtons.length - 1])
      })
      expect(toast.success).toHaveBeenCalledWith(
        'Chave de API removida com sucesso'
      )
    })

    it('shows an error toast when deletion fails', async () => {
      mockFetch(false, {})
      render(<ApiKeyManager />)
      fireEvent.click(screen.getByText('Revogar'))
      const revogarButtons = screen.getAllByText('Revogar')
      await act(async () => {
        fireEvent.click(revogarButtons[revogarButtons.length - 1])
      })
      expect(toast.error).toHaveBeenCalledWith(
        'Falha ao remover a chave de API'
      )
    })

    it('does not call delete when user id is missing', async () => {
      mockUseUser.mockReturnValue({ id: null })
      render(<ApiKeyManager />)
      fireEvent.click(screen.getByText('Revogar'))
      const revogarButtons = screen.getAllByText('Revogar')
      await act(async () => {
        fireEvent.click(revogarButtons[revogarButtons.length - 1])
      })
      expect(global.fetch).not.toHaveBeenCalled()
    })
  })

  describe('copy key in dialog', () => {
    beforeEach(() => {
      mockUseApiKey.mockReturnValue({ apiKey: null, isLoading: false })
      mockFetch(true, { key: 'usr_newkey_abc123' })
    })

    it('copies the key to clipboard when the copy button is clicked', async () => {
      render(<ApiKeyManager />)
      await act(async () => {
        fireEvent.click(screen.getByText('Gerar chave de API'))
      })
      // Copy button is the icon button inside the dialog
      const copyButton = screen.getByRole('button', { name: '' })
      await act(async () => {
        fireEvent.click(copyButton)
      })
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'usr_newkey_abc123'
      )
    })
  })
})
