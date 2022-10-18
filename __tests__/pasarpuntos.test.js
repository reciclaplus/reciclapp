import { fireEvent, render, waitFor } from '@testing-library/react'
import moment from 'moment'
import { PdrContext } from '../context/PdrContext'
import PasarPuntosPage from '../pages/pasarPuntos'

describe('Testing the pasar puntos page', () => {

  test("pasar puntos page", () => {

    const providerProps = {
      pdr: [{"internalId":1,"nombre":"Nelson Mandela","lat":18.462140731718193,"lng":-70.83514609847093,"barrio":"Ojo de Agua","categoria":"casa","zafacon":true,"id":1,"descripcion":"Calle Emilio Prud'Homme 24","recogida":[],"alerta":false,"active":true,"tableData":{"id":0}},{"internalId":2,"nombre":"Jane Goodall","lat":18.459851115089396,"lng":-70.83119687214337,"barrio":"Barrio Nuevo","categoria":"casa","zafacon":true,"id":1,"descripcion":"Calle Jose MartÃ­ 13","recogida":[],"alerta":false,"active":"true","tableData":{"id":1}},{"internalId":3,"nombre":"Wangari Maathai","lat":18.45494228852632,"lng":-70.82762157023635,"barrio":"Barrio Blanco","categoria":"casa","zafacon":true,"id":1,"descripcion":"Calle 19 de marzo frente al hotel AA","recogida":[],"alerta":false,"active":"true","tableData":{"id":2}},{"internalId":4,"nombre":"Greta Thunberg","lat":18.463492325292986,"lng":-70.83343279987761,"barrio":"El Abanico","categoria":"casa","zafacon":true,"id":1,"descripcion":"Calle del colmado de Angel en la Esquina","recogida":[],"tableData":{"id":3},"alerta":false,"active":"true"},{"internalId":5,"nombre":"Sebastiao Salgado","lat":18.456618120554186,"lng":-70.83669901832872,"barrio":"Barrio Pintado","categoria":"casa","zafacon":true,"id":1,"descripcion":"Calle altagracia 42","recogida":[],"tableData":{"id":4},"alerta":false,"active":"true"},{"internalId":6,"nombre":"Berta Caceres","lat":18.4575696658742,"lng":-70.8330190275603,"barrio":"Barrio Pintado","categoria":"casa","zafacon":true,"id":2,"descripcion":"Calle Mella cerca del parque","recogida":[],"alerta":false,"active":"true","tableData":{"id":5}},{"internalId":7,"nombre":"Leonardo DiCaprio","lat":18.458149749769376,"lng":-70.83639324650102,"barrio":"Barrio Pintado","categoria":"casa","zafacon":false,"id":3,"descripcion":"Calle Capotillo Esquina FerreterÃ­a A&D","recogida":[],"tableData":{"id":6},"alerta":false,"active":"true"},{"internalId":8,"nombre":"David Attenborough","lat":18.45771723125657,"lng":-70.83717645153337,"barrio":"Los Cartones","categoria":"casa","zafacon":false,"id":1,"descripcion":"Calle Independencia 10","recogida":[],"alerta":false,"active":"true","tableData":{"id":7}}],
      setPdr: () => {}
    }
    
    const page = render(<PdrContext.Provider value={providerProps}><PasarPuntosPage/></PdrContext.Provider>)
    
    const form = page.getByTestId("pasar-puntos-form")
    const formFields = page.getAllByRole("form-field")
    
    // Form fields are in place
    expect(formFields[0].firstChild.firstChild.textContent).toBe("Fecha")
    expect(formFields[0].firstChild.childNodes[1].firstChild.value).toBe(moment().format("YYYY-MM-DD"))
    expect(formFields[1].firstChild.firstChild.textContent).toBe("Barrio")
  })

  test("dropdown pdrs appear when selecting barrio", async () => {
    const providerProps = {
        pdr: [{"internalId":1,"nombre":"Nelson Mandela","lat":18.462140731718193,"lng":-70.83514609847093,"barrio":"Ojo de Agua","categoria":"casa","zafacon":true,"id":1,"descripcion":"Calle Emilio Prud'Homme 24","recogida":[],"alerta":false,"active":true,"tableData":{"id":0}},{"internalId":2,"nombre":"Jane Goodall","lat":18.459851115089396,"lng":-70.83119687214337,"barrio":"Barrio Nuevo","categoria":"casa","zafacon":true,"id":1,"descripcion":"Calle Jose MartÃ­ 13","recogida":[],"alerta":false,"active":"true","tableData":{"id":1}},{"internalId":3,"nombre":"Wangari Maathai","lat":18.45494228852632,"lng":-70.82762157023635,"barrio":"Barrio Blanco","categoria":"casa","zafacon":true,"id":1,"descripcion":"Calle 19 de marzo frente al hotel AA","recogida":[],"alerta":false,"active":"true","tableData":{"id":2}},{"internalId":4,"nombre":"Greta Thunberg","lat":18.463492325292986,"lng":-70.83343279987761,"barrio":"El Abanico","categoria":"casa","zafacon":true,"id":1,"descripcion":"Calle del colmado de Angel en la Esquina","recogida":[],"tableData":{"id":3},"alerta":false,"active":"true"},{"internalId":5,"nombre":"Sebastiao Salgado","lat":18.456618120554186,"lng":-70.83669901832872,"barrio":"Barrio Pintado","categoria":"casa","zafacon":true,"id":1,"descripcion":"Calle altagracia 42","recogida":[],"tableData":{"id":4},"alerta":false,"active":"true"},{"internalId":6,"nombre":"Berta Caceres","lat":18.4575696658742,"lng":-70.8330190275603,"barrio":"Barrio Pintado","categoria":"casa","zafacon":true,"id":2,"descripcion":"Calle Mella cerca del parque","recogida":[],"alerta":false,"active":"true","tableData":{"id":5}},{"internalId":7,"nombre":"Leonardo DiCaprio","lat":18.458149749769376,"lng":-70.83639324650102,"barrio":"Barrio Pintado","categoria":"casa","zafacon":false,"id":3,"descripcion":"Calle Capotillo Esquina FerreterÃ­a A&D","recogida":[],"tableData":{"id":6},"alerta":false,"active":"true"},{"internalId":8,"nombre":"David Attenborough","lat":18.45771723125657,"lng":-70.83717645153337,"barrio":"Los Cartones","categoria":"casa","zafacon":false,"id":1,"descripcion":"Calle Independencia 10","recogida":[],"alerta":false,"active":"true","tableData":{"id":7}}],
        setPdr: () => {}
      }
      
    const page = render(<PdrContext.Provider value={providerProps}><PasarPuntosPage/></PdrContext.Provider>)
      
    const form = page.getByTestId("pasar-puntos-form")
    const selectElement = form.childNodes[1].firstChild.childNodes[1].firstChild

    await waitFor(() => {
        // Before selecting barrio no pdrs are displayed
        expect(page.queryAllByRole("form-field")[2].childNodes.length).toBe(0)
        fireEvent.change(selectElement, { target: { value: "Barrio Blanco" } });
        expect(selectElement.value).toBe("Barrio Blanco");
        // After selecting barrio pdrs appear
        expect(page.queryAllByRole("form-field")[2].childNodes.length).toBeGreaterThan(0)

      });

  })
})
