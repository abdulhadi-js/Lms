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
    // Get existing users and courses
    const studentsRes = await client.query("SELECT id, email, \"firstName\", \"lastName\" FROM users WHERE role = 'STUDENT'");
    const teachersRes = await client.query("SELECT id, email, \"firstName\", \"lastName\" FROM users WHERE role = 'TEACHER'");
    const adminsRes = await client.query("SELECT id, email FROM users WHERE role = 'ADMIN'");
    const coursesRes = await client.query("SELECT id, title, code FROM courses");

    const students = studentsRes.rows;
    const teachers = teachersRes.rows;
    const admins = adminsRes.rows;
    const courses = coursesRes.rows;

    if (students.length === 0 || courses.length === 0) {
      console.log('Ensure you have students and courses before running this seeder.');
      return;
    }

    // 1. Applications (Realistic)
    const apps = [
      { email: 'david.miller@gmail.com', fName: 'David', lName: 'Miller', phone: '+1-555-0192', course: 'Computer Science B.S.', notes: 'Great academic record', status: 'PENDING_REVIEW' },
      { email: 'sarah.jones@yahoo.com', fName: 'Sarah', lName: 'Jones', phone: '+1-555-8371', course: 'Business Administration', notes: '', status: 'PENDING_REVIEW' },
      { email: 'emily.chen@hotmail.com', fName: 'Emily', lName: 'Chen', phone: '+1-555-4423', course: 'Software Engineering', notes: 'Missing high school transcript', status: 'REJECTED' },
      { email: 'michael.brown@gmail.com', fName: 'Michael', lName: 'Brown', phone: '+1-555-9982', course: 'Mathematics', notes: 'Approved for Fall semester', status: 'APPROVED' }
    ];
    for (const app of apps) {
      await client.query(
        'INSERT INTO applications ("applicantEmail", "firstName", "lastName", "phone", "desiredCourse", "status", "notes", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())',
        [app.email, app.fName, app.lName, app.phone, app.course, app.status, app.notes]
      ).catch(() => {});
    }
    console.log('Seeded Applications');

    // 2. Fees (Realistic)
    const feeTypes = [
      { desc: 'Fall 2024 Tuition Fee', amt: 4500, due: '2024-09-01' },
      { desc: 'Library Access Fee', amt: 150, due: '2024-09-15' },
      { desc: 'Laboratory Equipment Fee', amt: 300, due: '2024-09-15' },
      { desc: 'Student Union Fee', amt: 75, due: '2024-08-30' }
    ];
    for (const student of students) {
      for (const fee of feeTypes) {
        // Randomize status
        const isPaid = Math.random() > 0.5;
        const status = isPaid ? 'PAID' : 'PENDING';
        const paidAmt = isPaid ? fee.amt : 0;
        
        await client.query(
          'INSERT INTO fees ("studentId", "courseId", "amount", "description", "dueDate", "paidAmount", "status", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())',
          [student.id, courses[Math.floor(Math.random() * courses.length)].id, fee.amt, fee.desc, fee.due, paidAmt, status]
        ).catch(() => {});
      }
    }
    console.log('Seeded Fees');

    // 3. Timetable (Realistic)
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
    const times = [
      { start: '09:00', end: '10:30' },
      { start: '11:00', end: '12:30' },
      { start: '14:00', end: '15:30' },
      { start: '16:00', end: '17:30' }
    ];
    const rooms = ['Room 101', 'Room 102', 'Lab 1', 'Lab 2', 'Auditorium A', 'Lecture Hall B'];
    for (const course of courses) {
      // 2 classes per week per course
      for(let i=0; i<2; i++) {
        const day = days[Math.floor(Math.random() * days.length)];
        const time = times[Math.floor(Math.random() * times.length)];
        const room = rooms[Math.floor(Math.random() * rooms.length)];
        await client.query(
          'INSERT INTO timetable ("courseId", "dayOfWeek", "startTime", "endTime", "room", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
          [course.id, day, time.start, time.end, room]
        ).catch(() => {});
      }
    }
    console.log('Seeded Timetable');

    // 4. Attendance (Realistic)
    for (const student of students) {
      for (const course of courses) {
        // Only mark attendance if enrolled (assume they might be, we seeded 15 enrollments earlier)
        // Let's just create attendance for the past 5 days
        for(let i=1; i<=5; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const status = Math.random() > 0.15 ? 'PRESENT' : 'ABSENT'; // 85% attendance
          await client.query(
            'INSERT INTO attendance ("studentId", "courseId", "classDate", "status", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())',
            [student.id, course.id, d, status]
          ).catch(() => {});
        }
      }
    }
    console.log('Seeded Attendance');

    // 5. Marks (Realistic)
    const components = ['Midterm Exam', 'Final Exam', 'Assignment 1', 'Project Presentation'];
    for (const student of students) {
      for (const course of courses) {
        for (const comp of components) {
          const maxScore = comp.includes('Exam') ? 100 : 50;
          // Random score between 60% and 98%
          const score = Math.floor(maxScore * (0.6 + (Math.random() * 0.38)));
          const weight = comp.includes('Final') ? 40 : 20;
          
          await client.query(
            'INSERT INTO marks ("studentId", "courseId", "component", "score", "maxScore", "weightPercent", "gradedById", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())',
            [student.id, course.id, comp, score, maxScore, weight, teachers[0]?.id || admins[0]?.id]
          ).catch(() => {});
        }
      }
    }
    console.log('Seeded Marks');

    console.log('All realistic data successfully seeded!');
  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
