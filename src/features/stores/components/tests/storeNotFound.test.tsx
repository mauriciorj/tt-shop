import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import NotFoundStore from '../storeNotFound'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
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

beforeEach(() => {
  jest.clearAllMocks()
})

describe('NotFoundStore', () => {
  describe('content', () => {
    it('renders the "Store Not Found" heading', () => {
      render(<NotFoundStore />)
      expect(
        screen.getByRole('heading', { name: 'Store Not Found' })
      ).toBeInTheDocument()
    })

    it('renders the descriptive message', () => {
      render(<NotFoundStore />)
      expect(
        screen.getByText("The store youre looking for doesnt exist.")
      ).toBeInTheDocument()
    })

    it('renders the back button', () => {
      render(<NotFoundStore />)
      expect(
        screen.getByRole('button', { name: /Voltar para lojas/i })
      ).toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('calls router.push with /stores when the button is clicked', () => {
      render(<NotFoundStore />)
      fireEvent.click(screen.getByRole('button', { name: /Voltar para lojas/i }))
      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith('/stores')
    })

    it('does not navigate before the button is clicked', () => {
      render(<NotFoundStore />)
      expect(mockPush).not.toHaveBeenCalled()
    })
  })
})
