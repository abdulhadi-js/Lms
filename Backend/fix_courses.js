const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'educore_lms',
  password: 'postgres',
  port: 5432,
});

async function fix() {
  const client = await pool.connect();
  try {
    const teachersRes = await client.query("SELECT id FROM users WHERE role = 'TEACHER'");
    const teachers = teachersRes.rows;
    if (teachers.length > 0) {
      await client.query('UPDATE courses SET "teacherId" = $1 WHERE "teacherId" IS NULL', [teachers[0].id]);
      console.log('Assigned teacher to all courses!');
    } else {
      console.log('No teachers found to assign.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}
fix();
