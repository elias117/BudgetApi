const redis = require("redis");
const redisClient = redis.createClient(
    process.env.redisClient_PORT,
    process.env.redisClient_HOST
);

module.exports = { redisClient };
