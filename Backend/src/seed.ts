/**
 * EduCore LMS — Database Seeder
 * Run with: npx ts-node -r tsconfig-paths/register src/seed.ts
 *
 * Creates:
 *  - 1 Admin account
 *  - 2 Teacher accounts
 *  - 3 Student accounts
 *  - 3 Courses (assigned to teachers)
 *  - Grading criteria (A–F scale)
 *  - Timetable entries for each course
 *  - Fee records for enrolled students
 */

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

// ─── Data source (inline — no module system needed) ──────────────────────────

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  username: process.env.POSTGRES_USER ?? 'postgres',
  password: process.env.POSTGRES_PASSWORD ?? 'postgres',
  database: process.env.POSTGRES_DB ?? 'educore_lms',
  entities: [resolve(__dirname, '**/*.entity.{ts,js}')],
  synchronize: true,
  logging: false,
});

// ─── Seed data ────────────────────────────────────────────────────────────────

const SALT_ROUNDS = 10;

async function hash(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function seed() {
  console.log('🌱  Connecting to database…');
  await AppDataSource.initialize();
  console.log('✅  Connected.\n');

  const userRepo = AppDataSource.getRepository('users');
  const courseRepo = AppDataSource.getRepository('courses');
  const enrollmentRepo = AppDataSource.getRepository('enrollments');
  const gradingRepo = AppDataSource.getRepository('grading_criteria');
  const timetableRepo = AppDataSource.getRepository('timetable');
  const feeRepo = AppDataSource.getRepository('fees');

  // ── 1. Users ──────────────────────────────────────────────────────────────

  console.log('👤  Seeding users…');

  const users = await userRepo.save([
    {
      email: 'admin@educore.com',
      passwordHash: await hash('Admin@123'),
      role: 'ADMIN',
      status: 'ACTIVE',
      firstName: 'System',
      lastName: 'Admin',
      phone: '+1-000-000-0000',
    },
    {
      email: 'sarah.johnson@educore.com',
      passwordHash: await hash('Teacher@123'),
      role: 'TEACHER',
      status: 'ACTIVE',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1-555-100-0001',
    },
    {
      email: 'michael.chen@educore.com',
      passwordHash: await hash('Teacher@123'),
      role: 'TEACHER',
      status: 'ACTIVE',
      firstName: 'Michael',
      lastName: 'Chen',
      phone: '+1-555-100-0002',
    },
    {
      email: 'alice.smith@student.educore.com',
      passwordHash: await hash('Student@123'),
      role: 'STUDENT',
      status: 'ACTIVE',
      firstName: 'Alice',
      lastName: 'Smith',
      phone: '+1-555-200-0001',
    },
    {
      email: 'bob.khan@student.educore.com',
      passwordHash: await hash('Student@123'),
      role: 'STUDENT',
      status: 'ACTIVE',
      firstName: 'Bob',
      lastName: 'Khan',
      phone: '+1-555-200-0002',
    },
    {
      email: 'carol.lee@student.educore.com',
      passwordHash: await hash('Student@123'),
      role: 'STUDENT',
      status: 'ACTIVE',
      firstName: 'Carol',
      lastName: 'Lee',
      phone: '+1-555-200-0003',
    },
  ]);

  const [admin, teacher1, teacher2, student1, student2, student3] = users;
  console.log(`   ✓ Created ${users.length} users`);

  // ── 2. Courses ────────────────────────────────────────────────────────────

  console.log('📚  Seeding courses…');

  const courses = await courseRepo.save([
    {
      code: 'CS101',
      title: 'Introduction to Computer Science',
      description: 'Fundamentals of programming, algorithms, and data structures.',
      teacherId: teacher1.id,
      credits: 3,
      status: 'ACTIVE',
      isPublished: true,
    },
    {
      code: 'MATH201',
      title: 'Calculus I',
      description: 'Limits, derivatives, and introduction to integration.',
      teacherId: teacher2.id,
      credits: 4,
      status: 'ACTIVE',
      isPublished: true,
    },
    {
      code: 'ENG101',
      title: 'Academic Writing',
      description: 'Developing critical writing and communication skills.',
      teacherId: teacher1.id,
      credits: 3,
      status: 'ACTIVE',
      isPublished: true,
    },
  ]);

  const [cs101, math201, eng101] = courses;
  console.log(`   ✓ Created ${courses.length} courses`);

  // ── 3. Enrollments ────────────────────────────────────────────────────────

  console.log('📋  Seeding enrollments…');

  const enrollments = await enrollmentRepo.save([
    { studentId: student1.id, courseId: cs101.id, status: 'ENROLLED', enrolledAt: new Date() },
    { studentId: student1.id, courseId: math201.id, status: 'ENROLLED', enrolledAt: new Date() },
    { studentId: student2.id, courseId: cs101.id, status: 'ENROLLED', enrolledAt: new Date() },
    { studentId: student2.id, courseId: eng101.id, status: 'ENROLLED', enrolledAt: new Date() },
    { studentId: student3.id, courseId: math201.id, status: 'ENROLLED', enrolledAt: new Date() },
    { studentId: student3.id, courseId: eng101.id, status: 'ENROLLED', enrolledAt: new Date() },
  ]);

  console.log(`   ✓ Created ${enrollments.length} enrollments`);

  // ── 4. Grading Criteria (Pakistan/US Standard A–F) ────────────────────────

  console.log('📊  Seeding grading criteria…');

  await gradingRepo.save([
    { minScore: 90, maxScore: 100, gradeLetter: 'A',  gpaPoints: 4.0, description: 'Excellent' },
    { minScore: 85, maxScore: 89,  gradeLetter: 'A-', gpaPoints: 3.7, description: 'Very Good' },
    { minScore: 80, maxScore: 84,  gradeLetter: 'B+', gpaPoints: 3.3, description: 'Good' },
    { minScore: 75, maxScore: 79,  gradeLetter: 'B',  gpaPoints: 3.0, description: 'Above Average' },
    { minScore: 70, maxScore: 74,  gradeLetter: 'B-', gpaPoints: 2.7, description: 'Average' },
    { minScore: 65, maxScore: 69,  gradeLetter: 'C+', gpaPoints: 2.3, description: 'Satisfactory' },
    { minScore: 60, maxScore: 64,  gradeLetter: 'C',  gpaPoints: 2.0, description: 'Passing' },
    { minScore: 55, maxScore: 59,  gradeLetter: 'C-', gpaPoints: 1.7, description: 'Below Average' },
    { minScore: 50, maxScore: 54,  gradeLetter: 'D',  gpaPoints: 1.0, description: 'Marginal' },
    { minScore: 0,  maxScore: 49,  gradeLetter: 'F',  gpaPoints: 0.0, description: 'Failing' },
  ]);

  console.log(`   ✓ Created 10 grading criteria`);

  // ── 5. Timetable ──────────────────────────────────────────────────────────

  console.log('🕐  Seeding timetable…');

  await timetableRepo.save([
    { courseId: cs101.id,   dayOfWeek: 'MON', startTime: '09:00', endTime: '10:30', room: 'CS-101' },
    { courseId: cs101.id,   dayOfWeek: 'WED', startTime: '09:00', endTime: '10:30', room: 'CS-101' },
    { courseId: math201.id, dayOfWeek: 'TUE', startTime: '11:00', endTime: '12:30', room: 'MATH-201' },
    { courseId: math201.id, dayOfWeek: 'THU', startTime: '11:00', endTime: '12:30', room: 'MATH-201' },
    { courseId: eng101.id,  dayOfWeek: 'MON', startTime: '14:00', endTime: '15:30', room: 'ENG-101' },
    { courseId: eng101.id,  dayOfWeek: 'FRI', startTime: '10:00', endTime: '11:30', room: 'ENG-101' },
  ]);

  console.log(`   ✓ Created 6 timetable entries`);

  // ── 6. Fee Records ────────────────────────────────────────────────────────

  console.log('💰  Seeding fee records…');

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30); // due in 30 days

  await feeRepo.save([
    { studentId: student1.id, courseId: cs101.id,   amount: 1500, description: 'Course fee – CS101',   dueDate, status: 'PENDING' },
    { studentId: student1.id, courseId: math201.id, amount: 1800, description: 'Course fee – MATH201', dueDate, status: 'PENDING' },
    { studentId: student2.id, courseId: cs101.id,   amount: 1500, description: 'Course fee – CS101',   dueDate, status: 'PAID', paidAt: new Date(), paidAmount: 1500 },
    { studentId: student2.id, courseId: eng101.id,  amount: 1200, description: 'Course fee – ENG101',  dueDate, status: 'PENDING' },
    { studentId: student3.id, courseId: math201.id, amount: 1800, description: 'Course fee – MATH201', dueDate, status: 'PENDING' },
    { studentId: student3.id, courseId: eng101.id,  amount: 1200, description: 'Course fee – ENG101',  dueDate, status: 'PAID', paidAt: new Date(), paidAmount: 1200 },
  ]);

  console.log(`   ✓ Created 6 fee records`);

  // ── Done ──────────────────────────────────────────────────────────────────

  console.log('\n🎉  Database seeded successfully!\n');
  console.log('═══════════════════════════════════════════════════');
  console.log('  LOGIN CREDENTIALS');
  console.log('═══════════════════════════════════════════════════');
  console.log('  🔑 Admin:');
  console.log('     Email:    admin@educore.com');
  console.log('     Password: Admin@123');
  console.log('');
  console.log('  🎓 Teacher 1 (Sarah Johnson):');
  console.log('     Email:    sarah.johnson@educore.com');
  console.log('     Password: Teacher@123');
  console.log('');
  console.log('  🎓 Teacher 2 (Michael Chen):');
  console.log('     Email:    michael.chen@educore.com');
  console.log('     Password: Teacher@123');
  console.log('');
  console.log('  📖 Student 1 (Alice Smith):');
  console.log('     Email:    alice.smith@student.educore.com');
  console.log('     Password: Student@123');
  console.log('');
  console.log('  📖 Student 2 (Bob Khan):');
  console.log('     Email:    bob.khan@student.educore.com');
  console.log('     Password: Student@123');
  console.log('');
  console.log('  📖 Student 3 (Carol Lee):');
  console.log('     Email:    carol.lee@student.educore.com');
  console.log('     Password: Student@123');
  console.log('═══════════════════════════════════════════════════\n');

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌  Seeding failed:', err);
  process.exit(1);
});
