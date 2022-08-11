import { createContext } from 'react'

export const StatsContext = createContext({
  stats: [],
  setStats: () => {}
})
