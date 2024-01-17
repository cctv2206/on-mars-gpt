import { Pool } from 'pg';
import dotenv from 'dotenv';
import { getCoordinatesString } from '../util/location.util';
import { doInTxn } from '../util/db.util';
dotenv.config({ path: '.env.development.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

(async () => {
  await doInTxn(pool, async (client) => {
    const sql = `
      UPDATE location_status
      SET occupied = TRUE, occupied_by = $1, occupied_since = NOW()
      WHERE coordinates = $2 
      AND (occupied = FALSE OR (occupied = TRUE AND occupied_since <= NOW() - INTERVAL '2 hours'))
      returning *
    `;
    const coordinates = { x: 2, y: 3 };
    const values = [2, getCoordinatesString(coordinates)];
    const result = await client.query(sql, values);
    console.log('result:', result);
    console.log('result.rows:', result.rows);
  })
  
  // const client = await pool.connect();
  // try {
  //   await client.query('BEGIN');
  //   const coordinates = { x: 2, y: 3 }
  //   // const sql = `
  //   //   UPDATE location_status
  //   //   SET occupied = TRUE, occupied_by = $1, occupied_since = NOW()
  //   //   WHERE coordinates = $2 
  //   //   AND (occupied = FALSE OR (occupied = TRUE AND occupied_since <= NOW() - INTERVAL '30 seconds'))
  //   //   returning *
  //   // `;

  //   const sql = `
  //     UPDATE location_status
  //     SET occupied = TRUE, occupied_by = $1, occupied_since = NOW()
  //     WHERE coordinates = $2
  //   `;
  //   // const sql = `
  //   // select * from location_status where coordinates = $1
  //   // `
  //   const values = [2, getCoordinatesString(coordinates)];
  //   const result = await client.query(sql, values);
  //   console.log('result:', result);
  //   console.log('result.rows:', result.rows);

  //   await client.query("COMMIT");
  // } catch (error) {
  //   await client.query('ROLLBACK');
  //   console.log('error:', error);
  // } finally {
  //   client.release();
  // }
})();
