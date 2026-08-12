import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  clearTokens,
} from './authStorage';

const LOCAL_IP = '192.168.1.37';
const BASE_URL = __DEV__
  ? `http://${LOCAL_IP}:8000/api`
  : 'https://your-prod-url.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const refreshClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const AUTH_WHITELIST = [
  '/user/login',
  '/user/register',
  '/user/verifyOtp',
  '/user/sendOtp',
  '/user/refresh',
];

const isWhitelisted = (url = '') =>
  AUTH_WHITELIST.some((path) => url.includes(path));

api.interceptors.request.use(async (config) => {
  if (!isWhitelisted(config.url)) {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (isWhitelisted(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        await clearTokens();
        processQueue(error, null);
        return Promise.reject(error);
      }

      const { data } = await refreshClient.post('/user/refresh', { refreshToken });
      const newAccessToken = data.accessToken;

      await saveAccessToken(newAccessToken);
      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);

    } catch (refreshError) {
      await clearTokens();
      processQueue(refreshError, null);
      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);

export default api;