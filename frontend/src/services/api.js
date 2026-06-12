import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000' });

API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  login: (data) => API.post('/api/auth/login', data),
  register: (data) => API.post('/api/auth/register', data),
  getProfile: () => API.get('/api/auth/profile'),
  updateProfile: (data) => API.put('/api/auth/profile', data)
};

// Products
export const productAPI = {
  getAll: (params) => API.get('/api/products', { params }),
  getOne: (id) => API.get(`/api/products/${id}`),
  getMine: () => API.get('/api/products/my/products'),
  create: (data) => API.post('/api/products', data),
  update: (id, data) => API.put(`/api/products/${id}`, data),
  delete: (id) => API.delete(`/api/products/${id}`)
};

// Trends
export const trendAPI = {
  getAll: (params) => API.get('/api/trends', { params }),
  getTop: () => API.get('/api/trends/public/top'),
  getByCategory: () => API.get('/api/trends/public/by-category'),
  getCountries: () => API.get('/api/trends/public/countries'),
  refresh: () => API.post('/api/trends/refresh')
};

// Recommendations
export const recommendAPI = {
  byCategory: (category) => API.get(`/api/recommendations/public/by-category/${category}`),
  overview: () => API.get('/api/recommendations/public/overview'),
  forProduct: (data) => API.post('/api/recommendations/for-product', data)
};

// Export interests
export const interestAPI = {
  submit: (data) => API.post('/api/export-interests', data),
  getMyRequests: () => API.get('/api/export-interests/my-requests'),
  updateStatus: (id, status) => API.patch(`/api/export-interests/${id}/status`, { status })
};

// Admin
export const adminAPI = {
  getUsers: (params) => API.get('/api/admin/users', { params }),
  toggleUser: (id) => API.patch(`/api/admin/users/${id}/toggle`),
  getUserStats: () => API.get('/api/admin/stats/users'),
  getProducts: () => API.get('/api/admin/products'),
  getInterests: () => API.get('/api/admin/interests'),
  getStats: () => API.get('/api/admin/stats')
};

export default API;
