import { render } from '@testing-library/react'
import { PdrContext } from '../context/PdrContext'
import NewPdrPage from '../pages/newPdr'

describe('Testing the newpdr page', () => {

  test("new pdr page", () => {

    const providerProps = {
        pdr: [{"internalId":1,"nombre":"Nelson Mandela","lat":18.462140731718193,"lng":-70.83514609847093,"barrio":"Ojo de Agua","categoria":"casa","zafacon":true,"id":1,"descripcion":"Calle Emilio Prud'Homme 24","recogida":[],"alerta":false,"active":true,"tableData":{"id":0}},{"internalId":2,"nombre":"Jane Goodall","lat":18.459851115089396,"lng":-70.83119687214337,"barrio":"Barrio Nuevo","categoria":"casa","zafacon":true,"id":1,"descripcion":"Calle Jose MartÃ­ 13","recogida":[],"alerta":false,"active":"true","tableData":{"id":1}},{"internalId":3,"nombre":"Wangari Maathai","lat":18.45494228852632,"lng":-70.82762157023635,"barrio":"Barrio Blanco","categoria":"casa","zafacon":true,"id":1,"descripcion":"Calle 19 de marzo frente al hotel AA","recogida":[],"alerta":false,"active":"true","tableData":{"id":2}},{"internalId":4,"nombre":"Greta Thunberg","lat":18.463492325292986,"lng":-70.83343279987761,"barrio":"El Abanico","categoria":"casa","zafacon":true,"id":1,"descripcion":"Calle del colmado de Angel en la Esquina","recogida":[],"tableData":{"id":3},"alerta":false,"active":"true"},{"internalId":5,"nombre":"Sebastiao Salgado","lat":18.456618120554186,"lng":-70.83669901832872,"barrio":"Barrio Pintado","categoria":"casa","zafacon":true,"id":1,"descripcion":"Calle altagracia 42","recogida":[],"tableData":{"id":4},"alerta":false,"active":"true"},{"internalId":6,"nombre":"Berta Caceres","lat":18.4575696658742,"lng":-70.8330190275603,"barrio":"Barrio Pintado","categoria":"casa","zafacon":true,"id":2,"descripcion":"Calle Mella cerca del parque","recogida":[],"alerta":false,"active":"true","tableData":{"id":5}},{"internalId":7,"nombre":"Leonardo DiCaprio","lat":18.458149749769376,"lng":-70.83639324650102,"barrio":"Barrio Pintado","categoria":"casa","zafacon":false,"id":3,"descripcion":"Calle Capotillo Esquina FerreterÃ­a A&D","recogida":[],"tableData":{"id":6},"alerta":false,"active":"true"},{"internalId":8,"nombre":"David Attenborough","lat":18.45771723125657,"lng":-70.83717645153337,"barrio":"Los Cartones","categoria":"casa","zafacon":false,"id":1,"descripcion":"Calle Independencia 10","recogida":[],"alerta":false,"active":"true","tableData":{"id":7}}],
        setPdr: () => {}
      }
    
    const page = render(
    <PdrContext.Provider value={providerProps}>
      <NewPdrPage/>
    </PdrContext.Provider>)    

  })
})
