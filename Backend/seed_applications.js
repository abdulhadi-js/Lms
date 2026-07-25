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
    const apps = [
      { email: 'david.miller@gmail.com', fName: 'David', lName: 'Miller', phone: '+1-555-0192', course: 'Computer Science B.S.', notes: 'Great academic record', status: 'PENDING_REVIEW' },
      { email: 'sarah.jones@yahoo.com', fName: 'Sarah', lName: 'Jones', phone: '+1-555-8371', course: 'Business Administration', notes: 'Transfer student from NYU', status: 'PENDING_REVIEW' },
      { email: 'emily.chen@hotmail.com', fName: 'Emily', lName: 'Chen', phone: '+1-555-4423', course: 'Software Engineering', notes: 'Missing high school transcript', status: 'REJECTED' },
      { email: 'michael.brown@gmail.com', fName: 'Michael', lName: 'Brown', phone: '+1-555-9982', course: 'Mathematics', notes: 'Approved for Fall semester', status: 'APPROVED' },
      { email: 'lucas.wright@yahoo.com', fName: 'Lucas', lName: 'Wright', phone: '+1-555-1122', course: 'Computer Science B.S.', notes: 'Needs scholarship info', status: 'PENDING_REVIEW' }
    ];
    let count = 0;
    for (const app of apps) {
      await client.query(
        'INSERT INTO applications (email, "firstName", "lastName", "phone", "desiredCourse", "status", "notes", "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())',
        [app.email, app.fName, app.lName, app.phone, app.course, app.status, app.notes]
      );
      count++;
    }
    console.log(`Successfully seeded ${count} applications!`);
  } catch (err) {
    console.error('Error seeding applications:', err);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
