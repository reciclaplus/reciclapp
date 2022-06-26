import conn from '../../../lib/db'

export default async (req, res) => {

    const n = 3
    try {
            const query = `SELECT
            * 
          FROM (
            SELECT
              ROW_NUMBER() OVER (PARTITION BY (id, barrio) ORDER BY date) AS r,
              t.*
            FROM
              recogida t) x
          WHERE
            x.r <=${n}`

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