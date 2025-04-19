module.exports = {
    apps: [
      {
        name: "server",
        script: "./server/index.js",
      },
      {
        name: "publisher",
        script: "./publishers/goldUpdatePublisher/index.js",
      },
      {
        name: "db-subscriber",
        script: "./subscribers/dbSubscriber/index.js",
      },
      {
        name: "socket-subscriber",
        script: "./subscribers/socketSubscriber/index.js",
      }
    ]
  };
  