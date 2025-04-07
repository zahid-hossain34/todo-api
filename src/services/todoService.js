const fs = require('fs').promises;
const path = require('path');
const config = require('../config');

const DATA_FILE = path.resolve(config.dataFile);

class TodoService {
  async loadTodos() {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      if (!data.trim()) return []; // Empty file or whitespace
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') return []; // File doesn't exist
      throw new Error(`Failed to parse todos.json: ${error.message}`); // Specific error for invalid JSON
    }
  }

  async saveTodos(todos) {
    await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf8');
  }

  async getAllTodos({ completed, sort, order = 'asc', page = 1, limit = 10 }) {
    const todos = await this.loadTodos();
    let filteredTodos = [...todos];

    if (completed !== undefined) {
      filteredTodos = filteredTodos.filter(todo => todo.completed === (completed === 'true'));
    }

    if (sort) {
      filteredTodos.sort((a, b) => {
        const valueA = a[sort] || '';
        const valueB = b[sort] || '';
        return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      });
    }

    const start = (page - 1) * limit;
    const end = start + parseInt(limit);
    const paginatedTodos = filteredTodos.slice(start, end);

    return {
      todos: paginatedTodos,
      total: filteredTodos.length,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }

  async getTodoById(id) {
    const todos = await this.loadTodos();
    return todos.find(todo => todo.id === id) || null;
  }

  async createTodo(todoData) {
    const todos = await this.loadTodos();
    const newTodo = {
      id: Date.now(),
      ...todoData,
      completed: false,
      createdAt: new Date().toISOString()
    };
    todos.push(newTodo);
    await this.saveTodos(todos);
    return newTodo;
  }

  async updateTodo(id, updateData) {
    const todos = await this.loadTodos();
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) return null;
    todos[index] = { ...todos[index], ...updateData, updatedAt: new Date().toISOString() };
    await this.saveTodos(todos);
    return todos[index];
  }

  async deleteTodo(id) {
    const todos = await this.loadTodos();
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) return false;
    todos.splice(index, 1);
    await this.saveTodos(todos);
    return true;
  }
}

module.exports = new TodoService();