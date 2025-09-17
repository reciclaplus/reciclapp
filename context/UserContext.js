import { createContext, useContext, useState } from 'react'

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

  const hasRole = (role) => {
    if (!user) return false
    const roleOrder = { read: 1, write: 2, admin: 3 }
    return roleOrder[user.role] >= roleOrder[role]
  }

  const value = {
    user,
    setUser,
    hasRole
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export { UserContext }
