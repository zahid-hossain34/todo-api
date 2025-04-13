const { ObjectId } = require('mongodb');
const Todo = require('../../domain/entities/todo');
const dbService = require('../database/db');

class TodoRepository {
  constructor() {
    // Bind methods to ensure `this` is always correct
    this.getCollection = this.getCollection.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.save = this.save.bind(this);
    this.deleteById = this.deleteById.bind(this);
  }

  getCollection() {
    const collection = dbService.getDb().collection('todos');
    // Debug: Verify collection is valid
    if (!collection.find || !collection.insertOne) {
      throw new Error('Failed to get MongoDB collection');
    }
    return collection;
  }

  async findAll({ completed, sort, order = 'asc', page = 1, limit = 10 }) {
    const query = completed !== undefined ? { completed: completed === 'true' } : {};
    const options = {
      sort: sort ? { [sort]: order === 'asc' ? 1 : -1 } : {},
      skip: (page - 1) * limit,
      limit: parseInt(limit)
    };

    const collection = this.getCollection();
    const todos = await collection.find(query, options).toArray();
    const total = await collection.countDocuments(query);
    return {
      todos: todos.map(todo => new Todo(todo)),
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }

  async findById(id) {
    const collection = this.getCollection();
    const todo = await collection.findOne({ _id: new ObjectId(id) });
    return todo ? new Todo(todo) : null;
  }

  async save(todo) {
    const todoData = {
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt
    };

    const collection = this.getCollection();
    if (!todo._id) {
      const result = await collection.insertOne(todoData);
      todo._id = result.insertedId;
    } else {
      await collection.updateOne(
        { _id: new ObjectId(todo._id) },
        { $set: todoData }
      );
    }

    return todo;
  }

  async deleteById(id) {
    const collection = this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }
}

module.exports = new TodoRepository();