/**
 * Test for the Admin Panel components
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { UserProvider } from '../context/UserContext'
import AdminPanel from '../pages/admin'
import UserManagement from '../components/admin/UserManagement'
import TownManagement from '../components/admin/TownManagement'
import GlobalStatistics from '../components/admin/GlobalStatistics'

// Mock the Layout component
jest.mock('../components/layout/Layout', () => {
  return function Layout({ children }) {
    return <div data-testid="layout">{children}</div>
  }
})

// Mock the configuration
jest.mock('../configuration', () => ({
  API_URL: 'http://localhost:8000',
  conf: {
    sabanayegua: {
      nombre: 'Sabana Yegua',
      barrios: [
        { nombre: 'Barrio 1', color: '#FF0000' },
        { nombre: 'Barrio 2', color: '#00FF00' }
      ],
      map_center: { lat: 18.46, lng: -70.84 }
    }
  }
}))

// Mock the hooks
jest.mock('../hooks/queries', () => ({
  usePdr: jest.fn(() => ({ status: 'success', data: [] })),
  useWeight: jest.fn(() => ({ status: 'success', data: [] }))
}))

// Mock user with admin role
const mockAdminUser = {
  name: 'Admin User',
  email: 'admin@test.com',
  picture: 'http://example.com/pic.jpg',
  role: 'admin',
  permissions: ['manage_users']
}

// Test component wrapper
const TestWrapper = ({ user, children }) => {
  return (
    <UserProvider>
      <TestUserSetter user={user} />
      {children}
    </UserProvider>
  )
}

// Helper component to set user in context
const TestUserSetter = ({ user }) => {
  const { setUser } = require('../context/UserContext').useUser()
  React.useEffect(() => {
    setUser(user)
  }, [user, setUser])
  return null
}

describe('Admin Panel', () => {
  test('renders admin panel with proper structure', () => {
    render(
      <TestWrapper user={mockAdminUser}>
        <AdminPanel />
      </TestWrapper>
    )

    expect(screen.getByText('Panel de Administración')).toBeInTheDocument()
  })

  test('shows access denied for non-admin users', () => {
    const nonAdminUser = { ...mockAdminUser, role: 'read' }
    
    render(
      <TestWrapper user={nonAdminUser}>
        <AdminPanel />
      </TestWrapper>
    )

    expect(screen.getByText('Acceso Denegado')).toBeInTheDocument()
  })

  test('town management component is importable', () => {
    // Just verify the component can be imported and instantiated
    expect(TownManagement).toBeDefined()
  })

  test('global statistics component is importable', () => {
    // Just verify the component can be imported and instantiated
    expect(GlobalStatistics).toBeDefined()
  })

  test('user management component is importable', () => {
    // Just verify the component can be imported and instantiated
    expect(UserManagement).toBeDefined()
  })
})
