const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');

const db = require('../data/database');

class User {
  constructor(name, rollno, username, password) {
    this.name = name;
    this.rollno = rollno;
    this.username = username;
    this.password = password;
  }

  static findById(userId) {
    const uid = new mongodb.ObjectId(userId);

    return db
      .getDb()
      .collection('users')
      .findOne({ _id: uid }, { projection: { password: 0 } });
  }

  getUserWithSameRollNo() { 
    return db.getDb().collection('users').findOne({ rollno: this.rollno }); 
  }

 static getUserWithSameUsername(username) { 
    return db.getDb().collection('users').findOne({ username: username }); 
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameRollNo(); 
    if (existingUser) {
      return true;
    }
    return false;
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await db.getDb().collection('users').insertOne({
      name: this.name,
      rollno: this.rollno,
      username: this.username,
      password: hashedPassword,
    });
  }

  static hasMatchingPassword(password,hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;
