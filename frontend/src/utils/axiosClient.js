import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Fast In-Memory Cache for Static Public Data (Problem List)
const getCache = new Map();
const CACHE_TTL = 15000; // 15 seconds

export const clearApiCache = () => {
    getCache.clear();
};

// Endpoints that MUST NEVER be cached to prevent account data pollution when switching users
const UNCACHED_ENDPOINTS = [
    '/user/check',
    '/problem/problemSolvedByUser',
    '/problem/userStats',
    '/user/profile',
    '/submission'
];

// Request Interceptor: Return cached GET responses for static public endpoints only
axiosClient.interceptors.request.use((config) => {
    const url = config.url || '';
    const isUncached = UNCACHED_ENDPOINTS.some(path => url.includes(path));

    if (config.method?.toLowerCase() === 'get' && !isUncached && !config.headers?.['x-no-cache']) {
        const cached = getCache.get(url);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            config.adapter = () => Promise.resolve({
                data: cached.data,
                status: 200,
                statusText: 'OK (Cached)',
                headers: config.headers,
                config
            });
        }
    }
    return config;
});

// Response Interceptor: Cache GET results and invalidate cache on Mutations or Session Changes
axiosClient.interceptors.response.use(
    (response) => {
        const url = response.config.url || '';
        const method = response.config.method?.toLowerCase();
        const isUncached = UNCACHED_ENDPOINTS.some(path => url.includes(path));

        if (method === 'get' && !isUncached) {
            getCache.set(url, {
                data: response.data,
                timestamp: Date.now()
            });
        } else if (['post', 'put', 'delete'].includes(method)) {
            clearApiCache();
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            clearApiCache();
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
