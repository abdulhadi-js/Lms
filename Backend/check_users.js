const { Client } = require('pg');

async function check() {
  const client = new Client({ 
    connectionString: 'postgresql://educore_user:bhMRBk7XcMhfhRIpEw5W4MCQ7t8Uhg80@dpg-d9k967rm8hqs73bv57eg-a.oregon-postgres.render.com/educore_5zmd?sslmode=require' 
  });
  await client.connect();
  try {
    const res = await client.query('SELECT email, status FROM users');
    console.log("Users:", res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
check();
