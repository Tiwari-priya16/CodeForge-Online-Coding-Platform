import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Fast In-Memory Cache for GET Requests (0ms Page Loading)
const getCache = new Map();
const CACHE_TTL = 30000; // 30 seconds

export const clearApiCache = () => {
    getCache.clear();
};

// Request Interceptor: Return cached GET responses instantly
axiosClient.interceptors.request.use((config) => {
    if (config.method?.toLowerCase() === 'get' && !config.headers?.['x-no-cache']) {
        const cached = getCache.get(config.url);
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

// Response Interceptor: Cache GET results and invalidate cache on Mutations (POST, PUT, DELETE)
axiosClient.interceptors.response.use(
    (response) => {
        const method = response.config.method?.toLowerCase();
        if (method === 'get' && response.config.url) {
            getCache.set(response.config.url, {
                data: response.data,
                timestamp: Date.now()
            });
        } else if (['post', 'put', 'delete'].includes(method)) {
            clearApiCache();
        }
        return response;
    },
    (error) => Promise.reject(error)
);

export default axiosClient;
