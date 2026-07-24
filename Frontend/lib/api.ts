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

export const reportsApi = {
  overview: () => fetchApi('/reports/overview'),
  atRisk: () => fetchApi('/reports/at-risk'),
};

export const enrollmentsApi = {
  getApplications: (status: string) => fetchApi(`/enrollments?status=${status}`),
  list: () => fetchApi('/enrollments'),
};

export const coursesApi = {
  list: () => fetchApi('/courses'),
};

export const feesApi = {
  list: () => fetchApi('/fees'),
};

export const assignmentsApi = {
  list: () => fetchApi('/assignments'),
};
