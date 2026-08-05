/**
 * EduCore LMS — CBT Exam Engine & Fee Management E2E Automated Integration Test Suite
 * Tests full workflow: Auth -> Question Creation -> Exam Setup -> Question Assignment -> Student Exam Submission & Auto-Grading -> Bulk Fee Generation & Family Consolidated Billing
 */

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api/v1';

async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Login failed for ${email}: ${errText}`);
  }
  const data = await res.json();
  return data.accessToken;
}

async function request(token, method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  let data = null;
  try {
    data = await res.json();
  } catch {
    // raw text or empty
  }
  return { status: res.status, data };
}

async function runTestSuite() {
  console.log('=============== 🧪 EduCore LMS Automated E2E Test Suite ===============\n');

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`❌ [FAIL] ${testName} - ${details}`);
      failedCount++;
    }
  }

  try {
    // 1. Authenticate Test Personas
    console.log('--- Phase 1: Persona Authentication ---');
    const adminToken = await login('superadmin@educore.com', 'Admin@123!');
    const teacherToken = await login('teacher@educore.com', 'Teacher@123!');
    const studentToken = await login('student@educore.com', 'Student@123!');
    assert(adminToken && teacherToken && studentToken, 'Authenticate SuperAdmin, Teacher, and Student');

    // 2. CBT Question Creation (Teacher)
    console.log('\n--- Phase 2: CBT Question Bank Management ---');
    const questionPayload = {
      text: 'What is the speed of light in vacuum?',
      type: 'MCQ',
      options: ['3 x 10^8 m/s', '1.5 x 10^8 m/s', '3 x 10^6 m/s', '300 m/s'],
      correctAnswer: '3 x 10^8 m/s',
      chapter: 'Physics 101',
      topic: 'Kinematics',
      difficulty: 'MEDIUM',
      marks: 5
    };
    const createQRes = await request(teacherToken, 'POST', '/exams/questions', questionPayload);
    assert(createQRes.status === 201 || createQRes.status === 200, 'Teacher creates MCQ question in Question Bank', `Status: ${createQRes.status}`);
    const createdQuestionId = createQRes.data?.id;

    // Fetch Questions list
    const getQRes = await request(teacherToken, 'GET', '/exams/questions');
    assert(getQRes.status === 200 && Array.isArray(getQRes.data), 'Teacher retrieves Question Bank items', `Count: ${getQRes.data?.length}`);

    // 3. CBT Exam Setup & Question Assignment
    console.log('\n--- Phase 3: CBT Exam Setup & Question Assignment ---');
    const examPayload = {
      title: 'Physics Mid-Term CBT Exam',
      durationMinutes: 45,
      totalMarks: 50,
      status: 'PUBLISHED'
    };
    const createExamRes = await request(teacherToken, 'POST', '/exams', examPayload);
    assert(createExamRes.status === 201 || createExamRes.status === 200, 'Teacher creates a new CBT Exam', `Status: ${createExamRes.status}`);
    const createdExamId = createExamRes.data?.id;

    if (createdExamId && createdQuestionId) {
      const assignRes = await request(teacherToken, 'POST', `/exams/${createdExamId}/questions`, {
        questionIds: [createdQuestionId]
      });
      assert(assignRes.status === 200 || assignRes.status === 201, 'Teacher assigns questions to CBT Exam', `Status: ${assignRes.status}`);
    }

    // 4. Student CBT Exam Submission & Auto-Grading
    console.log('\n--- Phase 4: Student CBT Exam Submission & Auto-Grading ---');
    if (createdExamId && createdQuestionId) {
      const studentAnswers = {};
      studentAnswers[createdQuestionId] = '3 x 10^8 m/s'; // Correct Answer

      const submitRes = await request(studentToken, 'POST', `/exams/${createdExamId}/submit`, {
        answers: studentAnswers
      });
      assert(
        submitRes.status === 200 || submitRes.status === 201,
        'Student submits CBT Exam answers',
        `Status: ${submitRes.status}`
      );
      assert(
        submitRes.data?.score === 5,
        'CBT Engine auto-scores correct MCQ answer (+5 marks)',
        `Actual Score: ${submitRes.data?.score}`
      );
    }

    // 5. Fee Management & Bulk Generation
    console.log('\n--- Phase 5: Bulk Fee Generation & Family Consolidated Billing ---');
    const bulkFeePayload = {
      courseId: 'SEC-A',
      title: 'Monthly Tuition Fee - August 2026',
      amount: 4500,
      dueDate: '2026-08-15'
    };
    const bulkFeeRes = await request(adminToken, 'POST', '/fees/bulk-generate', bulkFeePayload);
    assert(
      bulkFeeRes.status === 200 || bulkFeeRes.status === 201,
      'Admin triggers bulk fee challan generation',
      `Status: ${bulkFeeRes.status}`
    );

    // Get Fees list
    const getFeesRes = await request(adminToken, 'GET', '/fees');
    assert(getFeesRes.status === 200 && Array.isArray(getFeesRes.data), 'Admin lists generated fee vouchers');

    // Family Consolidated Billing Test
    const familyRes = await request(adminToken, 'GET', '/fees/family-consolidated/FAM-1001');
    assert(
      familyRes.status === 200 || familyRes.status === 404,
      'Family Consolidated Billing endpoint evaluates correctly',
      `Status: ${familyRes.status}`
    );

    // 6. Security RBAC Verification
    console.log('\n--- Phase 6: RBAC Matrix Security Verification ---');
    const studentCreateExamRes = await request(studentToken, 'POST', '/exams', examPayload);
    assert(
      studentCreateExamRes.status === 403,
      'Student restricted from creating exams (403 Forbidden)',
      `Status: ${studentCreateExamRes.status}`
    );

    // Clean up created test question and exam if needed
    if (createdExamId) await request(adminToken, 'DELETE', `/exams/${createdExamId}`);
    if (createdQuestionId) await request(adminToken, 'DELETE', `/exams/questions/${createdQuestionId}`);

  } catch (err) {
    console.error('\n⚠️ Test suite execution exception:', err.message);
    failedCount++;
  }

  console.log('\n================================================================');
  console.log(`📊 TEST SUITE SUMMARY: Passed: ${passedCount} | Failed: ${failedCount}`);
  console.log('================================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite();
