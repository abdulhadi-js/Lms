const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://educore_user:bhMRBk7XcMhfhRIpEw5W4MCQ7t8Uhg80@dpg-d9k967rm8hqs73bv57eg-a.oregon-postgres.render.com/educore_5zmd?sslmode=require' });
client.connect().then(async () => {
  try {
    // Delete the campus to see what the exact error is from Postgres
    await client.query("DELETE FROM campuses WHERE id = 'f038b093-da4e-4e54-bd2e-acae0d451a05'");
    console.log('Successfully deleted');
  } catch (err) {
    console.error('Delete failed:', err);
  } finally {
    client.end();
  }
});
