import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hostel_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear localStorage and redirect to login if not already there
      const isAuthPath = window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register');
      if (!isAuthPath) {
        localStorage.removeItem('hostel_token');
        localStorage.removeItem('hostel_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (studentData) => API.post('/auth/register', studentData),
  getMe: () => API.get('/auth/me'),
  logout: (token) =>
    API.post('/auth/logout', {}, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  updateProfile: (data) => API.put('/auth/update-profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
};

// Hostel Services
export const hostelService = {
  getAll: (params) => API.get('/hostels', { params }),
  getById: (id) => API.get(`/hostels/${id}`),
  create: (data) => API.post('/hostels', data),
  update: (id, data) => API.put(`/hostels/${id}`, data),
  delete: (id) => API.delete(`/hostels/${id}`),
};

// Room Services
export const roomService = {
  getAll: (params) => API.get('/rooms', { params }),
  getById: (id) => API.get(`/rooms/${id}`),
  create: (data) => API.post('/rooms', data),
  update: (id, data) => API.put(`/rooms/${id}`, data),
  delete: (id) => API.delete(`/rooms/${id}`),
};

// Application Services
export const applicationService = {
  create: (data) => API.post('/applications', data),
  getMy: () => API.get('/applications/my'),
  getAll: (params) => API.get('/applications', { params }),
  updateStatus: (id, data) => API.put(`/applications/${id}/status`, data),
};

// Allocation Services
export const allocationService = {
  create: (data) => API.post('/allocations', data),
  vacate: (id, data) => API.put(`/allocations/${id}/vacate`, data),
  reassign: (id, data) => API.put(`/allocations/${id}/reassign`, data),
  getAll: (params) => API.get('/allocations', { params }),
  getMy: () => API.get('/allocations/my'),
};

// Student Services
export const studentService = {
  getAll: (params) => API.get('/students', { params }),
  getById: (id) => API.get(`/students/${id}`),
  update: (id, data) => API.put(`/students/${id}`, data),
};

// Dashboard Services
export const dashboardService = {
  getAdmin: () => API.get('/dashboard/admin'),
  getStudent: () => API.get('/dashboard/student'),
};

// Reports Services
export const reportService = {
  getSummary: (params) => API.get('/reports/summary', { params }),
  exportCSV: (type, params) =>
    API.get(`/reports/export/${type}`, {
      params,
      responseType: 'blob',
    }),
};

export default API;
