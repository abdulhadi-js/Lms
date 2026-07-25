const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'educore_lms',
  password: 'postgres',
  port: 5432,
});

async function seed() {
  const client = await pool.connect();
  try {
    const studentsRes = await client.query("SELECT id, email FROM users WHERE role = 'STUDENT'");
    const coursesRes = await client.query("SELECT id, title FROM courses");
    
    if (studentsRes.rows.length === 0 || coursesRes.rows.length === 0) {
      console.log('No students or courses found. Cannot seed enrollments.');
      return;
    }

    const students = studentsRes.rows;
    const courses = coursesRes.rows;
    
    const statuses = ['ENROLLED', 'COMPLETED', 'DROPPED'];
    let inserted = 0;

    for (let i = 0; i < 15; i++) {
      const student = students[Math.floor(Math.random() * students.length)];
      const course = courses[Math.floor(Math.random() * courses.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      try {
        await client.query(
          'INSERT INTO enrollments ("studentId", "courseId", "status") VALUES ($1, $2, $3)',
          [student.id, course.id, status]
        );
        inserted++;
      } catch (err) {
        console.error('Error inserting:', err.message);
      }
    }
    console.log(`Successfully seeded ${inserted} enrollments with randomized statuses!`);
  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
