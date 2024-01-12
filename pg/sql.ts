import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.development.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

(async () => {
  try {
    const user = {
      id: 6
    }
    // const code = await getReferCodeOfUser(pool, user);
    // console.log('code:', code);

    // const queryInsertUser = `
    //       INSERT INTO users (pluginlab_id, email, username)
    //       VALUES ($1, $2, $3)
    //       returning *
    //     `;
    // const values = ['pluginlab_id_4', 'foo@email.com' ?? '', 'kai_test_4' ?? ''];
    const createTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL DEFAULT '',
        pluginlab_id VARCHAR(255) NOT NULL DEFAULT '',
        lang VARCHAR(255) NOT NULL DEFAULT 'English'
      );
    `;

    const queryUsers = `
        select * from users;
    `

    const result = await pool.query(queryUsers);

    console.log('query res:', result);
    console.log('query res rows:', result.rows);
  } catch (error) {
    console.log('error:', error);
  }
})();
