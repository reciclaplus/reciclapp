import React from 'react'
import { useUser } from '../../context/UserContext'

/**
 * Component that conditionally renders children based on user permissions
 */
export const PermissionGuard = ({ 
  permission, 
  role, 
  resource, 
  action = 'read',
  fallback = null, 
  children 
}) => {
  const { hasPermission, hasRole, canRead, canWrite, canDelete } = useUser()

  let hasAccess = false

  if (permission) {
    hasAccess = hasPermission(permission)
  } else if (role) {
    hasAccess = hasRole(role)
  } else if (resource && action) {
    switch (action) {
      case 'read':
        hasAccess = canRead(resource)
        break
      case 'write':
        hasAccess = canWrite(resource)
        break
      case 'delete':
        hasAccess = canDelete(resource)
        break
      default:
        hasAccess = false
    }
  }

  return hasAccess ? children : fallback
}

/**
 * Hook for checking permissions in components
 */
export const usePermissions = () => {
  const { hasPermission, hasRole, canRead, canWrite, canDelete, canManageUsers } = useUser()
  
  return {
    hasPermission,
    hasRole,
    canRead,
    canWrite,
    canDelete,
    canManageUsers
  }
}