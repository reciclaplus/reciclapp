import { render } from '@testing-library/react'
import { useContext } from 'react'
import { TownContext } from '../context/TownContext'

describe('TownContext', () => {
  test('provides default town value', () => {
    let townValue = null
    
    function TestComponent() {
      const { town } = useContext(TownContext)
      townValue = town
      return <div>{town}</div>
    }

    const { container } = render(
      <TownContext.Provider value={{ town: 'sabanayegua' }}>
        <TestComponent />
      </TownContext.Provider>
    )
    
    expect(townValue).toBe('sabanayegua')
    expect(container.textContent).toBe('sabanayegua')
  })

  test('town value is read-only (no setTown)', () => {
    let contextValue = null
    
    function TestComponent() {
      contextValue = useContext(TownContext)
      return <div>{contextValue.town}</div>
    }

    render(
      <TownContext.Provider value={{ town: 'sample' }}>
        <TestComponent />
      </TownContext.Provider>
    )
    
    expect(contextValue).toHaveProperty('town')
    expect(contextValue.town).toBe('sample')
    // setTown should not exist anymore
    expect(contextValue).not.toHaveProperty('setTown')
  })
})
