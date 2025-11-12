import { createContext, useContext, useMemo } from 'react';
import { TOWN } from '../configuration';
import { useTown } from '../hooks/queries';

// Create the context with default values
export const TownContext = createContext({
  town: TOWN,
  townConfig: null,
  isLoading: true,
  error: null
});

// Provider component that fetches and provides town configuration
export function TownProvider({ children }) {
  const townQuery = useTown(TOWN);

  const contextValue = useMemo(() => ({
    town: TOWN,
    townConfig: townQuery.data || null,
    isLoading: townQuery.isLoading,
    error: townQuery.error
  }), [townQuery.data, townQuery.isLoading, townQuery.error]);

  return (
    <TownContext.Provider value={contextValue}>
      {children}
    </TownContext.Provider>
  );
}

// Custom hook to use the town context
export function useTownContext() {
  return useContext(TownContext);
}
