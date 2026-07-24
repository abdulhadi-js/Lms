const API_BASE = 'http://localhost:3001/api/v1';

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export const tokens = {
  getAccessToken: () => localStorage.getItem('lms_access_token'),
  set: (access: string, refresh: string) => {
    localStorage.setItem('lms_access_token', access);
    localStorage.setItem('lms_refresh_token', refresh);
  },
  clear: () => {
    localStorage.removeItem('lms_access_token');
    localStorage.removeItem('lms_refresh_token');
  }
};

async function fetchAuthApi(endpoint: string, options: RequestInit = {}) {
  const token = tokens.getAccessToken();
  return fetchApi(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
}

export type AuthUser = { id: string; email: string; role: string; firstName: string; lastName: string };
export type LoginResponse = { accessToken: string; refreshToken: string; user: AuthUser };

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },
  logout: () => fetchAuthApi('/auth/logout', { method: 'POST' }),
  me: () => fetchAuthApi('/auth/me'),
};

export const usersApi = {
  list: (role?: string) => fetchAuthApi(role ? `/users?role=${role}` : '/users'),
  create: (data: any) => fetchAuthApi('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAuthApi(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => fetchAuthApi(`/users/${id}`, { method: 'DELETE' }),
};

export const reportsApi = {
  overview: () => fetchAuthApi('/reports/overview'),
  performance: (courseId?: string) => fetchAuthApi(courseId ? `/reports/performance?courseId=${courseId}` : '/reports/performance'),
  attendance: (courseId?: string) => fetchAuthApi(courseId ? `/reports/attendance?courseId=${courseId}` : '/reports/attendance'),
  atRisk: (thresholdOrCourseId?: string | number) => fetchAuthApi(thresholdOrCourseId ? `/reports/at-risk?param=${thresholdOrCourseId}` : '/reports/at-risk'),
};

export const enrollmentsApi = {
  getApplications: (status?: string) => fetchAuthApi(status ? `/applications?status=${status}` : '/applications'),
  list: () => fetchAuthApi('/enrollments'),
  reviewApplication: (id: string, status: string, notes?: string) => fetchAuthApi(`/applications/${id}/review`, {
    method: 'PATCH',
    body: JSON.stringify({ status, notes })
  }),
  directEnroll: (studentId: string, courseId: string) => fetchAuthApi('/enrollments', {
    method: 'POST',
    body: JSON.stringify({ studentId, courseId })
  }),
  requestDrop: (enrollmentId: string, reason: string) => fetchAuthApi(`/enrollments/${enrollmentId}/drop`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  }),
  update: (id: string, data: any) => fetchAuthApi(`/enrollments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => fetchAuthApi(`/enrollments/${id}`, { method: 'DELETE' }),
};

export const coursesApi = {
  list: () => fetchAuthApi('/courses'),
  get: (id: string) => fetchAuthApi(`/courses/${id}`),
  getModules: (courseId: string) => fetchAuthApi(`/courses/${courseId}/modules`),
  create: (data: any) => fetchAuthApi('/courses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAuthApi(`/courses/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => fetchAuthApi(`/courses/${id}`, { method: 'DELETE' }),
};

export const feesApi = {
  list: () => fetchAuthApi('/fees'),
  pay: (id: string, amount: number) => fetchAuthApi(`/fees/${id}/pay`, {
    method: 'POST',
    body: JSON.stringify({ amount })
  }),
};

export const assignmentsApi = {
  list: () => fetchAuthApi('/assignments'),
};

export const timetableApi = {
  list: () => fetchAuthApi('/timetable'),
  create: (data: any) => fetchAuthApi('/timetable', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAuthApi(`/timetable/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => fetchAuthApi(`/timetable/${id}`, { method: 'DELETE' }),
};
