import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Course } from './src/courses/entities/course.entity';
import { Enrollment } from './src/enrollments/entities/enrollment.entity';
import { Application } from './src/enrollments/entities/application.entity';
import { Fee } from './src/fees/entities/fee.entity';
import { Assignment } from './src/assignments/entities/assignment.entity';
import { Timetable } from './src/timetable/entities/timetable.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  
  console.log('Seeding dummy data...');
  
  const passwordHash = await bcrypt.hash('Student@123', 10);
  
  // 1. Users
  let student1 = await dataSource.getRepository(User).findOneBy({ email: 'student1@educore.com' });
  if (!student1) {
    student1 = dataSource.getRepository(User).create({
      email: 'student1@educore.com', passwordHash, role: 'STUDENT' as any, status: 'ACTIVE' as any, firstName: 'John', lastName: 'Doe', phone: '1234567890'
    });
    student1 = await dataSource.getRepository(User).save(student1);
  }
  
  let student2 = await dataSource.getRepository(User).findOneBy({ email: 'student2@educore.com' });
  if (!student2) {
    student2 = dataSource.getRepository(User).create({
      email: 'student2@educore.com', passwordHash, role: 'STUDENT' as any, status: 'ACTIVE' as any, firstName: 'Jane', lastName: 'Smith', phone: '0987654321'
    });
    student2 = await dataSource.getRepository(User).save(student2);
  }

  let teacher1 = await dataSource.getRepository(User).findOneBy({ email: 'teacher1@educore.com' });
  if (!teacher1) {
    teacher1 = dataSource.getRepository(User).create({
      email: 'teacher1@educore.com', passwordHash, role: 'INSTRUCTOR' as any, status: 'ACTIVE' as any, firstName: 'Prof', lastName: 'Oak', phone: '1112223333'
    });
    teacher1 = await dataSource.getRepository(User).save(teacher1);
  }

  // 2. Courses
  let course1 = await dataSource.getRepository(Course).findOneBy({ code: 'CS101' });
  if (!course1) {
    const newCourse = dataSource.getRepository(Course).create({
      code: 'CS101', title: 'Introduction to Computer Science', description: 'Basic programming concepts.', credits: 3, status: 'ACTIVE', teacherId: teacher1!.id
    } as any);
    course1 = await dataSource.getRepository(Course).save(newCourse) as any;
  }

  let course2 = await dataSource.getRepository(Course).findOneBy({ code: 'MAT201' });
  if (!course2) {
    const newCourse = dataSource.getRepository(Course).create({
      code: 'MAT201', title: 'Calculus II', description: 'Advanced integration.', credits: 4, status: 'ACTIVE', teacherId: teacher1!.id
    } as any);
    course2 = await dataSource.getRepository(Course).save(newCourse) as any;
  }

  // 3. Enrollments
  const enrollRepo = dataSource.getRepository(Enrollment);
  if ((await enrollRepo.count()) === 0) {
    await enrollRepo.save([
      enrollRepo.create({ studentId: student1!.id, courseId: course1!.id, status: 'ENROLLED', enrolledAt: new Date() } as any),
      enrollRepo.create({ studentId: student2!.id, courseId: course1!.id, status: 'ENROLLED', enrolledAt: new Date() } as any),
      enrollRepo.create({ studentId: student1!.id, courseId: course2!.id, status: 'DROPPED', enrolledAt: new Date(), droppedAt: new Date(), dropReason: 'Too hard' } as any),
    ] as any[]);
  }

  // 4. Applications
  const appRepo = dataSource.getRepository(Application);
  if ((await appRepo.count()) === 0) {
    await appRepo.save([
      appRepo.create({ email: 'newguy@gmail.com', firstName: 'New', lastName: 'Guy', phone: '555-1234', desiredCourse: 'CS101', status: 'PENDING_REVIEW' } as any),
      appRepo.create({ email: 'rejected@gmail.com', firstName: 'Bad', lastName: 'Student', phone: '555-0000', desiredCourse: 'MAT201', status: 'REJECTED' } as any),
    ] as any[]);
  }

  // 5. Fees
  const feeRepo = dataSource.getRepository(Fee);
  if ((await feeRepo.count()) === 0) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    await feeRepo.save([
      feeRepo.create({ studentId: student1!.id, courseId: course1!.id, amount: 500.0, description: 'Tuition Fee', dueDate, status: 'PENDING' } as any),
      feeRepo.create({ studentId: student2!.id, courseId: course1!.id, amount: 500.0, description: 'Tuition Fee', dueDate, status: 'PAID', paidAmount: 500.0, paidAt: new Date() } as any),
    ] as any[]);
  }

  // 6. Timetable
  const ttRepo = dataSource.getRepository(Timetable);
  if ((await ttRepo.count()) === 0) {
    await ttRepo.save([
      ttRepo.create({ courseId: course1!.id, dayOfWeek: 'MON', startTime: '09:00', endTime: '10:30', room: 'Room 101' } as any),
      ttRepo.create({ courseId: course1!.id, dayOfWeek: 'WED', startTime: '09:00', endTime: '10:30', room: 'Room 101' } as any),
      ttRepo.create({ courseId: course2!.id, dayOfWeek: 'TUE', startTime: '11:00', endTime: '12:30', room: 'Room 205' } as any),
    ] as any[]);
  }

  // 7. Assignments
  const assignRepo = dataSource.getRepository(Assignment);
  if ((await assignRepo.count()) === 0) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    await assignRepo.save([
      assignRepo.create({ courseId: course1!.id, createdById: teacher1!.id, title: 'Hello World Program', description: 'Write a basic python script.', maxMarks: 100, weightPercent: 10, dueDate } as any),
      assignRepo.create({ courseId: course2!.id, createdById: teacher1!.id, title: 'Integration Worksheet', description: 'Solve 10 problems.', maxMarks: 50, weightPercent: 20, dueDate } as any),
    ] as any[]);
  }

  console.log('Dummy data seeded successfully!');
  await app.close();
}
bootstrap();
