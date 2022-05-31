import conn from '../../../lib/db'
import { getDateOfWeek } from '../../../utils/dates'

export default async (req, res) => {

    const pdr = JSON.parse(req.body).pdr
    console.log(pdr)
    console.log(pdr[0].recogida[0])
    const query = 'INSERT INTO recogida(id, barrio, year, week, date, value) VALUES ' +
             '($1, $2, $3, $4, $5, $6)'
    
    pdr.map( element => {
        let id = element.id
        let barrio = element.barrio
        element.recogida.map(async (weekData) => {
            let year = weekData.year
            let week = weekData.week
            let value = weekData.wasCollected
            let date = getDateOfWeek(week, year)

            let queryValues = [id, barrio, year, week, date, value]

            try {
                const result = await conn.query(query, queryValues)
                .then(res => console.log(res.rows) )
                          
                res.status(200)
            }
        catch ( error ) {
               console.log( error );
               return false
               }
        })

})
    }