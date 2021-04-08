const redis = require("redis");

require('bluebird').promisifyAll(redis);

module.exports = {
  createConnection: () => {
    return new Promise((resolve, reject) => {
      const client = redis.createClient();
      client.on("connect", () => {
        resolve(client);
      });

      client.on("error", () => {
        reject("Error: Failed to connect");
      });
    });
  },
};
