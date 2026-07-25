const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'educore_lms',
  password: 'postgres',
  port: 5432,
});

async function check() {
  const client = await pool.connect();
  try {
    const studentsRes = await client.query("SELECT id, email FROM users WHERE role = 'STUDENT'");
    const coursesRes = await client.query("SELECT id, title FROM courses");
    console.log("Students: ", studentsRes.rows);
    console.log("Courses: ", coursesRes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}
check();
