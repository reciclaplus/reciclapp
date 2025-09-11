/**
 * Integration test for the access management system
 * This tests the frontend permission components and context
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { UserProvider } from '../context/UserContext'
import { PermissionGuard } from '../components/common/PermissionGuard'

// Mock user data for testing
const mockUsers = {
  admin: {
    name: 'Admin User',
    email: 'admin@test.com',
    picture: 'http://example.com/pic.jpg',
    role: 'admin',
    permissions: ['manage_users']
  },
  editor: {
    name: 'Editor User',
    email: 'editor@test.com', 
    picture: 'http://example.com/pic.jpg',
    role: 'editor',
    permissions: ['read_pdr', 'write_pdr', 'read_recogida']
  },
  viewer: {
    name: 'Viewer User',
    email: 'viewer@test.com',
    picture: 'http://example.com/pic.jpg', 
    role: 'viewer',
    permissions: ['read_pdr']
  }
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

describe('Access Management System', () => {
  describe('PermissionGuard Component', () => {
    test('admin user sees all content', () => {
      render(
        <TestWrapper user={mockUsers.admin}>
          <PermissionGuard permission="write_pdr">
            <div>Admin Content</div>
          </PermissionGuard>
        </TestWrapper>
      )
      
      expect(screen.getByText('Admin Content')).toBeInTheDocument()
    })

    test('editor user sees content they have permission for', () => {
      render(
        <TestWrapper user={mockUsers.editor}>
          <PermissionGuard permission="write_pdr">
            <div>Editor Can See This</div>
          </PermissionGuard>
          <PermissionGuard permission="manage_users">
            <div>Editor Cannot See This</div>
          </PermissionGuard>
        </TestWrapper>
      )
      
      expect(screen.getByText('Editor Can See This')).toBeInTheDocument()
      expect(screen.queryByText('Editor Cannot See This')).not.toBeInTheDocument()
    })

    test('viewer user sees only content they have permission for', () => {
      render(
        <TestWrapper user={mockUsers.viewer}>
          <PermissionGuard permission="read_pdr">
            <div>Viewer Can Read</div>
          </PermissionGuard>
          <PermissionGuard permission="write_pdr">
            <div>Viewer Cannot Write</div>
          </PermissionGuard>
        </TestWrapper>
      )
      
      expect(screen.getByText('Viewer Can Read')).toBeInTheDocument()
      expect(screen.queryByText('Viewer Cannot Write')).not.toBeInTheDocument()
    })

    test('resource-based permissions work correctly', () => {
      render(
        <TestWrapper user={mockUsers.editor}>
          <PermissionGuard resource="pdr" action="read">
            <div>Can Read PDR</div>
          </PermissionGuard>
          <PermissionGuard resource="pdr" action="write">
            <div>Can Write PDR</div>
          </PermissionGuard>
          <PermissionGuard resource="weight" action="write">
            <div>Cannot Write Weight</div>
          </PermissionGuard>
        </TestWrapper>
      )
      
      expect(screen.getByText('Can Read PDR')).toBeInTheDocument()
      expect(screen.getByText('Can Write PDR')).toBeInTheDocument()
      expect(screen.queryByText('Cannot Write Weight')).not.toBeInTheDocument()
    })

    test('role-based permissions work correctly', () => {
      render(
        <TestWrapper user={mockUsers.editor}>
          <PermissionGuard role="editor">
            <div>Editor Role Content</div>
          </PermissionGuard>
          <PermissionGuard role="admin">
            <div>Admin Only Content</div>
          </PermissionGuard>
        </TestWrapper>
      )
      
      expect(screen.getByText('Editor Role Content')).toBeInTheDocument()
      expect(screen.queryByText('Admin Only Content')).not.toBeInTheDocument()
    })

    test('fallback content shows when access denied', () => {
      render(
        <TestWrapper user={mockUsers.viewer}>
          <PermissionGuard 
            permission="manage_users" 
            fallback={<div>Access Denied</div>}
          >
            <div>Secret Content</div>
          </PermissionGuard>
        </TestWrapper>
      )
      
      expect(screen.getByText('Access Denied')).toBeInTheDocument()
      expect(screen.queryByText('Secret Content')).not.toBeInTheDocument()
    })
  })

  describe('User Context', () => {
    test('user context provides correct permission methods', () => {
      const TestComponent = () => {
        const { hasPermission, canRead, canWrite, canManageUsers } = require('../components/common/PermissionGuard').usePermissions()
        
        return (
          <div>
            <div>{hasPermission('read_pdr') ? 'Has Read PDR' : 'No Read PDR'}</div>
            <div>{canRead('pdr') ? 'Can Read PDR' : 'Cannot Read PDR'}</div>
            <div>{canWrite('weight') ? 'Can Write Weight' : 'Cannot Write Weight'}</div>
            <div>{canManageUsers() ? 'Can Manage Users' : 'Cannot Manage Users'}</div>
          </div>
        )
      }

      render(
        <TestWrapper user={mockUsers.editor}>
          <TestComponent />
        </TestWrapper>
      )
      
      expect(screen.getByText('Has Read PDR')).toBeInTheDocument()
      expect(screen.getByText('Can Read PDR')).toBeInTheDocument()
      expect(screen.getByText('Cannot Write Weight')).toBeInTheDocument()
      expect(screen.getByText('Cannot Manage Users')).toBeInTheDocument()
    })
  })
})

// Export test utilities for use in other test files
export { TestWrapper, mockUsers }