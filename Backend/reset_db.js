const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'educore_lms',
  password: 'postgres',
  port: 5432,
});

async function reset() {
  const client = await pool.connect();
  try {
    await client.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
    console.log("Database schema reset successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}
reset();
