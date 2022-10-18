import { render } from '@testing-library/react'
import { WeightContext } from '../context/WeightContext'
import WeightPage from '../pages/pesada'

describe('Testing the list page', () => {

  test("list page", () => {

    const providerProps = {
      weight:[{"date":"2022-09-21T14:50:17.538Z","pet":694,"galones":98,"plasticoduro":0,"basura":22},{"date":"2022-09-13T15:51:18.739Z","pet":570.5,"galones":125.5,"plasticoduro":0,"basura":11},{"date":"2022-09-07T14:58:27.641Z","pet":819,"galones":93,"plasticoduro":0,"basura":31},{"date":"2022-08-10T04:00:00.000Z","pet":388.5,"galones":62.5,"plasticoduro":0,"basura":0},{"date":"2022-08-31T14:37:21.110Z","pet":638,"galones":236,"plasticoduro":0,"basura":25.5},{"date":"2022-08-17T04:00:00.000Z","pet":1137.5,"galones":187,"plasticoduro":0,"basura":62},{"date":"2022-07-27T04:00:00.000Z","pet":963.5,"galones":0,"plasticoduro":0,"basura":5.5},{"date":"2022-03-30T04:00:00.000Z","pet":1218,"galones":103,"plasticoduro":0,"basura":0},{"date":"2022-04-06T04:00:00.000Z","pet":955.5,"galones":152.5,"plasticoduro":0,"basura":0},{"date":"2022-07-13T04:00:00.000Z","pet":683.5,"galones":127,"plasticoduro":0,"basura":47.5},{"date":"2022-08-03T04:00:00.000Z","pet":683,"galones":132,"plasticoduro":0,"basura":26.5},{"date":"2022-02-17T00:03:00.000Z","pet":671,"galones":114,"plasticoduro":null,"basura":10,"tableData":{"id":0}},{"date":"2022-03-23T13:41:00.000Z","galones":110,"pet":887.5,"basura":27.5,"tableData":{"id":1}},{"date":"2022-04-13T13:34:00.000Z","pet":863,"galones":50,"plasticoduro":null,"basura":13,"tableData":{"id":2}},{"date":"2022-04-20T12:45:41.792Z","pet":436,"galones":58,"basura":9,"tableData":{"id":3}},{"date":"2022-04-27T13:50:00.000Z","pet":866,"galones":110,"basura":21.5,"tableData":{"id":4}},{"date":"2022-05-04T13:44:15.881Z","pet":519,"galones":93,"basura":15,"tableData":{"id":5}},{"date":"2022-05-18T14:52:00.000Z","pet":1757,"galones":238.5,"basura":99,"tableData":{"id":7}},{"date":"2022-05-25T14:54:00.000Z","pet":889,"galones":51.5,"basura":21.5,"tableData":{"id":8}},{"date":"2022-06-01T14:56:00.000Z","pet":844,"galones":56,"basura":14,"tableData":{"id":9}},{"date":"2022-06-08T14:57:00.000Z","pet":1254,"galones":54,"basura":13,"tableData":{"id":10}},{"date":"2022-06-15T14:49:39.771Z","pet":99.5,"galones":254.5,"basura":97,"tableData":{"id":6}},{"date":"2022-06-29T14:33:25.051Z","pet":603,"galones":182,"basura":33.5,"tableData":{"id":11}}],
      setWeight: () => {}
    }
    
    const page = render(
    <WeightContext.Provider value={providerProps}>
      <WeightPage/>
    </WeightContext.Provider>)
    
    // Testing table is not null
    expect(page.queryByTestId('weight-table')).not.toBeNull()

    // Testing number of rows displaying
    expect(page.queryByTestId('footer').textContent).toBe('Filas por página:1001–23 de 23')
    
    // Testing columns
    expect(page.getAllByRole('columnheader').length).toBeGreaterThan(0)
    

    

  })
})
