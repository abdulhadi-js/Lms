const { Pool } = require('pg');
const bcrypt = require('bcrypt');

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
    const passHash = await bcrypt.hash('Password123!', 10);
    
    // Students
    const students = [
      { email: 'alice.smith@student.educore.com', f: 'Alice', l: 'Smith' },
      { email: 'bob.khan@student.educore.com', f: 'Bob', l: 'Khan' },
      { email: 'carol.lee@student.educore.com', f: 'Carol', l: 'Lee' }
    ];
    for (const s of students) {
      await client.query(
        'INSERT INTO users (email, "passwordHash", role, status, "firstName", "lastName", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) ON CONFLICT (email) DO NOTHING',
        [s.email, passHash, 'STUDENT', 'ACTIVE', s.f, s.l]
      );
    }

    let teachersRes = await client.query("SELECT id FROM users WHERE role = 'TEACHER'");
    if (teachersRes.rows.length === 0) {
      await client.query(
        'INSERT INTO users (email, "passwordHash", role, status, "firstName", "lastName", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) ON CONFLICT (email) DO NOTHING',
        ['teacher@educore.com', passHash, 'TEACHER', 'ACTIVE', 'Jane', 'Teacher']
      );
      teachersRes = await client.query("SELECT id FROM users WHERE role = 'TEACHER'");
    }
    const teacherId = teachersRes.rows[0].id;

    // Courses
    const courses = [
      { title: 'Calculus I', code: 'MATH101' },
      { title: 'OOPs', code: 'CS102' },
      { title: 'Introduction to Computer Science', code: 'CS101' },
      { title: 'Academic Writing', code: 'ENG101' }
    ];
    for (const c of courses) {
      await client.query(
        'INSERT INTO courses (title, code, "teacherId", status, credits) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (code) DO NOTHING',
        [c.title, c.code, teacherId, 'ACTIVE', 3]
      );
    }
    console.log("Base users and courses seeded successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}
seed();
