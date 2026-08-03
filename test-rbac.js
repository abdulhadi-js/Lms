const BASE_URL = 'http://localhost:3001/api/v1';

async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    throw new Error(`Login failed for ${email}`);
  }
  const data = await res.json();
  return data.accessToken;
}

async function hitEndpoint(token, method, path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: method === 'POST' ? JSON.stringify({ name: 'Test' }) : undefined
  });
  return res.status;
}

async function runTests() {
  console.log('--- RBAC Authorization E2E Test ---');
  try {
    const adminToken = await login('superadmin@educore.com', 'Admin@123!');
    const teacherToken = await login('teacher@educore.com', 'Teacher@123!');
    const studentToken = await login('student@educore.com', 'Student@123!');
    console.log('✅ Successfully authenticated all test accounts.\n');

    // Test 1: Student tries to create a campus (Admin only)
    console.log('Test 1: Student -> POST /campuses');
    const status1 = await hitEndpoint(studentToken, 'POST', '/campuses');
    console.log(`Result: ${status1} (Expected: 403) - ${status1 === 403 ? 'PASS' : 'FAIL'}`);

    // Test 2: Teacher tries to create a campus (Admin only)
    console.log('Test 2: Teacher -> POST /campuses');
    const status2 = await hitEndpoint(teacherToken, 'POST', '/campuses');
    console.log(`Result: ${status2} (Expected: 403) - ${status2 === 403 ? 'PASS' : 'FAIL'}`);

    // Test 3: Admin tries to create a campus
    console.log('Test 3: Admin -> POST /campuses');
    const status3 = await hitEndpoint(adminToken, 'POST', '/campuses');
    // Admin bypasses MatrixGuard, so it will reach the controller. It might return 400 Bad Request due to missing DTO fields, or 201. Both mean Auth passed.
    const passed3 = status3 === 201 || status3 === 400 || status3 === 500; // Anything but 403/401
    console.log(`Result: ${status3} (Expected: not 403) - ${passed3 ? 'PASS' : 'FAIL'}`);

    // Test 4: Student tries to view classes
    console.log('Test 4: Student -> GET /academics/classes');
    const status4 = await hitEndpoint(studentToken, 'GET', '/academics/classes');
    console.log(`Result: ${status4} (Expected: 200) - ${status4 === 200 ? 'PASS' : 'FAIL'}`);
    
    // Test 5: Teacher tries to create a class (Teacher Matrix has Academics canAdd: false)
    console.log('Test 5: Teacher -> POST /academics/classes');
    const status5 = await hitEndpoint(teacherToken, 'POST', '/academics/classes');
    console.log(`Result: ${status5} (Expected: 403) - ${status5 === 403 ? 'PASS' : 'FAIL'}`);

  } catch (err) {
    console.error('Test script error:', err.message);
  }
}

runTests();
