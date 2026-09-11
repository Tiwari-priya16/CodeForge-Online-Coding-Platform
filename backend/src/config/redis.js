const { createClient } = require('redis');

// Local in-memory blocklist fallback (0ms latency, zero network blocking)
const localBlocklist = new Set();

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'retrocool-singular-big-33472.db.redis.io',
        port: 16811,
        connectTimeout: 1500, // 1.5s max timeout to prevent blocking Node event loop
        reconnectStrategy: (retries) => {
            if (retries > 2) return false; // Stop retrying after 2 attempts
            return 500;
        }
    }
});

redisClient.on('error', (err) => {
    // Non-blocking log
});

const isTokenBlocked = async (token) => {
    if (!token) return false;
    if (localBlocklist.has(token)) return true;
    try {
        if (redisClient.isOpen) {
            const res = await redisClient.exists(`token:${token}`);
            return res === 1;
        }
    } catch (e) {
        // Fail open
    }
    return false;
};

const blockToken = async (token, expInSeconds = 3600) => {
    if (!token) return;
    localBlocklist.add(token);
    try {
        if (redisClient.isOpen) {
            await redisClient.set(`token:${token}`, 'Blocked', { EX: expInSeconds });
        }
    } catch (e) {
        // Fallback
    }
};

module.exports = { redisClient, isTokenBlocked, blockToken };
