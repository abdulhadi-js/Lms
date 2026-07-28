const http = require('http');

const API_BASE = 'http://localhost:3001/api/v1';

async function fetchApi(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    }
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(`API Error ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function runTests() {
  console.log('--- STARTING E2E FLOW TESTS ---');
  let adminToken, teacherToken, studentToken;
  let teacherId, studentId, courseId, assignmentId, feeId;

  try {
    // ==========================================
    // FLOW 1: ADMIN AUTH & SETUP
    // ==========================================
    console.log('\n[1] Testing Admin Login...');
    const adminLogin = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@educore.com', password: 'Admin@123!' })
    });
    adminToken = adminLogin.accessToken;
    console.log('✅ Admin login successful');

    const authHeaders = { 'Authorization': `Bearer ${adminToken}` };

    console.log('\n[2] Testing Teacher Creation...');
    const teacher = await fetchApi('/users', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        email: `teacher_${Date.now()}@test.com`,
        password: 'Password123!',
        role: 'INSTRUCTOR',
        firstName: 'Test',
        lastName: 'Teacher'
      })
    });
    teacherId = teacher.id;
    console.log(`✅ Teacher created with ID: ${teacherId}`);

    console.log('\n[3] Testing Student Creation...');
    const student = await fetchApi('/users', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        email: `student_${Date.now()}@test.com`,
        password: 'Password123!',
        role: 'STUDENT',
        firstName: 'Test',
        lastName: 'Student'
      })
    });
    studentId = student.id;
    console.log(`✅ Student created with ID: ${studentId}`);

    console.log('\n[4] Testing Course Creation...');
    const course = await fetchApi('/courses', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        code: `CS-${Math.floor(Math.random() * 1000000)}`,
        title: 'Test Automated Course',
        description: 'Testing flows',
        teacherId: teacherId,
        credits: 3
      })
    });
    courseId = course.id;
    console.log(`✅ Course created with ID: ${courseId}`);

    console.log('\n[5] Testing Enrollment Creation...');
    await fetchApi('/enrollments', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        studentId: studentId,
        courseId: courseId
      })
    });
    console.log('✅ Student enrolled in course');

    // ==========================================
    // FLOW 2: TEACHER OPERATIONS
    // ==========================================
    console.log('\n[6] Testing Teacher Login...');
    const teacherLogin = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: teacher.email, password: 'Password123!' })
    });
    teacherToken = teacherLogin.accessToken;
    const teacherHeaders = { 'Authorization': `Bearer ${teacherToken}` };
    console.log('✅ Teacher login successful');

    console.log('\n[7] Testing Teacher Course Access...');
    const teacherCourses = await fetchApi('/courses', { headers: teacherHeaders });
    console.log('Teacher courses returned:', JSON.stringify(teacherCourses));
    if (teacherCourses.length !== 1 || teacherCourses[0].id !== courseId) {
      throw new Error("Teacher course access failed or mismatched.");
    }
    console.log('✅ Teacher correctly sees only their assigned course');

    console.log('\n[8] Testing Assignment Creation...');
    const assignment = await fetchApi(`/courses/${courseId}/assignments`, {
      method: 'POST',
      headers: teacherHeaders,
      body: JSON.stringify({
        courseId: courseId,
        title: 'E2E Test Assignment',
        description: 'Please complete this test.',
        maxMarks: 100,
        weightPercent: 10,
        dueDate: new Date(Date.now() + 86400000).toISOString()
      })
    });
    assignmentId = assignment.id;
    console.log(`✅ Assignment created with ID: ${assignmentId}`);

    // ==========================================
    // FLOW 3: STUDENT OPERATIONS
    // ==========================================
    console.log('\n[9] Testing Student Login...');
    const studentLogin = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: student.email, password: 'Password123!' })
    });
    studentToken = studentLogin.accessToken;
    const studentHeaders = { 'Authorization': `Bearer ${studentToken}` };
    console.log('✅ Student login successful');

    console.log('\n[10] Testing Student Assignment Access & Submission...');
    const studentAssignments = await fetchApi(`/courses/${courseId}/assignments`, { headers: studentHeaders });
    if (!studentAssignments.some(a => a.id === assignmentId)) {
      throw new Error("Student cannot see the assignment for their enrolled course.");
    }
    
    await fetchApi(`/assignments/${assignmentId}/submissions`, {
      method: 'POST',
      headers: studentHeaders,
      body: JSON.stringify({
        textContent: 'This is my automated submission payload.'
      })
    });
    console.log('✅ Student successfully submitted the assignment');

    // ==========================================
    // FLOW 4: TEACHER GRADING
    // ==========================================
    console.log('\n[11] Testing Teacher Grading...');
    const submissions = await fetchApi(`/assignments/${assignmentId}/submissions`, { headers: teacherHeaders });
    if (!submissions || submissions.length === 0) {
        throw new Error("Teacher cannot see the student's submission.");
    }
    const submissionId = submissions[0].id;
    
    await fetchApi(`/submissions/${submissionId}/grade`, {
      method: 'PATCH',
      headers: teacherHeaders,
      body: JSON.stringify({
        grade: 95,
        feedback: 'Excellent automated work!'
      })
    });
    console.log('✅ Teacher successfully graded the student submission');

    console.log('\n🎉 ALL CORE API FLOWS TESTED SUCCESSFULLY! 🎉');
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
  }
}

runTests();
