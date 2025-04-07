const { MongoClient, ObjectId } = require('mongodb');
const config = require('../config');

class TodoService {
  constructor() {
    this.client = new MongoClient(config.mongodbUri);
    this.db = null;
    this.todosCollection = null;
  }

  async connect() {
    if (!this.db) {
      await this.client.connect();
      this.db = this.client.db('todo-api');
      this.todosCollection = this.db.collection('todos');
    }
  }

  async close() {
    if (this.client) {
      await this.client.close();
      this.db = null;
      this.todosCollection = null;
    }
  }

  async getAllTodos({ completed, sort, order = 'asc', page = 1, limit = 10 }) {
    await this.connect();
    let query = {};
    if (completed !== undefined) {
      query.completed = completed === 'true';
    }

    const options = {
      sort: sort ? { [sort]: order === 'asc' ? 1 : -1 } : {},
      skip: (page - 1) * limit,
      limit: parseInt(limit)
    };

    const todos = await this.todosCollection.find(query, options).toArray();
    const total = await this.todosCollection.countDocuments(query);

    return {
      todos,
      page: parseInt(page),
      limit: parseInt(limit),
      total
    };
  }

  async getTodoById(id) {
    await this.connect();
    const todo = await this.todosCollection.findOne({ _id: new ObjectId(id) });
    return todo;
  }

  async createTodo(todoData) {
    await this.connect();
    const newTodo = {
      ...todoData,
      completed: false,
      createdAt: new Date().toISOString()
    };
    const result = await this.todosCollection.insertOne(newTodo);
    return { _id: result.insertedId, ...newTodo };
  }

  async updateTodo(id, updateData) {
    await this.connect();
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return null; // Return null if ID is invalid
    }
    const result = await this.todosCollection.findOneAndUpdate(
      { _id: objectId },
      { $set: { ...updateData, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    return result; // Updated todo or null
  }

  async deleteTodo(id) {
    await this.connect();
    const result = await this.todosCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }
}

module.exports = new TodoService();