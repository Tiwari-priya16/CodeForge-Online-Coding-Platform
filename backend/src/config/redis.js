const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'retrocool-singular-big-33472.db.redis.io',
        port: 16811,
        reconnectStrategy: (retries) => {
            if (retries > 5) {
                return false; // Stop retrying after 5 attempts
            }
            return Math.min(retries * 500, 3000);
        }
    }
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err.message);
});

module.exports = redisClient;