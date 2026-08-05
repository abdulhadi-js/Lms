import { test, expect } from '@playwright/test';

// These tests call the backend API directly at port 4000
const API_BASE = 'http://127.0.0.1:4000/api/v1';

test.describe('Backend API - Health & Auth Endpoints', () => {
  test('API server should be reachable', async ({ request }) => {
    const response = await request.get(`${API_BASE}/auth/profile`, {
      failOnStatusCode: false,
    });
    // 401 = server is up but unauthenticated (expected)
    // 200 = server is up and somehow got a response
    expect([200, 401, 403, 404]).toContain(response.status());
  });

  test('POST /auth/login with invalid credentials should return 401', async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/login`, {
      data: { email: 'notexist@test.com', password: 'wrongpassword' },
      failOnStatusCode: false,
    });
    expect([400, 401, 403]).toContain(response.status());
  });

  test('POST /auth/login with missing fields should return 400', async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/login`, {
      data: {},
      failOnStatusCode: false,
    });
    expect([400, 401, 422]).toContain(response.status());
  });

  test('POST /auth/forgot-password with valid email format should not crash', async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/forgot-password`, {
      data: { email: 'test@educore.com' },
      failOnStatusCode: false,
    });
    // Should get some response (not 500)
    expect(response.status()).toBeLessThan(500);
  });

  test('GET /public/campuses should be publicly accessible', async ({ request }) => {
    const response = await request.get(`${API_BASE}/public/campuses`, {
      failOnStatusCode: false,
    });
    expect([200, 404]).toContain(response.status());
  });

  test('GET /public/courses should be publicly accessible', async ({ request }) => {
    const response = await request.get(`${API_BASE}/public/courses`, {
      failOnStatusCode: false,
    });
    expect([200, 404]).toContain(response.status());
  });

  test('GET /campuses without token should return 401', async ({ request }) => {
    const response = await request.get(`${API_BASE}/campuses`, {
      failOnStatusCode: false,
    });
    expect([401, 403]).toContain(response.status());
  });

  test('GET /users without token should return 401', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users`, {
      failOnStatusCode: false,
    });
    expect([401, 403]).toContain(response.status());
  });

  test('GET /roles without token should return 401', async ({ request }) => {
    const response = await request.get(`${API_BASE}/roles`, {
      failOnStatusCode: false,
    });
    expect([401, 403]).toContain(response.status());
  });

  test('GET /fees without token should return 401', async ({ request }) => {
    const response = await request.get(`${API_BASE}/fees`, {
      failOnStatusCode: false,
    });
    expect([401, 403]).toContain(response.status());
  });

  test('GET /enrollments without token should return 401', async ({ request }) => {
    const response = await request.get(`${API_BASE}/enrollments`, {
      failOnStatusCode: false,
    });
    expect([401, 403]).toContain(response.status());
  });

  test('GET /exams without token should return 401', async ({ request }) => {
    const response = await request.get(`${API_BASE}/exams`, {
      failOnStatusCode: false,
    });
    expect([401, 403]).toContain(response.status());
  });

  test('GET /marks without token should return 401', async ({ request }) => {
    const response = await request.get(`${API_BASE}/marks`, {
      failOnStatusCode: false,
    });
    expect([401, 403]).toContain(response.status());
  });

  test('GET /attendance without token should return 401', async ({ request }) => {
    const response = await request.get(`${API_BASE}/attendance`, {
      failOnStatusCode: false,
    });
    expect([401, 403]).toContain(response.status());
  });

  test('GET /timetable without token should return 401', async ({ request }) => {
    const response = await request.get(`${API_BASE}/timetable`, {
      failOnStatusCode: false,
    });
    expect([401, 403]).toContain(response.status());
  });
});
