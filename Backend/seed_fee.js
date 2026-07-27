const { DataSource } = require('typeorm');
const path = require('path');

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'educore',
});

async function seedFee() {
  await dataSource.initialize();
  
  const users = await dataSource.query(`SELECT * FROM users WHERE role = 'STUDENT' LIMIT 1`);
  if (!users.length) return console.log('No student found');
  const student = users[0];
  
  const courses = await dataSource.query(`SELECT * FROM course LIMIT 1`);
  const courseId = courses.length ? courses[0].id : null;
  
  await dataSource.query(
    `INSERT INTO fee (id, "studentId", "courseId", amount, "paidAmount", description, "dueDate", status, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, 45000, 0, 'Semester Fall 2026 Tuition', '2026-08-31', 'PENDING', NOW(), NOW())`,
    [student.id, courseId]
  );
  
  console.log('Successfully seeded a fee for testing!');
  process.exit(0);
}

seedFee().catch(console.error);
