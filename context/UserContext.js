import React, { createContext, useContext, useState } from 'react'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions && user.permissions.includes(permission)
  }

  const hasRole = (role) => {
    if (!user) return false
    return user.role === role || user.role === 'admin'
  }

  const canRead = (resource) => {
    return hasPermission(`read_${resource}`)
  }

  const canWrite = (resource) => {
    return hasPermission(`write_${resource}`)
  }

  const canDelete = (resource) => {
    return hasPermission(`delete_${resource}`)
  }

  const canManageUsers = () => {
    return hasPermission('manage_users')
  }

  const value = {
    user,
    setUser,
    hasPermission,
    hasRole,
    canRead,
    canWrite,
    canDelete,
    canManageUsers
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export { UserContext }