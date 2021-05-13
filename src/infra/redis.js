const redis = require("redis");

require('bluebird').promisifyAll(redis);

// TODO -> Use env variables
module.exports = {
  createConnection: () => {
    return new Promise((resolve, reject) => {
      const client = redis.createClient({
        host: '127.0.0.1',
        port: 6379
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
