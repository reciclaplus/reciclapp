import conn from '../../../lib/db'

export default async (req, res) => {

    const pdr = JSON.parse(req.body).pdr
    pdr.map(async (element) => {
        try {
            const query = 'INSERT INTO pdr(id, nombre, barrio, lat, lng, descripcion, zafacon) VALUES ' +
            '($6, $1, $4, $2, $3, $7, $5)'
    
            const values = Object.values(element).slice(0,7)
            console.log(values)
          const result = await conn.query(
            query, values
          ).then(res => console.log(res.rows) )
          
          res.status(200)

      } catch ( error ) {
          console.log( error );
          return false
      }
    });
    
  
  
  };