const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'retrocool-singular-big-33472.db.redis.io',
        port: 16811
    }
});

module.exports = redisClient;