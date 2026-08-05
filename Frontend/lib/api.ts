import axios from 'axios';
import { toast } from 'react-hot-toast';

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
export const BASE_URL = API_BASE.replace('/api/v1', '');

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    // Global 401 handler — clear tokens and redirect to login
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('lms_access_token');
        localStorage.removeItem('lms_refresh_token');
        window.location.href = '/login';
      }
      throw new Error('Session expired. Please log in again.');
    }

    if (!res.ok) {
      if (res.status >= 502 && res.status <= 504) {
        throw new Error('Server is temporarily unreachable. Please try again later.');
      }
      if (res.status === 500) {
        throw new Error('An internal server error occurred.');
      }
      // Try to parse backend error message
      let message = `API error: ${res.status}`;
      try {
        const errBody = await res.json();
        if (Array.isArray(errBody?.message)) {
          message = errBody.message.join(', ');
        } else {
          message = errBody?.message || errBody?.error || message;
        }
      } catch {
        // ignore parse errors
      }
      // Log toast before throwing so components with empty catch blocks still show feedback
      if (typeof window !== 'undefined') toast.error(message);
      throw new Error(message);
    }

    if (res.status === 204) return null;
    return await res.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    let errMsg = error.message;
    if (error.name === 'AbortError') {
      errMsg = 'Request timed out. Please check your internet connection.';
    } else if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Network'))) {
      errMsg = 'Network error. Unable to connect to the server.';
    }
    
    // Global toast for network/abort errors
    if (typeof window !== 'undefined' && errMsg !== error.message || error.name === 'AbortError' || error instanceof TypeError) {
      toast.error(errMsg);
    }
    
    if (error.message !== errMsg) {
      throw new Error(errMsg);
    }
    throw error;
  }
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

export async function fetchAuthApi(endpoint: string, options: RequestInit = {}) {
  const token = tokens.getAccessToken();
  return fetchApi(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
}

export type AuthUser = { id: string; email: string; role?: string; isSuperAdmin?: boolean; campusId?: string; firstName: string; lastName: string; phone?: string; matrix?: any[]; profilePicture?: string; };
export type LoginResponse = { accessToken: string; refreshToken: string; user: AuthUser };

export const authApi = {
  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || 'Failed to send reset link.');
    }
    return res.json();
  },
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || 'Invalid email or password. Please try again.');
    }
    return res.json();
  },
  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${refreshToken}` },
      body: JSON.stringify({ refreshToken })
    });
    if (!res.ok) throw new Error('Token refresh failed');
    return res.json();
  },
  logout: () => fetchAuthApi('/auth/logout', { method: 'POST' }),
  me: async (): Promise<AuthUser> => {
    const data = await fetchAuthApi('/auth/me');
    return {
      ...data,
      role: data.role?.name || data.role,
      matrix: data.matrix || data.role?.matrix || []
    };
  },
};

export const usersApi = {
  list: (roleId?: string, limit?: number, offset?: number) => {
    const qs = new URLSearchParams();
    if (roleId) qs.append('roleId', roleId);
    if (limit) qs.append('limit', String(limit));
    if (offset !== undefined) qs.append('offset', String(offset));
    const query = qs.toString();
    return fetchAuthApi(query ? `/users?${query}` : '/users');
  },
  get: (id: string) => fetchAuthApi(`/users/${id}`),
  getUnifiedProfile: (id: string) => fetchAuthApi(`/users/students/${id}/unified`),
  create: (data: any) => fetchAuthApi('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAuthApi(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => fetchAuthApi(`/users/${id}`, { method: 'DELETE' }),
  bulkImport: async (file: File) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('lms_access_token') : null;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/users/bulk-import`, {
      method: 'POST',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || 'Failed to import CSV');
    }
    return res.json();
  },
};

export const reportsApi = {
  overview: () => fetchAuthApi('/reports/overview'),
  performance: (courseId?: string) => fetchAuthApi(courseId ? `/reports/performance?courseId=${courseId}` : '/reports/performance'),
  attendance: (courseId?: string) => fetchAuthApi(courseId ? `/reports/attendance?courseId=${courseId}` : '/reports/attendance'),
  atRisk: (courseId?: string, threshold = 75) => fetchAuthApi(`/reports/at-risk?threshold=${threshold}${courseId ? `&courseId=${courseId}` : ''}`),
};

export const financeApi = {
  getTransactions: () => fetchAuthApi('/finance/transactions'),
  createTransaction: (data: any) => fetchAuthApi('/finance/transactions', { method: 'POST', body: JSON.stringify(data) }),
  generatePayroll: () => fetchAuthApi('/finance/payroll/generate', { method: 'POST' }),
  getPnL: (startDate: string, endDate: string) => fetchAuthApi(`/finance/reports/pnl?startDate=${startDate}&endDate=${endDate}`)
};

export const hrApi = {
  getProfile: (userId: string) => fetchAuthApi(`/hr/profile/${userId}`),
  updateProfile: (userId: string, data: any) => fetchAuthApi(`/hr/profile/${userId}`, { method: 'PUT', body: JSON.stringify(data) })
};

export const enrollmentsApi = {
  getApplications: (status?: string) => fetchAuthApi(status ? `/applications?status=${status}` : '/applications'),
  list: (page?: number, limit?: number) => {
    let url = '/enrollments';
    if (page && limit) {
      url += `?page=${page}&limit=${limit}`;
    }
    return fetchAuthApi(url);
  },
  reviewApplication: (id: string, status: string, notes?: string) => fetchAuthApi(`/applications/${id}/review`, {
    method: 'PATCH',
    body: JSON.stringify({ status, notes })
  }),
  directEnroll: (studentId: string, courseId: string) => fetchAuthApi('/enrollments', {
    method: 'POST',
    body: JSON.stringify({ studentId, courseId })
  }),
  bulkEnroll: (courseId: string, studentIds: string[]) => fetchAuthApi('/enrollments/bulk', {
    method: 'POST',
    body: JSON.stringify({ courseId, studentIds })
  }),
  requestDrop: (enrollmentId: string, reason: string) => fetchAuthApi('/enrollments/drop', {
    method: 'POST',
    body: JSON.stringify({ enrollmentId, reason })
  }),
  apply: (data: any) => fetchApi('/applications', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  remove: (id: string) => fetchAuthApi(`/enrollments/${id}`, { method: 'DELETE' }),
  rollover: (data: { fromCourseId: string; toCourseId: string; studentIds?: string[] }) => fetchAuthApi('/enrollments/rollover', { method: 'POST', body: JSON.stringify(data) }),
};

export const coursesApi = {
  list: () => fetchAuthApi('/courses'),
  getPublic: () => fetchApi('/public/courses'),
  get: (id: string) => fetchAuthApi(`/courses/${id}`),
  getModules: (courseId: string) => fetchAuthApi(`/courses/${courseId}/modules`),
  createModule: (courseId: string, data: any) => fetchAuthApi(`/courses/${courseId}/modules`, { method: 'POST', body: JSON.stringify(data) }),
  updateModule: (courseId: string, modId: string, data: any) => fetchAuthApi(`/courses/${courseId}/modules/${modId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  removeModule: (courseId: string, modId: string) => fetchAuthApi(`/courses/${courseId}/modules/${modId}`, { method: 'DELETE' }),
  create: (data: any) => fetchAuthApi('/courses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAuthApi(`/courses/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => fetchAuthApi(`/courses/${id}`, { method: 'DELETE' }),
};

export const academicsApi = {
  getPublicClasses: (campusId: string) => fetchApi(`/public/classes?campusId=${campusId}`),
  getPublicCampuses: () => fetchApi('/public/campuses'),
  listClasses: () => fetchAuthApi('/academics/classes'),
  getClass: (id: string) => fetchAuthApi(`/academics/classes/${id}`),
  createClass: (data: any) => fetchAuthApi('/academics/classes', { method: 'POST', body: JSON.stringify(data) }),
  updateClass: (id: string, data: any) => fetchAuthApi(`/academics/classes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  removeClass: (id: string) => fetchAuthApi(`/academics/classes/${id}`, { method: 'DELETE' }),

  createSection: (data: any) => fetchAuthApi(`/academics/sections`, { method: 'POST', body: JSON.stringify(data) }),
  updateSection: (id: string, data: any) => fetchAuthApi(`/academics/sections/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  removeSection: (id: string) => fetchAuthApi(`/academics/sections/${id}`, { method: 'DELETE' }),

  createSubject: (data: any) => fetchAuthApi(`/academics/subjects`, { method: 'POST', body: JSON.stringify(data) }),
  updateSubject: (id: string, data: any) => fetchAuthApi(`/academics/subjects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  removeSubject: (id: string) => fetchAuthApi(`/academics/subjects/${id}`, { method: 'DELETE' }),
};

export const familiesApi = {
  list: (familyCode?: string) => fetchAuthApi(familyCode ? `/families?familyCode=${familyCode}` : '/families'),
  get: (id: string) => fetchAuthApi(`/families/${id}`),
};

export const campusesApi = {
  list: () => fetchAuthApi('/campuses'),
  get: (id: string) => fetchAuthApi(`/campuses/${id}`),
  create: (data: any) => fetchAuthApi('/campuses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAuthApi(`/campuses/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => fetchAuthApi(`/campuses/${id}`, { method: 'DELETE' }),
};

export const rolesApi = {
  list: () => fetchAuthApi('/roles'),
  get: (id: string) => fetchAuthApi(`/roles/${id}`),
  create: (data: any) => fetchAuthApi('/roles', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAuthApi(`/roles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => fetchAuthApi(`/roles/${id}`, { method: 'DELETE' }),
};

export const feesApi = {
  list: () => fetchAuthApi('/fees'),
  create: (data: any) => fetchAuthApi('/fees', { method: 'POST', body: JSON.stringify(data) }),
  bulkGenerate: (data: { courseId: string; amount: number; dueDate: string; title: string }) => fetchAuthApi('/fees/bulk-generate', { method: 'POST', body: JSON.stringify(data) }),
  getFamilyConsolidated: (familyCode: string) => fetchAuthApi(`/fees/family/${familyCode}/consolidated`),
  pay: (id: string, amount: number) => fetchAuthApi(`/fees/${id}/pay`, {
    method: 'POST',
    body: JSON.stringify({ paidAmount: amount })
  }),
  update: (id: string, data: any) => fetchAuthApi(`/fees/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string, reason?: string) => fetchAuthApi(`/fees/${id}`, { method: 'DELETE', body: JSON.stringify({ reason }) }),
};

export const assignmentsApi = {
  list: () => fetchAuthApi('/assignments'),
  get: (id: string) => fetchAuthApi(`/assignments/${id}`),
  create: (courseId: string, data: any) => fetchAuthApi(`/courses/${courseId}/assignments`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAuthApi(`/assignments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => fetchAuthApi(`/assignments/${id}`, { method: 'DELETE' }),
  submit: async (id: string, data: any, onUploadProgress?: (progressEvent: any) => void) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('lms_access_token') : null;
    let payload = data;
    let headers: any = { Authorization: `Bearer ${token}` };

    if (data instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      headers['Content-Type'] = 'application/json';
    }

    const response = await axios.post(`${API_BASE}/assignments/${id}/submissions`, data, {
      headers,
      onUploadProgress,
    });
    return response.data;
  },
};

export const timetableApi = {
  list: () => fetchAuthApi('/timetable'),
  create: (data: any) => fetchAuthApi('/timetable', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAuthApi(`/timetable/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => fetchAuthApi(`/timetable/${id}`, { method: 'DELETE' }),
};

export const marksApi = {
  getGradebook: (courseId: string) => fetchAuthApi(`/marks/gradebook?courseId=${courseId}`),
  getStudentMarks: (studentId: string) => fetchAuthApi(`/marks?studentId=${studentId}`),
  getTranscript: (studentId: string) => fetchAuthApi(`/marks/transcript/${studentId}`),
  enterMark: (data: any) => fetchAuthApi('/marks', { method: 'POST', body: JSON.stringify(data) }),
  updateMark: (id: string, data: any) => fetchAuthApi(`/marks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  downloadTranscriptPdf: async (studentId: string) => {
    const token = tokens.getAccessToken();
    const res = await fetch(`${API_BASE}/marks/transcript/${studentId}/pdf`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to download PDF');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Filename is ideally parsed from Content-Disposition, but we provide a fallback
    a.download = `Transcript.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
};


export const attendanceApi = {
  get: (courseId?: string, studentId?: string, startDate?: string, endDate?: string) => {
    let params = new URLSearchParams();
    if (courseId) params.append('courseId', courseId);
    if (studentId) params.append('studentId', studentId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return fetchAuthApi(`/attendance?${params.toString()}`);
  },
  getSummary: (courseId: string, studentId?: string) => {
    let params = new URLSearchParams();
    params.append('courseId', courseId);
    if (studentId) params.append('studentId', studentId);
    return fetchAuthApi(`/attendance/summary?${params.toString()}`);
  },
  mark: (data: any) => fetchAuthApi('/attendance', { method: 'POST', body: JSON.stringify(data) }),
  bulkMark: (data: { courseId: string, date: string, grNumbers: string[], status: string }) => fetchAuthApi('/attendance/bulk-mark', { method: 'POST', body: JSON.stringify(data) })
};

export const messagingApi = {
  getTemplates: () => fetchAuthApi('/messaging/templates'),
  createTemplate: (data: any) => fetchAuthApi('/messaging/templates', { method: 'POST', body: JSON.stringify(data) }),
  updateTemplate: (id: string, data: any) => fetchAuthApi(`/messaging/templates/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getOutbox: () => fetchAuthApi('/messaging/outbox'),
  send: (data: any) => fetchAuthApi('/messaging/send', { method: 'POST', body: JSON.stringify(data) })
};

export const examsApi = {
  getQuestions: (courseId?: string) => fetchAuthApi(courseId ? `/exams/questions?courseId=${courseId}` : '/exams/questions'),
  createQuestion: (data: any) => fetchAuthApi('/exams/questions', { method: 'POST', body: JSON.stringify(data) }),
  getExams: (courseId?: string) => fetchAuthApi(courseId ? `/exams?courseId=${courseId}` : '/exams'),
  getExam: (id: string) => fetchAuthApi(`/exams/${id}`),
  createExam: (data: any) => fetchAuthApi('/exams', { method: 'POST', body: JSON.stringify(data) }),
  assignQuestions: (examId: string, questionIds: string[]) => fetchAuthApi(`/exams/${examId}/questions`, { method: 'POST', body: JSON.stringify({ questionIds }) }),
  submitExam: (examId: string, answers: any) => fetchAuthApi(`/exams/${examId}/submit`, { method: 'POST', body: JSON.stringify({ answers }) }),
  publishExam: (examId: string) => fetchAuthApi(`/exams/${examId}`, { method: 'PATCH', body: JSON.stringify({ status: 'PUBLISHED' }) })
};

export const chatApi = {
  getConversations: () => fetchAuthApi('/chat/conversations'),
  getMessages: (params: { partnerId?: string; courseId?: string }) => {
    const qs = new URLSearchParams();
    if (params.partnerId) qs.append('partnerId', params.partnerId);
    if (params.courseId) qs.append('courseId', params.courseId);
    return fetchAuthApi(`/chat/messages?${qs.toString()}`);
  },
  sendMessage: (data: { receiverId?: string; courseId?: string; body: string }) => fetchAuthApi('/chat/messages', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
};

export const notificationsApi = {
  list: () => fetchAuthApi('/notifications'),
  markAllRead: () => fetchAuthApi('/notifications/read-all', { method: 'PATCH' }),
};
