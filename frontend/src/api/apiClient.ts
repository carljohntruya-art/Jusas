import axios from 'axios';

/**
 * Centralized API client for the Jusas frontend.
 * Uses relative paths to avoid localhost vs production environment mismatches.
 */
const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor for global error handling (optional but recommended)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging
    console.error(`API Error [${error.config?.url}]:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
