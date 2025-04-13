const { MongoClient } = require('mongodb');
const config = require('../../config');

class DatabaseService {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnecting = false;
  }

  async connect() {
    if (this.db) {
      return this.db;
    }
    if (this.isConnecting) {
      // Wait for ongoing connection
      while (this.isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      return this.db;
    }

    this.isConnecting = true;
    try {
      this.client = new MongoClient(config.mongodbUri);
      await this.client.connect();
      this.db = this.client.db('todo-api');
      console.log('Connected to MongoDB');
      return this.db;
    } finally {
      this.isConnecting = false;
    }
  }

  async close() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('MongoDB connection closed');
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database not connected. Ensure connect() is called at startup.');
    }
    return this.db;
  }
}

// Export a single instance
const dbService = new DatabaseService();
module.exports = dbService;