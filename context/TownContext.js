import { createContext } from 'react'
import { TOWN } from '../configuration'

// Town is now determined by environment variable/deployment, not user selection
export const TownContext = createContext({
  town: TOWN
})
