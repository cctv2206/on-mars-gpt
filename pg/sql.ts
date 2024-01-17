import { Pool } from 'pg';
import dotenv from 'dotenv';
import { getCoordinatesString } from '../util/location.util';
import { doInTxn } from '../util/db.util';
dotenv.config({ path: '.env.development.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

(async () => {
  const rows = await doInTxn(pool, async (client) => {
    const sql = `
      UPDATE location_status
      SET occupied = TRUE, occupied_by = $1, occupied_since = NOW()
      WHERE coordinates = $2 
      AND (occupied = FALSE OR (occupied = TRUE AND occupied_since <= NOW() - INTERVAL '2 hours'))
      returning *
    `;
    const coordinates = { x: 3, y: 4 };
    const values = [1, getCoordinatesString(coordinates)];
    const result = await client.query(sql, values);
    return result.rows;
  })

  // const rows = await doInTxn(pool, async (client) => {
  //   const sql = `
  //     INSERT INTO location_status (coordinates)
  //     VALUES ($1)
  //     returning *
  //   `;
  //   const coordinates = { x: 1, y: 1 };
  //   const values = [getCoordinatesString(coordinates)];
  //   const result = await client.query(sql, values);
  //   return result.rows;
  // })


  console.log(rows);
})();
