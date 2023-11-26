const mongodb = require('mongodb');
const db = require('../data/database');

class Chat {
  constructor(username, code, notifications) {
    this.username = username;
    this.code = code;
    this.notifications = notifications || [];
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

  static addNotification(username, notification) {
    const timestamp = new Date();
  
    return db.getDb().collection('notifications').updateOne(
      { username: username },
      {
        $set: {
          username: username,
          message: notification,
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

  static getNotificationsByUsername(username) {
    return db.getDb().collection('notifications').findOne(
      { username: username },
      { projection: { _id: 0, username: 1, message: 1, timestamp: 1 } }
    );
  }

  static getNotifications() {
    return db.getDb().collection('notifications').find({}, { projection: { _id: 0, username: 1, message: 1, timestamp: 1 } }).toArray();
  }
}
  

module.exports = Chat;
