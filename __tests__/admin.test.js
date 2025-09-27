import { render, screen } from '@testing-library/react'
import Admin from '../pages/admin'
import { useCurrentUser } from '../hooks/queries'

// Mock the user query hook
jest.mock('../hooks/queries')
const mockUseCurrentUser = useCurrentUser

// Mock Layout component
jest.mock('../components/layout/Layout', () => {
  return function MockLayout({ children }) {
    return <div data-testid="layout">{children}</div>
  }
})

// Mock AdminPanel component  
jest.mock('../components/admin/AdminPanel', () => {
  return function MockAdminPanel() {
    return <div data-testid="admin-panel">Admin Panel Content</div>
  }
})

describe('Admin Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('shows loading state while checking user permissions', () => {
    mockUseCurrentUser.mockReturnValue({
      status: 'loading',
      data: null
    })

    render(<Admin />)
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  test('shows access denied message for non-admin users', () => {
    mockUseCurrentUser.mockReturnValue({
      status: 'success',
      data: { role: 'user', name: 'Test User' }
    })

    render(<Admin />)
    
    expect(screen.getByText(/No tienes permisos de administrador/)).toBeInTheDocument()
    expect(screen.queryByTestId('admin-panel')).not.toBeInTheDocument()
  })

  test('shows admin panel for admin users', () => {
    mockUseCurrentUser.mockReturnValue({
      status: 'success',
      data: { role: 'admin', name: 'Admin User' }
    })

    render(<Admin />)
    
    expect(screen.getByTestId('admin-panel')).toBeInTheDocument()
    expect(screen.queryByText(/No tienes permisos de administrador/)).not.toBeInTheDocument()
  })

  test('shows access denied message for authentication error', () => {
    mockUseCurrentUser.mockReturnValue({
      status: 'error',
      data: null
    })

    render(<Admin />)
    
    expect(screen.getByText(/No tienes permisos de administrador/)).toBeInTheDocument()
  })
})