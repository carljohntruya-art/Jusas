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

// Add a response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 is expected when not logged in, handle silently for certain endpoints
    if (error.response?.status === 401) {
      if (error.config?.url?.includes('/auth/me')) {
        // Silent fail for me check
        return Promise.reject(error);
      }
    }
    
    // Log other errors for debugging
    console.warn(`API Error [${error.config?.url}]:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
