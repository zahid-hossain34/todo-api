const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const User = require('../../domain/entities/userEntities');
const dbService = require('../database/db');

class UserRepository {
  constructor() {
    this.getCollection = this.getCollection.bind(this);
    this.findByEmail = this.findByEmail.bind(this);
    this.save = this.save.bind(this);
  }

  getCollection() {
    const collection = dbService.getDb().collection('users');
    if (!collection.find || !collection.insertOne) {
      console.error('Invalid collection object:', collection);
      throw new Error('Failed to get MongoDB collection');
    }
    return collection;
  }

  async findByEmail(email) {
    const user = await this.getCollection().findOne({ email });
    return user ? new User(user) : null;
  }

  async save(user) {
    const userData = {
      email: user.email,
      password: user.password, // Hashed
      name: user.name,
      createdAt: user.createdAt
    };
    const collection = this.getCollection();
    if (!user._id) {
      const result = await collection.insertOne(userData);
      user._id = result.insertedId;
    } else {
      await collection.updateOne(
        { _id: new ObjectId(user._id) },
        { $set: userData }
      );
    }

    return new User({
      _id: user._id,
      email: user.email,
      password: user.password,
      name: user.name,
      createdAt: user.createdAt
    });
  }
}

module.exports = new UserRepository();