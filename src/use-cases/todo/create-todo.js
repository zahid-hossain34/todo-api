const Todo = require('../../domain/entities/todoEntities');
const TodoRepository = require('../../infrastructure/repositories/todo-repository');

async function createTodo({ userId, title, description }) {
  const todo = new Todo({ userId, title, description });
  return await TodoRepository.save(todo);
}

module.exports = createTodo;