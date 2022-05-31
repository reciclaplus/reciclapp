import conn from '../../../lib/db'

export default async (req, res) => {

        try {
            const query = 'SELECT * FROM pdr'
            console.log("Querying...")
            const result = await conn.query(
                query
            )
            result.rows
            res.status(200).json(result.rows)

      } catch ( error ) {
          console.log( error );
          return false
      }
  };