const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');

let store;

function createSessionStore() {
  if (!store) {
    const MongoDBStore = mongoDbStore(expressSession);

    store = new MongoDBStore({
      uri: process.env.MONGODB_URL,
      databaseName: 'code2clear',
      collection: 'sessions'
    });
  }

  return store;
}

function createSessionConfig() {
  return {
    secret: 'super-secret',
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
  };
}

module.exports = createSessionConfig;
