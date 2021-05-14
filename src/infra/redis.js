const redis = require("redis");

require('bluebird').promisifyAll(redis);
require('dotenv').config();

module.exports = {
  createConnection: () => {
    return new Promise((resolve, reject) => {
      const client = redis.createClient({
        host: process.env.REDIS_URI,
        port: process.env.REDIS_PORT
    });
      client.on("connect", () => {
        resolve(client);
      });

      client.on("error", (e) => {
        reject( e);
      });
    });
  },
};
