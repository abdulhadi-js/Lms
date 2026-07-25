const { DataSource } = require('typeorm');
const path = require('path');

// Manually initialize the TypeORM connection identical to NestJS config
const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "educore_lms",
  entities: [path.join(__dirname, 'src/**/*.entity{.ts,.js}')],
  synchronize: false,
});

async function debug() {
  await AppDataSource.initialize();
  console.log("Data Source has been initialized!");
  
  const timetableRepo = AppDataSource.getRepository('Timetable');
  const entries = await timetableRepo.find({ relations: ['course', 'course.teacher'] });
  
  console.log("Timetable Entries with Relations:");
  console.dir(entries, { depth: null });
  
  const coursesRepo = AppDataSource.getRepository('Course');
  const courses = await coursesRepo.find({ relations: ['teacher'] });
  console.log("Courses with Teacher Relations:");
  console.dir(courses, { depth: null });
  
  await AppDataSource.destroy();
}

debug().catch(console.error);
