const mongodb = require('mongodb');
const db = require('../data/database');

class Chat {
  constructor(username, code) {
    this.username = username;
    this.code = code;
    this.timestamp = new Date();
  }

  static saveCodeSubmission(username, code) {
    const timestamp = new Date();

    return db.getDb().collection('chats').updateOne(
      { username: username },
      {
        $set: {
          username: username,
          code: code,
          timestamp: timestamp,
        },
      },
      { upsert: true } 
    );
  }

  static getCodeSubmissionsByUsername(username) {
    return db.getDb().collection('chats').findOne(
      { username: username },
      { projection: { _id: 0, code: 1 } }
    );
  }
}

module.exports = Chat;
